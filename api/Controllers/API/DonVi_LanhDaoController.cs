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
    [Route("api/DonVi_LanhDao/{action}", Name = "DonVi_LanhDaoApi")]
    public class DonVi_LanhDaoController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var donvi_lanhdao = _context.DonVi_LanhDao.Select(i => new {
                i.ID,
                i.IDLanhDao,
                i.IDDonVi,
                i.Hang,
                i.Cot,
                i.ChucVu,
                i.PhuTrach,
                i.ChucNangNhiemVu,
                i.ThongTinLanhDao,
                i.CoCauToChuc
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(donvi_lanhdao, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new DonVi_LanhDao();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.DonVi_LanhDao.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.DonVi_LanhDao.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.DonVi_LanhDao.FirstOrDefaultAsync(item => item.ID == key);

            _context.DonVi_LanhDao.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(DonVi_LanhDao model, IDictionary values) {
            string ID = nameof(DonVi_LanhDao.ID);
            string IDLANH_DAO = nameof(DonVi_LanhDao.IDLanhDao);
            string IDDON_VI = nameof(DonVi_LanhDao.IDDonVi);
            string HANG = nameof(DonVi_LanhDao.Hang);
            string COT = nameof(DonVi_LanhDao.Cot);
            string CHUC_VU = nameof(DonVi_LanhDao.ChucVu);
            string PHU_TRACH = nameof(DonVi_LanhDao.PhuTrach);
            string CHUC_NANG_NHIEM_VU = nameof(DonVi_LanhDao.ChucNangNhiemVu);

            if(values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(IDLANH_DAO)) {
                model.IDLanhDao = values[IDLANH_DAO] != null ? Convert.ToInt32(values[IDLANH_DAO]) : (int?)null;
            }

            if(values.Contains(IDDON_VI)) {
                model.IDDonVi = values[IDDON_VI] != null ? Convert.ToInt32(values[IDDON_VI]) : (int?)null;
            }

            if(values.Contains(HANG)) {
                model.Hang = values[HANG] != null ? Convert.ToInt32(values[HANG]) : (int?)null;
            }

            if(values.Contains(COT)) {
                model.Cot = values[COT] != null ? Convert.ToInt32(values[COT]) : (int?)null;
            }

            if(values.Contains(CHUC_VU)) {
                model.ChucVu = Convert.ToString(values[CHUC_VU]);
            }

            if(values.Contains(PHU_TRACH)) {
                model.PhuTrach = values[PHU_TRACH] != null ? Convert.ToInt32(values[PHU_TRACH]) : (int?)null;
            }

            if(values.Contains(CHUC_NANG_NHIEM_VU)) {
                model.ChucNangNhiemVu = Convert.ToString(values[CHUC_NANG_NHIEM_VU]);
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