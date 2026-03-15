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
    [Route("api/TinTuc_Files/{action}", Name = "TinTuc_FilesApi")]
    public class TinTuc_FilesController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var tintuc_files = _context.TinTuc_Files.Select(i => new {
                i.ID,
                i.TinTucID,
                i.FileID,
                i.File
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(tintuc_files, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            string TIN_TUC_ID = nameof(TinTuc_Files.TinTucID);
            string FILE_ID = nameof(TinTuc_Files.FileID);

            if (values.Contains(FILE_ID))
            {
                if (values[FILE_ID] is Int32)
                {
                    var model = new TinTuc_Files();
                    PopulateModel(model, values);

                    Validate(model);
                    if (!ModelState.IsValid)
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

                    var result = _context.TinTuc_Files.Add(model);
                    await _context.SaveChangesAsync();

                    return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
                }
                else if (values[FILE_ID] is Newtonsoft.Json.Linq.JArray)
                {
                    int TinTucid = 0;
                    if (values.Contains(TIN_TUC_ID))
                    {
                        TinTucid = Convert.ToInt32(values[TIN_TUC_ID]);
                    }

                    if (values.Contains(FILE_ID))
                    {
                        var fileIDs = values[FILE_ID] as Newtonsoft.Json.Linq.JArray;
                        var ids = new List<int>();
                        foreach (var fileID in fileIDs)
                        {
                            var model = new TinTuc_Files();
                            model.TinTucID = TinTucid;
                            model.FileID = Convert.ToInt32(fileID);

                            Validate(model);
                            if (!ModelState.IsValid)
                                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

                            var result = _context.TinTuc_Files.Add(model);
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
            var model = await _context.TinTuc_Files.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.TinTuc_Files.FirstOrDefaultAsync(item => item.ID == key);

            _context.TinTuc_Files.Remove(model);
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
        public async Task<HttpResponseMessage> TinTucsLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.TinTucs
                         orderby i.TieuDe
                         select new {
                             Value = i.ID,
                             Text = i.TieuDe
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(TinTuc_Files model, IDictionary values) {
            string ID = nameof(TinTuc_Files.ID);
            string TIN_TUC_ID = nameof(TinTuc_Files.TinTucID);
            string FILE_ID = nameof(TinTuc_Files.FileID);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TIN_TUC_ID)) {
                model.TinTucID = Convert.ToInt32(values[TIN_TUC_ID]);
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