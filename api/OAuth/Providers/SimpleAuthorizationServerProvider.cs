using API.Services;
using System.Web;
using System.Web.Caching;
﻿using Microsoft.Owin.Security.OAuth;
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

        public override async System.Threading.Tasks.Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
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

            var attemptKey = "login-attempt:" + context.UserName.ToLowerInvariant();
            lock (AttemptLock) {
                var count = (int?)HttpRuntime.Cache[attemptKey] ?? 0;
                if (count >= 10) { context.SetError("invalid_grant", "Vui lòng thử lại sau một phút."); return; }
                HttpRuntime.Cache.Insert(attemptKey, count + 1, null, DateTime.UtcNow.AddMinutes(1), Cache.NoSlidingExpiration);
            }
            using (var _context = new CongTTDT_MOHAEntities())
            {
            try
            {
                if (type == "password")
                {
                    var model = await _context.User_Account.FirstOrDefaultAsync(item => item.TenTruyCap == context.UserName);
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
                        TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                        bool result = tfa.ValidateTwoFactorPIN(model.Authenticator_Secret, code); 
                        if (!result)
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
                    HttpRuntime.Cache.Remove(attemptKey);
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
                //context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                return;
            }
            context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
            }
        }
    }
}
