using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using API.Models;
using API.OAuth.Providers;
using System.Data.SqlClient;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Net.Http.Headers;
using System.Web;

namespace API.Controllers
{
    [PermissionAuthorize("manage-backup")]
    [Route("api/BackUps/{action}", Name = "BackUpsApi")]
    public class BackUpsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        private static string BackupRoot()
        {
            return Path.GetFullPath(HttpContext.Current.Server.MapPath("~/Upload/BackUp"));
        }

        // Chi nhan TEN file (khong co thu muc), duoi .bak, va duong dan day du phai nam trong thu muc sao luu.
        private static string ResolveBackupFile(string name)
        {
            if (string.IsNullOrEmpty(name) || name.Length > 255) return null;
            if (!string.Equals(Path.GetFileName(name), name, StringComparison.Ordinal)) return null;
            if (name.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0) return null;
            if (!string.Equals(Path.GetExtension(name), ".bak", StringComparison.OrdinalIgnoreCase)) return null;
            var root = BackupRoot() + Path.DirectorySeparatorChar;
            var fullPath = Path.GetFullPath(Path.Combine(root, name));
            if (!fullPath.StartsWith(root, StringComparison.OrdinalIgnoreCase)) return null;
            return fullPath;
        }

        [HttpGet]
        public HttpResponseMessage Download(string path)
        {
            if (string.IsNullOrEmpty(path)) return Request.CreateResponse(HttpStatusCode.BadRequest);
            var fullPath = ResolveBackupFile(path);
            if (fullPath == null) return Request.CreateResponse(HttpStatusCode.Forbidden);
            if (!System.IO.File.Exists(fullPath)) return Request.CreateResponse(HttpStatusCode.NotFound);

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(stream)
            };
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = Path.GetFileName(fullPath)
            };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentLength = stream.Length;
            return result;
        }

        [HttpGet]
        public HttpResponseMessage Get(DataSourceLoadOptions loadOptions) {
            var root = BackupRoot();
            var list = new List<object>();
            if (Directory.Exists(root))
            {
                foreach (var fi in new DirectoryInfo(root).GetFiles("*.bak").OrderByDescending(f => f.CreationTimeUtc))
                {
                    // path = ten file (khoa cua grid, tuong thich nguoc); khong bao gio tra ve duong dan tuyet doi.
                    list.Add(new { name = fi.Name, size = fi.Length, created = fi.CreationTime, path = fi.Name });
                }
            }
            return Request.CreateResponse(DataSourceLoader.Load(list, loadOptions));
        }

        [HttpPost]
        public HttpResponseMessage Post() {
            var databaseName = _context.Database.Connection.Database;
            if (string.IsNullOrEmpty(databaseName) || !System.Text.RegularExpressions.Regex.IsMatch(databaseName, "^[A-Za-z0-9_]+$"))
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Tên cơ sở dữ liệu không hợp lệ để sao lưu.");

            var root = BackupRoot();
            Directory.CreateDirectory(root);
            var fileName = databaseName + "_" + DateTime.Now.ToString("yyyyMMdd_HHmmss", CultureInfo.InvariantCulture) + ".bak";
            var fullPath = ResolveBackupFile(fileName);
            if (fullPath == null) return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Tên file sao lưu không hợp lệ.");

            try
            {
                _context.Database.CommandTimeout = 7200;
                // Ten CSDL da duoc kiem tra ky tu an toan, boc trong [] (QUOTENAME).
                _context.Database.ExecuteSqlCommand(TransactionalBehavior.DoNotEnsureTransaction,
                    "BACKUP DATABASE [" + databaseName + "] TO DISK = @path WITH INIT",
                    new SqlParameter("@path", fullPath));
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("Backup failed: " + ex);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Sao lưu thất bại. Kiểm tra quyền ghi của dịch vụ SQL Server vào thư mục Upload/BackUp.");
            }
            return Request.CreateResponse(HttpStatusCode.Created, new { name = fileName, path = fileName });
        }

        [HttpDelete]
        public HttpResponseMessage Delete(FormDataCollection form) {
            var key = form == null ? null : form.Get("key");
            var fullPath = ResolveBackupFile(key);
            if (fullPath == null) return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Tên file sao lưu không hợp lệ.");
            if (!System.IO.File.Exists(fullPath)) return Request.CreateResponse(HttpStatusCode.NotFound);
            System.IO.File.Delete(fullPath);
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        protected override void Dispose(bool disposing) {
            if (disposing) {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}