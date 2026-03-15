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
    [Route("api/SuKienHoiThaos/{action}", Name = "SuKienHoiThaosApi")]
    public class SuKienHoiThaosController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var sukienhoithaos = _context.SuKienHoiThaos.Select(i => new {
                i.ID,
                i.TenHoiThao,
                i.LoaiHoiThao,
                i.ThoiGianTu,
                i.ThoiGianDen,
                i.DonViTaiTro,
                i.DiaDiemToChuc,
                i.ThanhPhanThamGia,
                i.DonViToChucChinh,
                i.FileNoiDung,
                i.NoiDungThongTinMoi,
                i.ChoPhepDangKy,
                i.TrangThai,
                i.Lang,
                i.AnhDaiDien
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(sukienhoithaos, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new SuKienHoiThao();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.SuKienHoiThaos.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.SuKienHoiThaos.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.SuKienHoiThaos.FirstOrDefaultAsync(item => item.ID == key);

            _context.SuKienHoiThaos.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(SuKienHoiThao model, IDictionary values) {
            string ID = nameof(SuKienHoiThao.ID);
            string TEN_HOI_THAO = nameof(SuKienHoiThao.TenHoiThao);
            string LOAI_HOI_THAO = nameof(SuKienHoiThao.LoaiHoiThao);
            string THOI_GIAN_TU = nameof(SuKienHoiThao.ThoiGianTu);
            string THOI_GIAN_DEN = nameof(SuKienHoiThao.ThoiGianDen);
            string DON_VI_TAI_TRO = nameof(SuKienHoiThao.DonViTaiTro);
            string DIA_DIEM_TO_CHUC = nameof(SuKienHoiThao.DiaDiemToChuc);
            string THANH_PHAN_THAM_GIA = nameof(SuKienHoiThao.ThanhPhanThamGia);
            string DON_VI_TO_CHUC_CHINH = nameof(SuKienHoiThao.DonViToChucChinh);
            string FILE_NOI_DUNG = nameof(SuKienHoiThao.FileNoiDung);
            string NOI_DUNG_THONG_TIN_MOI = nameof(SuKienHoiThao.NoiDungThongTinMoi);
            string CHO_PHEP_DANG_KY = nameof(SuKienHoiThao.ChoPhepDangKy);
            string TRANG_THAI = nameof(SuKienHoiThao.TrangThai);
            string LANG = nameof(SuKienHoiThao.Lang);
            string ANH_DAI_DIEN = nameof(SuKienHoiThao.AnhDaiDien);

            if (values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TEN_HOI_THAO)) {
                model.TenHoiThao = Convert.ToString(values[TEN_HOI_THAO]);
            }

            if(values.Contains(LOAI_HOI_THAO)) {
                model.LoaiHoiThao = values[LOAI_HOI_THAO] != null ? Convert.ToInt32(values[LOAI_HOI_THAO]) : (int?)null;
            }

            if(values.Contains(THOI_GIAN_TU)) {
                model.ThoiGianTu = values[THOI_GIAN_TU] != null ? Convert.ToDateTime(values[THOI_GIAN_TU]) : (DateTime?)null;
            }

            if(values.Contains(THOI_GIAN_DEN)) {
                model.ThoiGianDen = values[THOI_GIAN_DEN] != null ? Convert.ToDateTime(values[THOI_GIAN_DEN]) : (DateTime?)null;
            }

            if(values.Contains(DON_VI_TAI_TRO)) {
                model.DonViTaiTro = Convert.ToString(values[DON_VI_TAI_TRO]);
            }

            if(values.Contains(DIA_DIEM_TO_CHUC)) {
                model.DiaDiemToChuc = Convert.ToString(values[DIA_DIEM_TO_CHUC]);
            }

            if(values.Contains(THANH_PHAN_THAM_GIA)) {
                model.ThanhPhanThamGia = Convert.ToString(values[THANH_PHAN_THAM_GIA]);
            }

            if(values.Contains(DON_VI_TO_CHUC_CHINH)) {
                model.DonViToChucChinh = Convert.ToString(values[DON_VI_TO_CHUC_CHINH]);
            }

            if(values.Contains(FILE_NOI_DUNG)) {
                model.FileNoiDung = Convert.ToString(values[FILE_NOI_DUNG]);
            }

            if(values.Contains(NOI_DUNG_THONG_TIN_MOI)) {
                model.NoiDungThongTinMoi = Convert.ToString(values[NOI_DUNG_THONG_TIN_MOI]);
            }

            if(values.Contains(CHO_PHEP_DANG_KY)) {
                model.ChoPhepDangKy = values[CHO_PHEP_DANG_KY] != null ? Convert.ToInt32(values[CHO_PHEP_DANG_KY]) : (int?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToInt32(values[TRANG_THAI]);
            }

            if (values.Contains(LANG))
            {
                model.Lang = Convert.ToInt32(values[LANG]);
            }
            if (values.Contains(ANH_DAI_DIEN))
            {
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