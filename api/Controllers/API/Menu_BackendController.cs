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
    [Route("api/Menu_Backend/{action}", Name = "Menu_BackendApi")]
    public class Menu_BackendController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var menu_backend = _context.Menu_Backend.Select(i => new {
                i.ID,
                i.TenMenu,
                i.URL,
                i.STT,
                i.IDMenuCha,
                i.QuyenTruyCap,
                i.FunctionGetNoti,
                i.CoCanhBao,
                i.QuyenKhongTruyCap,
                i.ClassCSS,
                i.HienThi,
                i.TenTruyCap,
                i.FunctionTruyCap
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(menu_backend, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new Menu_Backend();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Menu_Backend.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Menu_Backend.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.Menu_Backend.FirstOrDefaultAsync(item => item.ID == key);

            _context.Menu_Backend.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> Menu_BackendLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.Menu_Backend
                         orderby i.TenMenu
                         select new {
                             Value = i.ID,
                             Text = i.TenMenu
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(Menu_Backend model, IDictionary values) {
            string ID = nameof(Menu_Backend.ID);
            string TEN_MENU = nameof(Menu_Backend.TenMenu);
            string URL = nameof(Menu_Backend.URL);
            string STT = nameof(Menu_Backend.STT);
            string IDMENU_CHA = nameof(Menu_Backend.IDMenuCha);
            string QUYEN_TRUY_CAP = nameof(Menu_Backend.QuyenTruyCap);
            string FUNCTION_GET_NOTI = nameof(Menu_Backend.FunctionGetNoti);
            string CO_CANH_BAO = nameof(Menu_Backend.CoCanhBao);
            string QUYEN_KHONG_TRUY_CAP = nameof(Menu_Backend.QuyenKhongTruyCap);
            string CLASS_CSS = nameof(Menu_Backend.ClassCSS);
            string HIEN_THI = nameof(Menu_Backend.HienThi);
            string TEN_TRUY_CAP = nameof(Menu_Backend.TenTruyCap);
            string FUNCTION_TRUY_CAP = nameof(Menu_Backend.FunctionTruyCap);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_MENU)) {
                model.TenMenu = Convert.ToString(values[TEN_MENU]);
            }

            if(values.Contains(URL)) {
                model.URL = Convert.ToString(values[URL]);
            }

            if(values.Contains(STT)) {
                model.STT = Convert.ToInt32(values[STT]);
            }

            if(values.Contains(IDMENU_CHA)) {
                model.IDMenuCha = values[IDMENU_CHA] != null ? Convert.ToInt32(values[IDMENU_CHA]) : (int?)null;
            }

            if(values.Contains(QUYEN_TRUY_CAP)) {
                model.QuyenTruyCap = Convert.ToString(values[QUYEN_TRUY_CAP]);
            }

            if(values.Contains(FUNCTION_GET_NOTI)) {
                model.FunctionGetNoti = Convert.ToString(values[FUNCTION_GET_NOTI]);
            }

            if(values.Contains(CO_CANH_BAO)) {
                model.CoCanhBao = values[CO_CANH_BAO] != null ? Convert.ToInt32(values[CO_CANH_BAO]) : (int?)null;
            }

            if(values.Contains(QUYEN_KHONG_TRUY_CAP)) {
                model.QuyenKhongTruyCap = Convert.ToString(values[QUYEN_KHONG_TRUY_CAP]);
            }

            if(values.Contains(CLASS_CSS)) {
                model.ClassCSS = Convert.ToString(values[CLASS_CSS]);
            }

            if(values.Contains(HIEN_THI)) {
                model.HienThi = values[HIEN_THI] != null ? Convert.ToInt32(values[HIEN_THI]) : (int?)null;
            }

            if(values.Contains(TEN_TRUY_CAP)) {
                model.TenTruyCap = Convert.ToString(values[TEN_TRUY_CAP]);
            }

            if(values.Contains(FUNCTION_TRUY_CAP)) {
                model.FunctionTruyCap = Convert.ToString(values[FUNCTION_TRUY_CAP]);
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