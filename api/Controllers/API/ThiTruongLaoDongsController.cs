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
    [Route("api/ThiTruongLaoDongs/{action}", Name = "ThiTruongLaoDongsApi")]
    public class ThiTruongLaoDongsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var thitruonglaodongs = _context.ThiTruongLaoDongs.Select(i => new {
                i.ID,
                i.TieuDe,
                i.AnhDaiDien,
                i.FileDinhKem,
                i.TrangThai,
                i.LoaiTin
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(thitruonglaodongs, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ThiTruongLaoDong();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ThiTruongLaoDongs.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ThiTruongLaoDongs.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ThiTruongLaoDongs.FirstOrDefaultAsync(item => item.ID == key);

            _context.ThiTruongLaoDongs.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ThiTruongLaoDong model, IDictionary values) {
            string ID = nameof(ThiTruongLaoDong.ID);
            string TIEU_DE = nameof(ThiTruongLaoDong.TieuDe);
            string ANH_DAI_DIEN = nameof(ThiTruongLaoDong.AnhDaiDien);
            string FILE_DINH_KEM = nameof(ThiTruongLaoDong.FileDinhKem);
            string TRANG_THAI = nameof(ThiTruongLaoDong.TrangThai);
            string LOAI_TIN = nameof(ThiTruongLaoDong.LoaiTin);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TIEU_DE)) {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if(values.Contains(ANH_DAI_DIEN)) {
                model.AnhDaiDien = Convert.ToString(values[ANH_DAI_DIEN]);
            }

            if(values.Contains(FILE_DINH_KEM)) {
                model.FileDinhKem = Convert.ToString(values[FILE_DINH_KEM]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(LOAI_TIN)) {
                model.LoaiTin = values[LOAI_TIN] != null ? Convert.ToInt32(values[LOAI_TIN]) : (int?)null;
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