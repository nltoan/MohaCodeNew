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
    [Route("api/QLDA_HoSo/{action}", Name = "QLDA_HoSoApi")]
    public class QLDA_HoSoController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var qlda_hoso = _context.QLDA_HoSo.Select(i => new {
                i.ID,
                i.Ten,
                i.NoiDung,
                i.DuAnDeAnID,
                i.CapBanHanh,
                i.TrangThai,
                i.NgayTao,
                i.FileDinhKem
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(qlda_hoso, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new QLDA_HoSo();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.QLDA_HoSo.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.QLDA_HoSo.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.QLDA_HoSo.FirstOrDefaultAsync(item => item.ID == key);

            _context.QLDA_HoSo.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_DuAnDeAnLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.QLDA_DuAnDeAn
                         orderby i.Ten
                         select new {
                             Value = i.id,
                             Text = i.Ten
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(QLDA_HoSo model, IDictionary values) {
            string ID = nameof(QLDA_HoSo.ID);
            string TEN = nameof(QLDA_HoSo.Ten);
            string NOI_DUNG = nameof(QLDA_HoSo.NoiDung);
            string DU_AN_DE_AN_ID = nameof(QLDA_HoSo.DuAnDeAnID);
            string CAP_BAN_HANH = nameof(QLDA_HoSo.CapBanHanh);
            string TRANG_THAI = nameof(QLDA_HoSo.TrangThai);
            string NGAY_TAO = nameof(QLDA_HoSo.NgayTao);
            string FILE_DINH_KEM = nameof(QLDA_HoSo.FileDinhKem);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN)) {
                model.Ten = Convert.ToString(values[TEN]);
            }

            if(values.Contains(NOI_DUNG)) {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if(values.Contains(DU_AN_DE_AN_ID)) {
                model.DuAnDeAnID = values[DU_AN_DE_AN_ID] != null ? Convert.ToInt32(values[DU_AN_DE_AN_ID]) : (int?)null;
            }

            if(values.Contains(CAP_BAN_HANH)) {
                model.CapBanHanh = values[CAP_BAN_HANH] != null ? Convert.ToInt32(values[CAP_BAN_HANH]) : (int?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = values[NGAY_TAO] != null ? Convert.ToDateTime(values[NGAY_TAO]) : (DateTime?)null;
            }

            if(values.Contains(FILE_DINH_KEM)) {
                model.FileDinhKem = Convert.ToString(values[FILE_DINH_KEM]);
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