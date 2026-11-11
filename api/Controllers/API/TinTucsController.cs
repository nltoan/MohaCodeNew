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

using API.OAuth.Providers;
using API.Models;
using System.Net.Mail;
using System.Text;
using System.Configuration;

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
                // Tin bi tra ve (TrangThai 'rejectapprove' - xem Action "reject" va bo loc trang thai o TinTuc.js)
                condition = String.Format("and t.NguoiTaoID = {0} and t.TrangThai = '{1}'", userId, "rejectapprove");
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
            // Tin tuc chung (khong co type) va cac danh sach toan bo tin (dang kiem duyet, xuat ban/huy xuat ban):
            // chi admin hoac nguoi phe duyet moi thay tin cua nguoi khac. Nguoi khac chi thay tin do chinh minh tao (tin noi bo la rieng tu).
            // Khong tra 403 vi ApprovePopup/SendApprovePopup goi Get khong type de nap tung tin theo ID.
            bool isGeneralList = string.IsNullOrEmpty(type) || type == "undefined" || condition == "" ||
                                 type == "approving" || type == "publishUnPublish";
            if (isGeneralList && !CanViewAllNews(userId))
            {
                condition += " and t.NguoiTaoID = @userId";
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
        // Admin (quyen manage-user) hoac nguoi phe duyet (thuoc it nhat mot buoc quy trinh kiem duyet) moi duoc xem tin chung cua moi nguoi.
        private bool CanViewAllNews(int userId)
        {
            if (_context.UserBuocQuyTrinhs.Any(u => u.UserID == userId)) return true;
            return _context.User_Account.Any(u => u.UserID == userId && u.Role.RolePermissions.Any(p => p.Permission.Name == "manage-user"));
        }

        // Frontend goi de quyet dinh co hien muc "Tin tuc" (tin chung) tren menu hay khong.
        [HttpGet]
        public HttpResponseMessage CanViewAll()
        {
            var userId = Convert.ToInt32(User.Identity.GetUserId());
            return Request.CreateResponse(HttpStatusCode.OK, new { canViewAll = CanViewAllNews(userId) });
        }

        // Xem truoc noi dung tin (ke ca tin nhap/chua cong khai) ngay trong CMS.
        // Chi nguoi tao tin, nguoi phe duyet thuoc cung quy trinh duyet cua tin do va nhom quan tri duoc xem;
        // nguoi khac nhan 403. KHONG mo ra cong khai.
        [HttpGet]
        public HttpResponseMessage Preview(int ID)
        {
            var userId = Convert.ToInt32(User.Identity.GetUserId());
            var post = _context.TinTucs.Where(x => x.ID == ID)
                .Select(x => new { x.ID, x.TieuDe, x.MoTa, x.NoiDung, x.NgayXuatBan, x.NgayTao, x.TenNguoiTao, x.TrangThai, x.NguoiTaoID, x.BuocQuyTrinhID })
                .FirstOrDefault();
            if (post == null) return Request.CreateResponse(HttpStatusCode.NotFound);
            bool allowed = post.NguoiTaoID == userId;
            if (!allowed && post.BuocQuyTrinhID != null)
            {
                var idQuyTrinh = _context.BuocQuyTrinhs.Where(b => b.ID == post.BuocQuyTrinhID).Select(b => b.IDQuyTrinh).FirstOrDefault();
                if (idQuyTrinh != null)
                    allowed = _context.UserBuocQuyTrinhs.Any(u => u.UserID == userId && u.BuocQuyTrinh.IDQuyTrinh == idQuyTrinh);
            }
            // Nhom quan tri (co quyen manage-user) duoc xem truoc moi tin.
            if (!allowed)
                allowed = _context.User_Account.Any(u => u.UserID == userId && u.Role.RolePermissions.Any(p => p.Permission.Name == "manage-user"));
            if (!allowed) return Request.CreateResponse(HttpStatusCode.Forbidden);
            return Request.CreateResponse(HttpStatusCode.OK, new { post.ID, post.TieuDe, post.MoTa, post.NoiDung, post.NgayXuatBan, post.NgayTao, post.TenNguoiTao, post.TrangThai });
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


        [PermissionAuthorize("manage-tintuc")]
        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form) {
            var model = new TinTuc();
            model.NgonNgu = "vi";
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            if (model.NgonNgu != "vi" && model.NgonNgu != "en")
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Ngôn ngữ phải là vi hoặc en.");

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
            bool isVN = model.NgonNgu == "vi";
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

        // Quy tac phan quyen quy trinh tin tuc - PHAI khop voi cac cot CanPublish/CanUnPublish/CanApprove/CanSendApprove/CanEdit
        // tinh trong SQL cua Get. Mot noi duy nhat; Action/Put/Delete deu goi ham nay.
        private bool HasNewsRight(TinTuc m, int userId, string right)
        {
            string st = m.TrangThai ?? "";
            bool isCreator = m.NguoiTaoID == userId;
            bool atStep = false, atFinalStep = false;
            if (m.BuocQuyTrinhID != null)
            {
                var stepId = m.BuocQuyTrinhID.Value;
                atStep = _context.UserBuocQuyTrinhs.Any(u => u.UserID == userId && u.BuocQuyTrinhId == stepId);
                if (atStep)
                {
                    var step = _context.BuocQuyTrinhs.Where(b => b.ID == stepId).Select(b => new { b.IDQuyTrinh, b.SoThuTu }).FirstOrDefault();
                    if (step != null && step.IDQuyTrinh != null)
                    {
                        var idQt = step.IDQuyTrinh;
                        var maxStep = _context.BuocQuyTrinhs.Where(b => b.IDQuyTrinh == idQt).Max(b => b.SoThuTu);
                        atFinalStep = step.SoThuTu != null && step.SoThuTu == maxStep;
                    }
                }
            }
            bool isSt(string v) { return string.Equals(st, v, StringComparison.OrdinalIgnoreCase); }
            switch (right)
            {
                case "CanPublish": return isSt("cancelpublic") && atFinalStep;
                case "CanUnPublish": return isSt("public") && atFinalStep;
                case "CanApprove": return isSt("waitapprove") && atStep; // = CanApprove (buoc cuoi) hoac CanSendNext (buoc giua)
                case "CanSendApprove": return (isSt("rejectapprove") || isSt("draft")) && isCreator;
                case "CanEdit":
                    return (isSt("rejectapprove") && isCreator)
                        || (isSt("draft") && isCreator)
                        || (isSt("waitapprove") && isCreator)
                        || (isSt("waitapprove") && atStep)
                        || (st != "" && !isSt("draft") && atFinalStep);
                default: return false;
            }
        }

        // Cot ngoai EF model (db/migrations/20261111-TinTucHistory-BoSungCot.sql) - bo qua neu cot chua co.
        private void UpdateHistoryExtraColumns(TinTuc_History his, TinTuc model)
        {
            try
            {
                _context.Database.ExecuteSqlCommand(
                    "UPDATE dbo.TinTuc_History SET NgonNgu = @p0, NoiBat = @p1, NguoiTaoID = @p2, BuocQuyTrinhID = @p3 WHERE ID = @p4",
                    new System.Data.SqlClient.SqlParameter("@p0", (object)model.NgonNgu ?? DBNull.Value),
                    new System.Data.SqlClient.SqlParameter("@p1", (object)model.NoiBat ?? DBNull.Value),
                    new System.Data.SqlClient.SqlParameter("@p2", (object)model.NguoiTaoID ?? DBNull.Value),
                    new System.Data.SqlClient.SqlParameter("@p3", (object)model.BuocQuyTrinhID ?? DBNull.Value),
                    new System.Data.SqlClient.SqlParameter("@p4", his.ID));
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceWarning("TinTuc_History extra columns not updated (migration 20261111-TinTucHistory-BoSungCot.sql applied?): " + ex.Message);
            }
        }

        private async Task SaveHistoryAsync(TinTuc model)
        {
            TinTuc_History his = CloneFromTinTuc(model);
            _context.TinTuc_History.Add(his);
            await _context.SaveChangesAsync();
            UpdateHistoryExtraColumns(his, model);
        }

        [PermissionAuthorize("manage-tintuc")]
        [AcceptVerbs("GET", "POST")]
        public async Task<HttpResponseMessage> Action(int ID, string action, string comment="")
        {
            var model = await _context.TinTucs.FirstOrDefaultAsync(item => item.ID == ID);
            if (model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");
            var userId = User.Identity.GetUserId();
            int userIdInt = Convert.ToInt32(userId);

            string requiredRight;
            switch (action)
            {
                case "public": requiredRight = "CanPublish"; break;
                case "cancelpublic":
                case "star":
                case "unstar": requiredRight = "CanUnPublish"; break;
                case "sendapprove": requiredRight = "CanSendApprove"; break;
                case "approve":
                case "reject": requiredRight = "CanApprove"; break;
                default: return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Hành động không hợp lệ.");
            }
            if (!HasNewsRight(model, userIdInt, requiredRight))
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Bạn không có quyền thực hiện thao tác này với tin.");
            if ((action == "sendapprove" || action == "approve" || action == "reject") && model.IDChuyenMuc == null)
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Tin chưa có chuyên mục nên không thể chuyển quy trình duyệt.");
            if ((action == "approve" || action == "reject") && model.BuocQuyTrinhID == null)
                return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Tin chưa ở bước nào của quy trình duyệt.");

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
                //set buoc quy trinh gan nhat
                var firstStep = GetBuocQuyTrinh(model.IDChuyenMuc.Value, model.BuocQuyTrinhID, null);
                // Khong co buoc duyet nao thi khong chuyen sang cho duyet: tin se ket o waitapprove, khong ai duyet duoc.
                if (firstStep == null)
                    return Request.CreateErrorResponse(HttpStatusCode.Conflict, "Chuyên mục của tin chưa có quy trình duyệt đang hoạt động hoặc quy trình chưa có bước duyệt nên không thể gửi duyệt.");
                model.TrangThai = "waitapprove";
                model.BuocQuyTrinhID = firstStep.ID;
            }
            else if (action == "approve")
            {
                model.TinTuc_QuyTrinh.Add(new TinTuc_QuyTrinh
                {
                    NguoiXuLyID = userIdInt,
                    TinTucID = model.ID,
                    NgayTao = DateTime.Now,
                    BinhLuan = comment,
                    BuocQuyTrinhID = model.BuocQuyTrinhID.Value
                });
                //Kiem tra neu la buoc cuoi cung
                var next = GetBuocQuyTrinh(model.IDChuyenMuc.Value, model.BuocQuyTrinhID, "next");
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
                    NguoiXuLyID = userIdInt,
                    TinTucID = model.ID,
                    NgayTao = DateTime.Now,
                    BinhLuan = comment,
                    BuocQuyTrinhID = model.BuocQuyTrinhID.Value
                });
                var prev = GetBuocQuyTrinh(model.IDChuyenMuc.Value, model.BuocQuyTrinhID, "prev");
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
            //Tao lich su
            await SaveHistoryAsync(model);
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
        [PermissionAuthorize("manage-tintuc")]
        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.TinTucs.FirstOrDefaultAsync(item => item.ID == key);
            if(model == null)
                return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");
            if (!HasNewsRight(model, Convert.ToInt32(User.Identity.GetUserId()), "CanEdit"))
                return Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Bạn không có quyền sửa tin này.");

            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            if (model.NgonNgu != "vi" && model.NgonNgu != "en")
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Ngôn ngữ phải là vi hoặc en.");

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            await _context.SaveChangesAsync();
            //Tao lich su
            await SaveHistoryAsync(model);

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
        // Chi bo qua kiem tra chung chi TLS khi appSetting SmtpAllowInvalidCertificate = "true" (mac dinh: kiem tra day du).
        // Callback chi gan khi bat co, va chi gan mot lan - khong tat xac thuc TLS cho toan tien trinh mac dinh.
        private static bool _smtpCertCallbackSet;
        private static bool SmtpAllowInvalidCertificate()
        {
            return string.Equals(ConfigurationManager.AppSettings["SmtpAllowInvalidCertificate"], "true", StringComparison.Ordinal);
        }
        private async Task SendEmail(TinTuc model)
        {
            try
            {
                using (var _context2 = new CongTTDT_MOHAEntities())
                {
                    var cauhinh = _context2.ThamSoHeThongs.FirstOrDefault();
                    if (cauhinh != null
                        && !string.IsNullOrEmpty(cauhinh.EmailHost)
                        && !string.IsNullOrEmpty(cauhinh.EmailPort)
                        && !string.IsNullOrEmpty(cauhinh.EmailAddress)
                        && !string.IsNullOrEmpty(cauhinh.EmailPassword)
                    )
                    {
                        if (SmtpAllowInvalidCertificate() && !_smtpCertCallbackSet)
                        {
                            System.Net.ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;
                            _smtpCertCallbackSet = true;
                            System.Diagnostics.Trace.TraceWarning("SmtpAllowInvalidCertificate=true: TLS certificate validation is disabled for this process.");
                        }

                        // Lien ket lay tu appSettings (frontendSiteUrl, adminSiteUrl); bo qua neu de trong.
                        var frontendUrl = (ConfigurationManager.AppSettings["frontendSiteUrl"] ?? "").Trim().TrimEnd('/');
                        var adminUrl = (ConfigurationManager.AppSettings["adminSiteUrl"] ?? "").Trim().TrimEnd('/');
                        var bodyHtml = new StringBuilder();
                        bodyHtml.Append("Bài viết <b>").Append(System.Net.WebUtility.HtmlEncode(model.TieuDe ?? "")).Append("</b> có sự thay đổi <br />");
                        if (frontendUrl != "")
                            bodyHtml.Append("Cổng thông tin: <a href='").Append(System.Net.WebUtility.HtmlEncode(frontendUrl)).Append("'>").Append(System.Net.WebUtility.HtmlEncode(frontendUrl)).Append("</a><br />");
                        if (adminUrl != "")
                            bodyHtml.Append("Để xét duyệt nội dung: <a href='").Append(System.Net.WebUtility.HtmlEncode(adminUrl + "/News/TinTuc/ownerApproving")).Append("'>Danh sách tin chờ kiểm duyệt</a><br />");

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

                    if (arrEmails.Length == 0) return;

                    //Send email thay doi
                    using (var smtpClient = new SmtpClient(cauhinh.EmailHost)
                    {
                        Port = Convert.ToInt32(cauhinh.EmailPort),
                        Credentials = new NetworkCredential(cauhinh.EmailAddress, cauhinh.EmailPassword),
                        EnableSsl = true,
                    })
                    using (var mailMessage = new MailMessage
                    {
                        From = new MailAddress(cauhinh.EmailAddress),
                        Subject = "Thông báo có sự thay đổi nội dung tin tức",
                        Body = bodyHtml.ToString(),
                        IsBodyHtml = true,
                    })
                    {
                        foreach (string i in arrEmails)
                        {
                            mailMessage.To.Add(i);
                        }
                        smtpClient.Send(mailMessage);
                    }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("TinTucs.SendEmail failed: " + ex);
            }
        }

        [PermissionAuthorize("manage-tintuc")]
        [HttpDelete]
        public async Task Delete(FormDataCollection form) {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.TinTucs.FirstOrDefaultAsync(item => item.ID == key);
            if (model == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            if (!HasNewsRight(model, Convert.ToInt32(User.Identity.GetUserId()), "CanEdit"))
                throw new HttpResponseException(HttpStatusCode.Forbidden);

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

        // Khong nhan tu client: ID, TrangThai (doi qua Action), PageCount, NguoiTao/TenNguoiTao (server gan o Post).
        private void PopulateModel(TinTuc model, IDictionary values) {
            string TIEU_DE = nameof(TinTuc.TieuDe);
            string NGON_NGU = nameof(TinTuc.NgonNgu);
            string MO_TA = nameof(TinTuc.MoTa);
            string NOI_DUNG = nameof(TinTuc.NoiDung);
            string TAC_GIA = nameof(TinTuc.TacGia);
            string NGAY_TAO = nameof(TinTuc.NgayTao);
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
            string NGUOI_TRA_VE = nameof(TinTuc.NguoiTraVe);
            string NGAY_TRA_VE = nameof(TinTuc.NgayTraVe);
            string TEN_NGUOI_TRA_VE = nameof(TinTuc.TenNguoiTraVe);
            string TU_KHOA = nameof(TinTuc.TuKhoa);
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

            if(values.Contains(TIEU_DE)) {
                model.TieuDe = Convert.ToString(values[TIEU_DE]);
            }

            if (values.Contains(NGON_NGU)) {
                model.NgonNgu = Convert.ToString(values[NGON_NGU])?.Trim().ToLowerInvariant();
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

            if(values.Contains(NGUOI_TRA_VE)) {
                model.NguoiTraVe = Convert.ToString(values[NGUOI_TRA_VE]);
            }

            if(values.Contains(NGAY_TRA_VE)) {
                model.NgayTraVe = Convert.ToString(values[NGAY_TRA_VE]);
            }

            if(values.Contains(TEN_NGUOI_TRA_VE)) {
                model.TenNguoiTraVe = Convert.ToString(values[TEN_NGUOI_TRA_VE]);
            }

            if(values.Contains(TU_KHOA)) {
                model.TuKhoa = Convert.ToString(values[TU_KHOA]);
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
