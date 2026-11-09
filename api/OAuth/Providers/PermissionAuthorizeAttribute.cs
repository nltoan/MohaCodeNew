using API.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
namespace API.OAuth.Providers
{
    public class ActiveUserAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext context)
        {
            if (!base.IsAuthorized(context)) return false;
            int id;
            if (!int.TryParse(context.RequestContext.Principal.Identity.GetUserId(), out id)) return false;
            using (var db = new CongTTDT_MOHAEntities()) return db.User_Account.Any(u => u.UserID == id && u.TrangThai == "active");
        }
    }
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class PermissionAuthorizeAttribute : AuthorizeAttribute
    {
        readonly string[] permissions;
        public PermissionAuthorizeAttribute(params string[] permissions) { this.permissions = permissions; }
        public override void OnAuthorization(HttpActionContext context)
        {
            var principal = context.RequestContext.Principal;
            if (principal == null || !principal.Identity.IsAuthenticated)
            { context.Response = context.Request.CreateResponse(HttpStatusCode.Unauthorized); return; }
            int id;
            if (!int.TryParse(principal.Identity.GetUserId(), out id))
            { context.Response = context.Request.CreateResponse(HttpStatusCode.Forbidden); return; }
            using (var db = new CongTTDT_MOHAEntities())
            {
                if (db.User_Account.Any(u => u.UserID == id && u.TrangThai == "active" &&
                    u.Role.RolePermissions.Any(p => permissions.Contains(p.Permission.Name)))) return;
            }
            context.Response = context.Request.CreateResponse(HttpStatusCode.Forbidden);
        }
    }
}
