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
    [Route("api/DongGopYKiens/{action}", Name = "DongGopYKiensApi")]
    public class DongGopYKiensController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var source = _context.DongGopYKiens.Select(i => new
            {
                i.ID,
                i.TieuDe,
                i.TenNguoiGui,
                i.CMND,
                i.Email,
                i.SoDienThoai,
                i.ChuDeId,
                i.NoiDung,
                i.NgayTao,
                i.NguoiTao,
                i.NgayCapNhat,
                i.NguoiCapNhat
            });

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(source, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var model = new DongGopYKien();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            _context.DongGopYKiens.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { model.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.DongGopYKiens.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.DongGopYKiens.FirstOrDefaultAsync(item => item.ID == key);

            if (model != null)
            {
                _context.DongGopYKiens.Remove(model);
                await _context.SaveChangesAsync();
            }
        }

        private void PopulateModel(DongGopYKien model, IDictionary values)
        {
            string TIEU_DE = nameof(DongGopYKien.TieuDe);
            string TEN_NGUOI_GUI = nameof(DongGopYKien.TenNguoiGui);
            string CMND = nameof(DongGopYKien.CMND);
            string EMAIL = nameof(DongGopYKien.Email);
            string SO_DIEN_THOAI = nameof(DongGopYKien.SoDienThoai);
            string CHU_DE_ID = nameof(DongGopYKien.ChuDeId);
            string NOI_DUNG = nameof(DongGopYKien.NoiDung);
            string NGAY_TAO = nameof(DongGopYKien.NgayTao);
            string NGUOI_TAO = nameof(DongGopYKien.NguoiTao);
            string NGAY_CAP_NHAT = nameof(DongGopYKien.NgayCapNhat);
            string NGUOI_CAP_NHAT = nameof(DongGopYKien.NguoiCapNhat);

            if (values.Contains(TIEU_DE)) model.TieuDe = Convert.ToString(values[TIEU_DE]);
            if (values.Contains(TEN_NGUOI_GUI)) model.TenNguoiGui = Convert.ToString(values[TEN_NGUOI_GUI]);
            if (values.Contains(CMND)) model.CMND = Convert.ToString(values[CMND]);
            if (values.Contains(EMAIL)) model.Email = Convert.ToString(values[EMAIL]);
            if (values.Contains(SO_DIEN_THOAI)) model.SoDienThoai = Convert.ToString(values[SO_DIEN_THOAI]);
            if (values.Contains(CHU_DE_ID)) model.ChuDeId = values[CHU_DE_ID] != null ? Convert.ToInt32(values[CHU_DE_ID]) : (int?)null;
            if (values.Contains(NOI_DUNG)) model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            if (values.Contains(NGAY_TAO))
            {
                model.NgayTao = Convert.ToDateTime(values[NGAY_TAO]);
            }

            if (values.Contains(NGUOI_TAO))
            {
                model.NguoiTao = Convert.ToString(values[NGUOI_TAO]);
            }

            if (values.Contains(NGAY_CAP_NHAT))
            {
                model.NgayCapNhat = Convert.ToDateTime(values[NGAY_CAP_NHAT]);
            }

            if (values.Contains(NGUOI_CAP_NHAT))
            {
                model.NguoiCapNhat = Convert.ToString(values[NGUOI_CAP_NHAT]);
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