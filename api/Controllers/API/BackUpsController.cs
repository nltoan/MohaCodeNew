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
    //[PermissionAuthorize("manage-backup")]
    [Authorize]
    [Route("api/BackUps/{action}", Name = "BackUpsApi")]
    public class BackUpsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public HttpResponseMessage Download(string path)
        {
            byte[] fileBytes = System.IO.File.ReadAllBytes(path);

            var stream = new MemoryStream();
            // processing the stream.

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(fileBytes)
            };
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment"){
                FileName = "Backup.bak"
            };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            return result;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Upload"),"BackUp");
            string[] fileArray = Directory.GetFiles(filePath);

            return Request.CreateResponse(DataSourceLoader.Load(fileArray.Select(x => new { path = x}), loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Post() {
            var databaseName = "CongTTDT_MOHA_new";
            var formatMediaName = $"DatabaseToolkitBackup_{databaseName}";
            var formatName = $"Full Backup of {databaseName}";
            var localTime = DateTime.Now.ToString("dd-MM-yyyy-hh-mm-tt");
            var localDatabasePath = Path.Combine("ll", $"{databaseName}-{localTime}.bak");

            using (var cmd = _context.Database.Connection.CreateCommand())
            {

                var sql = @"BACKUP DATABASE @databaseName
                    TO DISK = @localDatabasePath
                    WITH FORMAT,
                      MEDIANAME = @formatMediaName,
                        NAME = @formatName";
                cmd.CommandText = sql;
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                if (!wasOpen) cmd.Connection.Open();
                try
                {

                    cmd.CommandType = CommandType.Text;
                    cmd.CommandTimeout = 7200;

                    DbParameter dbParameter = cmd.CreateParameter();
                    dbParameter.ParameterName = "@databaseName";
                    dbParameter.Value = databaseName;
                    cmd.Parameters.Add(dbParameter);

                    dbParameter = cmd.CreateParameter();
                    dbParameter.ParameterName = "@localDatabasePath";
                    dbParameter.Value = localDatabasePath;
                    cmd.Parameters.Add(dbParameter);

                    dbParameter = cmd.CreateParameter();
                    dbParameter.ParameterName = "@formatMediaName";
                    dbParameter.Value = formatMediaName;
                    cmd.Parameters.Add(dbParameter);

                    dbParameter = cmd.CreateParameter();
                    dbParameter.ParameterName = "@formatName";
                    dbParameter.Value = formatName;
                    cmd.Parameters.Add(dbParameter);

                    cmd.ExecuteNonQuery();
                }
                finally
                {
                    if (!wasOpen) cmd.Connection.Close();
                }
            }

            return Request.CreateResponse(HttpStatusCode.Created, new { localDatabasePath });
        }

        [HttpDelete]
        public async Task Delete(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Roles.FirstOrDefaultAsync(item => item.ID == key);

            _context.Roles.Remove(model);
            await _context.SaveChangesAsync();
        }

        protected override void Dispose(bool disposing) {
            if (disposing) {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}