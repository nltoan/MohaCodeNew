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
    [Route("api/ThamSoHeThongs/{action}", Name = "ThamSoHeThongsApi")]
    public class ThamSoHeThongsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var thamsohethongs = _context.ThamSoHeThongs.Select(i => new {
                i.ID,
                i.DongBoDuLieu,
                i.ThoiGianCrawl,
                i.QuyenLanhDao,
                i.TenLanhDao,
                i.Theme,
                i.DuongDanCrawl,
                i.NoiDungFooter,
                i.NoiDungFooter_English,
                i.MoTa_HuongDan_GuiYKien,
                i.MoTa_HuongDan_ThuTucHanhChinh,
                i.HitCount,
                i.HienThi_IconPrefix,
                i.MoTa_HoTroDoanhNghiep,
                i.Title,
                i.ADConfig,
                i.EmailAddress,
                i.EmailPassword,
                i.EmailHost,
                i.EmailPort
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(thamsohethongs, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ThamSoHeThong();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ThamSoHeThongs.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ThamSoHeThongs.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ThamSoHeThongs.FirstOrDefaultAsync(item => item.ID == key);

            _context.ThamSoHeThongs.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ThamSoHeThong model, IDictionary values) {
            string ID = nameof(ThamSoHeThong.ID);
            string DONG_BO_DU_LIEU = nameof(ThamSoHeThong.DongBoDuLieu);
            string THOI_GIAN_CRAWL = nameof(ThamSoHeThong.ThoiGianCrawl);
            string QUYEN_LANH_DAO = nameof(ThamSoHeThong.QuyenLanhDao);
            string TEN_LANH_DAO = nameof(ThamSoHeThong.TenLanhDao);
            string THEME = nameof(ThamSoHeThong.Theme);
            string DUONG_DAN_CRAWL = nameof(ThamSoHeThong.DuongDanCrawl);
            string NOI_DUNG_FOOTER = nameof(ThamSoHeThong.NoiDungFooter);
            string NOI_DUNG_FOOTER_ENGLISH = nameof(ThamSoHeThong.NoiDungFooter_English);
            string MO_TA_HUONG_DAN_GUI_YKIEN = nameof(ThamSoHeThong.MoTa_HuongDan_GuiYKien);
            string MO_TA_HUONG_DAN_THU_TUC_HANH_CHINH = nameof(ThamSoHeThong.MoTa_HuongDan_ThuTucHanhChinh);
            string HIT_COUNT = nameof(ThamSoHeThong.HitCount);
            string HIEN_THI_ICON_PREFIX = nameof(ThamSoHeThong.HienThi_IconPrefix);
            string MO_TA_HO_TRO_DOANH_NGHIEP = nameof(ThamSoHeThong.MoTa_HoTroDoanhNghiep);
            string TITLE = nameof(ThamSoHeThong.Title);
            string ADCONFIG = nameof(ThamSoHeThong.ADConfig);
            string EMAIL_ADDRESS = nameof(ThamSoHeThong.EmailAddress);
            string EMAIL_PASSWORD = nameof(ThamSoHeThong.EmailPassword);
            string EMAIL_HOST = nameof(ThamSoHeThong.EmailHost);
            string EMAIL_PORT = nameof(ThamSoHeThong.EmailPort);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(DONG_BO_DU_LIEU)) {
                model.DongBoDuLieu = Convert.ToInt32(values[DONG_BO_DU_LIEU]);
            }

            if(values.Contains(THOI_GIAN_CRAWL)) {
                model.ThoiGianCrawl = values[THOI_GIAN_CRAWL] != null ? Convert.ToInt32(values[THOI_GIAN_CRAWL]) : (int?)null;
            }

            if(values.Contains(QUYEN_LANH_DAO)) {
                model.QuyenLanhDao = Convert.ToString(values[QUYEN_LANH_DAO]);
            }

            if(values.Contains(TEN_LANH_DAO)) {
                model.TenLanhDao = Convert.ToString(values[TEN_LANH_DAO]);
            }

            if(values.Contains(THEME)) {
                model.Theme = Convert.ToString(values[THEME]);
            }

            if(values.Contains(DUONG_DAN_CRAWL)) {
                model.DuongDanCrawl = Convert.ToString(values[DUONG_DAN_CRAWL]);
            }

            if(values.Contains(NOI_DUNG_FOOTER)) {
                model.NoiDungFooter = Convert.ToString(values[NOI_DUNG_FOOTER]);
            }

            if(values.Contains(NOI_DUNG_FOOTER_ENGLISH)) {
                model.NoiDungFooter_English = Convert.ToString(values[NOI_DUNG_FOOTER_ENGLISH]);
            }

            if(values.Contains(MO_TA_HUONG_DAN_GUI_YKIEN)) {
                model.MoTa_HuongDan_GuiYKien = Convert.ToString(values[MO_TA_HUONG_DAN_GUI_YKIEN]);
            }

            if(values.Contains(MO_TA_HUONG_DAN_THU_TUC_HANH_CHINH)) {
                model.MoTa_HuongDan_ThuTucHanhChinh = Convert.ToString(values[MO_TA_HUONG_DAN_THU_TUC_HANH_CHINH]);
            }

            if(values.Contains(HIT_COUNT)) {
                model.HitCount = values[HIT_COUNT] != null ? Convert.ToInt32(values[HIT_COUNT]) : (int?)null;
            }

            if(values.Contains(HIEN_THI_ICON_PREFIX)) {
                model.HienThi_IconPrefix = values[HIEN_THI_ICON_PREFIX] != null ? Convert.ToInt32(values[HIEN_THI_ICON_PREFIX]) : (int?)null;
            }

            if(values.Contains(MO_TA_HO_TRO_DOANH_NGHIEP)) {
                model.MoTa_HoTroDoanhNghiep = Convert.ToString(values[MO_TA_HO_TRO_DOANH_NGHIEP]);
            }

            if(values.Contains(TITLE)) {
                model.Title = Convert.ToString(values[TITLE]);
            }

            if(values.Contains(ADCONFIG)) {
                model.ADConfig = Convert.ToString(values[ADCONFIG]);
            }

            if(values.Contains(EMAIL_ADDRESS)) {
                model.EmailAddress = Convert.ToString(values[EMAIL_ADDRESS]);
            }

            if(values.Contains(EMAIL_PASSWORD)) {
                model.EmailPassword = Convert.ToString(values[EMAIL_PASSWORD]);
            }

            if(values.Contains(EMAIL_HOST)) {
                model.EmailHost = Convert.ToString(values[EMAIL_HOST]);
            }

            if(values.Contains(EMAIL_PORT)) {
                model.EmailPort = Convert.ToString(values[EMAIL_PORT]);
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