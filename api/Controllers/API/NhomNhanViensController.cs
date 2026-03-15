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
    [Route("api/NhomNhanViens/{action}", Name = "NhomNhanViensApi")]
    public class NhomNhanViensController : ApiController
    {
        private CongTTDT_MOLISAEntities _context = new CongTTDT_MOLISAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var nhomnhanviens = _context.NhomNhanViens.Select(i => new {
                i.ID,
                i.TenNhomNhanVien,
                i.NhomNhanVienCha,
                i.MoTa,
                i.TenDanhSachNhanVien,
                i.DanhSachNhanVien,
                i.TrangThai
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(nhomnhanviens, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new NhomNhanVien();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.NhomNhanViens.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.NhomNhanViens.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.NhomNhanViens.FirstOrDefaultAsync(item => item.ID == key);

            _context.NhomNhanViens.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(NhomNhanVien model, IDictionary values) {
            string ID = nameof(NhomNhanVien.ID);
            string TEN_NHOM_NHAN_VIEN = nameof(NhomNhanVien.TenNhomNhanVien);
            string NHOM_NHAN_VIEN_CHA = nameof(NhomNhanVien.NhomNhanVienCha);
            string MO_TA = nameof(NhomNhanVien.MoTa);
            string TEN_DANH_SACH_NHAN_VIEN = nameof(NhomNhanVien.TenDanhSachNhanVien);
            string DANH_SACH_NHAN_VIEN = nameof(NhomNhanVien.DanhSachNhanVien);
            string TRANG_THAI = nameof(NhomNhanVien.TrangThai);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_NHOM_NHAN_VIEN)) {
                model.TenNhomNhanVien = Convert.ToString(values[TEN_NHOM_NHAN_VIEN]);
            }

            if(values.Contains(NHOM_NHAN_VIEN_CHA)) {
                model.NhomNhanVienCha = Convert.ToString(values[NHOM_NHAN_VIEN_CHA]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(TEN_DANH_SACH_NHAN_VIEN)) {
                model.TenDanhSachNhanVien = Convert.ToString(values[TEN_DANH_SACH_NHAN_VIEN]);
            }

            if(values.Contains(DANH_SACH_NHAN_VIEN)) {
                model.DanhSachNhanVien = Convert.ToString(values[DANH_SACH_NHAN_VIEN]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
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