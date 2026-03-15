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
    [Route("api/Menu_FrontEnd/{action}", Name = "Menu_FrontEndApi")]
    public class Menu_FrontEndController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var menu_frontend = _context.Menu_FrontEnd.Select(i => new {
                i.ID,
                i.TenMenu,
                i.URL,
                i.STT,
                i.IDMenuCha,
                i.ClassCSS,
                i.HienThi,
                i.IconDaiDien
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(menu_frontend, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new Menu_FrontEnd();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Menu_FrontEnd.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Menu_FrontEnd.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.Menu_FrontEnd.FirstOrDefaultAsync(item => item.ID == key);

            _context.Menu_FrontEnd.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(Menu_FrontEnd model, IDictionary values) {
            string ID = nameof(Menu_FrontEnd.ID);
            string TEN_MENU = nameof(Menu_FrontEnd.TenMenu);
            string URL = nameof(Menu_FrontEnd.URL);
            string STT = nameof(Menu_FrontEnd.STT);
            string IDMENU_CHA = nameof(Menu_FrontEnd.IDMenuCha);
            string CLASS_CSS = nameof(Menu_FrontEnd.ClassCSS);
            string HIEN_THI = nameof(Menu_FrontEnd.HienThi);
            string ICON_DAI_DIEN = nameof(Menu_FrontEnd.IconDaiDien);

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

            if(values.Contains(CLASS_CSS)) {
                model.ClassCSS = Convert.ToString(values[CLASS_CSS]);
            }

            if(values.Contains(HIEN_THI)) {
                model.HienThi = values[HIEN_THI] != null ? Convert.ToInt32(values[HIEN_THI]) : (int?)null;
            }

            if(values.Contains(ICON_DAI_DIEN)) {
                model.IconDaiDien = Convert.ToString(values[ICON_DAI_DIEN]);
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