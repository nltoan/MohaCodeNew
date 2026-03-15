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
    [Route("api/DuAnDauThaus/{action}", Name = "DuAnDauThausApi")]
    public class DuAnDauThausController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var duandauthaus = _context.DuAnDauThaus.Select(i => new {
                i.ID,
                i.TenCoQuanDangKy,
                i.DiaChi,
                i.DienThoai,
                i.Fax,
                i.Email,
                i.TenDuAn,
                i.LoaiDuAn,
                i.TenChuDauTu,
                i.TenGoiThau,
                i.GiaGoiThau,
                i.NoiDung,
                i.FileDinhKem,
                i.TrangThai,
                i.HanDuAn,
                i.IDLinhVuc,
                i.GiaiDoanThucHien,
                i.SoHieuVanBan,
                i.TuKhoa,
                i.HienThi
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(duandauthaus, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new DuAnDauThau();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.DuAnDauThaus.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.DuAnDauThaus.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.DuAnDauThaus.FirstOrDefaultAsync(item => item.ID == key);

            _context.DuAnDauThaus.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(DuAnDauThau model, IDictionary values) {
            string ID = nameof(DuAnDauThau.ID);
            string TEN_CO_QUAN_DANG_KY = nameof(DuAnDauThau.TenCoQuanDangKy);
            string DIA_CHI = nameof(DuAnDauThau.DiaChi);
            string DIEN_THOAI = nameof(DuAnDauThau.DienThoai);
            string FAX = nameof(DuAnDauThau.Fax);
            string EMAIL = nameof(DuAnDauThau.Email);
            string TEN_DU_AN = nameof(DuAnDauThau.TenDuAn);
            string LOAI_DU_AN = nameof(DuAnDauThau.LoaiDuAn);
            string TEN_CHU_DAU_TU = nameof(DuAnDauThau.TenChuDauTu);
            string TEN_GOI_THAU = nameof(DuAnDauThau.TenGoiThau);
            string GIA_GOI_THAU = nameof(DuAnDauThau.GiaGoiThau);
            string NOI_DUNG = nameof(DuAnDauThau.NoiDung);
            string FILE_DINH_KEM = nameof(DuAnDauThau.FileDinhKem);
            string TRANG_THAI = nameof(DuAnDauThau.TrangThai);
            string HAN_DU_AN = nameof(DuAnDauThau.HanDuAn);
            string IDLINH_VUC = nameof(DuAnDauThau.IDLinhVuc);
            string GIAI_DOAN_THUC_HIEN = nameof(DuAnDauThau.GiaiDoanThucHien);
            string SO_HIEU_VAN_BAN = nameof(DuAnDauThau.SoHieuVanBan);
            string TU_KHOA = nameof(DuAnDauThau.TuKhoa);
            string HIEN_THI = nameof(DuAnDauThau.HienThi);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_CO_QUAN_DANG_KY)) {
                model.TenCoQuanDangKy = Convert.ToString(values[TEN_CO_QUAN_DANG_KY]);
            }

            if(values.Contains(DIA_CHI)) {
                model.DiaChi = Convert.ToString(values[DIA_CHI]);
            }

            if(values.Contains(DIEN_THOAI)) {
                model.DienThoai = Convert.ToString(values[DIEN_THOAI]);
            }

            if(values.Contains(FAX)) {
                model.Fax = Convert.ToString(values[FAX]);
            }

            if(values.Contains(EMAIL)) {
                model.Email = Convert.ToString(values[EMAIL]);
            }

            if(values.Contains(TEN_DU_AN)) {
                model.TenDuAn = Convert.ToString(values[TEN_DU_AN]);
            }

            if(values.Contains(LOAI_DU_AN)) {
                model.LoaiDuAn = values[LOAI_DU_AN] != null ? Convert.ToInt32(values[LOAI_DU_AN]) : (int?)null;
            }

            if(values.Contains(TEN_CHU_DAU_TU)) {
                model.TenChuDauTu = Convert.ToString(values[TEN_CHU_DAU_TU]);
            }

            if(values.Contains(TEN_GOI_THAU)) {
                model.TenGoiThau = Convert.ToString(values[TEN_GOI_THAU]);
            }

            if(values.Contains(GIA_GOI_THAU)) {
                model.GiaGoiThau = Convert.ToString(values[GIA_GOI_THAU]);
            }

            if(values.Contains(NOI_DUNG)) {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if(values.Contains(FILE_DINH_KEM)) {
                model.FileDinhKem = Convert.ToString(values[FILE_DINH_KEM]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(HAN_DU_AN)) {
                model.HanDuAn = values[HAN_DU_AN] != null ? Convert.ToDateTime(values[HAN_DU_AN]) : (DateTime?)null;
            }

            if(values.Contains(IDLINH_VUC)) {
                model.IDLinhVuc = values[IDLINH_VUC] != null ? Convert.ToInt32(values[IDLINH_VUC]) : (int?)null;
            }

            if(values.Contains(GIAI_DOAN_THUC_HIEN)) {
                model.GiaiDoanThucHien = Convert.ToString(values[GIAI_DOAN_THUC_HIEN]);
            }

            if(values.Contains(SO_HIEU_VAN_BAN)) {
                model.SoHieuVanBan = Convert.ToString(values[SO_HIEU_VAN_BAN]);
            }

            if(values.Contains(TU_KHOA)) {
                model.TuKhoa = Convert.ToString(values[TU_KHOA]);
            }

            if(values.Contains(HIEN_THI)) {
                model.HienThi = values[HIEN_THI] != null ? Convert.ToInt32(values[HIEN_THI]) : (int?)null;
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