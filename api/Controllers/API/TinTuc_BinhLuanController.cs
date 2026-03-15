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
    [Route("api/TinTuc_BinhLuan/{action}", Name = "TinTuc_BinhLuanApi")]
    public class TinTuc_BinhLuanController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var tintuc_binhluan = _context.TinTuc_BinhLuan.Select(i => new {
                i.ID,
                i.Comment,
                i.NguoiTao,
                i.NgayTao,
                i.TinTucID
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(tintuc_binhluan, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new TinTuc_BinhLuan();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.TinTuc_BinhLuan.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.TinTuc_BinhLuan.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.TinTuc_BinhLuan.FirstOrDefaultAsync(item => item.ID == key);

            _context.TinTuc_BinhLuan.Remove(model);
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

        private void PopulateModel(TinTuc_BinhLuan model, IDictionary values) {
            string ID = nameof(TinTuc_BinhLuan.ID);
            string COMMENT = nameof(TinTuc_BinhLuan.Comment);
            string NGUOI_TAO = nameof(TinTuc_BinhLuan.NguoiTao);
            string NGAY_TAO = nameof(TinTuc_BinhLuan.NgayTao);
            string TIN_TUC_ID = nameof(TinTuc_BinhLuan.TinTucID);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(COMMENT)) {
                model.Comment = Convert.ToString(values[COMMENT]);
            }

            if(values.Contains(NGUOI_TAO)) {
                model.NguoiTao = values[NGUOI_TAO] != null ? Convert.ToInt32(values[NGUOI_TAO]) : (int?)null;
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = values[NGAY_TAO] != null ? Convert.ToDateTime(values[NGAY_TAO]) : (DateTime?)null;
            }

            if(values.Contains(TIN_TUC_ID)) {
                model.TinTucID = values[TIN_TUC_ID] != null ? Convert.ToInt32(values[TIN_TUC_ID]) : (int?)null;
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