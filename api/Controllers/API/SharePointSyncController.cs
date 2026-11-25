using API.OAuth.Providers;
using API.Services.SharePoint;
using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace API.Controllers
{
    // Dong bo van ban tu SharePoint. Chi nguoi co quyen quan ly van ban; tat khi chua cau hinh SharePointSiteUrl.
    [PermissionAuthorize("manage-vanban")]
    [Route("api/SharePointSync/{action}", Name = "SharePointSyncApi")]
    public class SharePointSyncController : ApiController
    {
        [HttpGet]
        public async Task<HttpResponseMessage> Status()
        {
            var settings = SharePointSettings.Load();
            if (!settings.Enabled) return Request.CreateResponse(HttpStatusCode.OK, new { enabled = false });
            string reachable = null, error = null;
            try { using (var c = new SharePointClient(settings)) reachable = await c.PingAsync(CancellationToken.None); }
            catch (Exception ex) { error = ex.Message; }
            return Request.CreateResponse(HttpStatusCode.OK, new { enabled = true, siteTitle = reachable, error, last = SharePointVanBanSync.LastResult() });
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Run(bool full = false)
        {
            if (!SharePointSettings.Load().Enabled)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "SharePoint is not configured.");
            try
            {
                var result = await SharePointVanBanSync.RunAsync(full, CancellationToken.None);
                if (result == null) return Request.CreateErrorResponse(HttpStatusCode.Conflict, "A sync is already running.");
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (SharePointException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadGateway, ex.Message);
            }
        }
    }
}
