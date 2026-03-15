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
    [Route("api/ChiTieu_DanhMucs/{action}", Name = "ChiTieuDanhMucsApi")]
    public class ChiTieu_DanhMucsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var source = _context.ChiTieu_DanhMuc.Select(i => new
            {
                i.ID,
                i.TieuDe,
                i.TenDanhMuc,
                i.KeyDanhMucChiTieu,
                i.DanhMucCha
            });

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(source, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var model = new ChiTieu_DanhMuc();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            _context.ChiTieu_DanhMuc.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { model.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ChiTieu_DanhMuc.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ChiTieu_DanhMuc.FirstOrDefaultAsync(item => item.ID == key);

            if (model != null)
            {
                _context.ChiTieu_DanhMuc.Remove(model);
                await _context.SaveChangesAsync();
            }
        }

        private void PopulateModel(ChiTieu_DanhMuc model, IDictionary values)
        {
            string ID = nameof(ChiTieu_DanhMuc.ID);
            string TIEU_DE = nameof(ChiTieu_DanhMuc.TieuDe);
            string TEN_DANH_MUC = nameof(ChiTieu_DanhMuc.TenDanhMuc);
            string KEY_DANH_MUC_CHI_TIEU = nameof(ChiTieu_DanhMuc.KeyDanhMucChiTieu);
            string DANH_MUC_CHA = nameof(ChiTieu_DanhMuc.DanhMucCha);

            if (values.Contains(ID))
            {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if (values.Contains(TIEU_DE))
            {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if (values.Contains(TEN_DANH_MUC))
            {
                model.TenDanhMuc = Convert.ToString(values[TEN_DANH_MUC]);
            }

            if (values.Contains(KEY_DANH_MUC_CHI_TIEU))
            {
                model.KeyDanhMucChiTieu = Convert.ToString(values[KEY_DANH_MUC_CHI_TIEU]);
            }

            if (values.Contains(DANH_MUC_CHA))
            {
                model.DanhMucCha = values[DANH_MUC_CHA] != null ? Convert.ToInt32(values[DANH_MUC_CHA]) : (int?)null;
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