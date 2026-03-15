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
    [Route("api/TinTuc_History/{action}", Name = "TinTuc_HistoryApi")]
    public class TinTuc_HistoryController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> GetCompare(int ID)
        {
            var left = _context.TinTuc_History.Where(x=>x.ID == ID).FirstOrDefault();
            var right = _context.TinTuc_History.Where(x => x.ID < ID). Where(x=>x.TinTucID == left.TinTucID).OrderByDescending(x => x.ID).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, new { left, right });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var tintuc_history = _context.TinTuc_History.Select(i => new {
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
                i.LoaiTin,
                i.ChuyenMucHienThiThem,
                i.PreFix,
                i.Infographich,
                i.Type,
                i.TinTucID,
                i.UserId,
                i.UpdatedAt
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(tintuc_history, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new TinTuc_History();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.TinTuc_History.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.TinTuc_History.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.TinTuc_History.FirstOrDefaultAsync(item => item.ID == key);

            _context.TinTuc_History.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> ChuyenMucsLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.ChuyenMucs
                         orderby i.TenChuyenMuc
                         select new {
                             Value = i.ID,
                             Text = i.TenChuyenMuc
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

        private void PopulateModel(TinTuc_History model, IDictionary values) {
            string ID = nameof(TinTuc_History.ID);
            string TIEU_DE = nameof(TinTuc_History.TieuDe);
            string MO_TA = nameof(TinTuc_History.MoTa);
            string NOI_DUNG = nameof(TinTuc_History.NoiDung);
            string TAC_GIA = nameof(TinTuc_History.TacGia);
            string NGAY_TAO = nameof(TinTuc_History.NgayTao);
            string TRANG_THAI = nameof(TinTuc_History.TrangThai);
            string IDCHUYEN_MUC = nameof(TinTuc_History.IDChuyenMuc);
            string CHO_PHEP_GUI_PHAN_HOI = nameof(TinTuc_History.ChoPhepGuiPhanHoi);
            string CAC_TIN_LIEN_QUAN = nameof(TinTuc_History.CacTinLienQuan);
            string ANH_DAI_DIEN = nameof(TinTuc_History.AnhDaiDien);
            string NGAY_XUAT_BAN = nameof(TinTuc_History.NgayXuatBan);
            string DONG_SU_KIEN = nameof(TinTuc_History.DongSuKien);
            string VUNG_HIEN_THI = nameof(TinTuc_History.VungHienThi);
            string FILES_DINH_KEM = nameof(TinTuc_History.FilesDinhKem);
            string NGUON_TIN = nameof(TinTuc_History.NguonTin);
            string PHU_DE = nameof(TinTuc_History.PhuDe);
            string NGUOI_TAO = nameof(TinTuc_History.NguoiTao);
            string NGUOI_TRA_VE = nameof(TinTuc_History.NguoiTraVe);
            string NGAY_TRA_VE = nameof(TinTuc_History.NgayTraVe);
            string TEN_NGUOI_TAO = nameof(TinTuc_History.TenNguoiTao);
            string TEN_NGUOI_TRA_VE = nameof(TinTuc_History.TenNguoiTraVe);
            string TU_KHOA = nameof(TinTuc_History.TuKhoa);
            string PAGE_COUNT = nameof(TinTuc_History.PageCount);
            string DANH_GIA = nameof(TinTuc_History.DanhGia);
            string THOI_GIAN_UU_TIEN = nameof(TinTuc_History.ThoiGianUuTien);
            string LOG_CHUYEN_MUC_THAY_DOI = nameof(TinTuc_History.LogChuyenMucThayDoi);
            string LOG_QUY_TRINH_THAY_DOI = nameof(TinTuc_History.LogQuyTrinhThayDoi);
            string LOAI_TIN = nameof(TinTuc_History.LoaiTin);
            string CHUYEN_MUC_HIEN_THI_THEM = nameof(TinTuc_History.ChuyenMucHienThiThem);
            string PRE_FIX = nameof(TinTuc_History.PreFix);
            string INFOGRAPHICH = nameof(TinTuc_History.Infographich);
            string TYPE = nameof(TinTuc_History.Type);
            string TIN_TUC_ID = nameof(TinTuc_History.TinTucID);

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

            if(values.Contains(LOAI_TIN)) {
                model.LoaiTin = values[LOAI_TIN] != null ? Convert.ToInt32(values[LOAI_TIN]) : (int?)null;
            }

            if(values.Contains(CHUYEN_MUC_HIEN_THI_THEM)) {
                model.ChuyenMucHienThiThem = Convert.ToString(values[CHUYEN_MUC_HIEN_THI_THEM]);
            }

            if(values.Contains(PRE_FIX)) {
                model.PreFix = values[PRE_FIX] != null ? Convert.ToInt32(values[PRE_FIX]) : (int?)null;
            }

            if(values.Contains(INFOGRAPHICH)) {
                model.Infographich = values[INFOGRAPHICH] != null ? Convert.ToInt32(values[INFOGRAPHICH]) : (int?)null;
            }

            if(values.Contains(TYPE)) {
                model.Type = values[TYPE] != null ? Convert.ToInt32(values[TYPE]) : (int?)null;
            }

            if(values.Contains(TIN_TUC_ID)) {
                model.TinTucID = Convert.ToInt32(values[TIN_TUC_ID]);
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