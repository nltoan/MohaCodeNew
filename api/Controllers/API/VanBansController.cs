using API.Models;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Xml.Linq;

namespace API.Controllers
{
    //[Authorize]
    [Route("api/VanBans/{action}", Name = "VanBansApi")]
    public class VanBansController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions, int? LopVanBanID) {
            var vanbans = _context.VanBans
                .Include(x => x.VanBan_CoQuanBanHanh)
                .Include(x => x.VanBan_LinhVuc)
                .Include(x=>x.VanBan_LopVanBan)
                .Select(i => i);
            if (LopVanBanID != null)
            {
                var sql = @"
                with name_tree as 
                (
                    select i.ID, 0 AS Level
                    from LopVanBan i
                    where i.ID = @ID
	 
                    union all
	 
                    select i.ID, Level+1 AS Level
                    from LopVanBan i
                    join name_tree p on i.LopVanBanCha = p.ID
                )
                SELECT * FROM name_tree ORDER BY Level desc
                ";
                var parents = _context.CollectionFromSql(sql,new Dictionary<string, object> { { "@ID", LopVanBanID } })
                    .Select(x=>x.ID).Cast<int>().ToArray();
                vanbans = vanbans.Where(x => x.VanBan_LopVanBan.Any(y=> parents.Contains(y.LopVanBanID)));
            }
            // If underlying data is a large SQL table, specify PrimaryKey and PaginateViaPrimaryKey.
            // This can make SQL execution plans more efficient.
            // For more detailed information, please refer to this discussion: https://github.com/DevExpress/DevExtreme.AspNet.Data/issues/336.
            // loadOptions.PrimaryKey = new[] { "ID" };
            // loadOptions.PaginateViaPrimaryKey = true;

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(vanbans, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetLookupNguoiKy(DataSourceLoadOptions loadOptions) 
        {
            var vanbans = _context.VanBans
                .Select(i => new {
                    Name = i.NguoiKy
                })
                .Distinct();
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(vanbans, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetLookupChucDanh(DataSourceLoadOptions loadOptions)
        {
            var vanbans = _context.VanBans
                .Select(i => new {
                    Name = i.ChucDanh
                })
                .Distinct();
            return Request.CreateResponse(await DataSourceLoader.LoadAsync(vanbans, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new VanBan();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.VanBans.Add(model);
            await _context.SaveChangesAsync();

            if (values.Contains("VanBan_LopVanBan"))
            {
                JArray ids = (JArray)values["VanBan_LopVanBan"];
                int[] arrIds = ids.ToObject<int[]>();
                foreach (var aId in arrIds)
                {
                    model.VanBan_LopVanBan.Add(new VanBan_LopVanBan
                    {
                        LopVanBanID = aId,
                        VanBanID = model.ID
                    });
                }
            }
            if (values.Contains("VanBan_CoQuanBanHanh"))
            {
                JArray ids = (JArray)values["VanBan_CoQuanBanHanh"];
                int[] arrIds = ids.ToObject<int[]>();
                foreach (var aId in arrIds)
                {
                    model.VanBan_CoQuanBanHanh.Add(new VanBan_CoQuanBanHanh
                    {
                        CoQuanBanHanhID = aId,
                        VanBanID = model.ID
                    });
                }
            }
            if (values.Contains("VanBan_LinhVuc"))
            {
                JArray ids = (JArray)values["VanBan_LinhVuc"];
                int[] arrIds = ids.ToObject<int[]>();
                foreach (var aId in arrIds)
                {
                    model.VanBan_LinhVuc.Add(new VanBan_LinhVuc
                    {
                        LinhVucID = aId,
                        VanBanID = model.ID
                    });
                }
            }
            await _context.SaveChangesAsync();
            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VanBans
                                .Include(x=>x.VanBan_LopVanBan)
                                .Include(x => x.VanBan_CoQuanBanHanh)
                                .Include(x => x.VanBan_LinhVuc)
                                .FirstOrDefaultAsync(item => item.ID == key);
            if(model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");

            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            if (values.Contains("VanBan_LopVanBan"))
            {
                JArray ids = (JArray)values["VanBan_LopVanBan"];
                int[] arrIds = ids.ToObject<int[]>(); 
                _context.VanBan_LopVanBan.RemoveRange(model.VanBan_LopVanBan);
                foreach (var aId in arrIds)
                {
                    model.VanBan_LopVanBan.Add(new VanBan_LopVanBan
                    {
                        LopVanBanID = aId,
                        VanBanID = model.ID
                    });
                }
            }
            if (values.Contains("VanBan_CoQuanBanHanh"))
            {
                JArray ids = (JArray)values["VanBan_CoQuanBanHanh"];
                int[] arrIds = ids.ToObject<int[]>();
                _context.VanBan_CoQuanBanHanh.RemoveRange(model.VanBan_CoQuanBanHanh);
                foreach (var aId in arrIds)
                {
                    model.VanBan_CoQuanBanHanh.Add(new VanBan_CoQuanBanHanh
                    {
                        CoQuanBanHanhID = aId,
                        VanBanID = model.ID
                    });
                }
            }
            if (values.Contains("VanBan_LinhVuc"))
            {
                JArray ids = (JArray)values["VanBan_LinhVuc"];
                int[] arrIds = ids.ToObject<int[]>();
                _context.VanBan_LinhVuc.RemoveRange(model.VanBan_LinhVuc);
                foreach (var aId in arrIds)
                {
                    model.VanBan_LinhVuc.Add(new VanBan_LinhVuc
                    {
                        LinhVucID = aId,
                        VanBanID = model.ID
                    });
                }
            }
            await _context.SaveChangesAsync();
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpDelete]
        public async Task Delete(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.VanBans.FirstOrDefaultAsync(item => item.ID == key);

            _context.VanBans.Remove(model);
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(VanBan model, IDictionary values) {
            string ID = nameof(VanBan.ID);
            string SO_KY_HIEU = nameof(VanBan.SoKyHieu);
            string NGAY_BAN_HANH = nameof(VanBan.NgayBanHanh);
            string NGAY_XUAT_BAN = nameof(VanBan.NgayXuatBan);
            string ID_HINH_THUC_VAN_BAN = nameof(VanBan.ID_HinhThucVanBan);
            string IDS_LINH_VUC = nameof(VanBan.IDs_LinhVuc);
            string IDS_LOP_VAN_BAN = nameof(VanBan.IDs_LopVanBan);
            string IDS_CO_QUAN_BAN_HANH = nameof(VanBan.IDs_CoQuanBanHanh);
            string TRICH_YEU = nameof(VanBan.TrichYeu);
            string NGUOI_KY = nameof(VanBan.NguoiKy);
            string NGAY_CO_HIEU_LUC = nameof(VanBan.NgayCoHieuLuc);
            string NGAY_HET_HAN = nameof(VanBan.NgayHetHan);
            string VAN_BAN_LIEN_QUAN = nameof(VanBan.VanBanLienQuan);
            string FILE_DINH_KEM = nameof(VanBan.FileDinhKem);
            string TRANG_THAI = nameof(VanBan.TrangThai);
            string LANG = nameof(VanBan.Lang);
            string NOI_DUNG = nameof(VanBan.NoiDung);
            string VAN_BAN_CON_HIEU_LUC = nameof(VanBan.VanBanConHieuLuc);
            string GHI_CHU = nameof(VanBan.GhiChu);
            string NGAY_HET_HIEU_LUC1PHAN = nameof(VanBan.NgayHetHieuLuc1Phan);
            string VAN_BAN_BI_TAC_DONG_HIEU_LUC1PHAN = nameof(VanBan.VanBanBiTacDongHieuLuc1Phan);
            string CHUC_DANH = nameof(VanBan.ChucDanh);
            string NGAY_KY_KET = nameof(VanBan.NgayKyKet);
            string NGAY_CONG_BO = nameof(VanBan.NgayCongBo);
            string NGAY_GIA_NHAP = nameof(VanBan.NgayGiaNhap);
            string NGAY_CO_HLVIET_NAM = nameof(VanBan.NgayCoHLVietNam);
            string TINH_TRANG = nameof(VanBan.TinhTrang);
            string FILE_GOC = nameof(VanBan.FileGoc);

            if (values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(SO_KY_HIEU)) {
                model.SoKyHieu = Convert.ToString(values[SO_KY_HIEU]);
            }

            if(values.Contains(NGAY_BAN_HANH)) {
                model.NgayBanHanh = values[NGAY_BAN_HANH] != null ? Convert.ToDateTime(values[NGAY_BAN_HANH]) : (DateTime?)null;
            }

            if (values.Contains(NGAY_XUAT_BAN))
            {
                model.NgayXuatBan = values[NGAY_XUAT_BAN] != null ? Convert.ToDateTime(values[NGAY_XUAT_BAN]) : (DateTime?)null;
            }

            if (values.Contains(ID_HINH_THUC_VAN_BAN)) {
                model.ID_HinhThucVanBan = values[ID_HINH_THUC_VAN_BAN] != null ? Convert.ToInt32(values[ID_HINH_THUC_VAN_BAN]) : (int?)null;
            }

            if(values.Contains(IDS_LINH_VUC)) {
                model.IDs_LinhVuc = Convert.ToString(values[IDS_LINH_VUC]);
            }

            if(values.Contains(IDS_LOP_VAN_BAN)) {
                model.IDs_LopVanBan = Convert.ToString(values[IDS_LOP_VAN_BAN]);
            }

            if(values.Contains(IDS_CO_QUAN_BAN_HANH)) {
                model.IDs_CoQuanBanHanh = Convert.ToString(values[IDS_CO_QUAN_BAN_HANH]);
            }

            if(values.Contains(TRICH_YEU)) {
                model.TrichYeu = Convert.ToString(values[TRICH_YEU]);
            }

            if(values.Contains(NGUOI_KY)) {
                model.NguoiKy = Convert.ToString(values[NGUOI_KY]);
            }

            if(values.Contains(NGAY_CO_HIEU_LUC)) {
                model.NgayCoHieuLuc = values[NGAY_CO_HIEU_LUC] != null ? Convert.ToDateTime(values[NGAY_CO_HIEU_LUC]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_HET_HAN)) {
                model.NgayHetHan = values[NGAY_HET_HAN] != null ? Convert.ToDateTime(values[NGAY_HET_HAN]) : (DateTime?)null;
            }

            if(values.Contains(VAN_BAN_LIEN_QUAN)) {
                model.VanBanLienQuan = Convert.ToString(values[VAN_BAN_LIEN_QUAN]);
            }

            if(values.Contains(FILE_DINH_KEM)) {
                model.FileDinhKem = Convert.ToString(values[FILE_DINH_KEM]);
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = values[TRANG_THAI] != null ? Convert.ToInt32(values[TRANG_THAI]) : (int?)null;
            }

            if(values.Contains(LANG)) {
                model.Lang = values[LANG] != null ? Convert.ToInt32(values[LANG]) : (int?)null;
            }

            if(values.Contains(NOI_DUNG)) {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if(values.Contains(VAN_BAN_CON_HIEU_LUC)) {
                model.VanBanConHieuLuc = values[VAN_BAN_CON_HIEU_LUC] != null ? Convert.ToInt32(values[VAN_BAN_CON_HIEU_LUC]) : (int?)null;
            }

            if(values.Contains(GHI_CHU)) {
                model.GhiChu = Convert.ToString(values[GHI_CHU]);
            }

            if(values.Contains(NGAY_HET_HIEU_LUC1PHAN)) {
                model.NgayHetHieuLuc1Phan = values[NGAY_HET_HIEU_LUC1PHAN] != null ? Convert.ToDateTime(values[NGAY_HET_HIEU_LUC1PHAN]) : (DateTime?)null;
            }

            if(values.Contains(VAN_BAN_BI_TAC_DONG_HIEU_LUC1PHAN)) {
                model.VanBanBiTacDongHieuLuc1Phan = Convert.ToString(values[VAN_BAN_BI_TAC_DONG_HIEU_LUC1PHAN]);
            }

            if(values.Contains(CHUC_DANH)) {
                model.ChucDanh = Convert.ToString(values[CHUC_DANH]);
            }

            if(values.Contains(NGAY_KY_KET)) {
                model.NgayKyKet = values[NGAY_KY_KET] != null ? Convert.ToDateTime(values[NGAY_KY_KET]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_CONG_BO)) {
                model.NgayCongBo = values[NGAY_CONG_BO] != null ? Convert.ToDateTime(values[NGAY_CONG_BO]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_GIA_NHAP)) {
                model.NgayGiaNhap = values[NGAY_GIA_NHAP] != null ? Convert.ToDateTime(values[NGAY_GIA_NHAP]) : (DateTime?)null;
            }

            if(values.Contains(NGAY_CO_HLVIET_NAM)) {
                model.NgayCoHLVietNam = values[NGAY_CO_HLVIET_NAM] != null ? Convert.ToDateTime(values[NGAY_CO_HLVIET_NAM]) : (DateTime?)null;
            }

            if(values.Contains(TINH_TRANG)) {
                model.TinhTrang = values[TINH_TRANG] != null ? Convert.ToInt32(values[TINH_TRANG]) : (int?)null;
            }

            if(values.Contains(FILE_GOC)) {
                model.FileGoc = Convert.ToString(values[FILE_GOC]);
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