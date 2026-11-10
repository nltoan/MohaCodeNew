using API.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
namespace API.OAuth.Providers
{
    public static class ActiveUserStatus
    {
        // The CMS historically stored checkbox values as "True" / "False".
        // Accept only the two explicit active representations.
        public static bool IsActive(string status)
        {
            return string.Equals((status ?? "").Trim(), "active", StringComparison.OrdinalIgnoreCase)
                || string.Equals((status ?? "").Trim(), "true", StringComparison.OrdinalIgnoreCase);
        }

        public static readonly Expression<Func<User_Account, bool>> Predicate = u => u.TrangThai != null &&
            (u.TrangThai.Trim().ToLower() == "active" || u.TrangThai.Trim().ToLower() == "true");
    }

    public class ActiveUserAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext context)
        {
            if (!base.IsAuthorized(context)) return false;
            int id;
            if (!int.TryParse(context.RequestContext.Principal.Identity.GetUserId(), out id)) return false;
            using (var db = new CongTTDT_MOHAEntities()) return db.User_Account.Where(ActiveUserStatus.Predicate).Any(u => u.UserID == id);
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
                if (db.User_Account.Where(ActiveUserStatus.Predicate).Any(u => u.UserID == id &&
                    u.Role.RolePermissions.Any(p => permissions.Contains(p.Permission.Name)))) return;
            }
            context.Response = context.Request.CreateResponse(HttpStatusCode.Forbidden);
        }
    }
}
