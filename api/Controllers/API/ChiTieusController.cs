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
    [Route("api/ChiTieus/{action}", Name = "ChiTieusApi")]
    public class ChiTieusController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var source = _context.ChiTieux.Select(i => new
            {
                i.ID,
                i.DanhMucId,
                i.TieuDe,
                i.ChiSo,
                i.KeyChiTietChiTieu,
                i.NamThucHien
            });

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(source, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var model = new ChiTieu();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            _context.ChiTieux.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { model.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ChiTieux.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ChiTieux.FirstOrDefaultAsync(item => item.ID == key);

            if (model != null)
            {
                _context.ChiTieux.Remove(model);
                await _context.SaveChangesAsync();
            }
        }

        private void PopulateModel(ChiTieu model, IDictionary values)
        {
            string ID = nameof(ChiTieu.ID);
            string DANH_MUC_ID = nameof(ChiTieu.DanhMucId);
            string TIEU_DE = nameof(ChiTieu.TieuDe);
            string CHI_SO = nameof(ChiTieu.ChiSo);
            string KEY_CHI_TIET_CHI_TIEU = nameof(ChiTieu.KeyChiTietChiTieu);
            string NAM_THUC_HIEN = nameof(ChiTieu.NamThucHien);

            if (values.Contains(ID))
            {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if (values.Contains(DANH_MUC_ID))
            {
                model.DanhMucId = values[DANH_MUC_ID] != null ? Convert.ToInt32(values[DANH_MUC_ID]) : (int?)null;
            }

            if (values.Contains(TIEU_DE))
            {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if (values.Contains(CHI_SO))
            {
                model.ChiSo = values[CHI_SO] != null ? Convert.ToDouble(values[CHI_SO]) : (double?)null;
            }

            if (values.Contains(KEY_CHI_TIET_CHI_TIEU))
            {
                model.KeyChiTietChiTieu = Convert.ToString(values[KEY_CHI_TIET_CHI_TIEU]);
            }

            if (values.Contains(NAM_THUC_HIEN))
            {
                model.NamThucHien = values[NAM_THUC_HIEN] != null ? Convert.ToInt32(values[NAM_THUC_HIEN]) : (int?)null;
            }
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