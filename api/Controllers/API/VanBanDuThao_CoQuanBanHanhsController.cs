using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
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
    [Route("api/VanBanDuThao_CoQuanBanHanhs/{action}", Name = "VanBanDuThao_CoQuanBanHanhsApi")]
    public class VanBanDuThao_CoQuanBanHanhsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var VanBanDuThao_CoQuanBanHanhs = _context.VanBanDuThao_CoQuanBanHanhs.Select(i => new {
                i.ID,
                i.VanBanDuThaoID,
                i.CoQuanID,
                i.CoQuanBanHanh
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(VanBanDuThao_CoQuanBanHanhs, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new VanBanDuThao_CoQuanBanHanhs();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.VanBanDuThao_CoQuanBanHanhs.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VanBanDuThao_CoQuanBanHanhs.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.VanBanDuThao_CoQuanBanHanhs.FirstOrDefaultAsync(item => item.ID == key);

            _context.VanBanDuThao_CoQuanBanHanhs.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> CoQuanBanHanhsLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.CoQuanBanHanhs
                         orderby i.TenCoQuanBanHanh
                         select new {
                             Value = i.ID,
                             Text = i.TenCoQuanBanHanh
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> VanBanDuThaosLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.VanBanDuThaos
                         orderby i.TieuDe
                         select new {
                             Value = i.ID,
                             Text = i.TieuDe
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(VanBanDuThao_CoQuanBanHanhs model, IDictionary values) {
            string ID = nameof(VanBanDuThao_CoQuanBanHanhs.ID);
            string VAN_BAN_ID = nameof(VanBanDuThao_CoQuanBanHanhs.VanBanDuThaoID);
            string CoQuanBanHanh_ID = nameof(VanBanDuThao_CoQuanBanHanhs.CoQuanID);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(VAN_BAN_ID)) {
                model.VanBanDuThaoID = Convert.ToInt32(values[VAN_BAN_ID]);
            }

            if(values.Contains(CoQuanBanHanh_ID)) {
                model.CoQuanID = Convert.ToInt32(values[CoQuanBanHanh_ID]);
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