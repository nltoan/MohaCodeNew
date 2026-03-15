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
    [Route("api/DongSuKiens/{action}", Name = "DongSuKiensApi")]
    public class DongSuKiensController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var dongsukiens = _context.DongSuKiens.Select(i => new {
                i.ID,
                i.TenDongSuKien,
                i.MoTa,
                i.TrangThai,
                i.MucUuTien,
                i.NgayXuatBan,
                i.NgayHetHieuLuc,
                i.AnhDaiDien
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(dongsukiens, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new DongSuKien();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.DongSuKiens.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.DongSuKiens.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.DongSuKiens.FirstOrDefaultAsync(item => item.ID == key);

            _context.DongSuKiens.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(DongSuKien model, IDictionary values) {
            string ID = nameof(DongSuKien.ID);
            string TEN_DONG_SU_KIEN = nameof(DongSuKien.TenDongSuKien);
            string MO_TA = nameof(DongSuKien.MoTa);
            string TRANG_THAI = nameof(DongSuKien.TrangThai);
            string MUC_UU_TIEN = nameof(DongSuKien.MucUuTien);
            string NGAY_XUAT_BAN = nameof(DongSuKien.NgayXuatBan);
            string NGAY_HET_HIEU_LUC = nameof(DongSuKien.NgayHetHieuLuc);
            string ANH_DAI_DIEN = nameof(DongSuKien.AnhDaiDien);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_DONG_SU_KIEN)) {
                model.TenDongSuKien = Convert.ToString(values[TEN_DONG_SU_KIEN]);
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

            if(values.Contains(NGAY_XUAT_BAN)) {
                model.NgayXuatBan = values[NGAY_XUAT_BAN] != null ? Convert.ToDateTime(values[NGAY_XUAT_BAN]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_HET_HIEU_LUC)) {
                model.NgayHetHieuLuc = values[NGAY_HET_HIEU_LUC] != null ? Convert.ToDateTime(values[NGAY_HET_HIEU_LUC]) : (DateTime?)null;
            }

            if(values.Contains(ANH_DAI_DIEN)) {
                model.AnhDaiDien = Convert.ToString(values[ANH_DAI_DIEN]);
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