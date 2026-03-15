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
    [Route("api/VanBan_CoQuanBanHanh/{action}", Name = "VanBan_CoQuanBanHanhApi")]
    public class VanBan_CoQuanBanHanhController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var vanban_coquanbanhanh = _context.VanBan_CoQuanBanHanh.Select(i => new {
                i.ID,
                i.VanBanID,
                i.CoQuanBanHanhID
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(vanban_coquanbanhanh, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new VanBan_CoQuanBanHanh();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.VanBan_CoQuanBanHanh.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VanBan_CoQuanBanHanh.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.VanBan_CoQuanBanHanh.FirstOrDefaultAsync(item => item.ID == key);

            _context.VanBan_CoQuanBanHanh.Remove(model);
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
        public async Task<HttpResponseMessage> VanBansLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.VanBans
                         orderby i.SoKyHieu
                         select new {
                             Value = i.ID,
                             Text = i.SoKyHieu
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(VanBan_CoQuanBanHanh model, IDictionary values) {
            string ID = nameof(VanBan_CoQuanBanHanh.ID);
            string VAN_BAN_ID = nameof(VanBan_CoQuanBanHanh.VanBanID);
            string CO_QUAN_BAN_HANH_ID = nameof(VanBan_CoQuanBanHanh.CoQuanBanHanhID);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(VAN_BAN_ID)) {
                model.VanBanID = Convert.ToInt32(values[VAN_BAN_ID]);
            }

            if(values.Contains(CO_QUAN_BAN_HANH_ID)) {
                model.CoQuanBanHanhID = Convert.ToInt32(values[CO_QUAN_BAN_HANH_ID]);
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