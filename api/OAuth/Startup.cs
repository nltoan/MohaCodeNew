using API.OAuth.Providers;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Web.Http;

[assembly: OwinStartup(typeof(API.OAuth.Startup))]
namespace API.OAuth
{
    // Servis çalışmaya başlarken Owin pipeline'ını ayağa kaldırabilmek için Startup'u yazıyoruz.
    public class Startup
    {
        public void Configuration(IAppBuilder appBuilder)
        {

            HttpConfiguration httpConfiguration = new HttpConfiguration();
            httpConfiguration.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            // Ensure CORS middleware runs before authentication middleware so preflight (OPTIONS) requests are handled without being challenged
            appBuilder.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            ConfigureOAuth(appBuilder);
            WebApiConfig.Register(httpConfiguration);
            appBuilder.UseWebApi(httpConfiguration);
        }

        private void ConfigureOAuth(IAppBuilder appBuilder)
        {
            OAuthAuthorizationServerOptions oAuthAuthorizationServerOptions = new OAuthAuthorizationServerOptions()
            {
                TokenEndpointPath = new PathString("/api/Token"), // Get token path
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(2),
                AllowInsecureHttp=true,
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