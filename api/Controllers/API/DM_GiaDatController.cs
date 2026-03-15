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
    [Route("api/DM_GiaDat/{action}", Name = "DM_GiaDatApi")]
    public class DM_GiaDatController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var dm_giadat = _context.DM_GiaDat.Select(i => new {
                i.ID,
                i.TenDat,
                i.IDLoaiDat,
                i.IDDiaChi,
                i.IDGiaiDoan,
                i.GiaDat,
                i.ViTri,
                i.TrangThai,
                i.GhiChu
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(dm_giadat, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new DM_GiaDat();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.DM_GiaDat.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.DM_GiaDat.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.DM_GiaDat.FirstOrDefaultAsync(item => item.ID == key);

            _context.DM_GiaDat.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> DM_DiaChiLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.DM_DiaChi
                         orderby i.TenDiaChi
                         select new {
                             Value = i.ID,
                             Text = i.TenDiaChi
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> DM_GiaiDoanLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.DM_GiaiDoan
                         orderby i.GiaiDoan
                         select new {
                             Value = i.ID,
                             Text = i.GiaiDoan
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> DM_LoaiDatLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.DM_LoaiDat
                         orderby i.TenLoaiDat
                         select new {
                             Value = i.ID,
                             Text = i.TenLoaiDat
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(DM_GiaDat model, IDictionary values) {
            string ID = nameof(DM_GiaDat.ID);
            string TEN_DAT = nameof(DM_GiaDat.TenDat);
            string IDLOAI_DAT = nameof(DM_GiaDat.IDLoaiDat);
            string IDDIA_CHI = nameof(DM_GiaDat.IDDiaChi);
            string IDGIAI_DOAN = nameof(DM_GiaDat.IDGiaiDoan);
            string GIA_DAT = nameof(DM_GiaDat.GiaDat);
            string VI_TRI = nameof(DM_GiaDat.ViTri);
            string TRANG_THAI = nameof(DM_GiaDat.TrangThai);
            string GHI_CHU = nameof(DM_GiaDat.GhiChu);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_DAT)) {
                model.TenDat = Convert.ToString(values[TEN_DAT]);
            }

            if(values.Contains(IDLOAI_DAT)) {
                model.IDLoaiDat = Convert.ToInt32(values[IDLOAI_DAT]);
            }

            if(values.Contains(IDDIA_CHI)) {
                model.IDDiaChi = Convert.ToInt32(values[IDDIA_CHI]);
            }

            if(values.Contains(IDGIAI_DOAN)) {
                model.IDGiaiDoan = values[IDGIAI_DOAN] != null ? Convert.ToInt32(values[IDGIAI_DOAN]) : (int?)null;
            }

            if(values.Contains(GIA_DAT)) {
                model.GiaDat = Convert.ToString(values[GIA_DAT]);
            }

            if(values.Contains(VI_TRI)) {
                model.ViTri = Convert.ToString(values[VI_TRI]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(GHI_CHU)) {
                model.GhiChu = Convert.ToString(values[GHI_CHU]);
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