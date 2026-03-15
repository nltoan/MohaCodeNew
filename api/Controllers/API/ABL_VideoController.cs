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
    [Route("api/ABL_Video/{action}", Name = "ABL_VideoApi")]
    public class ABL_VideoController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var abl_video = _context.ABL_Video.Select(i => new {
                i.ID,
                i.LinkVideo,
                i.ThuTu,
                i.MoTa,
                i.IDAlbumVideo,
                i.LinkDownloadVideo,
                i.AnhDaiDien
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(abl_video, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ABL_Video();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ABL_Video.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ABL_Video.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ABL_Video.FirstOrDefaultAsync(item => item.ID == key);

            _context.ABL_Video.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ABL_Video model, IDictionary values) {
            string ID = nameof(ABL_Video.ID);
            string LINK_VIDEO = nameof(ABL_Video.LinkVideo);
            string THU_TU = nameof(ABL_Video.ThuTu);
            string MO_TA = nameof(ABL_Video.MoTa);
            string IDALBUM_VIDEO = nameof(ABL_Video.IDAlbumVideo);
            string LINK_DOWNLOAD_VIDEO = nameof(ABL_Video.LinkDownloadVideo);
            string ANH_DAI_DIEN = nameof(ABL_Video.AnhDaiDien);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(LINK_VIDEO)) {
                model.LinkVideo = Convert.ToString(values[LINK_VIDEO]);
            }

            if(values.Contains(THU_TU)) {
                model.ThuTu = values[THU_TU] != null ? Convert.ToInt32(values[THU_TU]) : (int?)null;
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(IDALBUM_VIDEO)) {
                model.IDAlbumVideo = values[IDALBUM_VIDEO] != null ? Convert.ToInt32(values[IDALBUM_VIDEO]) : (int?)null;
            }

            if(values.Contains(LINK_DOWNLOAD_VIDEO)) {
                model.LinkDownloadVideo = Convert.ToString(values[LINK_DOWNLOAD_VIDEO]);
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