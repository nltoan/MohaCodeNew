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
using System.Text;
using System.IO;
using System.Web.Hosting;
using HtmlAgilityPack;
using System.Web;
using System.Web.Caching;
using System.Net.Mail;
using Google.Authenticator;
using Microsoft.AspNet.Identity;

namespace API.Controllers
{
    [Authorize]
    [Route("api/Home/{action}", Name = "HomeApi")]
    public class HomeController : ApiController
    {
        static readonly string RelativePath = System.IO.Path.Combine("Documents");
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> Statistic()
        {
            var sql = @"
               SELECT count(*) as total FROM Vanban vb 
                join VanBan_LopVanBan lvb on lvb.VanBanID = vb.ID
                where vb.ID!=0  and vb.TrangThai = 1 and lvb.LopVanBanID = @id
            ";
            var totalPost = _context.TinTucs.Count();
            var totalVBPL = _context.
                CollectionFromSql(sql, new Dictionary<string, object> { { "@id", 101 } })
                .FirstOrDefault();
            var totalCDDH = _context.
                CollectionFromSql(sql, new Dictionary<string, object> { { "@id", 104 } })
                .FirstOrDefault();
            var totalQT = _context.
                CollectionFromSql(sql, new Dictionary<string, object> { { "@id", 105 } })
                .FirstOrDefault();

            var totalPostInMonth = _context.
                CollectionFromSql(@"
                    select count(*) as total from TinTuc t
                    where MONTH(t.NgayTao) = MONTH(GETDATE()) and YEAR(t.NgayTao) = YEAR(GETDATE())
                ", new Dictionary<string, object> { })
                .FirstOrDefault();

            var totalWait = _context.
                CollectionFromSql(@"
                    select count(*) as total from TinTuc t
                    where t.TrangThai = 'waitapprove'
                ", new Dictionary<string, object> { })
                .FirstOrDefault();

            var totalPostInMonthByPeople = _context.
                CollectionFromSql(@"
                    select top 5 count(*) as total, u.TenTruyCap from TinTuc t
                    join User_Account u on u.UserID = t.NguoiTaoID
                    where MONTH(t.NgayTao) = MONTH(GETDATE()) and YEAR(t.NgayTao) = YEAR(GETDATE())
                    group by u.TenTruyCap
                    order by total desc
                ", new Dictionary<string, object> { })
                .ToList();

            var topPost = _context.
                CollectionFromSql(@"
                    select top 5 t.* from TinTuc t
                    where MONTH(t.NgayTao) = MONTH(GETDATE()) and YEAR(t.NgayTao) = YEAR(GETDATE())
                    order by t.PageCount desc
                ", new Dictionary<string, object> { })
                .ToList();


            var username = ControllerContext.RequestContext.Principal.Identity.GetUserId();
            return Request.CreateResponse(HttpStatusCode.OK, new {
                totalCDDH = totalCDDH.total,
                totalQT = totalQT.total,
                totalVBPL = totalVBPL.total,
                totalPostInMonth = totalPostInMonth.total,
                totalPostInMonthByPeople = totalPostInMonthByPeople,
                totalWait = totalWait.total,
                totalPost = totalPost,
                topPost = topPost,
                username
            });
        }

        [HttpPost]
        public async Task<HttpResponseMessage> UpdateProfile(FormDataCollection form)
        {
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            var ID = Convert.ToInt32(User.Identity.GetUserId());
            if (values.Contains("UserID") && Convert.ToInt32(values["UserID"]) != ID)
                return Request.CreateResponse(HttpStatusCode.Forbidden);
            var aUser = _context.User_Account.Where(x => x.UserID == ID).FirstOrDefault();
            if (aUser == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { });
            }
            bool passwordChanged = false;
            if (values.Contains("IsReceiveEmail") && Convert.ToInt32(values["IsReceiveEmail"]) != aUser.IsReceiveEmail)
            {
                int isReceiveEmail = Convert.ToInt32(values["IsReceiveEmail"]);
                aUser.IsReceiveEmail = isReceiveEmail;
            }
            if (values.Contains("IsTwoFA") &&  values.Contains("Code") && Convert.ToInt32(values["IsTwoFA"]) != aUser.IsTwoFA)
            {
                int isTwoFA = Convert.ToInt32(values["IsTwoFA"]);
                string Code = Convert.ToString(values["Code"]);
                TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                bool result = tfa.ValidateTwoFactorPIN(aUser.Authenticator_Secret, Code);
                if (!result)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { status = "ko", error = "Mã xác nhận không đúng" });
                }
                aUser.IsTwoFA = isTwoFA;
            }
            if (values.Contains("Password") && !string.IsNullOrEmpty(Convert.ToString(values["Password"])))
            {
                string Password = Convert.ToString(values["Password"]);
                if (!values.Contains("CurrentPassword") || !API.Services.PasswordSecurity.Verify(Convert.ToString(values["CurrentPassword"]), aUser.MatKhau))
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { status = "ko", error = "Mật khẩu hiện tại không đúng." });
                if (Password.Length < 12 || Password.Length > 255)
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { status = "ko", error = "Mật khẩu mới cần từ 12 đến 255 ký tự." });
                if (Password == Convert.ToString(values["CurrentPassword"]))
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { status = "ko", error = "Mật khẩu mới phải khác mật khẩu hiện tại." });
                aUser.MatKhau = API.Services.PasswordSecurity.Hash(Password);
                passwordChanged = true;
            }
            // Phien bi han che do mat khau mac dinh: phai doi mat khau VA co 2FA thi moi hoan tat.
            var principal = User as System.Security.Claims.ClaimsPrincipal;
            if (principal != null && principal.HasClaim(API.Services.DefaultPasswordPolicy.SetupClaim, "1") && (!passwordChanged || aUser.IsTwoFA != 1))
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { status = "ko", error = "Cần đặt mật khẩu mới và bật Google Authenticator (nhập mã xác nhận) cùng lúc." });
            _context.SaveChanges();
            if (passwordChanged) API.Services.DefaultPasswordPolicy.Clear(_context, ID);
            return Request.CreateResponse(HttpStatusCode.OK, new { status = "ok"});
        }

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var bytes = new byte[length];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create()) rng.GetBytes(bytes);
            return new string(bytes.Select(b => chars[b % chars.Length]).ToArray());
        }
        [HttpGet]
        public async Task<HttpResponseMessage> GenerateAuthenticateSecret()
        {
            TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
            var username = User.Identity.GetUserName();
            var userId = Convert.ToInt32(User.Identity.GetUserId());
            var aUser = _context.User_Account.Where(x => x.UserID == userId).FirstOrDefault();
            if (aUser.IsTwoFA == 1) return Request.CreateResponse(HttpStatusCode.Conflict);
            aUser.Authenticator_Secret = RandomString(32);
            await _context.SaveChangesAsync();

            SetupCode setupInfo = tfa.GenerateSetupCode("moha.gov.vn", username, aUser.Authenticator_Secret, false, 3);
            string imageUrl = setupInfo.QrCodeSetupImageUrl;
            string entryKey = setupInfo.ManualEntryKey;

            return Request.CreateResponse(HttpStatusCode.OK, new { imageUrl, entryKey });
        }

    }
}