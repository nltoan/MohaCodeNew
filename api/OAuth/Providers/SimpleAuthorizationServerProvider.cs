using Microsoft.Owin.Security.OAuth;
using System.Threading.Tasks;
using System.Security.Claims;
using API.Models;
using System.Data.Entity;
using Novell.Directory.Ldap;
using System;
using System.Web.Configuration;
using System.Linq;
using Google.Authenticator;
using System.Text;

namespace API.OAuth.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {

        public override async System.Threading.Tasks.Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }
        
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            // CORS set setting
            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            var type = context.Request.Query.Get("type"); 
            if (string.IsNullOrEmpty(context.UserName) || string.IsNullOrEmpty(context.Password))
            {
                context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                return;
            }

            CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();
            try
            {
                if (type == "password")
                {
                    var model = await _context.User_Account.FirstOrDefaultAsync(item => item.TenTruyCap == context.UserName && item.MatKhau == context.Password);
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

                    context.Validated(identity);
                    context.Request.Context.Authentication.SignIn(identity);
                    return;
                }
                if (type == "ldap")
                {
                    var email = context.UserName;
                    var tmp = await _context.ADConfigs.FirstOrDefaultAsync(item => item.Name == email);
                    if (tmp == null)
                    {
                        context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                        return;
                    }
                    var cauhinh = _context.ThamSoHeThongs.FirstOrDefault(); 
                    if (cauhinh == null || string.IsNullOrEmpty(cauhinh.ADConfig) == true)
                    {
                        context.SetError("invalid_grant", "Error config!");
                        return;
                    }
                    //var ldapHost = cauhinh.ADConfig;// "192.168.137.18";
                    //int ldapPort = LdapConnection.DefaultPort;
                    //int ldapVersion = LdapConnection.LdapV3;
                    //LdapConnection conn = new LdapConnection();
                    //conn.Connect(ldapHost, ldapPort);
                    //conn.Bind(ldapVersion, email, context.Password);
                    //conn.Disconnect();

                    var model = await _context.User_Account.Include(x=>x.Role).FirstOrDefaultAsync(item => item.TenTruyCap == email);
                    if (model == null)
                    {
                        //Tao User
                        var role = await _context.Roles.FirstOrDefaultAsync(item => item.ID == 2);
                        model = new User_Account();
                        model.TenDangKy = email;
                        model.TenTruyCap = email;
                        model.TrangThai = "active";
                        model.EmailAddress = email;
                        model.RoleId = role.ID;
                        _context.User_Account.Add(model);
                        await _context.SaveChangesAsync();

                    }
                    var code = context.Request.Query.Get("code");
                    if (model.IsTwoFA == 1)
                    {
                        // verify
                        TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                        bool result = tfa.ValidateTwoFactorPIN(Encoding.UTF8.GetBytes(model.Authenticator_Secret), code);
                        if (!result)
                        {
                            context.SetError("invalid_grant", "Mã xác nhận không đúng!");
                            return;
                        }
                    }

                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                    identity.AddClaim(new Claim("role", model.Role.Name));
                    identity.AddClaim(new Claim(ClaimTypes.Name, model.TenTruyCap));
                    identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, model.UserID.ToString()));
                    context.Validated(identity);
                    context.Request.Context.Authentication.SignIn(identity);
                    return;
                }
            }
            catch (Exception ex)
            {
                //context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
                context.SetError("invalid_grant", ex.Message);
                return;
            }
            context.SetError("invalid_grant", "Username hay mật khẩu không đúng!");
        }
    }
}