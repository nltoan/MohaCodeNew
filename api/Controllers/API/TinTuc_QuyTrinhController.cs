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
    [Route("api/TinTuc_QuyTrinh/{action}", Name = "TinTuc_QuyTrinhApi")]
    public class TinTuc_QuyTrinhController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var tintuc_quytrinh = _context.TinTuc_QuyTrinh.Select(i => new {
                i.ID,
                i.TinTucID,
                i.BuocQuyTrinhID,
                i.NgayTao,
                i.BinhLuan,
                i.NguoiXuLyID
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(tintuc_quytrinh, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new TinTuc_QuyTrinh();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.TinTuc_QuyTrinh.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.TinTuc_QuyTrinh.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.TinTuc_QuyTrinh.FirstOrDefaultAsync(item => item.ID == key);

            _context.TinTuc_QuyTrinh.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> BuocQuyTrinhsLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.BuocQuyTrinhs
                         orderby i.TenBuocQuyTrinh
                         select new {
                             Value = i.ID,
                             Text = i.TenBuocQuyTrinh
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

        private void PopulateModel(TinTuc_QuyTrinh model, IDictionary values) {
            string ID = nameof(TinTuc_QuyTrinh.ID);
            string TIN_TUC_ID = nameof(TinTuc_QuyTrinh.TinTucID);
            string BUOC_QUY_TRINH_ID = nameof(TinTuc_QuyTrinh.BuocQuyTrinhID);
            string NGAY_TAO = nameof(TinTuc_QuyTrinh.NgayTao);
            string BINH_LUAN = nameof(TinTuc_QuyTrinh.BinhLuan);
            string NGUOI_XU_LY_ID = nameof(TinTuc_QuyTrinh.NguoiXuLyID);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TIN_TUC_ID)) {
                model.TinTucID = Convert.ToInt32(values[TIN_TUC_ID]);
            }

            if(values.Contains(BUOC_QUY_TRINH_ID)) {
                model.BuocQuyTrinhID = Convert.ToInt32(values[BUOC_QUY_TRINH_ID]);
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = Convert.ToDateTime(values[NGAY_TAO]);
            }

            if(values.Contains(BINH_LUAN)) {
                model.BinhLuan = Convert.ToString(values[BINH_LUAN]);
            }

            if(values.Contains(NGUOI_XU_LY_ID)) {
                model.NguoiXuLyID = values[NGUOI_XU_LY_ID] != null ? Convert.ToInt32(values[NGUOI_XU_LY_ID]) : (int?)null;
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