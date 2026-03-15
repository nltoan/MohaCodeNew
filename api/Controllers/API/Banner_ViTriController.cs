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
    [Route("api/Banner_ViTri/{action}", Name = "Banner_ViTriApi")]
    public class Banner_ViTriController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var banner_vitri = _context.Banner_ViTri.Select(i => new {
                i.ID,
                i.ID_Banner,
                i.ID_ViTri,
                i.ThuTu
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(banner_vitri, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new Banner_ViTri();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Banner_ViTri.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Banner_ViTri.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.Banner_ViTri.FirstOrDefaultAsync(item => item.ID == key);

            _context.Banner_ViTri.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> BannersLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.Banners
                         orderby i.TenBanner
                         select new {
                             Value = i.ID,
                             Text = i.TenBanner
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> QuangCao_ViTriLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.QuangCao_ViTri
                         orderby i.TenViTri
                         select new {
                             Value = i.ID,
                             Text = i.TenViTri
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(Banner_ViTri model, IDictionary values) {
            string ID = nameof(Banner_ViTri.ID);
            string ID_BANNER = nameof(Banner_ViTri.ID_Banner);
            string ID_VI_TRI = nameof(Banner_ViTri.ID_ViTri);
            string THU_TU = nameof(Banner_ViTri.ThuTu);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(ID_BANNER)) {
                model.ID_Banner = values[ID_BANNER] != null ? Convert.ToInt32(values[ID_BANNER]) : (int?)null;
            }

            if(values.Contains(ID_VI_TRI)) {
                model.ID_ViTri = values[ID_VI_TRI] != null ? Convert.ToInt32(values[ID_VI_TRI]) : (int?)null;
            }

            if(values.Contains(THU_TU)) {
                model.ThuTu = Convert.ToInt32(values[THU_TU]);
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