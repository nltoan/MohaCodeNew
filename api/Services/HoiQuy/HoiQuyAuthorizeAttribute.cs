using API.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
namespace API.Services.HoiQuy
{
    // Dedicated exact permission check; the legacy attribute does not check permission names.
    public sealed class HoiQuyAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(HttpActionContext context)
        {
            if (context.RequestContext.Principal == null || !context.RequestContext.Principal.Identity.IsAuthenticated)
            { context.Response = context.Request.CreateResponse(HttpStatusCode.Unauthorized); return; }
            int id;
            if (!int.TryParse(context.RequestContext.Principal.Identity.GetUserId(), out id))
            { context.Response = context.Request.CreateResponse(HttpStatusCode.Forbidden); return; }
            using (var db = new CongTTDT_MOHAEntities())
            {
                if (db.User_Account.Any(u => u.UserID == id && u.Role.RolePermissions.Any(p => p.Permission.Name == "manage-hoiquy"))) return;
            }
            context.Response = context.Request.CreateResponse(HttpStatusCode.Forbidden);
        }
    }
}
