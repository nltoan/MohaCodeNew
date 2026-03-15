using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using System.Data.Entity;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Net.Http;
using System.Net;

namespace API.OAuth.Providers
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class PermissionAuthorizeAttribute : AuthorizeAttribute
    {
        CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();
        private readonly string[] allowedpermissions;
        public PermissionAuthorizeAttribute(params string[] permissions)
        {
            this.allowedpermissions = permissions;
        }
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                return;
            }
            var userId = Convert.ToInt32(HttpContext.Current.User.Identity.GetUserId());
            foreach (var permission in allowedpermissions)
            {
                var user = _context.User_Account.Where(m => m.UserID == userId).FirstOrDefault();
                if (user != null)
                {
                    var role = _context.Roles.Where(item => item.ID == user.RoleId).FirstOrDefault();
                    if (role != null && role.RolePermissions.Count() > 0)
                    {
                        return;
                    }
                }
            }
            actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
            return;
        }
    }
}