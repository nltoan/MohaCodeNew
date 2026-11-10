using System.Configuration;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json.Serialization;
﻿using API.OAuth.Providers;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Web.Http;

[assembly: OwinStartup(typeof(API.OAuth.Startup))]
namespace API.OAuth
{
    public class SafeUserContractResolver : DefaultContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, Newtonsoft.Json.MemberSerialization serialization)
        {
            var property = base.CreateProperty(member, serialization);
            if (typeof(API.Models.User_Account).IsAssignableFrom(member.DeclaringType) &&
                new[] { "MatKhau", "Authenticator_Secret", "PasswordAnswer" }.Contains(member.Name))
                property.ShouldSerialize = instance => false;
            return property;
        }
    }
    // Servis çalışmaya başlarken Owin pipeline'ını ayağa kaldırabilmek için Startup'u yazıyoruz.
    public class Startup
    {
        public void Configuration(IAppBuilder appBuilder)
        {

            HttpConfiguration httpConfiguration = new HttpConfiguration();
            httpConfiguration.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Never;
            httpConfiguration.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new SafeUserContractResolver();
            // Ensure CORS middleware runs before authentication middleware so preflight (OPTIONS) requests are handled without being challenged
            var origins = (ConfigurationManager.AppSettings["AllowedCorsOrigins"] ?? "https://moha.gov.vn,https://www.moha.gov.vn,https://quantri-portal.moha.gov.vn")
                .Split(',').Select(x => x.Trim()).Where(x => x.Length > 0).ToArray();
            appBuilder.Use(async (context, next) => {
                var origin = context.Request.Headers.Get("Origin");
                if (!string.IsNullOrEmpty(origin)) {
                    if (!origins.Contains(origin, StringComparer.OrdinalIgnoreCase)) { context.Response.StatusCode = 403; return; }
                    context.Response.Headers.Set("Access-Control-Allow-Origin", origin);
                    context.Response.Headers.Set("Vary", "Origin");
                    context.Response.Headers.Set("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept");
                    context.Response.Headers.Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
                    if (context.Request.Method == "OPTIONS") { context.Response.StatusCode = 204; return; }
                }
                await next();
            });
            ConfigureOAuth(appBuilder);
            // Phien dang nhap bang mat khau mac dinh da het luot: chi cho doi mat khau + bat 2FA.
            var allowedDuringSetup = new[] {
                "/api/home/updateprofile", "/api/home/generateauthenticatesecret", "/api/user_account/getloginuser"
            };
            appBuilder.Use(async (context, next) => {
                var principal = context.Request.User as System.Security.Claims.ClaimsPrincipal;
                if (principal != null && principal.Identity.IsAuthenticated &&
                    principal.HasClaim(API.Services.DefaultPasswordPolicy.SetupClaim, "1") &&
                    !allowedDuringSetup.Contains((context.Request.Path.Value ?? "").TrimEnd('/').ToLowerInvariant()))
                {
                    context.Response.StatusCode = 403;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{\"error\":\"setup_required\",\"error_description\":\"Bạn cần đổi mật khẩu và bật Google Authenticator trước khi sử dụng hệ thống.\"}");
                    return;
                }
                await next();
            });
            WebApiConfig.Register(httpConfiguration);
            appBuilder.UseWebApi(httpConfiguration);
        }

        private void ConfigureOAuth(IAppBuilder appBuilder)
        {
            OAuthAuthorizationServerOptions oAuthAuthorizationServerOptions = new OAuthAuthorizationServerOptions()
            {
                TokenEndpointPath = new PathString("/api/Token"), // Get token path
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(2),
                AllowInsecureHttp = string.Equals(ConfigurationManager.AppSettings["AllowInsecureOAuthHttp"], "true", StringComparison.OrdinalIgnoreCase),
                Provider= new SimpleAuthorizationServerProvider()
            };

            // AppBuilder be product authorization settings
            appBuilder.UseOAuthAuthorizationServer(oAuthAuthorizationServerOptions);

            // Beraer token OAuth 2.0 token type
            // Beraer securtiy SSL
            appBuilder.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }
    }
}