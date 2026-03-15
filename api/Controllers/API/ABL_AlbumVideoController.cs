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
    [Route("api/ABL_AlbumVideo/{action}", Name = "ABL_AlbumVideoApi")]
    public class ABL_AlbumVideoController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var abl_albumvideo = _context.ABL_AlbumVideo.Select(i => new {
                i.ID,
                i.TieuDe,
                i.MoTa,
                i.ThoiGianTao,
                i.TrangThai,
                i.IDChuyenMucAlbumVideo,
                i.TacGia,
                i.DanhSachChuyenMuc,
                i.ThoiGianXuatBan,
                i.Link,
                i.Poster,
                i.AnhDaiDien
            });

            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(abl_albumvideo, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new ABL_AlbumVideo();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.ABL_AlbumVideo.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.ABL_AlbumVideo.FirstOrDefaultAsync(item => item.ID == key);
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
            var model = await _context.ABL_AlbumVideo.FirstOrDefaultAsync(item => item.ID == key);

            _context.ABL_AlbumVideo.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(ABL_AlbumVideo model, IDictionary values) {
            string ID = nameof(ABL_AlbumVideo.ID);
            string TIEU_DE = nameof(ABL_AlbumVideo.TieuDe);
            string MO_TA = nameof(ABL_AlbumVideo.MoTa);
            string THOI_GIAN_TAO = nameof(ABL_AlbumVideo.ThoiGianTao);
            string TRANG_THAI = nameof(ABL_AlbumVideo.TrangThai);
            string IDCHUYEN_MUC_ALBUM_VIDEO = nameof(ABL_AlbumVideo.IDChuyenMucAlbumVideo);
            string TAC_GIA = nameof(ABL_AlbumVideo.TacGia);
            string DANH_SACH_CHUYEN_MUC = nameof(ABL_AlbumVideo.DanhSachChuyenMuc);
            string THOI_GIAN_XUAT_BAN = nameof(ABL_AlbumVideo.ThoiGianXuatBan);
            string LINK = nameof(ABL_AlbumVideo.Link);
            string POSTER = nameof(ABL_AlbumVideo.Poster);
            string ANH_DAI_DIEN = nameof(ABL_AlbumVideo.AnhDaiDien);

            if (values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TIEU_DE)) {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(THOI_GIAN_TAO)) {
                model.ThoiGianTao = values[THOI_GIAN_TAO] != null ? Convert.ToDateTime(values[THOI_GIAN_TAO]) : (DateTime?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(IDCHUYEN_MUC_ALBUM_VIDEO)) {
                model.IDChuyenMucAlbumVideo = values[IDCHUYEN_MUC_ALBUM_VIDEO] != null ? Convert.ToInt32(values[IDCHUYEN_MUC_ALBUM_VIDEO]) : (int?)null;
            }

            if(values.Contains(TAC_GIA)) {
                model.TacGia = Convert.ToString(values[TAC_GIA]);
            }

            if(values.Contains(DANH_SACH_CHUYEN_MUC)) {
                model.DanhSachChuyenMuc = Convert.ToString(values[DANH_SACH_CHUYEN_MUC]);
            }

            if(values.Contains(THOI_GIAN_XUAT_BAN)) {
                model.ThoiGianXuatBan = values[THOI_GIAN_XUAT_BAN] != null ? Convert.ToDateTime(values[THOI_GIAN_XUAT_BAN]) : (DateTime?)null;
            }

            if(values.Contains(LINK)) {
                model.Link = Convert.ToString(values[LINK]);
            }

            if (values.Contains(POSTER))
            {
                model.Poster = Convert.ToString(values[POSTER]);
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