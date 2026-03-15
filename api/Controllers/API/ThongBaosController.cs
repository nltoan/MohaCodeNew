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
    [Route("api/ThongBaos/{action}", Name = "ThongBaosApi")]
    public class ThongBaosController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var ThongBaos = _context.ThongBaos.Select(i => new {
                i.ID,
                i.TieuDe,
                i.SoVanBan,
                i.NgayDang,
                i.DonViBanHanh,
                i.NoiDung,
                i.HienThiTrangChu,
                i.TenFileHienThi,
                i.DuongDanFile
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(ThongBaos, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ThongBao();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ThongBaos.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ThongBaos.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ThongBaos.FirstOrDefaultAsync(item => item.ID == key);

            _context.ThongBaos.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ThongBao model, IDictionary values)
        {
            string ID = nameof(ThongBao.ID);
            string TIEU_DE = nameof(ThongBao.TieuDe);
            string SO_VAN_BAN = nameof(ThongBao.SoVanBan);
            string NGAY_DANG = nameof(ThongBao.NgayDang);
            string DON_VI_BAN_HANH = nameof(ThongBao.DonViBanHanh);
            string NOI_DUNG = nameof(ThongBao.NoiDung);
            string HIEN_THI_TRANG_CHU = nameof(ThongBao.HienThiTrangChu);
            string TEN_FILE_HIEN_THI = nameof(ThongBao.TenFileHienThi);
            string DUONG_DAN_FILE = nameof(ThongBao.DuongDanFile);

            if (values.Contains(ID))
            {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if (values.Contains(TIEU_DE))
            {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if (values.Contains(SO_VAN_BAN))
            {
                model.SoVanBan = Convert.ToString(values[SO_VAN_BAN]);
            }

            if (values.Contains(NGAY_DANG))
            {
                model.NgayDang = values[NGAY_DANG] != null ? Convert.ToDateTime(values[NGAY_DANG]) : (DateTime?)null;
            }

            if (values.Contains(DON_VI_BAN_HANH))
            {
                model.DonViBanHanh = Convert.ToString(values[DON_VI_BAN_HANH]);
            }

            if (values.Contains(NOI_DUNG))
            {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if (values.Contains(HIEN_THI_TRANG_CHU))
            {
                model.HienThiTrangChu = values[HIEN_THI_TRANG_CHU] != null ? Convert.ToBoolean(values[HIEN_THI_TRANG_CHU]) : (bool?)null;
            }

            if (values.Contains(TEN_FILE_HIEN_THI))
            {
                model.TenFileHienThi = Convert.ToString(values[TEN_FILE_HIEN_THI]);
            }

            if (values.Contains(DUONG_DAN_FILE))
            {
                model.DuongDanFile = Convert.ToString(values[DUONG_DAN_FILE]);
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