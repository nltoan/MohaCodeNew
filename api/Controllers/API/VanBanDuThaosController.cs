using API.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace API.Controllers
{
    [Authorize]
    [Route("api/VanBanDuThaos/{action}", Name = "VanBanDuThaosApi")]
    public class VanBanDuThaosController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var source = _context.VanBanDuThaos
                .Include(x => x.VanBanDuThao_CoQuanBanHanhs)
                .Include(x => x.VanBanDuThao_LinhVucs)
                .Include(x => x.VanBanDuThao_GopY)
                .Select(i => i);

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(source, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var model = new VanBanDuThao();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            _context.VanBanDuThaos.Add(model);
            await _context.SaveChangesAsync();

            if (values.Contains("VanBanDuThao_CoQuanBanHanhs"))
            {
                JArray ids = (JArray)values["VanBanDuThao_CoQuanBanHanhs"];
                int[] arrIds = ids.ToObject<int[]>();
                foreach (var aId in arrIds)
                {
                    model.VanBanDuThao_CoQuanBanHanhs.Add(new VanBanDuThao_CoQuanBanHanhs
                    {
                        CoQuanID = aId,
                        VanBanDuThaoID = model.ID
                    });
                }
            }
            if (values.Contains("VanBanDuThao_LinhVucs"))
            {
                JArray ids = (JArray)values["VanBanDuThao_LinhVucs"];
                int[] arrIds = ids.ToObject<int[]>();
                foreach (var aId in arrIds)
                {
                    model.VanBanDuThao_LinhVucs.Add(new VanBanDuThao_LinhVucs
                    {
                        LinhVucID = aId,
                        VanBanDuThaoID = model.ID
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Request.CreateResponse(HttpStatusCode.Created, new { model.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VanBanDuThaos
                                .Include(x => x.VanBanDuThao_CoQuanBanHanhs)
                                .Include(x => x.VanBanDuThao_LinhVucs)
                                .FirstOrDefaultAsync(item => item.ID == key);
            if (model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");

            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            if (values.Contains("VanBanDuThao_CoQuanBanHanhs"))
            {
                JArray ids = (JArray)values["VanBanDuThao_CoQuanBanHanhs"];
                int[] arrIds = ids.ToObject<int[]>();
                _context.VanBanDuThao_CoQuanBanHanhs.RemoveRange(model.VanBanDuThao_CoQuanBanHanhs);
                foreach (var aId in arrIds)
                {
                    model.VanBanDuThao_CoQuanBanHanhs.Add(new VanBanDuThao_CoQuanBanHanhs
                    {
                        CoQuanID = aId,
                        VanBanDuThaoID = model.ID
                    });
                }
            }
            if (values.Contains("VanBanDuThao_LinhVucs"))
            {
                JArray ids = (JArray)values["VanBanDuThao_LinhVucs"];
                int[] arrIds = ids.ToObject<int[]>();
                _context.VanBanDuThao_LinhVucs.RemoveRange(model.VanBanDuThao_LinhVucs);
                foreach (var aId in arrIds)
                {
                    model.VanBanDuThao_LinhVucs.Add(new VanBanDuThao_LinhVucs
                    {
                        LinhVucID = aId,
                        VanBanDuThaoID = model.ID
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpDelete]
        public async Task Delete(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VanBanDuThaos.FirstOrDefaultAsync(item => item.ID == key);

            if (model != null)
            {
                _context.VanBanDuThaos.Remove(model);
                await _context.SaveChangesAsync();
            }
        }

        private void PopulateModel(VanBanDuThao model, IDictionary values)
        {
            string ID_HTVB = nameof(VanBanDuThao.ID_HinhThucVanBan);
            string TIEU_DE = nameof(VanBanDuThao.TieuDe);
            string TRICH_YEU = nameof(VanBanDuThao.TrichYeu);
            string NGAY_BD = nameof(VanBanDuThao.NgayBatDauLayYKien);
            string NGAY_HH = nameof(VanBanDuThao.NgayHetHanLayYKien);
            string TRANG_THAI = nameof(VanBanDuThao.TrangThai);
            string LANG = nameof(VanBanDuThao.Lang);
            string NOI_DUNG = nameof(VanBanDuThao.NoiDung);

            if (values.Contains(ID_HTVB)) model.ID_HinhThucVanBan = values[ID_HTVB] != null ? Convert.ToInt32(values[ID_HTVB]) : (int?)null;
            if (values.Contains(TIEU_DE)) model.TieuDe = Convert.ToString(values[TIEU_DE]);
            if (values.Contains(TRICH_YEU)) model.TrichYeu = Convert.ToString(values[TRICH_YEU]);
            if (values.Contains(NGAY_BD)) model.NgayBatDauLayYKien = values[NGAY_BD] != null ? Convert.ToDateTime(values[NGAY_BD]) : (DateTime?)null;
            if (values.Contains(NGAY_HH)) model.NgayHetHanLayYKien = values[NGAY_HH] != null ? Convert.ToDateTime(values[NGAY_HH]) : (DateTime?)null;
            if (values.Contains(TRANG_THAI)) model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            if (values.Contains(LANG)) model.Lang = values[LANG] != null ? Convert.ToInt32(values[LANG]) : (int?)null;
            if (values.Contains(NOI_DUNG)) model.NoiDung = Convert.ToString(values[NOI_DUNG]);
        }

        private string GetFullErrorMessage(ModelStateDictionary modelState)
        {
            var messages = new List<string>();
            foreach (var entry in modelState)
                foreach (var error in entry.Value.Errors)
                    messages.Add(error.ErrorMessage);
            return String.Join(" ", messages);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) _context.Dispose();
            base.Dispose(disposing);
        }
    }
}