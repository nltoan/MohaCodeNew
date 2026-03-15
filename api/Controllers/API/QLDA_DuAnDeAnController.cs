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
    [Route("api/QLDA_DuAnDeAn/{action}", Name = "QLDA_DuAnDeAnApi")]
    public class QLDA_DuAnDeAnController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var qlda_duandean = _context.QLDA_DuAnDeAn.Select(i => new {
                i.id,
                i.IDCha,
                i.Ten,
                i.NoiDung,
                i.PhamViThucHienID,
                i.GiaiDoanThucHienID,
                i.PhamVi,
                i.GiaiDoan,
                i.LinhVucID,
                i.DonViChuTriID,
                i.DonViThucHien,
                i.DonViPhoiHop,
                i.TrangThaiDuAn,
                i.TrangThai,
                i.LoaiID,
                i.NgayTao,
                i.TuKhoa,
                i.NgaybatDau,
                i.NgayKetThuc,
                i.NganSach,
                i.MenhGia,
                i.TenChuDauTu,
                i.TenGoiThau,
                i.GiaGoiThau,
                i.FileDinhKem,
                i.NgayHetHan,
                i.DauThau
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "id" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(qlda_duandean, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new QLDA_DuAnDeAn();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.QLDA_DuAnDeAn.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.id });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.QLDA_DuAnDeAn.FirstOrDefaultAsync(item => item.id == key);
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
            var model = await _context.QLDA_DuAnDeAn.FirstOrDefaultAsync(item => item.id == key);

            _context.QLDA_DuAnDeAn.Remove(model);
            await _context.SaveChangesAsync();
        }


        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_DuAnDeAnLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.QLDA_DuAnDeAn
                         orderby i.Ten
                         select new {
                             Value = i.id,
                             Text = i.Ten
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_GiaiDoanLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.QLDA_GiaiDoan
                         orderby i.Ten
                         select new {
                             Value = i.ID,
                             Text = i.Ten
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_LoaiDuAnLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.QLDA_LoaiDuAn
                         orderby i.Ten
                         select new {
                             Value = i.ID,
                             Text = i.Ten
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_PhamViLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.QLDA_PhamVi
                         orderby i.Ten
                         select new {
                             Value = i.ID,
                             Text = i.Ten
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_LinhVucLookup(DataSourceLoadOptions loadOptions) {
            var lookup = from i in _context.QLDA_LinhVuc
                         orderby i.Ten
                         select new {
                             Value = i.ID,
                             Text = i.Ten
                         };
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(lookup, loadOptions));
        }

        private void PopulateModel(QLDA_DuAnDeAn model, IDictionary values) {
            string ID = nameof(QLDA_DuAnDeAn.id);
            string IDCHA = nameof(QLDA_DuAnDeAn.IDCha);
            string TEN = nameof(QLDA_DuAnDeAn.Ten);
            string NOI_DUNG = nameof(QLDA_DuAnDeAn.NoiDung);
            string PHAM_VI_THUC_HIEN_ID = nameof(QLDA_DuAnDeAn.PhamViThucHienID);
            string GIAI_DOAN_THUC_HIEN_ID = nameof(QLDA_DuAnDeAn.GiaiDoanThucHienID);
            string PHAM_VI = nameof(QLDA_DuAnDeAn.PhamVi);
            string GIAI_DOAN = nameof(QLDA_DuAnDeAn.GiaiDoan);
            string LINH_VUC_ID = nameof(QLDA_DuAnDeAn.LinhVucID);
            string DON_VI_CHU_TRI_ID = nameof(QLDA_DuAnDeAn.DonViChuTriID);
            string DON_VI_THUC_HIEN = nameof(QLDA_DuAnDeAn.DonViThucHien);
            string DON_VI_PHOI_HOP = nameof(QLDA_DuAnDeAn.DonViPhoiHop);
            string TRANG_THAI_DU_AN = nameof(QLDA_DuAnDeAn.TrangThaiDuAn);
            string TRANG_THAI = nameof(QLDA_DuAnDeAn.TrangThai);
            string LOAI_ID = nameof(QLDA_DuAnDeAn.LoaiID);
            string NGAY_TAO = nameof(QLDA_DuAnDeAn.NgayTao);
            string TU_KHOA = nameof(QLDA_DuAnDeAn.TuKhoa);
            string NGAYBAT_DAU = nameof(QLDA_DuAnDeAn.NgaybatDau);
            string NGAY_KET_THUC = nameof(QLDA_DuAnDeAn.NgayKetThuc);
            string NGAN_SACH = nameof(QLDA_DuAnDeAn.NganSach);
            string MENH_GIA = nameof(QLDA_DuAnDeAn.MenhGia);
            string TEN_CHU_DAU_TU = nameof(QLDA_DuAnDeAn.TenChuDauTu);
            string TEN_GOI_THAU = nameof(QLDA_DuAnDeAn.TenGoiThau);
            string GIA_GOI_THAU = nameof(QLDA_DuAnDeAn.GiaGoiThau);
            string FILE_DINH_KEM = nameof(QLDA_DuAnDeAn.FileDinhKem);
            string NGAY_HET_HAN = nameof(QLDA_DuAnDeAn.NgayHetHan);
            string DAU_THAU = nameof(QLDA_DuAnDeAn.DauThau);

            if(values.Contains(ID)) {
                model.id = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(IDCHA)) {
                model.IDCha = values[IDCHA] != null ? Convert.ToInt32(values[IDCHA]) : (int?)null;
            }

            if(values.Contains(TEN)) {
                model.Ten = Convert.ToString(values[TEN]);
            }

            if(values.Contains(NOI_DUNG)) {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if(values.Contains(PHAM_VI_THUC_HIEN_ID)) {
                model.PhamViThucHienID = values[PHAM_VI_THUC_HIEN_ID] != null ? Convert.ToInt32(values[PHAM_VI_THUC_HIEN_ID]) : (int?)null;
            }

            if(values.Contains(GIAI_DOAN_THUC_HIEN_ID)) {
                model.GiaiDoanThucHienID = values[GIAI_DOAN_THUC_HIEN_ID] != null ? Convert.ToInt32(values[GIAI_DOAN_THUC_HIEN_ID]) : (int?)null;
            }

            if(values.Contains(PHAM_VI)) {
                model.PhamVi = values[PHAM_VI] != null ? Convert.ToInt32(values[PHAM_VI]) : (int?)null;
            }

            if(values.Contains(GIAI_DOAN)) {
                model.GiaiDoan = values[GIAI_DOAN] != null ? Convert.ToInt32(values[GIAI_DOAN]) : (int?)null;
            }

            if(values.Contains(LINH_VUC_ID)) {
                model.LinhVucID = values[LINH_VUC_ID] != null ? Convert.ToInt32(values[LINH_VUC_ID]) : (int?)null;
            }

            if(values.Contains(DON_VI_CHU_TRI_ID)) {
                model.DonViChuTriID = values[DON_VI_CHU_TRI_ID] != null ? Convert.ToInt32(values[DON_VI_CHU_TRI_ID]) : (int?)null;
            }

            if(values.Contains(DON_VI_THUC_HIEN)) {
                model.DonViThucHien = Convert.ToString(values[DON_VI_THUC_HIEN]);
            }

            if(values.Contains(DON_VI_PHOI_HOP)) {
                model.DonViPhoiHop = Convert.ToString(values[DON_VI_PHOI_HOP]);
            }

            if(values.Contains(TRANG_THAI_DU_AN)) {
                model.TrangThaiDuAn = values[TRANG_THAI_DU_AN] != null ? Convert.ToInt32(values[TRANG_THAI_DU_AN]) : (int?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(LOAI_ID)) {
                model.LoaiID = values[LOAI_ID] != null ? Convert.ToInt32(values[LOAI_ID]) : (int?)null;
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = values[NGAY_TAO] != null ? Convert.ToDateTime(values[NGAY_TAO]) : (DateTime?)null;
            }

            if(values.Contains(TU_KHOA)) {
                model.TuKhoa = Convert.ToString(values[TU_KHOA]);
            }

            if(values.Contains(NGAYBAT_DAU)) {
                model.NgaybatDau = values[NGAYBAT_DAU] != null ? Convert.ToDateTime(values[NGAYBAT_DAU]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_KET_THUC)) {
                model.NgayKetThuc = values[NGAY_KET_THUC] != null ? Convert.ToDateTime(values[NGAY_KET_THUC]) : (DateTime?)null;
            }

            if(values.Contains(NGAN_SACH)) {
                model.NganSach = values[NGAN_SACH] != null ? Convert.ToInt32(values[NGAN_SACH]) : (int?)null;
            }

            if(values.Contains(MENH_GIA)) {
                model.MenhGia = Convert.ToString(values[MENH_GIA]);
            }

            if(values.Contains(TEN_CHU_DAU_TU)) {
                model.TenChuDauTu = Convert.ToString(values[TEN_CHU_DAU_TU]);
            }

            if(values.Contains(TEN_GOI_THAU)) {
                model.TenGoiThau = Convert.ToString(values[TEN_GOI_THAU]);
            }

            if(values.Contains(GIA_GOI_THAU)) {
                model.GiaGoiThau = Convert.ToString(values[GIA_GOI_THAU]);
            }

            if(values.Contains(FILE_DINH_KEM)) {
                model.FileDinhKem = Convert.ToString(values[FILE_DINH_KEM]);
            }

            if(values.Contains(NGAY_HET_HAN)) {
                model.NgayHetHan = values[NGAY_HET_HAN] != null ? Convert.ToDateTime(values[NGAY_HET_HAN]) : (DateTime?)null;
            }

            if(values.Contains(DAU_THAU)) {
                model.DauThau = values[DAU_THAU] != null ? Convert.ToInt32(values[DAU_THAU]) : (int?)null;
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