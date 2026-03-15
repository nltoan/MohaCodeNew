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
    [Route("api/TinTuc_Temp/{action}", Name = "TinTuc_TempApi")]
    public class TinTuc_TempController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var tintuc_temp = _context.TinTuc_Temp.Select(i => new {
                i.ID,
                i.TieuDe,
                i.MoTa,
                i.NoiDung,
                i.TacGia,
                i.NgayTao,
                i.TrangThai,
                i.IDChuyenMuc,
                i.ChoPhepGuiPhanHoi,
                i.CacTinLienQuan,
                i.AnhDaiDien,
                i.NgayXuatBan,
                i.DongSuKien,
                i.VungHienThi,
                i.FilesDinhKem,
                i.NguonTin,
                i.PhuDe,
                i.NguoiTao,
                i.NguoiTraVe,
                i.NgayTraVe,
                i.TenNguoiTao,
                i.TenNguoiTraVe,
                i.TuKhoa,
                i.PageCount,
                i.DanhGia,
                i.ThoiGianUuTien,
                i.LogChuyenMucThayDoi,
                i.LogQuyTrinhThayDoi,
                i.ID_TinTuc
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(tintuc_temp, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new TinTuc_Temp();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.TinTuc_Temp.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.TinTuc_Temp.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.TinTuc_Temp.FirstOrDefaultAsync(item => item.ID == key);

            _context.TinTuc_Temp.Remove(model);
            await _context.SaveChangesAsync();
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

        private void PopulateModel(TinTuc_Temp model, IDictionary values) {
            string ID = nameof(TinTuc_Temp.ID);
            string TIEU_DE = nameof(TinTuc_Temp.TieuDe);
            string MO_TA = nameof(TinTuc_Temp.MoTa);
            string NOI_DUNG = nameof(TinTuc_Temp.NoiDung);
            string TAC_GIA = nameof(TinTuc_Temp.TacGia);
            string NGAY_TAO = nameof(TinTuc_Temp.NgayTao);
            string TRANG_THAI = nameof(TinTuc_Temp.TrangThai);
            string IDCHUYEN_MUC = nameof(TinTuc_Temp.IDChuyenMuc);
            string CHO_PHEP_GUI_PHAN_HOI = nameof(TinTuc_Temp.ChoPhepGuiPhanHoi);
            string CAC_TIN_LIEN_QUAN = nameof(TinTuc_Temp.CacTinLienQuan);
            string ANH_DAI_DIEN = nameof(TinTuc_Temp.AnhDaiDien);
            string NGAY_XUAT_BAN = nameof(TinTuc_Temp.NgayXuatBan);
            string DONG_SU_KIEN = nameof(TinTuc_Temp.DongSuKien);
            string VUNG_HIEN_THI = nameof(TinTuc_Temp.VungHienThi);
            string FILES_DINH_KEM = nameof(TinTuc_Temp.FilesDinhKem);
            string NGUON_TIN = nameof(TinTuc_Temp.NguonTin);
            string PHU_DE = nameof(TinTuc_Temp.PhuDe);
            string NGUOI_TAO = nameof(TinTuc_Temp.NguoiTao);
            string NGUOI_TRA_VE = nameof(TinTuc_Temp.NguoiTraVe);
            string NGAY_TRA_VE = nameof(TinTuc_Temp.NgayTraVe);
            string TEN_NGUOI_TAO = nameof(TinTuc_Temp.TenNguoiTao);
            string TEN_NGUOI_TRA_VE = nameof(TinTuc_Temp.TenNguoiTraVe);
            string TU_KHOA = nameof(TinTuc_Temp.TuKhoa);
            string PAGE_COUNT = nameof(TinTuc_Temp.PageCount);
            string DANH_GIA = nameof(TinTuc_Temp.DanhGia);
            string THOI_GIAN_UU_TIEN = nameof(TinTuc_Temp.ThoiGianUuTien);
            string LOG_CHUYEN_MUC_THAY_DOI = nameof(TinTuc_Temp.LogChuyenMucThayDoi);
            string LOG_QUY_TRINH_THAY_DOI = nameof(TinTuc_Temp.LogQuyTrinhThayDoi);
            string ID_TIN_TUC = nameof(TinTuc_Temp.ID_TinTuc);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TIEU_DE)) {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(NOI_DUNG)) {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if(values.Contains(TAC_GIA)) {
                model.TacGia = Convert.ToString(values[TAC_GIA]);
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = values[NGAY_TAO] != null ? Convert.ToDateTime(values[NGAY_TAO]) : (DateTime?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(IDCHUYEN_MUC)) {
                model.IDChuyenMuc = values[IDCHUYEN_MUC] != null ? Convert.ToInt32(values[IDCHUYEN_MUC]) : (int?)null;
            }

            if(values.Contains(CHO_PHEP_GUI_PHAN_HOI)) {
                model.ChoPhepGuiPhanHoi = values[CHO_PHEP_GUI_PHAN_HOI] != null ? Convert.ToInt32(values[CHO_PHEP_GUI_PHAN_HOI]) : (int?)null;
            }

            if(values.Contains(CAC_TIN_LIEN_QUAN)) {
                model.CacTinLienQuan = Convert.ToString(values[CAC_TIN_LIEN_QUAN]);
            }

            if(values.Contains(ANH_DAI_DIEN)) {
                model.AnhDaiDien = Convert.ToString(values[ANH_DAI_DIEN]);
            }

            if(values.Contains(NGAY_XUAT_BAN)) {
                model.NgayXuatBan = values[NGAY_XUAT_BAN] != null ? Convert.ToDateTime(values[NGAY_XUAT_BAN]) : (DateTime?)null;
            }

            if(values.Contains(DONG_SU_KIEN)) {
                model.DongSuKien = Convert.ToString(values[DONG_SU_KIEN]);
            }

            if(values.Contains(VUNG_HIEN_THI)) {
                model.VungHienThi = Convert.ToString(values[VUNG_HIEN_THI]);
            }

            if(values.Contains(FILES_DINH_KEM)) {
                model.FilesDinhKem = Convert.ToString(values[FILES_DINH_KEM]);
            }

            if(values.Contains(NGUON_TIN)) {
                model.NguonTin = Convert.ToString(values[NGUON_TIN]);
            }

            if(values.Contains(PHU_DE)) {
                model.PhuDe = Convert.ToString(values[PHU_DE]);
            }

            if(values.Contains(NGUOI_TAO)) {
                model.NguoiTao = Convert.ToString(values[NGUOI_TAO]);
            }

            if(values.Contains(NGUOI_TRA_VE)) {
                model.NguoiTraVe = Convert.ToString(values[NGUOI_TRA_VE]);
            }

            if(values.Contains(NGAY_TRA_VE)) {
                model.NgayTraVe = Convert.ToString(values[NGAY_TRA_VE]);
            }

            if(values.Contains(TEN_NGUOI_TAO)) {
                model.TenNguoiTao = Convert.ToString(values[TEN_NGUOI_TAO]);
            }

            if(values.Contains(TEN_NGUOI_TRA_VE)) {
                model.TenNguoiTraVe = Convert.ToString(values[TEN_NGUOI_TRA_VE]);
            }

            if(values.Contains(TU_KHOA)) {
                model.TuKhoa = Convert.ToString(values[TU_KHOA]);
            }

            if(values.Contains(PAGE_COUNT)) {
                model.PageCount = values[PAGE_COUNT] != null ? Convert.ToInt32(values[PAGE_COUNT]) : (int?)null;
            }

            if(values.Contains(DANH_GIA)) {
                model.DanhGia = Convert.ToString(values[DANH_GIA]);
            }

            if(values.Contains(THOI_GIAN_UU_TIEN)) {
                model.ThoiGianUuTien = values[THOI_GIAN_UU_TIEN] != null ? Convert.ToDateTime(values[THOI_GIAN_UU_TIEN]) : (DateTime?)null;
            }

            if(values.Contains(LOG_CHUYEN_MUC_THAY_DOI)) {
                model.LogChuyenMucThayDoi = values[LOG_CHUYEN_MUC_THAY_DOI] != null ? Convert.ToInt32(values[LOG_CHUYEN_MUC_THAY_DOI]) : (int?)null;
            }

            if(values.Contains(LOG_QUY_TRINH_THAY_DOI)) {
                model.LogQuyTrinhThayDoi = values[LOG_QUY_TRINH_THAY_DOI] != null ? Convert.ToInt32(values[LOG_QUY_TRINH_THAY_DOI]) : (int?)null;
            }

            if(values.Contains(ID_TIN_TUC)) {
                model.ID_TinTuc = values[ID_TIN_TUC] != null ? Convert.ToInt32(values[ID_TIN_TUC]) : (int?)null;
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