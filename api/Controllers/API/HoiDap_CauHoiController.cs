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
    [Route("api/HoiDap_CauHoi/{action}", Name = "HoiDap_CauHoiApi")]
    public class HoiDap_CauHoiController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var hoidap_cauhoi = _context.HoiDap_CauHoi.Select(i => new {
                i.ID,
                i.HoTen,
                i.Email,
                i.DienThoai,
                i.DiaChi,
                i.CauHoi,
                i.TrangThai,
                i.ID_ChuDe,
                i.PhanCongTraLoi,
                i.DonViTraLoi,
                i.DonViDongXuLy,
                i.ThoiGianTao,
                i.ThoiGianXuatBan,
                i.FileDinhKems,
                i.Attachments,
                i.TieuDe,
                i.ID_ChuDe_New
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(hoidap_cauhoi, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new HoiDap_CauHoi();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.HoiDap_CauHoi.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.HoiDap_CauHoi.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.HoiDap_CauHoi.FirstOrDefaultAsync(item => item.ID == key);

            _context.HoiDap_CauHoi.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(HoiDap_CauHoi model, IDictionary values) {
            string ID = nameof(HoiDap_CauHoi.ID);
            string HO_TEN = nameof(HoiDap_CauHoi.HoTen);
            string EMAIL = nameof(HoiDap_CauHoi.Email);
            string DIEN_THOAI = nameof(HoiDap_CauHoi.DienThoai);
            string DIA_CHI = nameof(HoiDap_CauHoi.DiaChi);
            string CAU_HOI = nameof(HoiDap_CauHoi.CauHoi);
            string TRANG_THAI = nameof(HoiDap_CauHoi.TrangThai);
            string ID_CHU_DE = nameof(HoiDap_CauHoi.ID_ChuDe);
            string PHAN_CONG_TRA_LOI = nameof(HoiDap_CauHoi.PhanCongTraLoi);
            string DON_VI_TRA_LOI = nameof(HoiDap_CauHoi.DonViTraLoi);
            string DON_VI_DONG_XU_LY = nameof(HoiDap_CauHoi.DonViDongXuLy);
            string THOI_GIAN_TAO = nameof(HoiDap_CauHoi.ThoiGianTao);
            string THOI_GIAN_XUAT_BAN = nameof(HoiDap_CauHoi.ThoiGianXuatBan);
            string FILE_DINH_KEMS = nameof(HoiDap_CauHoi.FileDinhKems);
            string ATTACHMENTS = nameof(HoiDap_CauHoi.Attachments);
            string TIEU_DE = nameof(HoiDap_CauHoi.TieuDe);
            string ID_CHU_DE_NEW = nameof(HoiDap_CauHoi.ID_ChuDe_New);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(HO_TEN)) {
                model.HoTen = Convert.ToString(values[HO_TEN]);
            }

            if(values.Contains(EMAIL)) {
                model.Email = Convert.ToString(values[EMAIL]);
            }

            if(values.Contains(DIEN_THOAI)) {
                model.DienThoai = Convert.ToString(values[DIEN_THOAI]);
            }

            if(values.Contains(DIA_CHI)) {
                model.DiaChi = Convert.ToString(values[DIA_CHI]);
            }

            if(values.Contains(CAU_HOI)) {
                model.CauHoi = Convert.ToString(values[CAU_HOI]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(ID_CHU_DE)) {
                model.ID_ChuDe = values[ID_CHU_DE] != null ? Convert.ToInt32(values[ID_CHU_DE]) : (int?)null;
            }

            if(values.Contains(PHAN_CONG_TRA_LOI)) {
                model.PhanCongTraLoi = values[PHAN_CONG_TRA_LOI] != null ? Convert.ToInt32(values[PHAN_CONG_TRA_LOI]) : (int?)null;
            }

            if(values.Contains(DON_VI_TRA_LOI)) {
                model.DonViTraLoi = values[DON_VI_TRA_LOI] != null ? Convert.ToInt32(values[DON_VI_TRA_LOI]) : (int?)null;
            }

            if(values.Contains(DON_VI_DONG_XU_LY)) {
                model.DonViDongXuLy = Convert.ToString(values[DON_VI_DONG_XU_LY]);
            }

            if(values.Contains(THOI_GIAN_TAO)) {
                model.ThoiGianTao = values[THOI_GIAN_TAO] != null ? Convert.ToDateTime(values[THOI_GIAN_TAO]) : (DateTime?)null;
            }

            if(values.Contains(THOI_GIAN_XUAT_BAN)) {
                model.ThoiGianXuatBan = values[THOI_GIAN_XUAT_BAN] != null ? Convert.ToDateTime(values[THOI_GIAN_XUAT_BAN]) : (DateTime?)null;
            }

            if(values.Contains(FILE_DINH_KEMS)) {
                model.FileDinhKems = Convert.ToString(values[FILE_DINH_KEMS]);
            }

            if(values.Contains(ATTACHMENTS)) {
                model.Attachments = Convert.ToString(values[ATTACHMENTS]);
            }

            if(values.Contains(TIEU_DE)) {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if(values.Contains(ID_CHU_DE_NEW)) {
                model.ID_ChuDe_New = values[ID_CHU_DE_NEW] != null ? Convert.ToInt32(values[ID_CHU_DE_NEW]) : (int?)null;
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