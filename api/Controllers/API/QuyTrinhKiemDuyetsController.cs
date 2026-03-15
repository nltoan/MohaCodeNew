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
    [Route("api/QuyTrinhKiemDuyets/{action}", Name = "QuyTrinhKiemDuyetsApi")]
    public class QuyTrinhKiemDuyetsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var quytrinhkiemduyets = _context.QuyTrinhKiemDuyets.Select(i => new {
                i.ID,
                i.TenQuyTrinhKiemDuyet,
                i.MoTa,
                i.TrangThai,
                i.LogThayDoi
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(quytrinhkiemduyets, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new QuyTrinhKiemDuyet();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.QuyTrinhKiemDuyets.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.QuyTrinhKiemDuyets.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.QuyTrinhKiemDuyets.FirstOrDefaultAsync(item => item.ID == key);

            _context.QuyTrinhKiemDuyets.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(QuyTrinhKiemDuyet model, IDictionary values) {
            string ID = nameof(QuyTrinhKiemDuyet.ID);
            string TEN_QUY_TRINH_KIEM_DUYET = nameof(QuyTrinhKiemDuyet.TenQuyTrinhKiemDuyet);
            string MO_TA = nameof(QuyTrinhKiemDuyet.MoTa);
            string TRANG_THAI = nameof(QuyTrinhKiemDuyet.TrangThai);
            string LOG_THAY_DOI = nameof(QuyTrinhKiemDuyet.LogThayDoi);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_QUY_TRINH_KIEM_DUYET)) {
                model.TenQuyTrinhKiemDuyet = Convert.ToString(values[TEN_QUY_TRINH_KIEM_DUYET]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(LOG_THAY_DOI)) {
                model.LogThayDoi = values[LOG_THAY_DOI] != null ? Convert.ToInt32(values[LOG_THAY_DOI]) : (int?)null;
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