using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
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
    [Route("api/PhanAnhKienNghi_LinhVucs/{action}", Name = "PhanAnhKienNghiLinhVucsApi")]
    public class PhanAnhKienNghiLinhVucsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var source = _context.PhanAnhKienNghi_LinhVuc.Select(i => new
            {
                i.ID,
                i.TenLinhVuc,
                i.MoTa
            });

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(source, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var model = new PhanAnhKienNghi_LinhVuc();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            _context.PhanAnhKienNghi_LinhVuc.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { model.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.PhanAnhKienNghi_LinhVuc.FirstOrDefaultAsync(item => item.ID == key);
            if (model == null)
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
        public async Task Delete(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.PhanAnhKienNghi_LinhVuc.FirstOrDefaultAsync(item => item.ID == key);

            if (model != null)
            {
                _context.PhanAnhKienNghi_LinhVuc.Remove(model);
                await _context.SaveChangesAsync();
            }
        }

        private void PopulateModel(PhanAnhKienNghi_LinhVuc model, IDictionary values)
        {
            string TEN_LINH_VUC = nameof(PhanAnhKienNghi_LinhVuc.TenLinhVuc);
            string MO_TA = nameof(PhanAnhKienNghi_LinhVuc.MoTa);

            if (values.Contains(TEN_LINH_VUC)) model.TenLinhVuc = Convert.ToString(values[TEN_LINH_VUC]);
            if (values.Contains(MO_TA)) model.MoTa = Convert.ToString(values[MO_TA]);
        }

        private string GetFullErrorMessage(ModelStateDictionary modelState)
        {
            var messages = new List<string>();
            foreach (var entry in modelState)
            {
                foreach (var error in entry.Value.Errors)
                    messages.Add(error.ErrorMessage);
            }
            return String.Join(" ", messages);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) _context.Dispose();
            base.Dispose(disposing);
        }
    }
}