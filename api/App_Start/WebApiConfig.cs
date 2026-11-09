using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace API {

    public static class WebApiConfig {
        public static void Register(HttpConfiguration config) {
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Never;
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new API.OAuth.SafeUserContractResolver();
            config.Filters.Add(new API.OAuth.Providers.ActiveUserAuthorizeAttribute());
            config.MapHttpAttributeRoutes();
            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            
            //EnableCorsAttribute cors = new EnableCorsAttribute("*", "*", "*"); 
            //config.EnableCors(cors);
            
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }

}
