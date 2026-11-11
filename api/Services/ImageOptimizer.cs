using System;
using System.Configuration;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Hosting;
using System.Web.Http;

namespace API.Services
{
    // Anh thu nho cho portal (PublicController.Img): GET api/Public/Img?src=/Upload/abc.jpg&w=640
    // Thu nho theo be rong (chi chon trong danh sach co dinh), luu cache tren dia, tra Cache-Control dai han.
    // Chi nhan duong dan tuong doi trong Upload/ hoac Media_Share/ de tranh SSRF/doc file tuy y.
    // Nguon: file trong thu muc cua API neu co, neu khong tai tu ImageSourceBaseUrl (hoac frontendSiteUrl).
    // Moi loi/anh qua lon => chuyen huong ve anh goc, trang khong bi mat anh.
    internal static class ImageOptimizer
    {
        private static readonly int[] AllowedWidths = { 160, 240, 320, 480, 640, 800, 1024, 1280, 1600, 1920 };
        private static readonly Regex SrcPattern = new Regex(@"^(Upload|Media_Share)/[^\\:*?""<>|\x00-\x1f]+\.(jpe?g|png)$", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
        private const long MaxSourceBytes = 40L * 1024 * 1024;
                private const int JpegQuality = 88;
        // Anh goc chi lon hon be rong yeu cau duoi ~11% thi giu nguyen: thu nho nhe + ma hoa lai chi lam mo chu ma khong tiet kiem duoc bao nhieu.
        private const double MinScaleToResize = 0.9;
        private static readonly SemaphoreSlim ResizeGate = new SemaphoreSlim(3);
        private static readonly HttpClient Remote = new HttpClient(new HttpClientHandler { AllowAutoRedirect = false }) { Timeout = TimeSpan.FromSeconds(20), MaxResponseContentBufferSize = MaxSourceBytes };

        public static async Task<HttpResponseMessage> Handle(HttpRequestMessage Request, string src, int w)
        {
            string path = NormalizeSource(src);
            if (path == null) return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid image path.");
            int width = AllowedWidths.FirstOrDefault(x => x >= w);
            if (width == 0) width = AllowedWidths[AllowedWidths.Length - 1];
            bool png = path.EndsWith(".png", StringComparison.OrdinalIgnoreCase);

            string cacheDir = HostingEnvironment.MapPath("~/App_Data/img-cache");
            string name = "v3_" + Hex(path.ToLowerInvariant()) + "_" + width + (png ? ".png" : ".jpg");
            string cacheFile = Path.Combine(cacheDir, name);
            string etag = "\"" + name + "\"";

            if (Request.Headers.IfNoneMatch.Any(t => t.Tag == etag) && File.Exists(cacheFile)) return NotModified(Request, etag);
            if (File.Exists(cacheFile)) return Serve(Request, File.ReadAllBytes(cacheFile), png, etag);

            byte[] source = null;
            await ResizeGate.WaitAsync();
            try
            {
                if (File.Exists(cacheFile)) return Serve(Request, File.ReadAllBytes(cacheFile), png, etag);
                source = ReadLocal(path) ?? await ReadRemote(path);
                if (source == null) return Original(Request, path);

                byte[] output = ImageProcessing.ResizeToFit(source, width, int.MaxValue, png, JpegQuality, false, MinScaleToResize) ?? source;
                if (output.Length >= source.Length) output = source;

                Directory.CreateDirectory(cacheDir);
                string tmp = cacheFile + "." + Guid.NewGuid().ToString("N") + ".tmp";
                File.WriteAllBytes(tmp, output);
                try { File.Move(tmp, cacheFile); } catch (IOException) { File.Delete(tmp); }
                return Serve(Request, output, png, etag);
            }
            catch (Exception)
            {
                return Original(Request, path);
            }
            finally
            {
                ResizeGate.Release();
            }
        }

        private static string NormalizeSource(string src)
        {
            if (string.IsNullOrWhiteSpace(src) || src.Length > 400) return null;
            string path = src.Trim().Replace('\\', '/').TrimStart('/');
            if (!SrcPattern.IsMatch(path)) return null;
            if (path.Split('/').Any(seg => seg == ".." || seg == ".")) return null;
            return path;
        }

        private static byte[] ReadLocal(string path)
        {
            string root = HostingEnvironment.MapPath("~/" + path.Substring(0, path.IndexOf('/')));
            string full = HostingEnvironment.MapPath("~/" + path);
            if (root == null || full == null) return null;
            string rootFull = Path.GetFullPath(root).TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
            full = Path.GetFullPath(full);
            if (!full.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase) || !File.Exists(full)) return null;
            if (new FileInfo(full).Length > MaxSourceBytes) return null;
            return File.ReadAllBytes(full);
        }

        private static Uri SourceBase()
        {
            string value = ConfigurationManager.AppSettings["ImageSourceBaseUrl"];
            if (string.IsNullOrWhiteSpace(value)) value = ConfigurationManager.AppSettings["frontendSiteUrl"];
            Uri uri;
            if (string.IsNullOrWhiteSpace(value) || !Uri.TryCreate(value.Trim().TrimEnd('/') + "/", UriKind.Absolute, out uri)) return null;
            return uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps ? uri : null;
        }

        private static Uri RemoteUri(string path)
        {
            Uri baseUri = SourceBase();
            if (baseUri == null) return null;
            return new Uri(baseUri, string.Join("/", path.Split('/').Select(Uri.EscapeDataString)));
        }

        private static async Task<byte[]> ReadRemote(string path)
        {
            Uri uri = RemoteUri(path);
            if (uri == null) return null;
            using (var response = await Remote.GetAsync(uri, HttpCompletionOption.ResponseHeadersRead))
            {
                if (!response.IsSuccessStatusCode) return null;
                string type = response.Content.Headers.ContentType?.MediaType;
                if (type == null || !type.StartsWith("image/", StringComparison.OrdinalIgnoreCase)) return null;
                if (response.Content.Headers.ContentLength > MaxSourceBytes) return null;
                return await response.Content.ReadAsByteArrayAsync();
            }
        }

        private static HttpResponseMessage Original(HttpRequestMessage Request, string path)
        {
            Uri uri = RemoteUri(path);
            if (uri == null) return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Image not found.");
            var response = Request.CreateResponse(HttpStatusCode.Redirect);
            response.Headers.Location = uri;
            response.Headers.CacheControl = new CacheControlHeaderValue { Public = true, MaxAge = TimeSpan.FromMinutes(5) };
            return response;
        }

        private static HttpResponseMessage NotModified(HttpRequestMessage Request, string etag)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotModified);
            response.Headers.ETag = new EntityTagHeaderValue(etag);
            response.Headers.CacheControl = new CacheControlHeaderValue { Public = true, MaxAge = TimeSpan.FromDays(30) };
            return response;
        }

        private static HttpResponseMessage Serve(HttpRequestMessage Request, byte[] bytes, bool png, string etag)
        {
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new ByteArrayContent(bytes);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(png ? "image/png" : "image/jpeg");
            response.Headers.ETag = new EntityTagHeaderValue(etag);
            response.Headers.CacheControl = new CacheControlHeaderValue { Public = true, MaxAge = TimeSpan.FromDays(30) };
            response.Headers.Add("X-Content-Type-Options", "nosniff");
            return response;
        }

        private static string Hex(string value)
        {
            using (var sha = SHA1.Create())
                return string.Concat(sha.ComputeHash(Encoding.UTF8.GetBytes(value)).Select(b => b.ToString("x2")));
        }
    }
}
