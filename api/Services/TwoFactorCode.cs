using System;
using System.Web;
using System.Web.Caching;
using Google.Authenticator;

namespace API.Services
{
    // Kiem tra ma Google Authenticator voi do lech dong ho ro rang (mac dinh thu vien la 5 phut).
    public static class TwoFactorCode
    {
        // Tuong thich voi hanh vi cu cua thu vien: chap nhan ma lech toi da 5 phut.
        // Van chan dung lai ma da dung thanh cong trong ReplayWindow ben duoi.
        public static readonly TimeSpan Tolerance = TimeSpan.FromMinutes(5);
        // Giu dau ma da dung lau hon cua so hop le de chan dung lai.
        static readonly TimeSpan ReplayWindow = TimeSpan.FromMinutes(3);

        // secretIsBase32 = false: giong GenerateSetupCode trong HomeController.
        public static bool IsValid(string secret, string code)
        {
            if (string.IsNullOrEmpty(secret) || string.IsNullOrEmpty(code)) return false;
            code = code.Trim();
            if (code.Length != 6) return false;
            for (var i = 0; i < code.Length; i++) if (code[i] < '0' || code[i] > '9') return false;
            return new TwoFactorAuthenticator().ValidateTwoFactorPIN(secret, code, Tolerance, false);
        }

        // Dung khi dang nhap: ma dung nhung da dung thanh cong truoc do (trong cua so) thi tu choi.
        public static bool IsValidOnce(int userId, string secret, string code)
        {
            if (!IsValid(secret, code)) return false;
            var key = "totp-used:" + userId + ":" + code.Trim();
            // Cache.Add tra ve gia tri cu neu khoa da ton tai (nguyen tu).
            var existing = HttpRuntime.Cache.Add(key, true, null, DateTime.UtcNow.Add(ReplayWindow), Cache.NoSlidingExpiration, CacheItemPriority.High, null);
            return existing == null;
        }
    }
}
