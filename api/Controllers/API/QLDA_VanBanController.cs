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
    [Route("api/QLDA_VanBan/{action}", Name = "QLDA_VanBanApi")]
    public class QLDA_VanBanController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var qlda_vanban = _context.QLDA_VanBan.Select(i => new {
                i.ID,
                i.Ten,
                i.SoKyHieu,
                i.NgayBanHanh,
                i.TrichYeu,
                i.DonViBanHanhID,
                i.DuAnDeAnID,
                i.NgayCoHieuLuc,
                i.NgayHetHieuLuc,
                i.TrangThai,
                i.Loai,
                i.NguoiKyID,
                i.FileDinhKem,
                i.NgayTao
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(qlda_vanban, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new QLDA_VanBan();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.QLDA_VanBan.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.QLDA_VanBan.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.QLDA_VanBan.FirstOrDefaultAsync(item => item.ID == key);

            _context.QLDA_VanBan.Remove(model);
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

        private void PopulateModel(QLDA_VanBan model, IDictionary values) {
            string ID = nameof(QLDA_VanBan.ID);
            string TEN = nameof(QLDA_VanBan.Ten);
            string SO_KY_HIEU = nameof(QLDA_VanBan.SoKyHieu);
            string NGAY_BAN_HANH = nameof(QLDA_VanBan.NgayBanHanh);
            string TRICH_YEU = nameof(QLDA_VanBan.TrichYeu);
            string DON_VI_BAN_HANH_ID = nameof(QLDA_VanBan.DonViBanHanhID);
            string DU_AN_DE_AN_ID = nameof(QLDA_VanBan.DuAnDeAnID);
            string NGAY_CO_HIEU_LUC = nameof(QLDA_VanBan.NgayCoHieuLuc);
            string NGAY_HET_HIEU_LUC = nameof(QLDA_VanBan.NgayHetHieuLuc);
            string TRANG_THAI = nameof(QLDA_VanBan.TrangThai);
            string LOAI = nameof(QLDA_VanBan.Loai);
            string NGUOI_KY_ID = nameof(QLDA_VanBan.NguoiKyID);
            string FILE_DINH_KEM = nameof(QLDA_VanBan.FileDinhKem);
            string NGAY_TAO = nameof(QLDA_VanBan.NgayTao);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN)) {
                model.Ten = Convert.ToString(values[TEN]);
            }

            if(values.Contains(SO_KY_HIEU)) {
                model.SoKyHieu = Convert.ToString(values[SO_KY_HIEU]);
            }

            if(values.Contains(NGAY_BAN_HANH)) {
                model.NgayBanHanh = values[NGAY_BAN_HANH] != null ? Convert.ToDateTime(values[NGAY_BAN_HANH]) : (DateTime?)null;
            }

            if(values.Contains(TRICH_YEU)) {
                model.TrichYeu = Convert.ToString(values[TRICH_YEU]);
            }

            if(values.Contains(DON_VI_BAN_HANH_ID)) {
                model.DonViBanHanhID = values[DON_VI_BAN_HANH_ID] != null ? Convert.ToInt32(values[DON_VI_BAN_HANH_ID]) : (int?)null;
            }

            if(values.Contains(DU_AN_DE_AN_ID)) {
                model.DuAnDeAnID = values[DU_AN_DE_AN_ID] != null ? Convert.ToInt32(values[DU_AN_DE_AN_ID]) : (int?)null;
            }

            if(values.Contains(NGAY_CO_HIEU_LUC)) {
                model.NgayCoHieuLuc = values[NGAY_CO_HIEU_LUC] != null ? Convert.ToDateTime(values[NGAY_CO_HIEU_LUC]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_HET_HIEU_LUC)) {
                model.NgayHetHieuLuc = values[NGAY_HET_HIEU_LUC] != null ? Convert.ToDateTime(values[NGAY_HET_HIEU_LUC]) : (DateTime?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(LOAI)) {
                model.Loai = values[LOAI] != null ? Convert.ToInt32(values[LOAI]) : (int?)null;
            }

            if(values.Contains(NGUOI_KY_ID)) {
                model.NguoiKyID = values[NGUOI_KY_ID] != null ? Convert.ToInt32(values[NGUOI_KY_ID]) : (int?)null;
            }

            if(values.Contains(FILE_DINH_KEM)) {
                model.FileDinhKem = Convert.ToString(values[FILE_DINH_KEM]);
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = values[NGAY_TAO] != null ? Convert.ToDateTime(values[NGAY_TAO]) : (DateTime?)null;
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