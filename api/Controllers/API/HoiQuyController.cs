using API.Services.HoiQuy;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Web;
using System.Web.Caching;
using System.Web.Http;
using System.Web.Http.Filters;
namespace API.Controllers
{
    public sealed class HoiQuyNoCacheAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext context)
        {
            if (context.Response != null)
                context.Response.Headers.CacheControl = new CacheControlHeaderValue { NoStore = true, NoCache = true };
        }
    }
    [HoiQuyNoCache]
    [RoutePrefix("api/HoiQuy")]
    public class HoiQuyController : ApiController
    {
        class Challenge { public string Answer; public string Query; }
        static byte[] Random(int count) { var bytes = new byte[count]; using (var rng = RandomNumberGenerator.Create()) rng.GetBytes(bytes); return bytes; }
        static string Token() { return BitConverter.ToString(Random(24)).Replace("-", "").ToLowerInvariant(); }
        [AllowAnonymous, HttpGet, Route("Captcha")]
        public IHttpActionResult Captcha()
        {
            const string alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
            var answer = new string(Random(5).Select(b => alphabet[b % alphabet.Length]).ToArray());
            var token = Token();
            HttpRuntime.Cache.Insert("hoi-captcha:" + token, new Challenge { Answer = answer }, null, DateTime.UtcNow.AddMinutes(5), Cache.NoSlidingExpiration);
            using (var bitmap = new Bitmap(160, 44)) using (var graphics = Graphics.FromImage(bitmap))
            using (var font = new Font(FontFamily.GenericSansSerif, 23, FontStyle.Bold | FontStyle.Italic)) using (var output = new MemoryStream())
            {
                graphics.Clear(Color.White); graphics.DrawString(answer, font, Brushes.Teal, 4, 2);
                for (int i = 0; i < 5; i++) graphics.DrawLine(Pens.LightGray, 0, i * 9, 160, 44 - i * 8);
                bitmap.Save(output, ImageFormat.Png);
                return Ok(new { Token = token, Image = "data:image/png;base64," + Convert.ToBase64String(output.ToArray()) });
            }
        }
        [AllowAnonymous, HttpGet, Route("Search")]
        public IHttpActionResult Search(string name = "", string token = "", string code = "", int page = 1)
        {
            string query = HoiQuyRecord.Normalize(name);
            if (query.Length == 0 || query.Length > 200) return BadRequest("Vui lòng nhập tên tổ chức (tối đa 200 ký tự).");
            var challenge = HttpRuntime.Cache["hoi-captcha:" + token] as Challenge;
            if (challenge == null || !string.Equals(challenge.Answer, (code ?? "").Trim(), StringComparison.OrdinalIgnoreCase)) return BadRequest("Mã xác nhận sai hoặc hết hạn. Vui lòng đổi mã và nhập lại.");
            lock (challenge)
            {
                if (challenge.Query != null && challenge.Query != query) return BadRequest("Vui lòng đổi mã xác nhận cho lượt tìm kiếm mới.");
                challenge.Query = query;
            }
            try { return Ok(HoiQuyStore.Search(name, page)); } catch (ArgumentException e) { return BadRequest(e.Message); }
        }
        [AllowAnonymous, HttpGet, Route("Logo/{id:int}")]
        public HttpResponseMessage Logo(int id)
        {
            var bytes = HoiQuyStore.Logo(id);
            if (bytes == null) return Request.CreateResponse(HttpStatusCode.NotFound);
            var response = Request.CreateResponse(HttpStatusCode.OK); response.Content = new ByteArrayContent(bytes); response.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png"); return response;
        }
        [HoiQuyAuthorize, HttpPost, Route("Preview")]
        public IHttpActionResult Preview()
        {
            var request = HttpContext.Current.Request;
            if (request.Files.Count != 1) return BadRequest("Vui lòng chọn một file Excel .xlsx.");
            var file = request.Files[0];
            if (!string.Equals(Path.GetExtension(file.FileName), ".xlsx", StringComparison.OrdinalIgnoreCase) || file.ContentLength <= 0 || file.ContentLength > 80 * 1024 * 1024) return BadRequest("Chỉ hỗ trợ file .xlsx tối đa 80 MB.");
            try
            {
                var preview = new ImportPreview { Token = Token(), FileName = Path.GetFileName(file.FileName), Owner = User.Identity.Name, Rows = HoiQuyExcel.Parse(file.InputStream, request.Form["includeLogos"] != "false") };
                if (preview.FileName.Length > 260) return BadRequest("Tên file quá dài.");
                // One active preview per account keeps uploads bounded and invalidates superseded previews.
                var ownerKey = "hoi-preview-owner:" + preview.Owner;
                var previous = HttpRuntime.Cache[ownerKey] as string;
                if (previous != null) HttpRuntime.Cache.Remove("hoi-preview:" + previous);
                HttpRuntime.Cache.Insert("hoi-preview:" + preview.Token, preview, null, DateTime.UtcNow.AddMinutes(30), Cache.NoSlidingExpiration);
                HttpRuntime.Cache.Insert(ownerKey, preview.Token, null, DateTime.UtcNow.AddMinutes(30), Cache.NoSlidingExpiration);
                return Ok(preview);
            }
            catch (InvalidDataException e) { return BadRequest(e.Message); }
            catch (Exception e) when (e is System.Xml.XmlException || e is ArgumentException || e is OutOfMemoryException) { return BadRequest("Không đọc được dữ liệu hoặc logo trong file Excel."); }
        }
        [HoiQuyAuthorize, HttpPost, Route("Commit")]
        public IHttpActionResult Commit(ImportCommit options)
        {
            if (options == null || string.IsNullOrWhiteSpace(options.Token)) return BadRequest("Thiếu phiên xem trước.");
            var preview = HttpRuntime.Cache["hoi-preview:" + options.Token] as ImportPreview;
            if (preview == null || preview.Owner != User.Identity.Name) return BadRequest("Phiên xem trước hết hạn. Vui lòng chọn lại file.");
            lock (preview.Sync)
            {
                if (preview.Committed) return BadRequest("File này đã được import.");
                try { var result = HoiQuyStore.Commit(preview, options); preview.Committed = true; HttpRuntime.Cache.Remove("hoi-preview:" + options.Token); return Ok(result); }
                catch (ArgumentException e) { return BadRequest(e.Message); }
            }
        }
    }
}
