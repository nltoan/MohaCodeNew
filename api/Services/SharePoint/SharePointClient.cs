using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace API.Services.SharePoint
{
    // Ket noi toi SharePoint qua REST (SharePoint 2019 / Subscription Edition), chi doc.
    // Cau hinh trong appSettings (dat gia tri that trong appSettings.local.config, khong commit):
    //   SharePointSiteUrl   vd. https://sharepoint.noi-bo/sites/portal   (de trong = tinh nang tat)
    //   SharePointAuth      Windows (NTLM/Kerberos, mac dinh) | Basic (chi dung voi ban gia lap)
    //   SharePointUser, SharePointPassword, SharePointDomain
    public class SharePointSettings
    {
        public string SiteUrl { get; private set; }
        public string AuthMode { get; private set; }
        public string User { get; private set; }
        public string Password { get; private set; }
        public string Domain { get; private set; }
        public string VanBanList { get; private set; }

        public bool Enabled { get { return !string.IsNullOrWhiteSpace(SiteUrl); } }

        public static SharePointSettings Load()
        {
            var s = ConfigurationManager.AppSettings;
            var auth = (s["SharePointAuth"] ?? "Windows").Trim();
            return new SharePointSettings
            {
                SiteUrl = (s["SharePointSiteUrl"] ?? "").Trim().TrimEnd('/'),
                AuthMode = string.Equals(auth, "Basic", StringComparison.OrdinalIgnoreCase) ? "Basic" : "Windows",
                User = s["SharePointUser"] ?? "",
                Password = s["SharePointPassword"] ?? "",
                Domain = s["SharePointDomain"] ?? "",
                VanBanList = string.IsNullOrWhiteSpace(s["SharePointVanBanList"]) ? "VanBan" : s["SharePointVanBanList"].Trim()
            };
        }
    }

    public class SharePointException : Exception
    {
        public SharePointException(string message) : base(message) { }
        public SharePointException(string message, Exception inner) : base(message, inner) { }
    }

    public class SharePointClient : IDisposable
    {
        const int MaxPages = 200;
        const long MaxFileBytes = 80L * 1024 * 1024;

        readonly SharePointSettings settings;
        readonly HttpClient http;
        readonly Uri siteUri;

        public SharePointClient(SharePointSettings settings)
        {
            if (!settings.Enabled) throw new SharePointException("SharePointSiteUrl is not configured.");
            this.settings = settings;
            siteUri = new Uri(settings.SiteUrl + "/");
            var handler = new HttpClientHandler();
            if (settings.AuthMode == "Windows")
                handler.Credentials = new NetworkCredential(settings.User, settings.Password, settings.Domain);
            http = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(60) };
            http.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            http.DefaultRequestHeaders.Accept.ParseAdd("application/json;odata=nometadata");
            if (settings.AuthMode == "Basic")
                http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                    Convert.ToBase64String(Encoding.UTF8.GetBytes(settings.User + ":" + settings.Password)));
        }

        // Doc tat ca muc cua thu vien, co the chi lay muc sua tu mot moc (Modified).
        public async Task<List<JObject>> GetItemsAsync(string listTitle, DateTime? modifiedSinceUtc, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(listTitle) || listTitle.IndexOf('\'') >= 0)
                throw new SharePointException("Invalid list title.");
            var url = settings.SiteUrl + "/_api/web/lists/getbytitle('" + Uri.EscapeDataString(listTitle) + "')/items?$top=100";
            if (modifiedSinceUtc.HasValue)
                url += "&$filter=" + Uri.EscapeDataString("Modified ge datetime'" + modifiedSinceUtc.Value.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ") + "'");

            var result = new List<JObject>();
            for (int page = 0; url != null; page++)
            {
                if (page >= MaxPages) throw new SharePointException("Too many pages returned by SharePoint.");
                var body = await GetStringAsync(url, ct);
                JObject json;
                try { json = JObject.Parse(body); }
                catch (Exception ex) { throw new SharePointException("SharePoint returned invalid JSON.", ex); }
                var rows = json["value"] as JArray;
                if (rows == null) throw new SharePointException("SharePoint response has no 'value' array.");
                foreach (var row in rows) { var o = row as JObject; if (o != null) result.Add(o); }
                var next = (string)json["odata.nextLink"] ?? (string)json["@odata.nextLink"];
                url = next == null ? null : EnsureSameSite(next);
            }
            return result;
        }

        public async Task<byte[]> DownloadFileAsync(string serverRelativeUrl, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(serverRelativeUrl) || !serverRelativeUrl.StartsWith("/") || serverRelativeUrl.Contains("..") || serverRelativeUrl.IndexOf('\'') >= 0)
                throw new SharePointException("Invalid server relative URL.");
            var url = settings.SiteUrl + "/_api/web/GetFileByServerRelativeUrl('" + Uri.EscapeDataString(serverRelativeUrl).Replace("%2F", "/") + "')/$value";
            using (var resp = await SendAsync(url, HttpCompletionOption.ResponseHeadersRead, ct))
            {
                await EnsureSuccess(resp);
                if (resp.Content.Headers.ContentLength.HasValue && resp.Content.Headers.ContentLength.Value > MaxFileBytes)
                    throw new SharePointException("File is larger than the allowed size.");
                var bytes = await resp.Content.ReadAsByteArrayAsync();
                if (bytes.LongLength > MaxFileBytes) throw new SharePointException("File is larger than the allowed size.");
                return bytes;
            }
        }

        // Loi mang / het gio duoc doi thanh SharePointException de lop goi tra 502 thay vi 500.
        async Task<HttpResponseMessage> SendAsync(string url, HttpCompletionOption option, CancellationToken ct)
        {
            try { return await http.GetAsync(url, option, ct); }
            catch (HttpRequestException ex) { throw new SharePointException("Cannot reach SharePoint: " + (ex.InnerException != null ? ex.InnerException.Message : ex.Message), ex); }
            catch (TaskCanceledException ex) when (!ct.IsCancellationRequested) { throw new SharePointException("SharePoint did not respond in time.", ex); }
        }

        // Kiem tra ket noi + xac thuc, tra ve tieu de site.
        public async Task<string> PingAsync(CancellationToken ct)
        {
            var body = await GetStringAsync(settings.SiteUrl + "/_api/web", ct);
            return (string)JObject.Parse(body)["Title"];
        }

        async Task<string> GetStringAsync(string url, CancellationToken ct)
        {
            using (var resp = await SendAsync(url, HttpCompletionOption.ResponseContentRead, ct))
            {
                await EnsureSuccess(resp);
                return await resp.Content.ReadAsStringAsync();
            }
        }

        static async Task EnsureSuccess(HttpResponseMessage resp)
        {
            if (resp.IsSuccessStatusCode) return;
            string detail = "";
            try { detail = (await resp.Content.ReadAsStringAsync()); } catch { }
            if (detail.Length > 200) detail = detail.Substring(0, 200);
            throw new SharePointException("SharePoint returned HTTP " + (int)resp.StatusCode + (detail.Length > 0 ? ": " + detail : ""));
        }

        // Link phan trang do may chu tra ve khong duoc dan sang may khac (tranh bi dan di noi la voi tai khoan dich vu).
        string EnsureSameSite(string url)
        {
            Uri u;
            if (!Uri.TryCreate(url, UriKind.Absolute, out u) ||
                !string.Equals(u.Scheme, siteUri.Scheme, StringComparison.OrdinalIgnoreCase) ||
                !string.Equals(u.Host, siteUri.Host, StringComparison.OrdinalIgnoreCase) || u.Port != siteUri.Port)
                throw new SharePointException("SharePoint returned a paging link to a different host.");
            return u.AbsoluteUri;
        }

        public void Dispose() { http.Dispose(); }
    }
}
