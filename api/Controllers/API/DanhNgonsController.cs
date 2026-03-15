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
    [Route("api/DanhNgons/{action}", Name = "DanhNgonsApi")]
    public class DanhNgonsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var danhngons = _context.DanhNgons.Select(i => new {
                i.ID,
                i.AnhDaiDien,
                i.CauNoi,
                i.TacGia,
                i.TrangThai,
                i.NgonNgu
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(danhngons, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new DanhNgon();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.DanhNgons.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.DanhNgons.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.DanhNgons.FirstOrDefaultAsync(item => item.ID == key);

            _context.DanhNgons.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(DanhNgon model, IDictionary values) {
            string ID = nameof(DanhNgon.ID);
            string ANH_DAI_DIEN = nameof(DanhNgon.AnhDaiDien);
            string CAU_NOI = nameof(DanhNgon.CauNoi);
            string TAC_GIA = nameof(DanhNgon.TacGia);
            string TRANG_THAI = nameof(DanhNgon.TrangThai);
            string NGON_NGU = nameof(DanhNgon.NgonNgu);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(ANH_DAI_DIEN)) {
                model.AnhDaiDien = Convert.ToString(values[ANH_DAI_DIEN]);
            }

            if(values.Contains(CAU_NOI)) {
                model.CauNoi = Convert.ToString(values[CAU_NOI]);
            }

            if(values.Contains(TAC_GIA)) {
                model.TacGia = Convert.ToString(values[TAC_GIA]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(NGON_NGU)) {
                model.NgonNgu = values[NGON_NGU] != null ? Convert.ToInt32(values[NGON_NGU]) : (int?)null;
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