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
    [Route("api/ThongTinDoanhNghieps/{action}", Name = "ThongTinDoanhNghiepsApi")]
    public class ThongTinDoanhNghiepsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var thongtindoanhnghieps = _context.ThongTinDoanhNghieps.Select(i => new {
                i.ID,
                i.TenDoanhNghiep,
                i.MaSoDoanhNghiep,
                i.DiaChi,
                i.DienThoai,
                i.EmailAddress,
                i.Website,
                i.CoQuanThucHien,
                i.NguoiDaiDien,
                i.ChucVuNguoiDaiDien,
                i.DienThoaiNguoiDaiDien,
                i.EmailNguoiDaiDien,
                i.NoiDung,
                i.FilesDinhKem,
                i.Fax
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(thongtindoanhnghieps, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ThongTinDoanhNghiep();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ThongTinDoanhNghieps.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ThongTinDoanhNghieps.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ThongTinDoanhNghieps.FirstOrDefaultAsync(item => item.ID == key);

            _context.ThongTinDoanhNghieps.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ThongTinDoanhNghiep model, IDictionary values) {
            string ID = nameof(ThongTinDoanhNghiep.ID);
            string TEN_DOANH_NGHIEP = nameof(ThongTinDoanhNghiep.TenDoanhNghiep);
            string MA_SO_DOANH_NGHIEP = nameof(ThongTinDoanhNghiep.MaSoDoanhNghiep);
            string DIA_CHI = nameof(ThongTinDoanhNghiep.DiaChi);
            string DIEN_THOAI = nameof(ThongTinDoanhNghiep.DienThoai);
            string EMAIL_ADDRESS = nameof(ThongTinDoanhNghiep.EmailAddress);
            string WEBSITE = nameof(ThongTinDoanhNghiep.Website);
            string CO_QUAN_THUC_HIEN = nameof(ThongTinDoanhNghiep.CoQuanThucHien);
            string NGUOI_DAI_DIEN = nameof(ThongTinDoanhNghiep.NguoiDaiDien);
            string CHUC_VU_NGUOI_DAI_DIEN = nameof(ThongTinDoanhNghiep.ChucVuNguoiDaiDien);
            string DIEN_THOAI_NGUOI_DAI_DIEN = nameof(ThongTinDoanhNghiep.DienThoaiNguoiDaiDien);
            string EMAIL_NGUOI_DAI_DIEN = nameof(ThongTinDoanhNghiep.EmailNguoiDaiDien);
            string NOI_DUNG = nameof(ThongTinDoanhNghiep.NoiDung);
            string FILES_DINH_KEM = nameof(ThongTinDoanhNghiep.FilesDinhKem);
            string FAX = nameof(ThongTinDoanhNghiep.Fax);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_DOANH_NGHIEP)) {
                model.TenDoanhNghiep = Convert.ToString(values[TEN_DOANH_NGHIEP]);
            }

            if(values.Contains(MA_SO_DOANH_NGHIEP)) {
                model.MaSoDoanhNghiep = Convert.ToString(values[MA_SO_DOANH_NGHIEP]);
            }

            if(values.Contains(DIA_CHI)) {
                model.DiaChi = Convert.ToString(values[DIA_CHI]);
            }

            if(values.Contains(DIEN_THOAI)) {
                model.DienThoai = Convert.ToString(values[DIEN_THOAI]);
            }

            if(values.Contains(EMAIL_ADDRESS)) {
                model.EmailAddress = Convert.ToString(values[EMAIL_ADDRESS]);
            }

            if(values.Contains(WEBSITE)) {
                model.Website = Convert.ToString(values[WEBSITE]);
            }

            if(values.Contains(CO_QUAN_THUC_HIEN)) {
                model.CoQuanThucHien = Convert.ToString(values[CO_QUAN_THUC_HIEN]);
            }

            if(values.Contains(NGUOI_DAI_DIEN)) {
                model.NguoiDaiDien = Convert.ToString(values[NGUOI_DAI_DIEN]);
            }

            if(values.Contains(CHUC_VU_NGUOI_DAI_DIEN)) {
                model.ChucVuNguoiDaiDien = Convert.ToString(values[CHUC_VU_NGUOI_DAI_DIEN]);
            }

            if(values.Contains(DIEN_THOAI_NGUOI_DAI_DIEN)) {
                model.DienThoaiNguoiDaiDien = Convert.ToString(values[DIEN_THOAI_NGUOI_DAI_DIEN]);
            }

            if(values.Contains(EMAIL_NGUOI_DAI_DIEN)) {
                model.EmailNguoiDaiDien = Convert.ToString(values[EMAIL_NGUOI_DAI_DIEN]);
            }

            if(values.Contains(NOI_DUNG)) {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if(values.Contains(FILES_DINH_KEM)) {
                model.FilesDinhKem = Convert.ToString(values[FILES_DINH_KEM]);
            }

            if(values.Contains(FAX)) {
                model.Fax = Convert.ToString(values[FAX]);
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