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
    [Route("api/ThongTinLanhDaos/{action}", Name = "ThongTinLanhDaosApi")]
    public class ThongTinLanhDaosController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var thongtinlanhdaos = _context.ThongTinLanhDaos.Select(i => new {
                i.ID,
                i.HoTenLanhDao,
                i.NhiemKy,
                i.NgaySinh,
                i.GioiTinh,
                i.SoFax,
                i.Email,
                i.SoDienThoai,
                i.NguyenQuan,
                i.TieuSuBanThan,
                i.AnhDaiDien,
                i.ChucDanh,
                i.Hang,
                i.Cot,
                i.HienThiTieuSu,
                i.TrangThai,
                i.ThuKy,
                i.Lang,
                i.TrinhDo,
                i.DangVien,
                i.SoQDBoNhiem,
                i.NgayQDBoNhiem,
                i.NguoiKyQDBoNhiem,
                i.ThoiHanBoNhiem,
                i.BatDauBoNhiem,
                i.ChucVuCu,
                i.ChucVuMoi,
                i.DonViCu,
                i.DonViMoi,
                i.QuaTrinhCongTac,
                i.LinkQDBoNhiem,
                i.TrinhDoLLCT,
                i.ThongTinQĐBoNhiem,
                i.DanToc,
                i.TonGiao,
                i.ChucVuDang,
                i.NgayVaoDang,
                i.NgayVaoDangChinhThuc
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(thongtinlanhdaos, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ThongTinLanhDao();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ThongTinLanhDaos.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ThongTinLanhDaos.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ThongTinLanhDaos.FirstOrDefaultAsync(item => item.ID == key);

            _context.ThongTinLanhDaos.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> ThongTinLanhDaosLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.ThongTinLanhDaos
                         orderby i.HoTenLanhDao
                         select new {
                             Value = i.ID,
                             Text = i.HoTenLanhDao
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(ThongTinLanhDao model, IDictionary values) {
            string ID = nameof(ThongTinLanhDao.ID);
            string HO_TEN_LANH_DAO = nameof(ThongTinLanhDao.HoTenLanhDao);
            string NHIEM_KY = nameof(ThongTinLanhDao.NhiemKy);
            string NGAY_SINH = nameof(ThongTinLanhDao.NgaySinh);
            string GIOI_TINH = nameof(ThongTinLanhDao.GioiTinh);
            string SO_FAX = nameof(ThongTinLanhDao.SoFax);
            string EMAIL = nameof(ThongTinLanhDao.Email);
            string SO_DIEN_THOAI = nameof(ThongTinLanhDao.SoDienThoai);
            string NGUYEN_QUAN = nameof(ThongTinLanhDao.NguyenQuan);
            string TIEU_SU_BAN_THAN = nameof(ThongTinLanhDao.TieuSuBanThan);
            string ANH_DAI_DIEN = nameof(ThongTinLanhDao.AnhDaiDien);
            string CHUC_DANH = nameof(ThongTinLanhDao.ChucDanh);
            string HANG = nameof(ThongTinLanhDao.Hang);
            string COT = nameof(ThongTinLanhDao.Cot);
            string HIEN_THI_TIEU_SU = nameof(ThongTinLanhDao.HienThiTieuSu);
            string TRANG_THAI = nameof(ThongTinLanhDao.TrangThai);
            string THU_KY = nameof(ThongTinLanhDao.ThuKy);
            string LANG = nameof(ThongTinLanhDao.Lang);
            string TRINH_DO = nameof(ThongTinLanhDao.TrinhDo);
            string TRINH_DO_LLCT = nameof(ThongTinLanhDao.TrinhDoLLCT);
            string DANG_VIEN = nameof(ThongTinLanhDao.DangVien);
            string SO_QDBO_NHIEM = nameof(ThongTinLanhDao.SoQDBoNhiem);
            string NGAY_QDBO_NHIEM = nameof(ThongTinLanhDao.NgayQDBoNhiem);
            string NGUOI_KY_QDBO_NHIEM = nameof(ThongTinLanhDao.NguoiKyQDBoNhiem);
            string THOI_HAN_BO_NHIEM = nameof(ThongTinLanhDao.ThoiHanBoNhiem);
            string BAT_DAU_BO_NHIEM = nameof(ThongTinLanhDao.BatDauBoNhiem);
            string CHUC_VU_CU = nameof(ThongTinLanhDao.ChucVuCu);
            string CHUC_VU_MOI = nameof(ThongTinLanhDao.ChucVuMoi);
            string DON_VI_CU = nameof(ThongTinLanhDao.DonViCu);
            string DON_VI_MOI = nameof(ThongTinLanhDao.DonViMoi);
            string QUA_TRINH_CONG_TAC = nameof(ThongTinLanhDao.QuaTrinhCongTac);
            string LINK_QDBO_NHIEM = nameof(ThongTinLanhDao.LinkQDBoNhiem);
            string THONGTIN_QDBO_NHIEM = nameof(ThongTinLanhDao.ThongTinQĐBoNhiem);
            string DAN_TOC = nameof(ThongTinLanhDao.DanToc);
            string TON_GIAO = nameof(ThongTinLanhDao.TonGiao);
            string CHUC_VU_DANG = nameof(ThongTinLanhDao.ChucVuDang);
            string NGAY_VAO_DANG = nameof(ThongTinLanhDao.NgayVaoDang);
            string NGAY_VAO_DANG_CHINH_THUC = nameof(ThongTinLanhDao.NgayVaoDangChinhThuc);

            if (values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(HO_TEN_LANH_DAO)) {
                model.HoTenLanhDao = Convert.ToString(values[HO_TEN_LANH_DAO]);
            }

            if(values.Contains(NHIEM_KY)) {
                model.NhiemKy = Convert.ToString(values[NHIEM_KY]);
            }

            if(values.Contains(NGAY_SINH)) {
                model.NgaySinh = values[NGAY_SINH] != null ? Convert.ToDateTime(values[NGAY_SINH]) : (DateTime?)null;
            }

            if(values.Contains(GIOI_TINH)) {
                model.GioiTinh = Convert.ToString(values[GIOI_TINH]);
            }

            if(values.Contains(SO_FAX)) {
                model.SoFax = Convert.ToString(values[SO_FAX]);
            }

            if(values.Contains(EMAIL)) {
                model.Email = Convert.ToString(values[EMAIL]);
            }

            if(values.Contains(SO_DIEN_THOAI)) {
                model.SoDienThoai = Convert.ToString(values[SO_DIEN_THOAI]);
            }

            if(values.Contains(NGUYEN_QUAN)) {
                model.NguyenQuan = Convert.ToString(values[NGUYEN_QUAN]);
            }

            if(values.Contains(TIEU_SU_BAN_THAN)) {
                model.TieuSuBanThan = Convert.ToString(values[TIEU_SU_BAN_THAN]);
            }

            if(values.Contains(ANH_DAI_DIEN)) {
                model.AnhDaiDien = Convert.ToString(values[ANH_DAI_DIEN]);
            }

            if(values.Contains(CHUC_DANH)) {
                model.ChucDanh = Convert.ToString(values[CHUC_DANH]);
            }

            if(values.Contains(HANG)) {
                model.Hang = values[HANG] != null ? Convert.ToInt32(values[HANG]) : (int?)null;
            }

            if(values.Contains(COT)) {
                model.Cot = values[COT] != null ? Convert.ToInt32(values[COT]) : (int?)null;
            }

            if(values.Contains(HIEN_THI_TIEU_SU)) {
                model.HienThiTieuSu = values[HIEN_THI_TIEU_SU] != null ? Convert.ToInt32(values[HIEN_THI_TIEU_SU]) : (int?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(THU_KY)) {
                model.ThuKy = values[THU_KY] != null ? Convert.ToInt32(values[THU_KY]) : (int?)null;
            }

            if(values.Contains(LANG)) {
                model.Lang = values[LANG] != null ? Convert.ToInt32(values[LANG]) : (int?)null;
            }

            if(values.Contains(TRINH_DO)) {
                model.TrinhDo = Convert.ToString(values[TRINH_DO]);
            }
            if (values.Contains(TRINH_DO_LLCT))
            {
                model.TrinhDoLLCT = Convert.ToString(values[TRINH_DO_LLCT]);
            }

            if (values.Contains(DANG_VIEN)) {
                model.DangVien = values[DANG_VIEN] != null ? Convert.ToInt32(values[DANG_VIEN]) : (int?)null;
            }

            if(values.Contains(SO_QDBO_NHIEM)) {
                model.SoQDBoNhiem = Convert.ToString(values[SO_QDBO_NHIEM]);
            }

            if(values.Contains(NGAY_QDBO_NHIEM)) {
                model.NgayQDBoNhiem = values[NGAY_QDBO_NHIEM] != null ? Convert.ToDateTime(values[NGAY_QDBO_NHIEM]) : (DateTime?)null;
            }

            if(values.Contains(NGUOI_KY_QDBO_NHIEM)) {
                model.NguoiKyQDBoNhiem = Convert.ToString(values[NGUOI_KY_QDBO_NHIEM]);
            }

            if(values.Contains(THOI_HAN_BO_NHIEM)) {
                model.ThoiHanBoNhiem = Convert.ToString(values[THOI_HAN_BO_NHIEM]);
            }

            if(values.Contains(BAT_DAU_BO_NHIEM)) {
                model.BatDauBoNhiem = values[BAT_DAU_BO_NHIEM] != null ? Convert.ToDateTime(values[BAT_DAU_BO_NHIEM]) : (DateTime?)null;
            }

            if(values.Contains(CHUC_VU_CU)) {
                model.ChucVuCu = Convert.ToString(values[CHUC_VU_CU]);
            }

            if(values.Contains(CHUC_VU_MOI)) {
                model.ChucVuMoi = Convert.ToString(values[CHUC_VU_MOI]);
            }

            if(values.Contains(DON_VI_CU)) {
                model.DonViCu = Convert.ToString(values[DON_VI_CU]);
            }

            if(values.Contains(DON_VI_MOI)) {
                model.DonViMoi = Convert.ToString(values[DON_VI_MOI]);
            }

            if(values.Contains(QUA_TRINH_CONG_TAC)) {
                model.QuaTrinhCongTac = Convert.ToString(values[QUA_TRINH_CONG_TAC]);
            }

            if(values.Contains(LINK_QDBO_NHIEM)) {
                model.LinkQDBoNhiem = Convert.ToString(values[LINK_QDBO_NHIEM]);
            }

            if (values.Contains(THONGTIN_QDBO_NHIEM))
            {
                model.ThongTinQĐBoNhiem = Convert.ToString(values[THONGTIN_QDBO_NHIEM]);
            }

            if (values.Contains(DAN_TOC))
            {
                model.DanToc = Convert.ToString(values[DAN_TOC]);
            }

            if (values.Contains(TON_GIAO))
            {
                model.TonGiao = Convert.ToString(values[TON_GIAO]);
            }

            if (values.Contains(CHUC_VU_DANG))
            {
                model.ChucVuDang = Convert.ToString(values[CHUC_VU_DANG]);
            }

            if (values.Contains(NGAY_VAO_DANG))
            {
                model.NgayVaoDang = values[NGAY_VAO_DANG] != null ? Convert.ToDateTime(values[NGAY_VAO_DANG]) : (DateTime?)null;
            }

            if (values.Contains(NGAY_VAO_DANG_CHINH_THUC))
            {
                model.NgayVaoDangChinhThuc = values[NGAY_VAO_DANG_CHINH_THUC] != null ? Convert.ToDateTime(values[NGAY_VAO_DANG_CHINH_THUC]) : (DateTime?)null;
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