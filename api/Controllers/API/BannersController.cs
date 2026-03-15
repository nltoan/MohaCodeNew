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
    [Route("api/Banners/{action}", Name = "BannersApi")]
    public class BannersController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {

            var banners = _context.CollectionFromSql(@"
            select 
                b.*, f.Ten as TenFile, f.LinkLuuTru 
            from Banner b 
            left join Files f on b.ID_File = f.ID",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(banners, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new Banner();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Banners.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Banners.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.Banners.FirstOrDefaultAsync(item => item.ID == key);

            _context.Banners.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(Banner model, IDictionary values) {
            string ID = nameof(Banner.ID);
            string TEN_BANNER = nameof(Banner.TenBanner);
            string ID_FILE = nameof(Banner.ID_File);
            string NGAY_XUAT_BAN = nameof(Banner.NgayXuatBan);
            string NGAY_HET_HIEU_LUC = nameof(Banner.NgayHetHieuLuc);
            string NGAY_TAO = nameof(Banner.NgayTao);
            string URL = nameof(Banner.URL);
            string LUOT_TRUY_CAP = nameof(Banner.LuotTruyCap);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_BANNER)) {
                model.TenBanner = Convert.ToString(values[TEN_BANNER]);
            }

            if(values.Contains(ID_FILE)) {
                model.ID_File = Convert.ToInt32(values[ID_FILE]);
            }

            if(values.Contains(NGAY_XUAT_BAN)) {
                model.NgayXuatBan = values[NGAY_XUAT_BAN] != null ? Convert.ToDateTime(values[NGAY_XUAT_BAN]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_HET_HIEU_LUC)) {
                model.NgayHetHieuLuc = values[NGAY_HET_HIEU_LUC] != null ? Convert.ToDateTime(values[NGAY_HET_HIEU_LUC]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = Convert.ToDateTime(values[NGAY_TAO]);
            }

            if(values.Contains(URL)) {
                model.URL = Convert.ToString(values[URL]);
            }

            if(values.Contains(LUOT_TRUY_CAP)) {
                model.LuotTruyCap = values[LUOT_TRUY_CAP] != null ? Convert.ToInt32(values[LUOT_TRUY_CAP]) : (int?)null;
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