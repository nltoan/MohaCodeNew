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
    [Route("api/ABL_Audio/{action}", Name = "ABL_AudioApi")]
    public class ABL_AudioController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var abl_audio = _context.ABL_Audio.Select(i => new {
                i.ID,
                i.LinkAudio,
                i.ThuTu,
                i.MoTa,
                i.IDAlbumAudio,
                i.LinkDownloadAudio,
                i.AnhDaiDien
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(abl_audio, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ABL_Audio();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ABL_Audio.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ABL_Audio.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ABL_Audio.FirstOrDefaultAsync(item => item.ID == key);

            _context.ABL_Audio.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ABL_Audio model, IDictionary values) {
            string ID = nameof(ABL_Audio.ID);
            string LINK_AUDIO = nameof(ABL_Audio.LinkAudio);
            string THU_TU = nameof(ABL_Audio.ThuTu);
            string MO_TA = nameof(ABL_Audio.MoTa);
            string IDALBUM_AUDIO = nameof(ABL_Audio.IDAlbumAudio);
            string LINK_DOWNLOAD_AUDIO = nameof(ABL_Audio.LinkDownloadAudio);
            string ANH_DAI_DIEN = nameof(ABL_Audio.AnhDaiDien);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(LINK_AUDIO)) {
                model.LinkAudio = Convert.ToString(values[LINK_AUDIO]);
            }

            if(values.Contains(THU_TU)) {
                model.ThuTu = values[THU_TU] != null ? Convert.ToInt32(values[THU_TU]) : (int?)null;
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(IDALBUM_AUDIO)) {
                model.IDAlbumAudio = values[IDALBUM_AUDIO] != null ? Convert.ToInt32(values[IDALBUM_AUDIO]) : (int?)null;
            }

            if(values.Contains(LINK_DOWNLOAD_AUDIO)) {
                model.LinkDownloadAudio = Convert.ToString(values[LINK_DOWNLOAD_AUDIO]);
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