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
    //[Authorize]
    [Route("api/User_Account/{action}", Name = "User_AccountsApi")]
    public class User_AccountController : ApiController
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        [HttpGet]
        public async Task<HttpResponseMessage> GetLive(DataSourceLoadOptions loadOptions)
        {
            var banners = _context.User_Account.Where(x=>x.TrangThai != "deleted").Select(i => new {
                i.UserID,
                i.CreationDate,
                i.DiaChi,
                i.EmailAddress,
                i.IDDVC_DonViDangKy,
                i.LastLockoutDate,
                i.LastLoginDate,
                i.LastPasswordChangeDate,
                i.LoaiTaiKhoan,
                i.MatKhau,
                i.NguoiLienHe_CMT_HoChieu,
                i.NguoiLienHe_DiaChi,
                i.NguoiLienHe_Email,
                i.NguoiLienHe_HoVaTen,
                i.NguoiLienHe_SoDienThoai,
                i.PasswordAnswer,
                i.PasswordQuestion,
                i.SoCMND,
                i.SoDienThoai,
                i.TenDangKy,
                i.TenTruyCap,
                i.TrangThai,
                i.IsTwoFA,
                i.IsReceiveEmail,
                i.RoleId
            });

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(banners, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
        {
            var banners = _context.User_Account.Select(i => new {
                i.UserID,
                i.CreationDate,
                i.DiaChi,
                i.EmailAddress,
                i.IDDVC_DonViDangKy,
                i.LastLockoutDate,
                i.LastLoginDate,
                i.LastPasswordChangeDate,
                i.LoaiTaiKhoan,
                i.MatKhau,
                i.NguoiLienHe_CMT_HoChieu,
                i.NguoiLienHe_DiaChi,
                i.NguoiLienHe_Email,
                i.NguoiLienHe_HoVaTen,
                i.NguoiLienHe_SoDienThoai,
                i.PasswordAnswer,
                i.PasswordQuestion,
                i.SoCMND,
                i.SoDienThoai,
                i.TenDangKy,
                i.TenTruyCap,
                i.TrangThai,
                i.IsTwoFA,
                i.IsReceiveEmail,
                i.RoleId
            });

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(banners, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> GetLoginUser(DataSourceLoadOptions loadOptions)
        {
            var banners = _context.User_Account.Include(x=>x.Role.RolePermissions.Select(y=>y.Permission));

            return Request.CreateResponse(await DataSourceLoader.LoadAsync(banners, loadOptions));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> Post(FormDataCollection form)
        {
            var model = new User_Account();
            var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
            PopulateModel(model, values);

            Validate(model);
            if (!ModelState.IsValid)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

            var result = _context.User_Account.Add(model);
            await _context.SaveChangesAsync();

            return Request.CreateResponse(HttpStatusCode.Created, new { result.UserID });
        }

        [HttpPut]
        public async Task<HttpResponseMessage> Put(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.User_Account.FirstOrDefaultAsync(item => item.UserID == key);
            if (model == null)
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
        public async Task Delete(FormDataCollection form)
        {
            var key = Convert.ToInt32(form.Get("key"));
            var model = await _context.User_Account.FirstOrDefaultAsync(item => item.UserID == key);
            model.TrangThai = "deleted";
            await _context.SaveChangesAsync();
        }


        private void PopulateModel(User_Account model, IDictionary values)
        {
            string USERID = nameof(User_Account.UserID);
            string DIACHI = nameof(User_Account.DiaChi);
            string EMAILADDRESS = nameof(User_Account.EmailAddress);
            string IDDVC_DONVIDANGKY = nameof(User_Account.IDDVC_DonViDangKy);
            string LASTLOCKOUTDATE = nameof(User_Account.LastLockoutDate);
            string LASTLOGINDATE = nameof(User_Account.LastLoginDate);
            string LASTPASSWORDCHANGEDATE = nameof(User_Account.LastPasswordChangeDate);
            string LOAITAIKHOAN = nameof(User_Account.LoaiTaiKhoan);
            string MATKHAU = nameof(User_Account.MatKhau);
            string NGUOILIENHE_CMT_HOCHIEU = nameof(User_Account.NguoiLienHe_CMT_HoChieu);
            string NGUOILIENHE_DIACHI = nameof(User_Account.NguoiLienHe_DiaChi);
            string NGUOILIENHE_EMAIL = nameof(User_Account.NguoiLienHe_Email);
            string NGUOILIENHE_HOVATEN = nameof(User_Account.NguoiLienHe_HoVaTen);
            string NGUOILIENHE_SODIENTHOAI = nameof(User_Account.NguoiLienHe_SoDienThoai);
            string PASSWORDANSWER = nameof(User_Account.PasswordAnswer);
            string PASSWORDQUESTION = nameof(User_Account.PasswordQuestion);
            string SOCMND = nameof(User_Account.SoCMND);
            string SODIENTHOAI = nameof(User_Account.SoDienThoai);
            string TENDANGKY = nameof(User_Account.TenDangKy);
            string TENTRUYCAP = nameof(User_Account.TenTruyCap);
            string TRANGTHAI = nameof(User_Account.TrangThai);
            string ROLEID = nameof(User_Account.RoleId);
            string ISRECEIVEEMAIL = nameof(User_Account.IsReceiveEmail);

            if (values.Contains(USERID))
            {
                model.UserID = Convert.ToInt32(values[USERID]);
            }
            if (values.Contains(ISRECEIVEEMAIL))
            {
                model.IsReceiveEmail = Convert.ToInt32(values[ISRECEIVEEMAIL]);
            }

            if (values.Contains(DIACHI))
            {
                model.DiaChi = Convert.ToString(values[DIACHI]);
            }

            if (values.Contains(EMAILADDRESS))
            {
                model.EmailAddress = Convert.ToString(values[EMAILADDRESS]);
            }

            if (values.Contains(IDDVC_DONVIDANGKY))
            {
                model.IDDVC_DonViDangKy = Convert.ToString(values[IDDVC_DONVIDANGKY]);
            }

            if (values.Contains(LASTLOCKOUTDATE))
            {
                model.LastLockoutDate = values[LASTLOCKOUTDATE] != null ? Convert.ToDateTime(values[LASTLOCKOUTDATE]) : (DateTime?)null;
            }

            if (values.Contains(EMAILADDRESS))
            {
                model.EmailAddress = Convert.ToString(values[EMAILADDRESS]);
            }

            if (values.Contains(LASTLOGINDATE))
            {
                model.LastLoginDate = values[LASTLOGINDATE] != null ? Convert.ToDateTime(values[LASTLOGINDATE]) : (DateTime?)null;
            }

            if (values.Contains(EMAILADDRESS))
            {
                model.EmailAddress = Convert.ToString(values[EMAILADDRESS]);
            }

            if (values.Contains(LASTPASSWORDCHANGEDATE))
            {
                model.LastPasswordChangeDate = values[LASTPASSWORDCHANGEDATE] != null ? Convert.ToDateTime(values[LASTPASSWORDCHANGEDATE]) : (DateTime?)null;
            }

            if (values.Contains(LOAITAIKHOAN))
            {
                model.LoaiTaiKhoan = Convert.ToString(values[LOAITAIKHOAN]);
            }

            if (values.Contains(EMAILADDRESS))
            {
                model.EmailAddress = Convert.ToString(values[EMAILADDRESS]);
            }

            if (values.Contains(MATKHAU))
            {
                model.MatKhau = Convert.ToString(values[MATKHAU]);
            }

            if (values.Contains(NGUOILIENHE_CMT_HOCHIEU))
            {
                model.NguoiLienHe_CMT_HoChieu = Convert.ToString(values[NGUOILIENHE_CMT_HOCHIEU]);
            }

            if (values.Contains(EMAILADDRESS))
            {
                model.EmailAddress = Convert.ToString(values[EMAILADDRESS]);
            }

            if (values.Contains(NGUOILIENHE_DIACHI))
            {
                model.NguoiLienHe_DiaChi = Convert.ToString(values[NGUOILIENHE_DIACHI]);
            }

            if (values.Contains(NGUOILIENHE_EMAIL))
            {
                model.NguoiLienHe_Email = Convert.ToString(values[NGUOILIENHE_EMAIL]);
            }

            if (values.Contains(EMAILADDRESS))
            {
                model.EmailAddress = Convert.ToString(values[EMAILADDRESS]);
            }

            if (values.Contains(NGUOILIENHE_HOVATEN))
            {
                model.NguoiLienHe_HoVaTen = Convert.ToString(values[NGUOILIENHE_HOVATEN]);
            }

            if (values.Contains(NGUOILIENHE_SODIENTHOAI))
            {
                model.NguoiLienHe_SoDienThoai = Convert.ToString(values[NGUOILIENHE_SODIENTHOAI]);
            }

            if (values.Contains(EMAILADDRESS))
            {
                model.EmailAddress = Convert.ToString(values[EMAILADDRESS]);
            }

            if (values.Contains(PASSWORDANSWER))
            {
                model.PasswordAnswer = Convert.ToString(values[PASSWORDANSWER]);
            }

            if (values.Contains(EMAILADDRESS))
            {
                model.EmailAddress = Convert.ToString(values[EMAILADDRESS]);
            }

            if (values.Contains(PASSWORDQUESTION))
            {
                model.PasswordQuestion = Convert.ToString(values[PASSWORDQUESTION]);
            }
            if (values.Contains(SOCMND))
            {
                model.SoCMND = Convert.ToString(values[SOCMND]);
            }
            if (values.Contains(SODIENTHOAI))
            {
                model.SoDienThoai = Convert.ToString(values[SODIENTHOAI]);
            }
            if (values.Contains(TENDANGKY))
            {
                model.TenDangKy = Convert.ToString(values[TENDANGKY]);
            }
            if (values.Contains(TENTRUYCAP))
            {
                model.TenTruyCap = Convert.ToString(values[TENTRUYCAP]);
            }
            if (values.Contains(PASSWORDQUESTION))
            {
                model.PasswordQuestion = Convert.ToString(values[PASSWORDQUESTION]);
            }
            if (values.Contains(TRANGTHAI))
            {
                model.TrangThai = Convert.ToString(values[TRANGTHAI]);
            }
            if (values.Contains(ROLEID))
            {
                model.RoleId = Convert.ToInt32(values[ROLEID]);
            }
        }

        private string GetFullErrorMessage(ModelStateDictionary modelState)
        {
            var messages = new List<string>();

            foreach (var entry in modelState)
            {
                foreach (var error in entry.Value.Errors)
                    messages.Add(error.ErrorMessage);
            }

            return String.Join(" ", messages);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}