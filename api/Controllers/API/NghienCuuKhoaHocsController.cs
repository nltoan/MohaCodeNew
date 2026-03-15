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
    [Route("api/NghienCuuKhoaHocs/{action}", Name = "NghienCuuKhoaHocsApi")]
    public class NghienCuuKhoaHocsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var NghienCuuKhoaHocs = _context.NghienCuuKhoaHocs.Select(i => new {
                i.ID,
                i.TenDeTai,
                i.CapQuanLy,
                i.LinhVuc,
                i.DonViChuTri,
                i.ThoiGianThucHien,
                i.MoTa,
                i.NoiDung,
                i.NgayTao,
                i.NguoiTao,
                i.NgayCapNhat,
                i.NguoiCapNhat
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(NghienCuuKhoaHocs, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new NghienCuuKhoaHoc();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.NghienCuuKhoaHocs.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.NghienCuuKhoaHocs.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.NghienCuuKhoaHocs.FirstOrDefaultAsync(item => item.ID == key);

            _context.NghienCuuKhoaHocs.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(NghienCuuKhoaHoc model, IDictionary values) {
            string ID = nameof(NghienCuuKhoaHoc.ID);
            string TEN_DE_TAI = nameof(NghienCuuKhoaHoc.TenDeTai);
            string CAP_QUAN_LY = nameof(NghienCuuKhoaHoc.CapQuanLy);
            string DON_VI_CHU_TRI = nameof(NghienCuuKhoaHoc.DonViChuTri);
            string THOI_GIAN_THUC_HIEN = nameof(NghienCuuKhoaHoc.ThoiGianThucHien);
            string NGAY_TAO = nameof(NghienCuuKhoaHoc.NgayTao);
            string NGUOI_TAO = nameof(NghienCuuKhoaHoc.NguoiTao);
            string NGAY_CAP_NHAT = nameof(NghienCuuKhoaHoc.NgayCapNhat);
            string NGUOI_CAP_NHAT = nameof(NghienCuuKhoaHoc.NguoiCapNhat);
            string NOI_DUNG = nameof(NghienCuuKhoaHoc.NoiDung);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_DE_TAI)) {
                model.TenDeTai = Convert.ToString(values[TEN_DE_TAI]);
            }

            if(values.Contains(CAP_QUAN_LY)) {
                model.CapQuanLy = Convert.ToString(values[CAP_QUAN_LY]);
            }

            if(values.Contains(DON_VI_CHU_TRI)) {
                model.DonViChuTri = Convert.ToString(values[DON_VI_CHU_TRI]);
            }

            if (values.Contains(THOI_GIAN_THUC_HIEN))
            {
                model.ThoiGianThucHien = Convert.ToString(values[THOI_GIAN_THUC_HIEN]);
            }

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

            if (values.Contains(NOI_DUNG))
            {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
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