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
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    [Route("api/BuocQuyTrinhs/{action}", Name = "BuocQuyTrinhsApi")]
    public class BuocQuyTrinhsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var buocquytrinhs = _context.BuocQuyTrinhs.Select(i => new {
                i.ID,
                i.TenBuocQuyTrinh,
                i.IDQuyTrinh,
                i.SoThuTu,
                i.UserBuocQuyTrinhs
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(buocquytrinhs, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new BuocQuyTrinh();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.BuocQuyTrinhs.Add(model);
            await _context.SaveChangesAsync();


            if (values.Contains("UserBuocQuyTrinhs"))
            {
                JArray ids = (JArray)values["UserBuocQuyTrinhs"];
                int[] arrIds = ids.ToObject<int[]>();
                foreach (var aId in arrIds)
                {
                    model.UserBuocQuyTrinhs.Add(new UserBuocQuyTrinh
                    {
                        UserID = aId,
                        BuocQuyTrinhId = model.ID
                    });
                }
            }
            await _context.SaveChangesAsync();
            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.BuocQuyTrinhs.Include(x => x.UserBuocQuyTrinhs).FirstOrDefaultAsync(item => item.ID == key);
            if(model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");

            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();

            if (values.Contains("UserBuocQuyTrinhs"))
            {
                JArray ids = (JArray)values["UserBuocQuyTrinhs"];
                int[] arrIds = ids.ToObject<int[]>();
                _context.UserBuocQuyTrinhs.RemoveRange(model.UserBuocQuyTrinhs);
                foreach (var aId in arrIds)
                {
                    model.UserBuocQuyTrinhs.Add(new UserBuocQuyTrinh
                    {
                        UserID = aId,
                        BuocQuyTrinhId = model.ID
                    });
                }
            }
            await _context.SaveChangesAsync();
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpDelete]
        public async Task Delete(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.BuocQuyTrinhs.FirstOrDefaultAsync(item => item.ID == key);
            _context.BuocQuyTrinhs.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(BuocQuyTrinh model, IDictionary values) {
            string ID = nameof(BuocQuyTrinh.ID);
            string TEN_BUOC_QUY_TRINH = nameof(BuocQuyTrinh.TenBuocQuyTrinh);
            string IDQUY_TRINH = nameof(BuocQuyTrinh.IDQuyTrinh);
            string SO_THU_TU = nameof(BuocQuyTrinh.SoThuTu);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_BUOC_QUY_TRINH)) {
                model.TenBuocQuyTrinh = Convert.ToString(values[TEN_BUOC_QUY_TRINH]);
            }

            if(values.Contains(IDQUY_TRINH)) {
                model.IDQuyTrinh = values[IDQUY_TRINH] != null ? Convert.ToInt32(values[IDQUY_TRINH]) : (int?)null;
            }

            if(values.Contains(SO_THU_TU)) {
                model.SoThuTu = values[SO_THU_TU] != null ? Convert.ToInt32(values[SO_THU_TU]) : (int?)null;
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