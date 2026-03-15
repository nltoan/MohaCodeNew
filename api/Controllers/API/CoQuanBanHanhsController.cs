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
    [Route("api/CoQuanBanHanhs/{action}", Name = "CoQuanBanHanhsApi")]
    public class CoQuanBanHanhsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var coquanbanhanhs = _context.CoQuanBanHanhs.Select(i => new {
                i.ID,
                i.TenCoQuanBanHanh,
                i.MoTa,
                i.SoThuTu,
                i.HienThi,
                i.Lang
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(coquanbanhanhs, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new CoQuanBanHanh();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.CoQuanBanHanhs.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.CoQuanBanHanhs.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.CoQuanBanHanhs.FirstOrDefaultAsync(item => item.ID == key);

            _context.CoQuanBanHanhs.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(CoQuanBanHanh model, IDictionary values) {
            string ID = nameof(CoQuanBanHanh.ID);
            string TEN_CO_QUAN_BAN_HANH = nameof(CoQuanBanHanh.TenCoQuanBanHanh);
            string MO_TA = nameof(CoQuanBanHanh.MoTa);
            string SO_THU_TU = nameof(CoQuanBanHanh.SoThuTu);
            string HIEN_THI = nameof(CoQuanBanHanh.HienThi);
            string LANG = nameof(CoQuanBanHanh.Lang);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_CO_QUAN_BAN_HANH)) {
                model.TenCoQuanBanHanh = Convert.ToString(values[TEN_CO_QUAN_BAN_HANH]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(SO_THU_TU)) {
                model.SoThuTu = values[SO_THU_TU] != null ? Convert.ToInt32(values[SO_THU_TU]) : (int?)null;
            }

            if(values.Contains(HIEN_THI)) {
                model.HienThi = values[HIEN_THI] != null ? Convert.ToInt32(values[HIEN_THI]) : (int?)null;
            }

            if(values.Contains(LANG)) {
                model.Lang = values[LANG] != null ? Convert.ToInt32(values[LANG]) : (int?)null;
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