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
    [Route("api/BinhLuans/{action}", Name = "BinhLuansApi")]
    public class BinhLuansController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var binhluans = _context.BinhLuans.Select(i => new {
                i.ID,
                i.ID_ThongTin,
                i.NoiDung,
                i.TenBanDoc,
                i.Email,
                i.Trangthai,
                i.NgayTao,
                i.NgayKiemDuyet,
                i.TieuDe,
                i.IDCha,
                i.DiaChi,
                i.FileDinhKem
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(binhluans, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new BinhLuan();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.BinhLuans.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.BinhLuans.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.BinhLuans.FirstOrDefaultAsync(item => item.ID == key);

            _context.BinhLuans.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> TinTucsLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.TinTucs
                         orderby i.TieuDe
                         select new {
                             Value = i.ID,
                             Text = i.TieuDe
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(BinhLuan model, IDictionary values) {
            string ID = nameof(BinhLuan.ID);
            string ID_THONG_TIN = nameof(BinhLuan.ID_ThongTin);
            string NOI_DUNG = nameof(BinhLuan.NoiDung);
            string TEN_BAN_DOC = nameof(BinhLuan.TenBanDoc);
            string EMAIL = nameof(BinhLuan.Email);
            string TRANGTHAI = nameof(BinhLuan.Trangthai);
            string NGAY_TAO = nameof(BinhLuan.NgayTao);
            string NGAY_KIEM_DUYET = nameof(BinhLuan.NgayKiemDuyet);
            string TIEU_DE = nameof(BinhLuan.TieuDe);
            string IDCHA = nameof(BinhLuan.IDCha);
            string DIA_CHI = nameof(BinhLuan.DiaChi);
            string FILE_DINH_KEM = nameof(BinhLuan.FileDinhKem);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(ID_THONG_TIN)) {
                model.ID_ThongTin = Convert.ToInt32(values[ID_THONG_TIN]);
            }

            if(values.Contains(NOI_DUNG)) {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if(values.Contains(TEN_BAN_DOC)) {
                model.TenBanDoc = Convert.ToString(values[TEN_BAN_DOC]);
            }

            if(values.Contains(EMAIL)) {
                model.Email = Convert.ToString(values[EMAIL]);
            }

            if(values.Contains(TRANGTHAI)) {
                model.Trangthai = Convert.ToString(values[TRANGTHAI]);
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = Convert.ToDateTime(values[NGAY_TAO]);
            }

            if(values.Contains(NGAY_KIEM_DUYET)) {
                model.NgayKiemDuyet = values[NGAY_KIEM_DUYET] != null ? Convert.ToDateTime(values[NGAY_KIEM_DUYET]) : (DateTime?)null;
            }

            if(values.Contains(TIEU_DE)) {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if(values.Contains(IDCHA)) {
                model.IDCha = values[IDCHA] != null ? Convert.ToInt32(values[IDCHA]) : (int?)null;
            }

            if(values.Contains(DIA_CHI)) {
                model.DiaChi = Convert.ToString(values[DIA_CHI]);
            }

            if(values.Contains(FILE_DINH_KEM)) {
                model.FileDinhKem = Convert.ToString(values[FILE_DINH_KEM]);
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