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
    [Route("api/ThoiKyPhatTriens/{action}", Name = "ThoiKyPhatTriensApi")]
    public class ThoiKyPhatTriensController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var thoikyphattriens = _context.ThoiKyPhatTriens.Select(i => new {
                i.ID,
                i.TenThoiKy,
                i.ThoiGianBatDau,
                i.ThoiGianKetThuc,
                i.TrangThai,
                i.NoiDung
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(thoikyphattriens, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ThoiKyPhatTrien();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ThoiKyPhatTriens.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ThoiKyPhatTriens.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ThoiKyPhatTriens.FirstOrDefaultAsync(item => item.ID == key);

            _context.ThoiKyPhatTriens.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ThoiKyPhatTrien model, IDictionary values) {
            string ID = nameof(ThoiKyPhatTrien.ID);
            string TEN_THOI_KY = nameof(ThoiKyPhatTrien.TenThoiKy);
            string THOI_GIAN_BAT_DAU = nameof(ThoiKyPhatTrien.ThoiGianBatDau);
            string THOI_GIAN_KET_THUC = nameof(ThoiKyPhatTrien.ThoiGianKetThuc);
            string TRANG_THAI = nameof(ThoiKyPhatTrien.TrangThai);
            string NOI_DUNG = nameof(ThoiKyPhatTrien.NoiDung);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_THOI_KY)) {
                model.TenThoiKy = Convert.ToString(values[TEN_THOI_KY]);
            }

            if(values.Contains(THOI_GIAN_BAT_DAU)) {
                model.ThoiGianBatDau = values[THOI_GIAN_BAT_DAU] != null ? Convert.ToDateTime(values[THOI_GIAN_BAT_DAU]) : (DateTime?)null;
            }

            if(values.Contains(THOI_GIAN_KET_THUC)) {
                model.ThoiGianKetThuc = values[THOI_GIAN_KET_THUC] != null ? Convert.ToDateTime(values[THOI_GIAN_KET_THUC]) : (DateTime?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(NOI_DUNG)) {
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