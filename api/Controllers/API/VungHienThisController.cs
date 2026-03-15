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
    [Route("api/VungHienThis/{action}", Name = "VungHienThisApi")]
    public class VungHienThisController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var vunghienthis = _context.VungHienThis.Select(i => new {
                i.ID,
                i.TenVungHienThi,
                i.MoTa,
                i.TrangThai,
                i.MucUuTien,
                i.VungHienThiCha,
                //VungHienThiChaLast = i.VungHienThiCha??i.VungHienThiCha.Split(';').Last()
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(vunghienthis, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new VungHienThi();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.VungHienThis.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VungHienThis.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.VungHienThis.FirstOrDefaultAsync(item => item.ID == key);

            _context.VungHienThis.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(VungHienThi model, IDictionary values) {
            string ID = nameof(VungHienThi.ID);
            string TEN_VUNG_HIEN_THI = nameof(VungHienThi.TenVungHienThi);
            string MO_TA = nameof(VungHienThi.MoTa);
            string TRANG_THAI = nameof(VungHienThi.TrangThai);
            string MUC_UU_TIEN = nameof(VungHienThi.MucUuTien);
            string VUNG_HIEN_THI_CHA = nameof(VungHienThi.VungHienThiCha);

            if (values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_VUNG_HIEN_THI)) {
                model.TenVungHienThi = Convert.ToString(values[TEN_VUNG_HIEN_THI]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(MUC_UU_TIEN)) {
                model.MucUuTien = Convert.ToString(values[MUC_UU_TIEN]);
            }

            if(values.Contains(VUNG_HIEN_THI_CHA)) {
                model.VungHienThiCha = Convert.ToString(values[VUNG_HIEN_THI_CHA]);
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