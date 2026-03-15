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
    [Route("api/Crawler_NguonCha/{action}", Name = "Crawler_NguonChaApi")]
    public class Crawler_NguonChaController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var crawler_nguoncha = _context.Crawler_NguonCha.Select(i => new {
                i.ID,
                i.TenNguon,
                i.MoTa,
                i.HienThi,
                i.SoThuTu,
                i.LinkLienKet
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(crawler_nguoncha, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new Crawler_NguonCha();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Crawler_NguonCha.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Crawler_NguonCha.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.Crawler_NguonCha.FirstOrDefaultAsync(item => item.ID == key);

            _context.Crawler_NguonCha.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(Crawler_NguonCha model, IDictionary values) {
            string ID = nameof(Crawler_NguonCha.ID);
            string TEN_NGUON = nameof(Crawler_NguonCha.TenNguon);
            string MO_TA = nameof(Crawler_NguonCha.MoTa);
            string HIEN_THI = nameof(Crawler_NguonCha.HienThi);
            string SO_THU_TU = nameof(Crawler_NguonCha.SoThuTu);
            string LINK_LIEN_KET = nameof(Crawler_NguonCha.LinkLienKet);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_NGUON)) {
                model.TenNguon = Convert.ToString(values[TEN_NGUON]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(HIEN_THI)) {
                model.HienThi = values[HIEN_THI] != null ? Convert.ToInt32(values[HIEN_THI]) : (int?)null;
            }

            if(values.Contains(SO_THU_TU)) {
                model.SoThuTu = values[SO_THU_TU] != null ? Convert.ToInt32(values[SO_THU_TU]) : (int?)null;
            }

            if(values.Contains(LINK_LIEN_KET)) {
                model.LinkLienKet = Convert.ToString(values[LINK_LIEN_KET]);
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