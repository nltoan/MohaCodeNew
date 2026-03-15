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
using Microsoft.AspNet.Identity;

using API.Models;
using System.Net.Mail;
using System.Text;

namespace API.Controllers
{
    [Authorize]
    [Route("api/TinTucs/{action}", Name = "TinTucsApi")]
    public class TinTucsController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions) {
            var option = Request.GetQueryNameValuePairs().Where(x => x.Key == "type").FirstOrDefault();
            var type = option.Value;
            var userId = Convert.ToInt32(User.Identity.GetUserId());
            var condition = "";
            var tintucQuery = _context.TinTucs.Select(x => x);
            if (type == "owner")
            {
                condition = String.Format("and t.NguoiTaoID = {0}", userId);
            }
            else if (type == "publish")
            {
                condition = String.Format("and t.NguoiTaoID = {0} and t.TrangThai = '{1}'", userId, "public");
            }
            else if (type == "unpublish")
            {
                condition = String.Format("and t.NguoiTaoID = {0} and t.TrangThai = '{1}'", userId, "cancelpublic");
            }
            else if (type == "wait")
            {
                condition = String.Format("and t.NguoiTaoID = {0} and t.TrangThai = '{1}'", userId, "waitapprove");
            }
            else if (type == "cancel")
            {
                condition = String.Format("and t.NguoiTaoID = {0}", userId);
            }
            else if (type == "draft")
            {
                condition = String.Format("and t.NguoiTaoID = {0} and t.TrangThai = '{1}'", userId, "draft");
            }
            else if (type == "approving")
            {
                condition = String.Format("and t.TrangThai = 'waitapprove'");
            }
            else if (type == "ownerApproving")
            {
                condition = String.Format("and ub.total > 0 and t.TrangThai = 'waitapprove'");
            }
            else if (type == "publishUnPublish")
            {
                condition = String.Format("and t.TrangThai in ('public','cancelpublic')");
            }
            else if (type == "infographic")
            {
                condition = String.Format("and t.Infographich = {0}", 1);
            }
            else if (type == "emagazine")
            {
                condition = String.Format("and t.Type = {0}", 3);
            }
            var tmpQuery = @"
                select t.*, 
	            CASE WHEN t.TrangThai = 'cancelpublic' and tmp.total > 0 THEN 1 ELSE 0 END AS CanPublish, 
                CASE WHEN t.TrangThai = 'public' and tmp.total > 0 THEN 1 ELSE 0 END AS CanUnPublish, 
                CASE WHEN t.TrangThai = 'waitapprove' and tmp.total > 0 THEN 1 ELSE 0 END AS CanApprove, 
                CASE WHEN t.TrangThai = 'waitapprove' and ub.total > 0 and ISNULL(tmp.total,0) = 0 THEN 1 ELSE 0 END AS CanSendNext, 
                CASE
                    WHEN 
                    (t.TrangThai = 'rejectapprove' and t.NguoiTaoId = @userId) 
                    or (t.TrangThai = 'draft' and t.NguoiTaoId = @userId) 
                    or (t.TrangThai = 'waitapprove' and t.NguoiTaoId = @userId) 
                    or (t.TrangThai = 'waitapprove' and ub.total > 0)
                    or (t.TrangThai <> 'draft' and tmp.total > 0)
                    THEN 1
                    ELSE 0
                END AS CanEdit, 
                CASE WHEN (t.TrangThai = 'rejectapprove' and t.NguoiTaoId = @userId) 
                    or (t.TrangThai = 'draft' and t.NguoiTaoId = @userId)
                    THEN 1
                    ELSE 0
                END AS CanSendApprove

                from TinTuc t
                left join (
	                select count(*) as total, ub2.BuocQuyTrinhId 
	                from UserBuocQuyTrinh ub2 
	                where ub2.UserID = @userId
	                GROUP BY ub2.BuocQuyTrinhId
                ) ub on ub.BuocQuyTrinhId = t.BuocQuyTrinhID
                left join (
                    select 
                    count(*) as total, bqt.ID
                    from BuocQuyTrinh bqt
                    join UserBuocQuyTrinh ubqt on ubqt.BuocQuyTrinhId = bqt.ID
                    join (select Max(SoThuTu) as maxbuoc, IDQuyTrinh from BuocQuyTrinh group by IDQuyTrinh) 
                    tmp3 on tmp3.maxbuoc = bqt.SoThuTu and tmp3.IDQuyTrinh = bqt.IDQuyTrinh
                    where ubqt.UserID = @userId
                    group by bqt.ID
                ) tmp on tmp.ID = t.BuocQuyTrinhID
                where 1 = 1 {0}
            ";
            var sql = String.Format(tmpQuery, condition);
            var ret = _context.DatasourceLoaderRawQuery(sql, new Dictionary<string, object> { { "@userId", userId } }, loadOptions);
            //if (loadOptions.Filter != null && loadOptions.Filter.Count > 0)
            //{
            //    var filterCondition = Utils.GetQuery(loadOptions.Filter);
            //    condition += " and " + filterCondition + " ";
            //}

            //var sqlCount = String.Format(@"select count(*) as Total from (" + tmpQuery + ") ttttmp1", condition);
            //if (loadOptions.Sort != null && loadOptions.Sort.Count() > 0)
            //{
            //    tmpQuery += " ORDER BY ";
            //    for (int i=0;i < loadOptions.Sort.Count();i++)
            //    {
            //       var aOption = loadOptions.Sort[i];
            //       if(i > 0)
            //       {
            //            tmpQuery += ",";
            //       }
            //       tmpQuery += loadOptions.Sort[0].Selector + (loadOptions.Sort[0].Desc ? " desc " : " asc ");
            //    }
            //}
            //else
            //{
            //    tmpQuery += " ORDER BY ID desc ";
            //}
            //tmpQuery += " OFFSET "+ loadOptions.Skip + " ROWS ";
            //if (loadOptions.Take > 0)
            //{
            //    tmpQuery += "FETCH NEXT " + loadOptions.Take + " ROWS ONLY ";
            //}
            //var sql = String.Format(tmpQuery, condition);
            
            //var total = _context.CollectionFromSql(sqlCount, new Dictionary<string, object> { { "@userId", userId } }).Select(x=>x.Total).FirstOrDefault();
            //var tintucs = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@userId", userId } }).ToList();
            ////var ret = DataSourceLoader.Load(tintucs, loadOptions);
            //var ret = new {
            //    data = tintucs,
            //    totalCount = total
            //};
            return Request.CreateResponse(ret);
        }
        private bool isVNLanguage(int iDChuyenMuc) {
            var sql = String.Format(@"
                with name_tree as 
                (
		                select i.ID, i.ChuyenMucCha
		                from ChuyenMuc i
		                where i.ID = @IDChuyenMuc

		                union all

		                select i.ID, i.ChuyenMucCha
		                from ChuyenMuc i
		                join name_tree p on i.ID = p.ChuyenMucCha
                )
                SELECT count(*) as Total FROM name_tree nt where nt.ID = 10466
            ");
            var total = _context.CollectionFromSql(sql, new Dictionary<string, object> {
                { "@IDChuyenMuc", iDChuyenMuc }
            }).Select(x => x.Total).FirstOrDefault();
            return total > 0 ? false : true;
        }


        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new TinTuc();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));
            var userId = User.Identity.GetUserId();
            model.TrangThai = "draft";
            model.NgayTao = DateTime.Now;
            model.NguoiTaoID = Convert.ToInt32(userId);
            
            if (System.Web.HttpContext.Current != null && System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
            {
                model.TenNguoiTao = System.Web.HttpContext.Current.User.Identity.GetUserName();
            }
            var result = _context.TinTucs.Add(model);
            await _context.SaveChangesAsync();
            //
            bool isVN = isVNLanguage((int)model.IDChuyenMuc);
            var blockCode = "BoxHot";
            if(isVN == false)
            {
                blockCode = "BoxHotEn";
            }
            var block = _context.Blocks.Where(x => x.Path == blockCode).FirstOrDefault();
            if (block != null && !string.IsNullOrEmpty(model.AnhDaiDien))
            {
                _context.TinTuc_Block.Add(new TinTuc_Block
                {
                    TinTucID = model.ID,
                    BlockID = block.ID
                });
                await _context.SaveChangesAsync();
            }
            //Send mail
            TinTuc tmp = new TinTuc
            {
                ID = model.ID,
                TieuDe = model.TieuDe,
                IDChuyenMuc = model.IDChuyenMuc
            };
            Task.Run(async () => {
                await SendEmail(tmp);
            });

            return Request.CreateResponse(HttpStatusCode.Created, new { result.ID });
        }
        private dynamic GetBuocQuyTrinh(int IDChuyenMuc, int? currentBuocId, string action)
        {
            var condition = "";
            if(currentBuocId != null && action == "next")
            {
                var currentBuoc = _context.BuocQuyTrinhs.Where(x => x.ID == currentBuocId).FirstOrDefault();
                condition = String.Format(" and b.SoThuTu > {0}", currentBuoc.SoThuTu);
            }
            else
            if (currentBuocId != null && action == "prev")
            {
                var currentBuoc = _context.BuocQuyTrinhs.Where(x => x.ID == currentBuocId).FirstOrDefault();
                condition = String.Format(" and b.SoThuTu < {0}", currentBuoc.SoThuTu);
            }
            var sql = String.Format(@"
                with name_tree as 
                (
		                select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, i.Type, 0 AS Level
		                from ChuyenMuc i
		                where i.ID = @IDChuyenMuc

		                union all

		                select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, i.Type, Level+1 AS Level
		                from ChuyenMuc i
		                join name_tree p on i.ID = p.ChuyenMucCha
                )
                select b.* from (
	                SELECT top 1 nt.Level, q.ID FROM name_tree nt
	                Join QuyTrinhKiemDuyet q on q.ID = nt.IDQuyTrinh 
                    where q.TrangThai = 'HoatDong'
	                ORDER BY nt.Level asc
                ) tmp 
                join BuocQuyTrinh b on b.IDQuyTrinh = tmp.ID
                where 1=1 {0}
                ORDER BY b.SoThuTu asc
            ", condition);
            var step = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@IDChuyenMuc", IDChuyenMuc} }).FirstOrDefault();
            return step;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Action(int ID, string action, string comment="")
        {
            var model = await _context.TinTucs.FirstOrDefaultAsync(item => item.ID == ID);
            if (model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");
            var userId = User.Identity.GetUserId();
            if (action == "public")
            {
                model.TrangThai = "public";
            }

            if (action == "cancelpublic")
            {
                model.TrangThai = "cancelpublic";
            }
            if (action == "star")
            {
                model.NoiBat = 1;
            }
            if (action == "unstar")
            {
                model.NoiBat = 0;
            }

            if (action == "sendapprove")
            {
                model.TrangThai = "waitapprove";
                //set buoc quy trinh gan nhat
                var firstStep = GetBuocQuyTrinh((int)model.IDChuyenMuc, model.BuocQuyTrinhID, null);
                model.BuocQuyTrinhID = firstStep?.ID;
            }
            else if (action == "approve")
            {
                model.TinTuc_QuyTrinh.Add(new TinTuc_QuyTrinh
                {
                    NguoiXuLyID = Convert.ToInt32(userId),
                    TinTucID = model.ID,
                    NgayTao = DateTime.Now,
                    BinhLuan = comment,
                    BuocQuyTrinhID = (int)model.BuocQuyTrinhID
                });
                //Kiem tra neu la buoc cuoi cung
                var next = GetBuocQuyTrinh((int)model.IDChuyenMuc, model.BuocQuyTrinhID, "next");
                if (next == null)
                {
                    model.TrangThai = "public";
                }
                else
                {
                    model.BuocQuyTrinhID = next.ID;
                }
            }
            else if (action == "reject")
            {
                model.TinTuc_QuyTrinh.Add(new TinTuc_QuyTrinh
                {
                    NguoiXuLyID = Convert.ToInt32(userId),
                    TinTucID = model.ID,
                    NgayTao = DateTime.Now,
                    BinhLuan = comment,
                    BuocQuyTrinhID = (int)model.BuocQuyTrinhID
                });
                var prev = GetBuocQuyTrinh((int)model.IDChuyenMuc, model.BuocQuyTrinhID, "prev");
                if(prev != null)
                {
                    model.BuocQuyTrinhID = prev.ID;
                }
                else
                {
                    model.TrangThai = "rejectapprove";
                }
            }
            await _context.SaveChangesAsync();
            //Send mail
            TinTuc tmp = new TinTuc
            {
                ID = model.ID,
                TieuDe = model.TieuDe,
                IDChuyenMuc = model.IDChuyenMuc
            };
            Task.Run(async () => {
                await SendEmail(tmp);
            });
            return Request.CreateResponse(HttpStatusCode.OK, new { isOk = true} );
        }
        private TinTuc_History CloneFromTinTuc(TinTuc model)
        {
            TinTuc_History his = new TinTuc_History
            {
                TieuDe = model.TieuDe,
                MoTa = model.MoTa,
                NoiDung = model.NoiDung,
                TacGia = model.TacGia,
                NgayTao = model.NgayTao,
                TrangThai = model.TrangThai,
                IDChuyenMuc = model.IDChuyenMuc,
                ChoPhepGuiPhanHoi = model.ChoPhepGuiPhanHoi,
                CacTinLienQuan = model.CacTinLienQuan,
                AnhDaiDien = model.AnhDaiDien,
                NgayXuatBan = model.NgayXuatBan,
                DongSuKien = model.DongSuKien,
                VungHienThi = model.VungHienThi,
                FilesDinhKem = model.FilesDinhKem,
                NguonTin = model.NguonTin,
                PhuDe = model.PhuDe,
                NguoiTao = model.NguoiTao,
                NguoiTraVe = model.NguoiTraVe,
                NgayTraVe = model.NgayTraVe,
                TenNguoiTao = model.TenNguoiTao,
                TenNguoiTraVe = model.TenNguoiTraVe,
                TuKhoa = model.TuKhoa,
                PageCount = model.PageCount,
                DanhGia = model.DanhGia,
                ThoiGianUuTien = model.ThoiGianUuTien,
                LogChuyenMucThayDoi = model.LogChuyenMucThayDoi,
                LogQuyTrinhThayDoi = model.LogQuyTrinhThayDoi,
                LoaiTin = model.LoaiTin,
                ChuyenMucHienThiThem = model.ChuyenMucHienThiThem,
                PreFix = model.PreFix,
                Infographich = model.Infographich,
                Type = model.Type,
                TinTucID = model.ID,
                UpdatedAt = DateTime.Now,
                //UserId = System.Web.HttpContext.Current.User.Identity.GetUserId()
            };
            return his;
        }
        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.TinTucs.FirstOrDefaultAsync(item => item.ID == key);
            if(model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");

            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();
            //Tao lich su
            TinTuc_History his = CloneFromTinTuc(model);
            _context.TinTuc_History.Add(his);
            await _context.SaveChangesAsync();

            //Send mail
            TinTuc tmp = new TinTuc
            {
                ID = model.ID,
                TieuDe = model.TieuDe,
                IDChuyenMuc = model.IDChuyenMuc
            };
            Task.Run(async () => {
                await SendEmail(tmp);
            });

            return Request.CreateResponse(HttpStatusCode.OK);
        }
        private bool RemoteServerCertificateValidationCallback(object sender, 
            System.Security.Cryptography.X509Certificates.X509Certificate certificate, 
            System.Security.Cryptography.X509Certificates.X509Chain chain, 
            System.Net.Security.SslPolicyErrors sslPolicyErrors)
        {
            return true;
        }
        private async Task SendEmail(TinTuc model)
        {
            CongTTDT_MOHAEntities _context2 = new CongTTDT_MOHAEntities();
            var cauhinh = _context2.ThamSoHeThongs.FirstOrDefault();
            if (cauhinh != null
                && !string.IsNullOrEmpty(cauhinh.EmailHost)
                && !string.IsNullOrEmpty(cauhinh.EmailPort)
                && !string.IsNullOrEmpty(cauhinh.EmailAddress)
                && !string.IsNullOrEmpty(cauhinh.EmailPassword)
            )
            {
                try
                {
                    System.Net.ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(RemoteServerCertificateValidationCallback);

                    //Send email thay doi
                    var smtpClient = new SmtpClient(cauhinh.EmailHost)
                    {
                        Port = Convert.ToInt32(cauhinh.EmailPort),
                        Credentials = new NetworkCredential(cauhinh.EmailAddress, cauhinh.EmailPassword),
                        EnableSsl = true,
                    };
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(cauhinh.EmailAddress),
                        Subject = "Thông báo có sự thay đổi nội dung tin tức",
                        Body = @"Bài viết  có sự thay đổi <br /> 
                            Để xem trước nội dung: <a href='https://frontend.molisa.gov.vn/baiviet/" + model.ID + "'>" + model.TieuDe + @"</a><br />
                            Để xét duyệt nội dung: <a href='https://backend.molisa.gov.vn/News/TinTuc/ChangeStatus?action=approve&ID=" + model.ID + @"'>Xét duyệt</a><br />              
                        ",
                        IsBodyHtml = true,
                    };
                    //string[] arrEmails = _context2.User_Account
                    //    .Where(x => !string.IsNullOrEmpty(x.EmailAddress))
                    //    .Select(x => x.EmailAddress).ToArray();
                    //string[] arrEmails = new string[] { "nguyenminhtan0612@gmail.com"};

                    var sql = String.Format(@"
                    with name_tree as 
                    (
		                    select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, i.Type, 0 AS Level
		                    from ChuyenMuc i
		                    where i.ID = @IDChuyenMuc

		                    union all

		                    select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, i.Type, Level+1 AS Level
		                    from ChuyenMuc i
		                    join name_tree p on i.ID = p.ChuyenMucCha
                    )
                    select ua.* from (
	                    SELECT top 1 nt.Level, q.ID FROM name_tree nt
	                    Join QuyTrinhKiemDuyet q on q.ID = nt.IDQuyTrinh 
		                    where q.TrangThai = 'HoatDong'
	                    ORDER BY nt.Level asc
                    ) tmp 
                    join BuocQuyTrinh b on b.IDQuyTrinh = tmp.ID
                    join UserBuocQuyTrinh ub on ub.BuocQuyTrinhId = b.ID
                    join User_Account ua on ua.UserID = ub.UserID
                    where ua.IsReceiveEmail = 1
                    ORDER BY b.SoThuTu asc
                    ");
                    var arrEmails = _context2.CollectionFromSql(sql, new Dictionary<string, object> {
                        { "@IDChuyenMuc", model.IDChuyenMuc }
                    })
                    .Where(x => !string.IsNullOrEmpty(x.EmailAddress))
                    .Select(x => x.EmailAddress).ToArray();


                    foreach (string i in arrEmails)
                    {
                        mailMessage.To.Add(i);
                    }

                    smtpClient.Send(mailMessage);
                }
                catch
                {

                }
            }
        }

        [HttpDelete]
        public async Task Delete(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.TinTucs.FirstOrDefaultAsync(item => item.ID == key);

            _context.TinTucs.Remove(model);
            await _context.SaveChangesAsync();

            //Send mail
            TinTuc tmp = new TinTuc
            {
                ID = model.ID,
                TieuDe = model.TieuDe,
                IDChuyenMuc = model.IDChuyenMuc
            };
            Task.Run(async () => {
                await SendEmail(tmp);
            });
        }

        private void PopulateModel(TinTuc model, IDictionary values) {
            string ID = nameof(TinTuc.ID);
            string TIEU_DE = nameof(TinTuc.TieuDe);
            string MO_TA = nameof(TinTuc.MoTa);
            string NOI_DUNG = nameof(TinTuc.NoiDung);
            string TAC_GIA = nameof(TinTuc.TacGia);
            string NGAY_TAO = nameof(TinTuc.NgayTao);
            string TRANG_THAI = nameof(TinTuc.TrangThai);
            string IDCHUYEN_MUC = nameof(TinTuc.IDChuyenMuc);
            string CHO_PHEP_GUI_PHAN_HOI = nameof(TinTuc.ChoPhepGuiPhanHoi);
            string CAC_TIN_LIEN_QUAN = nameof(TinTuc.CacTinLienQuan);
            string ANH_DAI_DIEN = nameof(TinTuc.AnhDaiDien);
            string NGAY_XUAT_BAN = nameof(TinTuc.NgayXuatBan);
            string DONG_SU_KIEN = nameof(TinTuc.DongSuKien);
            string VUNG_HIEN_THI = nameof(TinTuc.VungHienThi);
            string FILES_DINH_KEM = nameof(TinTuc.FilesDinhKem);
            string NGUON_TIN = nameof(TinTuc.NguonTin);
            string PHU_DE = nameof(TinTuc.PhuDe);
            string NGUOI_TAO = nameof(TinTuc.NguoiTao);
            string NGUOI_TRA_VE = nameof(TinTuc.NguoiTraVe);
            string NGAY_TRA_VE = nameof(TinTuc.NgayTraVe);
            string TEN_NGUOI_TAO = nameof(TinTuc.TenNguoiTao);
            string TEN_NGUOI_TRA_VE = nameof(TinTuc.TenNguoiTraVe);
            string TU_KHOA = nameof(TinTuc.TuKhoa);
            string PAGE_COUNT = nameof(TinTuc.PageCount);
            string DANH_GIA = nameof(TinTuc.DanhGia);
            string THOI_GIAN_UU_TIEN = nameof(TinTuc.ThoiGianUuTien);
            string LOG_CHUYEN_MUC_THAY_DOI = nameof(TinTuc.LogChuyenMucThayDoi);
            string LOG_QUY_TRINH_THAY_DOI = nameof(TinTuc.LogQuyTrinhThayDoi);
            string LOAI_TIN = nameof(TinTuc.LoaiTin);
            string CHUYEN_MUC_HIEN_THI_THEM = nameof(TinTuc.ChuyenMucHienThiThem);
            string PRE_FIX = nameof(TinTuc.PreFix);
            string INFOGRAPHICH = nameof(TinTuc.Infographich);
            string TYPE = nameof(TinTuc.Type);
            string NOIBAT = nameof(TinTuc.NoiBat);

            if (values.Contains(ID)) {
                model.ID = Convert.ToInt32(values[ID]);
            }

            if(values.Contains(TIEU_DE)) {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if(values.Contains(MO_TA)) {
                model.MoTa = Convert.ToString(values[MO_TA]);
            }

            if(values.Contains(NOI_DUNG)) {
                model.NoiDung = Convert.ToString(values[NOI_DUNG]);
            }

            if(values.Contains(TAC_GIA)) {
                model.TacGia = Convert.ToString(values[TAC_GIA]);
            }

            if(values.Contains(NGAY_TAO)) {
                model.NgayTao = values[NGAY_TAO] != null ? Convert.ToDateTime(values[NGAY_TAO]) : (DateTime?)null;
            }

            if(values.Contains(TRANG_THAI)) {
                model.TrangThai = Convert.ToString(values[TRANG_THAI]);
            }

            if(values.Contains(IDCHUYEN_MUC)) {
                model.IDChuyenMuc = values[IDCHUYEN_MUC] != null ? Convert.ToInt32(values[IDCHUYEN_MUC]) : (int?)null;
            }

            if(values.Contains(CHO_PHEP_GUI_PHAN_HOI)) {
                model.ChoPhepGuiPhanHoi = values[CHO_PHEP_GUI_PHAN_HOI] != null ? Convert.ToInt32(values[CHO_PHEP_GUI_PHAN_HOI]) : (int?)null;
            }

            if(values.Contains(CAC_TIN_LIEN_QUAN)) {
                model.CacTinLienQuan = Convert.ToString(values[CAC_TIN_LIEN_QUAN]);
            }

            if(values.Contains(ANH_DAI_DIEN)) {
                model.AnhDaiDien = Convert.ToString(values[ANH_DAI_DIEN]);
            }

            if(values.Contains(NGAY_XUAT_BAN)) {
                model.NgayXuatBan = values[NGAY_XUAT_BAN] != null ? Convert.ToDateTime(values[NGAY_XUAT_BAN]) : (DateTime?)null;
            }

            if(values.Contains(DONG_SU_KIEN)) {
                model.DongSuKien = Convert.ToString(values[DONG_SU_KIEN]);
            }

            if(values.Contains(VUNG_HIEN_THI)) {
                model.VungHienThi = Convert.ToString(values[VUNG_HIEN_THI]);
            }

            if(values.Contains(FILES_DINH_KEM)) {
                model.FilesDinhKem = Convert.ToString(values[FILES_DINH_KEM]);
            }

            if(values.Contains(NGUON_TIN)) {
                model.NguonTin = Convert.ToString(values[NGUON_TIN]);
            }

            if(values.Contains(PHU_DE)) {
                model.PhuDe = Convert.ToString(values[PHU_DE]);
            }

            if(values.Contains(NGUOI_TAO)) {
                model.NguoiTao = Convert.ToString(values[NGUOI_TAO]);
            }

            if(values.Contains(NGUOI_TRA_VE)) {
                model.NguoiTraVe = Convert.ToString(values[NGUOI_TRA_VE]);
            }

            if(values.Contains(NGAY_TRA_VE)) {
                model.NgayTraVe = Convert.ToString(values[NGAY_TRA_VE]);
            }

            if(values.Contains(TEN_NGUOI_TAO)) {
                model.TenNguoiTao = Convert.ToString(values[TEN_NGUOI_TAO]);
            }

            if(values.Contains(TEN_NGUOI_TRA_VE)) {
                model.TenNguoiTraVe = Convert.ToString(values[TEN_NGUOI_TRA_VE]);
            }

            if(values.Contains(TU_KHOA)) {
                model.TuKhoa = Convert.ToString(values[TU_KHOA]);
            }

            if(values.Contains(PAGE_COUNT)) {
                model.PageCount = values[PAGE_COUNT] != null ? Convert.ToInt32(values[PAGE_COUNT]) : (int?)null;
            }

            if(values.Contains(DANH_GIA)) {
                model.DanhGia = Convert.ToString(values[DANH_GIA]);
            }

            if(values.Contains(THOI_GIAN_UU_TIEN)) {
                model.ThoiGianUuTien = values[THOI_GIAN_UU_TIEN] != null ? Convert.ToDateTime(values[THOI_GIAN_UU_TIEN]) : (DateTime?)null;
            }

            if(values.Contains(LOG_CHUYEN_MUC_THAY_DOI)) {
                model.LogChuyenMucThayDoi = values[LOG_CHUYEN_MUC_THAY_DOI] != null ? Convert.ToInt32(values[LOG_CHUYEN_MUC_THAY_DOI]) : (int?)null;
            }

            if(values.Contains(LOG_QUY_TRINH_THAY_DOI)) {
                model.LogQuyTrinhThayDoi = values[LOG_QUY_TRINH_THAY_DOI] != null ? Convert.ToInt32(values[LOG_QUY_TRINH_THAY_DOI]) : (int?)null;
            }

            if(values.Contains(LOAI_TIN)) {
                model.LoaiTin = values[LOAI_TIN] != null ? Convert.ToInt32(values[LOAI_TIN]) : (int?)null;
            }

            if(values.Contains(CHUYEN_MUC_HIEN_THI_THEM)) {
                model.ChuyenMucHienThiThem = Convert.ToString(values[CHUYEN_MUC_HIEN_THI_THEM]);
            }
            if (values.Contains(TYPE))
            {
                model.Type = Convert.ToInt32(values[TYPE]);
            }

            if (values.Contains(PRE_FIX)) {
                model.PreFix = values[PRE_FIX] != null ? Convert.ToInt32(values[PRE_FIX]) : (int?)null;
            }

            if(values.Contains(INFOGRAPHICH)) {
                model.Infographich = values[INFOGRAPHICH] != null ? Convert.ToInt32(values[INFOGRAPHICH]) : (int?)null;
            }
            if (values.Contains(NOIBAT))
            {
                model.NoiBat = Convert.ToInt32(values[NOIBAT]);
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