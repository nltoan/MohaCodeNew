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
    [Route("api/PhanAnhKienNghis/{action}", Name = "PhanAnhKienNghisApi")]
    public class PhanAnhKienNghisController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var source = _context.PhanAnhKienNghis.Select(i => new
            {
                i.ID,
                i.TenCauHoi,
                i.TenNguoiGui,
                i.Email,
                i.SoDienThoai,
                i.IPNguoiGui,
                i.LinhVucId,
                i.CoQuanId,
                i.NgayHoi,
                i.NguoiTraLoi,
                i.LuotXem,
                i.HienThiLuotXem,
                i.NoiDungCauHoi,
                i.NoiDungCauTraLoi
            });

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(source, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var model = new PhanAnhKienNghi();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            _context.PhanAnhKienNghis.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { model.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.PhanAnhKienNghis.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.PhanAnhKienNghis.FirstOrDefaultAsync(item => item.ID == key);

            if (model != null)
            {
                _context.PhanAnhKienNghis.Remove(model);
                await _context.SaveChangesAsync();
            }
        }

        private void PopulateModel(PhanAnhKienNghi model, IDictionary values)
        {
            string TEN_CAU_HOI = nameof(PhanAnhKienNghi.TenCauHoi);
            string TEN_NGUOI_GUI = nameof(PhanAnhKienNghi.TenNguoiGui);
            string EMAIL = nameof(PhanAnhKienNghi.Email);
            string SO_DIEN_THOAI = nameof(PhanAnhKienNghi.SoDienThoai);
            string IP_NGUOI_GUI = nameof(PhanAnhKienNghi.IPNguoiGui);
            string LINH_VUC_ID = nameof(PhanAnhKienNghi.LinhVucId);
            string CO_QUAN_ID = nameof(PhanAnhKienNghi.CoQuanId);
            string NGAY_HOI = nameof(PhanAnhKienNghi.NgayHoi);
            string NGUOI_TRA_LOI = nameof(PhanAnhKienNghi.NguoiTraLoi);
            string LUOT_XEM = nameof(PhanAnhKienNghi.LuotXem);
            string HIEN_THI_LUOT_XEM = nameof(PhanAnhKienNghi.HienThiLuotXem);
            string NOI_DUNG_CAU_HOI = nameof(PhanAnhKienNghi.NoiDungCauHoi);
            string NOI_DUNG_CAU_TRA_LOI = nameof(PhanAnhKienNghi.NoiDungCauTraLoi);

            if (values.Contains(TEN_CAU_HOI)) model.TenCauHoi = Convert.ToString(values[TEN_CAU_HOI]);
            if (values.Contains(TEN_NGUOI_GUI)) model.TenNguoiGui = Convert.ToString(values[TEN_NGUOI_GUI]);
            if (values.Contains(EMAIL)) model.Email = Convert.ToString(values[EMAIL]);
            if (values.Contains(SO_DIEN_THOAI)) model.SoDienThoai = Convert.ToString(values[SO_DIEN_THOAI]);
            if (values.Contains(IP_NGUOI_GUI)) model.IPNguoiGui = Convert.ToString(values[IP_NGUOI_GUI]);

            if (values.Contains(LINH_VUC_ID)) model.LinhVucId = values[LINH_VUC_ID] != null ? Convert.ToInt32(values[LINH_VUC_ID]) : (int?)null;
            if (values.Contains(CO_QUAN_ID)) model.CoQuanId = values[CO_QUAN_ID] != null ? Convert.ToInt32(values[CO_QUAN_ID]) : (int?)null;

            if (values.Contains(NGAY_HOI)) model.NgayHoi = Convert.ToDateTime(values[NGAY_HOI]);
            if (values.Contains(NGUOI_TRA_LOI)) model.NguoiTraLoi = Convert.ToString(values[NGUOI_TRA_LOI]);

            if (values.Contains(LUOT_XEM)) model.LuotXem = values[LUOT_XEM] != null ? Convert.ToInt32(values[LUOT_XEM]) : (int?)null;
            if (values.Contains(HIEN_THI_LUOT_XEM)) model.HienThiLuotXem = values[HIEN_THI_LUOT_XEM] != null ? Convert.ToBoolean(values[HIEN_THI_LUOT_XEM]) : (bool?)null;

            if (values.Contains(NOI_DUNG_CAU_HOI)) model.NoiDungCauHoi = Convert.ToString(values[NOI_DUNG_CAU_HOI]);
            if (values.Contains(NOI_DUNG_CAU_TRA_LOI)) model.NoiDungCauTraLoi = Convert.ToString(values[NOI_DUNG_CAU_TRA_LOI]);
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