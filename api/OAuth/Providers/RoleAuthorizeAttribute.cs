using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using System.Net.Http;
using System.Net;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace API.OAuth.Providers
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class RoleAuthorizeAttribute : AuthorizeAttribute
    {
        CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();
        private readonly string[] allowedroles;
        public RoleAuthorizeAttribute(params string[] roles)
        {
            this.allowedroles = roles;
        }
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                return;
            }
            var userId = Convert.ToInt32(HttpContext.Current.User.Identity.GetUserId());
            foreach (var role in allowedroles)
            {
                var user = _context.User_Account.Where(m => m.UserID == userId && m.Role.Name == role);  
                if (user.Count() > 0)
                {
                    return;
                }
            }
            actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            return;
        }
    }
}