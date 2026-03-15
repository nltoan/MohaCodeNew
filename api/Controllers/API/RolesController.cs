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
using API.OAuth.Providers;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    //[PermissionAuthorize("manage-role")]
    [Authorize]
    [Route("api/Roles/{action}", Name = "RolesApi")]
    public class RolesController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var roles = _context.Roles
                .Include(x => x.RolePermissions);

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(roles, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new Role();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);
            model.Removable = 1;
            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.Roles.Add(model);
            await _context.SaveChangesAsync();
            if (values.Contains("RolePermissions"))
            {
                JArray ids = (JArray)values["RolePermissions"];
                int[] arrIds = ids.ToObject<int[]>();
                foreach (var aId in arrIds)
                {
                    model.RolePermissions.Add(new RolePermission
                    {
                        RoleId = model.ID,
                        PermissionId = aId
                    });
                }
            }
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Roles.Include(x=>x.RolePermissions).FirstOrDefaultAsync(item => item.ID == key);
            if(model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");

            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));
            await _context.SaveChangesAsync();

            if (values.Contains("RolePermissions"))
            {
                JArray ids = (JArray)values["RolePermissions"];
                int[] arrIds = ids.ToObject<int[]>();
                _context.RolePermissions.RemoveRange(model.RolePermissions);
                foreach (var aId in arrIds)
                {
                    model.RolePermissions.Add(new RolePermission
                    {
                        RoleId = model.ID,
                        PermissionId = aId
                    }) ;
                }
            }
            await _context.SaveChangesAsync();
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpDelete]
        public async Task Delete(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.Roles.FirstOrDefaultAsync(item => item.ID == key);

            _context.Roles.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(Role model, IDictionary values) {
            string ID = nameof(Role.ID);
            string NAME = nameof(Role.Name);
            string REMOVABLE = nameof(Role.Removable);
            string DESCRIPTION = nameof(Role.Description);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(NAME)) {
                model.Name = Convert.ToString(values[NAME]);
            }

            if(values.Contains(REMOVABLE)) {
                model.Removable = Convert.ToByte(values[REMOVABLE]);
            }

            if(values.Contains(DESCRIPTION)) {
                model.Description = Convert.ToString(values[DESCRIPTION]);
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