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
    [Route("api/Files/{action}", Name = "FilesApi")]
    public class FilesController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> GetLookUp(DataSourceLoadOptions loadOptions)
        {
            var files = _context.Files.Select(i => new {
                i.ID,
                i.Ten,
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(files, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetFilePath(DataSourceLoadOptions loadOptions)
        {
            var files = _context.Files.Select(i => new {
                i.ID,
                i.LinkLuuTru,
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(files, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var files = _context.Files.Select(i => new {
                i.ID,
                i.Ten,
                i.MoTa,
                i.KichThuoc,
                i.ID_NhanVien,
                i.LoginName,
                i.NgayTao,
                i.SoLanTaiFile,
                i.LinkTaiFile,
                i.LinkLuuTru,
                i.TrangThai,
                i.LinkGoc
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(files, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new File();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Files.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Files.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.Files.FirstOrDefaultAsync(item => item.ID == key);

            _context.Files.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(File model, IDictionary values) {
            string ID = nameof(File.ID);
            string TEN = nameof(File.Ten);
            string MO_TA = nameof(File.MoTa);
            string KICH_THUOC = nameof(File.KichThuoc);
            string ID_NHAN_VIEN = nameof(File.ID_NhanVien);
            string LOGIN_NAME = nameof(File.LoginName);
            string NGAY_TAO = nameof(File.NgayTao);
            string SO_LAN_TAI_FILE = nameof(File.SoLanTaiFile);
            string LINK_TAI_FILE = nameof(File.LinkTaiFile);
            string LINK_LUU_TRU = nameof(File.LinkLuuTru);
            string TRANG_THAI = nameof(File.TrangThai);
            string LINK_GOC = nameof(File.LinkGoc);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN)) {
                model.Ten = Convert.ToString(values[TEN]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(KICH_THUOC)) {
                model.KichThuoc = Convert.ToString(values[KICH_THUOC]);
            }

            if(values.Contains(ID_NHAN_VIEN)) {
                model.ID_NhanVien = values[ID_NHAN_VIEN] != null ? Convert.ToInt32(values[ID_NHAN_VIEN]) : (int?)null;
            }

            if(values.Contains(LOGIN_NAME)) {
                model.LoginName = Convert.ToString(values[LOGIN_NAME]);
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = values[NGAY_TAO] != null ? Convert.ToDateTime(values[NGAY_TAO]) : (DateTime?)null;
            }

            if(values.Contains(SO_LAN_TAI_FILE)) {
                model.SoLanTaiFile = values[SO_LAN_TAI_FILE] != null ? Convert.ToInt32(values[SO_LAN_TAI_FILE]) : (int?)null;
            }

            if(values.Contains(LINK_TAI_FILE)) {
                model.LinkTaiFile = Convert.ToString(values[LINK_TAI_FILE]);
            }

            if(values.Contains(LINK_LUU_TRU)) {
                model.LinkLuuTru = Convert.ToString(values[LINK_LUU_TRU]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(LINK_GOC)) {
                model.LinkGoc = Convert.ToString(values[LINK_GOC]);
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