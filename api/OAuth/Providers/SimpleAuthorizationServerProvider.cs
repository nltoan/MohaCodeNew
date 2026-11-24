using API.Services;
using System.Web;
using System.Web.Caching;
using Microsoft.Owin.Security.OAuth;
using System.Threading.Tasks;
using System.Security.Claims;
using API.Models;
using System.Data.Entity;
using System;
using System.Web.Configuration;
using System.Linq;
using Google.Authenticator;
using System.Text;

namespace API.OAuth.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        static readonly object AttemptLock = new object();
        // Khoa theo ten dang nhap (moi IP): toi da 30 lan sai trong 15 phut.
        // Luu y: cac bo dem nam trong HttpRuntime.Cache nen chi tinh theo tung instance (web farm thi moi node dem rieng).
        const int MaxFailuresPerUser = 30;
        static readonly TimeSpan FailureWindow = TimeSpan.FromMinutes(15);

        sealed class FailureCounter
        {
            public int Count;
            public DateTime ExpiresUtc;
        }

        // SQL Server bo qua khoang trang cuoi khi so sanh '=' va collation khong phan biet hoa thuong,
        // nen khoa dem phai chuan hoa giong vay ("admin", "Admin  " la cung mot tai khoan).
        static string NormalizeUserName(string userName) { return userName.TrimEnd().ToLowerInvariant(); }
        static string NameFailureKey(string normalizedName) { return "login-fail:name:" + normalizedName; }
        static string UserFailureKey(int userId) { return "login-fail:uid:" + userId; }

        // Giu cho truoc (tinh la that bai) mot cach nguyen tu truoc moi lenh await:
        // request song song khong vuot duoc gioi han. Dang nhap thanh cong thi xoa bo dem.
        static bool TryReserveAttempt(string key, string label)
        {
            lock (AttemptLock)
            {
                var c = HttpRuntime.Cache[key] as FailureCounter;
                if (c == null || c.ExpiresUtc <= DateTime.UtcNow)
                {
                    // Cua so co dinh tinh tu lan thu dau tien.
                    c = new FailureCounter { Count = 0, ExpiresUtc = DateTime.UtcNow.Add(FailureWindow) };
                    HttpRuntime.Cache.Insert(key, c, null, c.ExpiresUtc, Cache.NoSlidingExpiration);
                }
                if (c.Count >= MaxFailuresPerUser) return false;
                c.Count++;
                if (c.Count == MaxFailuresPerUser)
                    System.Diagnostics.Trace.TraceWarning("Login locked for " + label.Replace("\r", "").Replace("\n", "") + " after " + c.Count + " failed attempts (until " + c.ExpiresUtc.ToString("o") + ").");
                return true;
            }
        }

        public override async System.Threading.Tasks.Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }
        
        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            if (context.Identity != null && context.Identity.HasClaim(DefaultPasswordPolicy.SetupClaim, "1"))
                context.AdditionalResponseParameters.Add(DefaultPasswordPolicy.SetupClaim, "1");
            return Task.FromResult(0);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            // CORS set setting
            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            var type = context.Request.Query.Get("type"); 
            if (string.IsNullOrEmpty(context.UserName) || context.UserName.Length > 255 || string.IsNullOrEmpty(context.Password) || context.Password.Length > 1000)
            {
                context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                return;
            }

            // Gioi han theo (ten dang nhap + IP) de ke tan cong khong khoa duoc tai khoan quan tri tu IP khac;
            // Khong dem rieng theo IP: sau reverse proxy moi nguoi dung chung mot IP.
            var clientIp = context.Request.RemoteIpAddress ?? "";
            var normalizedName = NormalizeUserName(context.UserName);
            var attemptKey = "login-attempt:" + normalizedName + "|" + clientIp;
            lock (AttemptLock) {
                var count = (int?)HttpRuntime.Cache[attemptKey] ?? 0;
                if (count >= 10) { context.SetError("invalid_grant", "Vui lòng thử lại sau một phút."); return; }
                HttpRuntime.Cache.Insert(attemptKey, count + 1, null, DateTime.UtcNow.AddMinutes(1), Cache.NoSlidingExpiration);
            }
            // Gioi han thu hai theo rieng ten dang nhap: chan ke tan cong doi IP lien tuc.
            // Moi lan khong cap token (sai mat khau, sai ma 2FA, loi) deu tinh la that bai vi da giu cho truoc.
            var nameFailureKey = NameFailureKey(normalizedName);
            if (!TryReserveAttempt(nameFailureKey, "user name '" + normalizedName + "'"))
            {
                context.SetError("invalid_grant", "Vui lòng thử lại sau 15 phút.");
                return;
            }
            using (var _context = new CongTTDT_MOHAEntities())
            {
            try
            {
                if (type == "password")
                {
                    var model = await _context.User_Account.FirstOrDefaultAsync(item => item.TenTruyCap == context.UserName);
                    // Them bo dem theo UserID: moi bien the ten (collation, khoang trang) cua cung tai khoan dung chung.
                    // Giu cho ngay sau truy van, truoc khi kiem tra mat khau (dong bo) va 2FA.
                    if (model != null && !TryReserveAttempt(UserFailureKey(model.UserID), "user id " + model.UserID))
                    {
                        context.SetError("invalid_grant", "Vui lòng thử lại sau 15 phút.");
                        return;
                    }
                    if (model == null || !ActiveUserStatus.IsActive(model.TrangThai) || !PasswordSecurity.Verify(context.Password, model.MatKhau)) { context.SetError("invalid_grant", "Username hay mật khẩu không đúng!"); return; }
                    var role = await _context.Roles.FirstOrDefaultAsync(item => item.ID == model.RoleId);
                    if(model == null || role == null)
                    {
                        context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                        return;
                    }
                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                    var code = context.Request.Query.Get("code");
                    if (model.IsTwoFA == 1)
                    {
                        // Do lech toi da 60 giay; ma da dung thanh cong thi khong dung lai duoc.
                        if (!TwoFactorCode.IsValidOnce(model.UserID, model.Authenticator_Secret, code))
                        {
                            context.SetError("invalid_grant", "Mã xác nhận không đúng!");
                            return;
                        }
                    }

                    identity.AddClaim(new Claim("role", role.Name));
                    identity.AddClaim(new Claim(ClaimTypes.Name, model.TenTruyCap));
                    identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, model.UserID.ToString()));

                    if (!PasswordSecurity.IsHash(model.MatKhau)) {
                        model.MatKhau = PasswordSecurity.Hash(context.Password);
                        await _context.SaveChangesAsync();
                    }
                    // Stamp tinh tu hash dang luu (sau khi nang cap): doi mat khau thi token cu het hieu luc.
                    identity.AddClaim(new Claim(TokenRevocation.StampClaim, TokenRevocation.Stamp(model.MatKhau)));
                    TokenRevocation.Evict(model.UserID);
                    // Mat khau mac dinh: cho dang nhap toi da N lan, sau do chi duoc vao man hinh doi mat khau + bat 2FA.
                    var policy = DefaultPasswordPolicy.Get(_context, model.UserID);
                    if (policy.MatKhauMacDinh == 1)
                    {
                        if (policy.SoLanDangNhapMacDinh >= DefaultPasswordPolicy.MaxLogins)
                            identity.AddClaim(new Claim(DefaultPasswordPolicy.SetupClaim, "1"));
                        else
                            DefaultPasswordPolicy.CountLogin(_context, model.UserID);
                    }
                    HttpRuntime.Cache.Remove(attemptKey);
                    lock (AttemptLock)
                    {
                        HttpRuntime.Cache.Remove(nameFailureKey);
                        HttpRuntime.Cache.Remove(UserFailureKey(model.UserID));
                    }
                    context.Validated(identity);
                    context.Request.Context.Authentication.SignIn(identity);
                    return;
                }
                if (type == "ldap")
                {
                    // Remains disabled until verified LDAPS configuration is available.
                    context.SetError("invalid_grant", "LDAP chưa được cấu hình xác thực an toàn.");
                    return;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("Login failed with exception: " + ex);
                //context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                return;
            }
            context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
            }
        }
    }
}
