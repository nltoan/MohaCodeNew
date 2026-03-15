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
    [Route("api/ABL_ChuyenMucAlbumAnh/{action}", Name = "ABL_ChuyenMucAlbumAnhApi")]
    public class ABL_ChuyenMucAlbumAnhController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var abl_chuyenmucalbumanh = _context.ABL_ChuyenMucAlbumAnh.Select(i => new {
                i.ID,
                i.TenChuyenMuc,
                i.ID_ChuDeCha,
                i.TrangThai,
                i.DanhSachCha,
                i.SoThuTu,
                i.DanhSachNguoiPhuTrach,
                i.DanhSachNhomPhuTrach,
                i.TenNguoiPhuTrach,
                i.TenNhomPhuTrach,
                i.IDQuyTrinh
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(abl_chuyenmucalbumanh, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ABL_ChuyenMucAlbumAnh();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ABL_ChuyenMucAlbumAnh.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ABL_ChuyenMucAlbumAnh.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ABL_ChuyenMucAlbumAnh.FirstOrDefaultAsync(item => item.ID == key);

            _context.ABL_ChuyenMucAlbumAnh.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ABL_ChuyenMucAlbumAnh model, IDictionary values) {
            string ID = nameof(ABL_ChuyenMucAlbumAnh.ID);
            string TEN_CHUYEN_MUC = nameof(ABL_ChuyenMucAlbumAnh.TenChuyenMuc);
            string ID_CHU_DE_CHA = nameof(ABL_ChuyenMucAlbumAnh.ID_ChuDeCha);
            string TRANG_THAI = nameof(ABL_ChuyenMucAlbumAnh.TrangThai);
            string DANH_SACH_CHA = nameof(ABL_ChuyenMucAlbumAnh.DanhSachCha);
            string SO_THU_TU = nameof(ABL_ChuyenMucAlbumAnh.SoThuTu);
            string DANH_SACH_NGUOI_PHU_TRACH = nameof(ABL_ChuyenMucAlbumAnh.DanhSachNguoiPhuTrach);
            string DANH_SACH_NHOM_PHU_TRACH = nameof(ABL_ChuyenMucAlbumAnh.DanhSachNhomPhuTrach);
            string TEN_NGUOI_PHU_TRACH = nameof(ABL_ChuyenMucAlbumAnh.TenNguoiPhuTrach);
            string TEN_NHOM_PHU_TRACH = nameof(ABL_ChuyenMucAlbumAnh.TenNhomPhuTrach);
            string IDQUY_TRINH = nameof(ABL_ChuyenMucAlbumAnh.IDQuyTrinh);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_CHUYEN_MUC)) {
                model.TenChuyenMuc = Convert.ToString(values[TEN_CHUYEN_MUC]);
            }

            if(values.Contains(ID_CHU_DE_CHA)) {
                model.ID_ChuDeCha = values[ID_CHU_DE_CHA] != null ? Convert.ToInt32(values[ID_CHU_DE_CHA]) : (int?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(DANH_SACH_CHA)) {
                model.DanhSachCha = Convert.ToString(values[DANH_SACH_CHA]);
            }

            if(values.Contains(SO_THU_TU)) {
                model.SoThuTu = values[SO_THU_TU] != null ? Convert.ToInt32(values[SO_THU_TU]) : (int?)null;
            }

            if(values.Contains(DANH_SACH_NGUOI_PHU_TRACH)) {
                model.DanhSachNguoiPhuTrach = Convert.ToString(values[DANH_SACH_NGUOI_PHU_TRACH]);
            }

            if(values.Contains(DANH_SACH_NHOM_PHU_TRACH)) {
                model.DanhSachNhomPhuTrach = Convert.ToString(values[DANH_SACH_NHOM_PHU_TRACH]);
            }

            if(values.Contains(TEN_NGUOI_PHU_TRACH)) {
                model.TenNguoiPhuTrach = Convert.ToString(values[TEN_NGUOI_PHU_TRACH]);
            }

            if(values.Contains(TEN_NHOM_PHU_TRACH)) {
                model.TenNhomPhuTrach = Convert.ToString(values[TEN_NHOM_PHU_TRACH]);
            }

            if(values.Contains(IDQUY_TRINH)) {
                model.IDQuyTrinh = values[IDQUY_TRINH] != null ? Convert.ToInt32(values[IDQUY_TRINH]) : (int?)null;
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