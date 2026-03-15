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
            var ID = Convert.ToInt32(values["UserID"]);
            var aUser = _context.User_Account.Where(x => x.UserID == ID).FirstOrDefault();
            if (aUser == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { });
            }
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
            if (values.Contains("Password"))
            {
                string Password = Convert.ToString(values["Password"]);
                aUser.MatKhau = Password;
            }
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.OK, new { status = "ok"});
        }
        private static Random random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        [HttpGet]
        public async Task<HttpResponseMessage> GenerateAuthenticateSecret()
        {
            TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
            var username = User.Identity.GetUserName();
            var userId = Convert.ToInt32(User.Identity.GetUserId());
            var aUser = _context.User_Account.Where(x => x.UserID == userId).FirstOrDefault();
            aUser.Authenticator_Secret = RandomString(8);
            await _context.SaveChangesAsync();

            SetupCode setupInfo = tfa.GenerateSetupCode("moha.gov.vn", username, aUser.Authenticator_Secret, false, 3);
            string imageUrl = setupInfo.QrCodeSetupImageUrl;
            string entryKey = setupInfo.ManualEntryKey;

            return Request.CreateResponse(HttpStatusCode.OK, new { imageUrl, entryKey });
        }

    }
}