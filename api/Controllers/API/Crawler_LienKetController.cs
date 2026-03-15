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
    [Route("api/Crawler_LienKet/{action}", Name = "Crawler_LienKetApi")]
    public class Crawler_LienKetController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var option = Request.GetQueryNameValuePairs().Where(x => x.Key == "type").FirstOrDefault();
            var type = option.Value;
            var crawler_lienket = _context.Crawler_LienKet.AsQueryable();
            if(type != null)
            {
                int id = Convert.ToInt32(type);
                crawler_lienket = crawler_lienket.Where(x => x.Crawler_Nguon.ChuDeID == id);
            }

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(crawler_lienket, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new Crawler_LienKet();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Crawler_LienKet.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Crawler_LienKet.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.Crawler_LienKet.FirstOrDefaultAsync(item => item.ID == key);

            _context.Crawler_LienKet.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> Crawler_NguonLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.Crawler_Nguon
                         orderby i.TenNguon
                         select new {
                             Value = i.ID,
                             Text = i.TenNguon
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(Crawler_LienKet model, IDictionary values) {
            string ID = nameof(Crawler_LienKet.ID);
            string TIEU_DE = nameof(Crawler_LienKet.TieuDe);
            string MO_TA = nameof(Crawler_LienKet.MoTa);
            string ID_NGUON_TIN = nameof(Crawler_LienKet.ID_NguonTin);
            string NGAY_XUAT_BAN = nameof(Crawler_LienKet.NgayXuatBan);
            string LIEN_KET = nameof(Crawler_LienKet.LienKet);
            string THOI_GIAN_CRAWL = nameof(Crawler_LienKet.ThoiGianCrawl);
            string LINK_ANH_DAI_DIEN = nameof(Crawler_LienKet.LinkAnhDaiDien);
            string TRANG_THAI = nameof(Crawler_LienKet.TrangThai);
            string IDS_CHU_DE = nameof(Crawler_LienKet.IDs_ChuDe);
            string ID_NGUOI_CAP_NHAT = nameof(Crawler_LienKet.ID_NguoiCapNhat);
            string THOI_GIAN_CAP_NHAT = nameof(Crawler_LienKet.ThoiGianCapNhat);
            string NOIBAT = nameof(Crawler_LienKet.NoiBat);
            string TRINH_LANH_DAO = nameof(Crawler_LienKet.TrinhLanhDao);
            string VUNG_HIEN_THI = nameof(Crawler_LienKet.VungHienThi);
            string THOI_GIAN_UU_TIEN = nameof(Crawler_LienKet.ThoiGianUuTien);
            string NGAY_BAT_DAU = nameof(Crawler_LienKet.NgayBatDau);
            string NGAY_HET_HAN = nameof(Crawler_LienKet.NgayHetHan);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TIEU_DE)) {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(ID_NGUON_TIN)) {
                model.ID_NguonTin = values[ID_NGUON_TIN] != null ? Convert.ToInt32(values[ID_NGUON_TIN]) : (int?)null;
            }

            if(values.Contains(NGAY_XUAT_BAN)) {
                model.NgayXuatBan = values[NGAY_XUAT_BAN] != null ? Convert.ToDateTime(values[NGAY_XUAT_BAN]) : (DateTime?)null;
            }

            if(values.Contains(LIEN_KET)) {
                model.LienKet = Convert.ToString(values[LIEN_KET]);
            }

            if(values.Contains(THOI_GIAN_CRAWL)) {
                model.ThoiGianCrawl = values[THOI_GIAN_CRAWL] != null ? Convert.ToDateTime(values[THOI_GIAN_CRAWL]) : (DateTime?)null;
            }

            if(values.Contains(LINK_ANH_DAI_DIEN)) {
                model.LinkAnhDaiDien = Convert.ToString(values[LINK_ANH_DAI_DIEN]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(IDS_CHU_DE)) {
                model.IDs_ChuDe = Convert.ToString(values[IDS_CHU_DE]);
            }

            if(values.Contains(ID_NGUOI_CAP_NHAT)) {
                model.ID_NguoiCapNhat = Convert.ToString(values[ID_NGUOI_CAP_NHAT]);
            }

            if(values.Contains(THOI_GIAN_CAP_NHAT)) {
                model.ThoiGianCapNhat = values[THOI_GIAN_CAP_NHAT] != null ? Convert.ToDateTime(values[THOI_GIAN_CAP_NHAT]) : (DateTime?)null;
            }

            if(values.Contains(NOIBAT)) {
                model.NoiBat = values[NOIBAT] != null ? Convert.ToInt32(values[NOIBAT]) : (int?)null;
            }

            if(values.Contains(TRINH_LANH_DAO)) {
                model.TrinhLanhDao = values[TRINH_LANH_DAO] != null ? Convert.ToInt32(values[TRINH_LANH_DAO]) : (int?)null;
            }

            if(values.Contains(VUNG_HIEN_THI)) {
                model.VungHienThi = Convert.ToString(values[VUNG_HIEN_THI]);
            }

            if(values.Contains(THOI_GIAN_UU_TIEN)) {
                model.ThoiGianUuTien = values[THOI_GIAN_UU_TIEN] != null ? Convert.ToDateTime(values[THOI_GIAN_UU_TIEN]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_BAT_DAU)) {
                model.NgayBatDau = values[NGAY_BAT_DAU] != null ? Convert.ToDateTime(values[NGAY_BAT_DAU]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_HET_HAN)) {
                model.NgayHetHan = values[NGAY_HET_HAN] != null ? Convert.ToDateTime(values[NGAY_HET_HAN]) : (DateTime?)null;
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