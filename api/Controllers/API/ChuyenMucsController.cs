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
    [Route("api/ChuyenMucs/{action}", Name = "ChuyenMucsApi")]
    public class ChuyenMucsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var chuyenmucs = _context.ChuyenMucs.Select(i => new {
                i.ID,
                i.TenChuyenMuc,
                i.ChuyenMucCha,
                i.LinkTinTuc,
                i.MoTa,
                i.IDQuyTrinh,
                i.TrangThai,
                i.DanhSachNguoiPhuTrach,
                i.DanhSachNhomPhuTrach,
                i.NgayTao,
                i.TenNguoiPhuTrach,
                i.TenNhomPhuTrach,
                i.SoThuTu,
                i.VungHienThi,
                i.LogThayDoi,
                i.DangKyNhanBaiViet,
                i.HienThiTieuDe,
                i.Type,
                i.IsVisible
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(chuyenmucs, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetActiveChuyenMuc(DataSourceLoadOptions loadOptions)
        {
            var sql = @"
                with name_tree as 
                (
		                select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, i.Type, 0 AS Level
		                from ChuyenMuc i
		                where i.ID in (10464, 10466)

		                union all

		                select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, i.Type, Level+1 AS Level
		                from ChuyenMuc i
		                join name_tree p on p.ID = i.ChuyenMucCha AND i.ID <> i.ChuyenMucCha 
                )
                SELECT ID FROM name_tree ORDER BY Level desc
            ";

            var ids = _context.CollectionFromSql(sql, new Dictionary<string, object> { }).Select(x => (int)x.ID).ToList();
            var chuyenmucs = _context.ChuyenMucs.Where(x => ids.Contains(x.ID));

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(chuyenmucs, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ChuyenMuc();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));
            if(model.ChuyenMucCha == "0")
            {
                model.ChuyenMucCha = null;
            }
            var result = _context.ChuyenMucs.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ChuyenMucs.FirstOrDefaultAsync(item => item.ID == key);
            if(model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");

            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            if (model.ChuyenMucCha == "0")
            {
                model.ChuyenMucCha = null;
            }
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpDelete]
        public async Task Delete(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ChuyenMucs.FirstOrDefaultAsync(item => item.ID == key);

            _context.ChuyenMucs.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ChuyenMuc model, IDictionary values) {
            string ID = nameof(ChuyenMuc.ID);
            string TEN_CHUYEN_MUC = nameof(ChuyenMuc.TenChuyenMuc);
            string CHUYEN_MUC_CHA = nameof(ChuyenMuc.ChuyenMucCha);
            string LINK_TIN_TUC = nameof(ChuyenMuc.LinkTinTuc);
            string MO_TA = nameof(ChuyenMuc.MoTa);
            string IDQUY_TRINH = nameof(ChuyenMuc.IDQuyTrinh);
            string TRANG_THAI = nameof(ChuyenMuc.TrangThai);
            string DANH_SACH_NGUOI_PHU_TRACH = nameof(ChuyenMuc.DanhSachNguoiPhuTrach);
            string DANH_SACH_NHOM_PHU_TRACH = nameof(ChuyenMuc.DanhSachNhomPhuTrach);
            string NGAY_TAO = nameof(ChuyenMuc.NgayTao);
            string TEN_NGUOI_PHU_TRACH = nameof(ChuyenMuc.TenNguoiPhuTrach);
            string TEN_NHOM_PHU_TRACH = nameof(ChuyenMuc.TenNhomPhuTrach);
            string SO_THU_TU = nameof(ChuyenMuc.SoThuTu);
            string VUNG_HIEN_THI = nameof(ChuyenMuc.VungHienThi);
            string LOG_THAY_DOI = nameof(ChuyenMuc.LogThayDoi);
            string DANG_KY_NHAN_BAI_VIET = nameof(ChuyenMuc.DangKyNhanBaiViet);
            string HIEN_THI_TIEU_DE = nameof(ChuyenMuc.HienThiTieuDe);
            string TYPE = nameof(ChuyenMuc.Type);
            string IS_VISIBLE = nameof(ChuyenMuc.IsVisible);

            if (values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_CHUYEN_MUC)) {
                model.TenChuyenMuc = Convert.ToString(values[TEN_CHUYEN_MUC]);
            }

            if(values.Contains(CHUYEN_MUC_CHA)) {
                model.ChuyenMucCha = Convert.ToString(values[CHUYEN_MUC_CHA]);
            }

            if(values.Contains(LINK_TIN_TUC)) {
                model.LinkTinTuc = Convert.ToString(values[LINK_TIN_TUC]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(IDQUY_TRINH)) {
                model.IDQuyTrinh = values[IDQUY_TRINH] != null ? Convert.ToInt32(values[IDQUY_TRINH]) : (int?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(DANH_SACH_NGUOI_PHU_TRACH)) {
                model.DanhSachNguoiPhuTrach = Convert.ToString(values[DANH_SACH_NGUOI_PHU_TRACH]);
            }

            if(values.Contains(DANH_SACH_NHOM_PHU_TRACH)) {
                model.DanhSachNhomPhuTrach = Convert.ToString(values[DANH_SACH_NHOM_PHU_TRACH]);
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = values[NGAY_TAO] != null ? Convert.ToDateTime(values[NGAY_TAO]) : (DateTime?)null;
            }

            if(values.Contains(TEN_NGUOI_PHU_TRACH)) {
                model.TenNguoiPhuTrach = Convert.ToString(values[TEN_NGUOI_PHU_TRACH]);
            }

            if(values.Contains(TEN_NHOM_PHU_TRACH)) {
                model.TenNhomPhuTrach = Convert.ToString(values[TEN_NHOM_PHU_TRACH]);
            }

            if(values.Contains(SO_THU_TU)) {
                model.SoThuTu = values[SO_THU_TU] != null ? Convert.ToInt32(values[SO_THU_TU]) : (int?)null;
            }

            if (values.Contains(TYPE))
            {
                model.Type = values[TYPE] != null ? Convert.ToInt32(values[TYPE]) : (int?)null;
            }

            if (values.Contains(IS_VISIBLE))
            {
                model.IsVisible = values[IS_VISIBLE] != null ? Convert.ToBoolean(values[IS_VISIBLE]) : false;
            }

            if (values.Contains(VUNG_HIEN_THI)) {
                model.VungHienThi = Convert.ToString(values[VUNG_HIEN_THI]);
            }

            if(values.Contains(LOG_THAY_DOI)) {
                model.LogThayDoi = values[LOG_THAY_DOI] != null ? Convert.ToInt32(values[LOG_THAY_DOI]) : (int?)null;
            }

            if(values.Contains(DANG_KY_NHAN_BAI_VIET)) {
                model.DangKyNhanBaiViet = values[DANG_KY_NHAN_BAI_VIET] != null ? Convert.ToInt32(values[DANG_KY_NHAN_BAI_VIET]) : (int?)null;
            }

            if(values.Contains(HIEN_THI_TIEU_DE)) {
                model.HienThiTieuDe = values[HIEN_THI_TIEU_DE] != null ? Convert.ToInt32(values[HIEN_THI_TIEU_DE]) : (int?)null;
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