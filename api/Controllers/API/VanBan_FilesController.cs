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

namespace API.Controllers
{
    [Authorize]
    [Route("api/VanBan_Files/{action}", Name = "VanBan_FilesApi")]
    public class VanBan_FilesController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var vanban_files = _context.VanBan_Files.Select(i => new {
                i.ID,
                i.VanBanID,
                i.FileID,
                i.File
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(vanban_files, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            string VAN_BAN_ID = nameof(VanBan_Files.VanBanID);
            string FILE_ID = nameof(VanBan_Files.FileID);

            if (values.Contains(FILE_ID))
            {
                if (values[FILE_ID] is Int32)
                {
                    var model = new VanBan_Files();
                    PopulateModel(model, values);

                    Validate(model);
                    if (!ModelState.IsValid)
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

                    var result = _context.VanBan_Files.Add(model);
                    await _context.SaveChangesAsync();

                    return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
                }
                else if (values[FILE_ID] is Newtonsoft.Json.Linq.JArray)
                {
                    int VanBanid = 0;
                    if (values.Contains(VAN_BAN_ID))
                    {
                        VanBanid = Convert.ToInt32(values[VAN_BAN_ID]);
                    }

                    if (values.Contains(FILE_ID))
                    {
                        var fileIDs = values[FILE_ID] as Newtonsoft.Json.Linq.JArray;
                        var ids = new List<int>();
                        foreach (var fileID in fileIDs)
                        {
                            var model = new VanBan_Files();
                            model.VanBanID = VanBanid;
                            model.FileID = Convert.ToInt32(fileID);

                            Validate(model);
                            if (!ModelState.IsValid)
                                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

                            var result = _context.VanBan_Files.Add(model);
                            await _context.SaveChangesAsync();
                            ids.Add(result.ID);
                        }
                        return Request.CreateResponse(HttpStatusCode.Created, new { ids });
                    }
                }
            }

            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VanBan_Files.FirstOrDefaultAsync(item => item.ID == key);
            if(model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");

            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpDelete]
        public async Task Delete(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VanBan_Files.FirstOrDefaultAsync(item => item.ID == key);

            _context.VanBan_Files.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> FilesLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.Files
                         orderby i.Ten
                         select new {
                             Value = i.ID,
                             Text = i.Ten
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> VanBansLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.VanBans
                         orderby i.SoKyHieu
                         select new {
                             Value = i.ID,
                             Text = i.SoKyHieu
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(VanBan_Files model, IDictionary values) {
            string ID = nameof(VanBan_Files.ID);
            string VAN_BAN_ID = nameof(VanBan_Files.VanBanID);
            string FILE_ID = nameof(VanBan_Files.FileID);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(VAN_BAN_ID)) {
                model.VanBanID = Convert.ToInt32(values[VAN_BAN_ID]);
            }

            if(values.Contains(FILE_ID)) {
                model.FileID = Convert.ToInt32(values[FILE_ID]);
            }
        }

        private string GetFullErrorMessage(ModelStateDictionary modelState) {
            var messages = new List<string>();

            foreach(var entry in modelState) {
                foreach(var error in entry.Value.Errors)
                    messages.Add(error.ErrorMessage);
            }

            return String.Join(" ", messages);
        }

        protected override void Dispose(bool disposing) {
            if (disposing) {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}