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
    [Route("api/CoCauToChucs/{action}", Name = "CoCauToChucsApi")]
    public class CoCauToChucsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var cocautochucs = _context.CoCauToChucs.Select(i => new {
                i.ID,
                i.IDLoaiDV,
                i.IDDVCha,
                i.TenTiengAnh,
                i.TenDonVi,
                i.ChucNangNhiemVu,
                i.SoThuTu,
                i.DiaChi,
                i.Email,
                i.Lang,
                i.HienThi,
                i.Website,
                i.Phone,
                i.LinkBaiViet,
                i.IsGroup
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(cocautochucs, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new CoCauToChuc();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.CoCauToChucs.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.CoCauToChucs.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.CoCauToChucs.FirstOrDefaultAsync(item => item.ID == key);

            _context.CoCauToChucs.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(CoCauToChuc model, IDictionary values) {
            string ID = nameof(CoCauToChuc.ID);
            string IDLOAI_DV = nameof(CoCauToChuc.IDLoaiDV);
            string IDDVCHA = nameof(CoCauToChuc.IDDVCha);
            string TEN_TIENG_ANH = nameof(CoCauToChuc.TenTiengAnh);
            string TEN_DON_VI = nameof(CoCauToChuc.TenDonVi);
            string CHUC_NANG_NHIEM_VU = nameof(CoCauToChuc.ChucNangNhiemVu);
            string SO_THU_TU = nameof(CoCauToChuc.SoThuTu);
            string DIA_CHI = nameof(CoCauToChuc.DiaChi);
            string EMAIL = nameof(CoCauToChuc.Email);
            string LANG = nameof(CoCauToChuc.Lang);
            string HIEN_THI = nameof(CoCauToChuc.HienThi);
            string WEBSITE = nameof(CoCauToChuc.Website);
            string PHONE = nameof(CoCauToChuc.Phone);
            string LINK_BAI_VIET = nameof(CoCauToChuc.LinkBaiViet);

            if (values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(IDLOAI_DV)) {
                model.IDLoaiDV = values[IDLOAI_DV] != null ? Convert.ToInt32(values[IDLOAI_DV]) : (int?)null;
            }

            if(values.Contains(IDDVCHA)) {
                model.IDDVCha = values[IDDVCHA] != null ? Convert.ToInt32(values[IDDVCHA]) : (int?)null;
            }

            if(values.Contains(TEN_TIENG_ANH)) {
                model.TenTiengAnh = Convert.ToString(values[TEN_TIENG_ANH]);
            }

            if(values.Contains(TEN_DON_VI)) {
                model.TenDonVi = Convert.ToString(values[TEN_DON_VI]);
            }

            if(values.Contains(CHUC_NANG_NHIEM_VU)) {
                model.ChucNangNhiemVu = Convert.ToString(values[CHUC_NANG_NHIEM_VU]);
            }

            if(values.Contains(SO_THU_TU)) {
                model.SoThuTu = values[SO_THU_TU] != null ? Convert.ToInt32(values[SO_THU_TU]) : (int?)null;
            }

            if(values.Contains(DIA_CHI)) {
                model.DiaChi = Convert.ToString(values[DIA_CHI]);
            }

            if(values.Contains(EMAIL)) {
                model.Email = Convert.ToString(values[EMAIL]);
            }

            if (values.Contains(WEBSITE))
            {
                model.Website = Convert.ToString(values[WEBSITE]);
            }

            if (values.Contains(PHONE))
            {
                model.Phone = Convert.ToString(values[PHONE]);
            }

            if (values.Contains(LINK_BAI_VIET))
            {
                model.LinkBaiViet = Convert.ToString(values[LINK_BAI_VIET]);
            }

            if (values.Contains(LANG)) {
                model.Lang = values[LANG] != null ? Convert.ToInt32(values[LANG]) : (int?)null;
            }

            if(values.Contains(HIEN_THI)) {
                model.HienThi = values[HIEN_THI] != null ? Convert.ToInt32(values[HIEN_THI]) : (int?)null;
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