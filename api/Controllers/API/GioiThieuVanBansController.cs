using API.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

namespace API.Controllers
{
    [Authorize]
    [Route("api/GioiThieuVanBans/{action}", Name = "GioiThieuVanBansApi")]
    public class GioiThieuVanBansController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var source = _context.GioiThieuVanBans
                .Select(i => i);

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(source, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var model = new GioiThieuVanBan();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            _context.GioiThieuVanBans.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { model.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.GioiThieuVanBans.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.GioiThieuVanBans.FirstOrDefaultAsync(item => item.ID == key);

            if (model != null)
            {
                _context.GioiThieuVanBans.Remove(model);
                await _context.SaveChangesAsync();
            }
        }

        private void PopulateModel(GioiThieuVanBan model, IDictionary values)
        {
            string TIEU_DE = nameof(GioiThieuVanBan.TieuDe);
            string ID_VB_QPPL = nameof(GioiThieuVanBan.IDVanBanQPPL);
            string ID_VB_DT = nameof(GioiThieuVanBan.IDVanBanDT);
            string MO_TA = nameof(GioiThieuVanBan.MoTa);
            string NOI_DUNG = nameof(GioiThieuVanBan.NoiDung);
            string NGAY_XB = nameof(GioiThieuVanBan.NgayXuatBan);
            string TAC_GIA = nameof(GioiThieuVanBan.TacGia);
            string ANH_DAI_DIEN = nameof(GioiThieuVanBan.AnhDaiDien);
            string TRANG_THAI = nameof(GioiThieuVanBan.TrangThai);

            if (values.Contains(TIEU_DE)) model.TieuDe = Convert.ToString(values[TIEU_DE]);

            if (values.Contains(ID_VB_QPPL))
                model.IDVanBanQPPL = values[ID_VB_QPPL] != null ? Convert.ToInt32(values[ID_VB_QPPL]) : (int?)null;

            if (values.Contains(ID_VB_DT))
                model.IDVanBanDT = values[ID_VB_DT] != null ? Convert.ToInt32(values[ID_VB_DT]) : (int?)null;

            if (values.Contains(MO_TA)) model.MoTa = Convert.ToString(values[MO_TA]);

            if (values.Contains(NOI_DUNG)) model.NoiDung = Convert.ToString(values[NOI_DUNG]);

            if (values.Contains(NGAY_XB))
                model.NgayXuatBan = values[NGAY_XB] != null ? Convert.ToDateTime(values[NGAY_XB]) : (DateTime?)null;

            if (values.Contains(TAC_GIA)) model.TacGia = Convert.ToString(values[TAC_GIA]);

            if (values.Contains(ANH_DAI_DIEN))
                model.AnhDaiDien = Convert.ToString(values[ANH_DAI_DIEN]);

            if (values.Contains(TRANG_THAI))
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
        }
        private string GetFullErrorMessage(ModelStateDictionary modelState)
        {
            var messages = new List<string>();
            foreach (var entry in modelState)
                foreach (var error in entry.Value.Errors)
                    messages.Add(error.ErrorMessage);
            return String.Join(" ", messages);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) _context.Dispose();
            base.Dispose(disposing);
        }
    }
}