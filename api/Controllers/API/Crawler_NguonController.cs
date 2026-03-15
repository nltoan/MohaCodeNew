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
    [Route("api/Crawler_Nguon/{action}", Name = "Crawler_NguonApi")]
    public class Crawler_NguonController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var crawler_nguon = _context.Crawler_Nguon.Select(i => new {
                i.ID,
                i.TenNguon,
                i.LinkLienKet,
                i.LoaiLienKet,
                i.Nguon,
                i.KichHoat,
                i.MoTa,
                i.BaseUrl,
                i.ChuDeID
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(crawler_nguon, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new Crawler_Nguon();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Crawler_Nguon.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Crawler_Nguon.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.Crawler_Nguon.FirstOrDefaultAsync(item => item.ID == key);

            _context.Crawler_Nguon.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> Crawler_ChuDeLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.Crawler_ChuDe
                         orderby i.TenChuyenMuc
                         select new {
                             Value = i.ID,
                             Text = i.TenChuyenMuc
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(Crawler_Nguon model, IDictionary values) {
            string ID = nameof(Crawler_Nguon.ID);
            string TEN_NGUON = nameof(Crawler_Nguon.TenNguon);
            string LINK_LIEN_KET = nameof(Crawler_Nguon.LinkLienKet);
            string LOAI_LIEN_KET = nameof(Crawler_Nguon.LoaiLienKet);
            string NGUON = nameof(Crawler_Nguon.Nguon);
            string KICH_HOAT = nameof(Crawler_Nguon.KichHoat);
            string MO_TA = nameof(Crawler_Nguon.MoTa);
            string BASE_URL = nameof(Crawler_Nguon.BaseUrl);
            string CHU_DE_ID = nameof(Crawler_Nguon.ChuDeID);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_NGUON)) {
                model.TenNguon = Convert.ToString(values[TEN_NGUON]);
            }

            if(values.Contains(LINK_LIEN_KET)) {
                model.LinkLienKet = Convert.ToString(values[LINK_LIEN_KET]);
            }

            if(values.Contains(LOAI_LIEN_KET)) {
                model.LoaiLienKet = values[LOAI_LIEN_KET] != null ? Convert.ToInt32(values[LOAI_LIEN_KET]) : (int?)null;
            }

            if(values.Contains(NGUON)) {
                model.Nguon = Convert.ToString(values[NGUON]);
            }

            if(values.Contains(KICH_HOAT)) {
                model.KichHoat = values[KICH_HOAT] != null ? Convert.ToInt32(values[KICH_HOAT]) : (int?)null;
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(BASE_URL)) {
                model.BaseUrl = Convert.ToString(values[BASE_URL]);
            }

            if(values.Contains(CHU_DE_ID)) {
                model.ChuDeID = values[CHU_DE_ID] != null ? Convert.ToInt32(values[CHU_DE_ID]) : (int?)null;
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