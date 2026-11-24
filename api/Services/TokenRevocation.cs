using System;
using System.Data.Entity;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;
using API.Models;
using API.OAuth.Providers;

namespace API.Services
{
    // Thu hoi bearer token khi doi mat khau hoac khoa tai khoan, khong can migration:
    // token mang claim pwd_stamp suy ra tu hash mat khau dang luu; doi mat khau -> stamp khac -> token cu bi tu choi.
    public static class TokenRevocation
    {
        public const string StampClaim = "pwd_stamp";
        const string CachePrefix = "token-user:";
        // Cache ngan de giam truy van DB; cache theo tung instance, doi mat khau tren instance nay thi xoa ngay (Evict).
        static readonly TimeSpan CacheLifetime = TimeSpan.FromSeconds(20);

        sealed class UserState
        {
            public bool Active;
            public string Stamp;
        }

        public static string Stamp(string storedPassword)
        {
            using (var sha = SHA256.Create())
            {
                var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(storedPassword ?? ""));
                return Convert.ToBase64String(hash).TrimEnd('=').Replace('+', '-').Replace('/', '_').Substring(0, 16);
            }
        }

        // Goi sau khi luu thay doi mat khau / trang thai cua user.
        public static void Evict(int userId)
        {
            HttpRuntime.Cache.Remove(CachePrefix + userId);
        }

        // true neu token (userId + stamp) con hieu luc: user ton tai, dang hoat dong, stamp khop.
        public static async Task<bool> IsValidAsync(int userId, string stamp)
        {
            if (string.IsNullOrEmpty(stamp)) return false;
            var key = CachePrefix + userId;
            var state = HttpRuntime.Cache[key] as UserState;
            if (state == null)
            {
                using (var db = new CongTTDT_MOHAEntities())
                {
                    var row = await db.User_Account.AsNoTracking()
                        .Where(u => u.UserID == userId)
                        .Select(u => new { u.MatKhau, u.TrangThai })
                        .FirstOrDefaultAsync();
                    state = row == null
                        ? new UserState { Active = false, Stamp = null }
                        : new UserState { Active = ActiveUserStatus.IsActive(row.TrangThai), Stamp = Stamp(row.MatKhau) };
                }
                HttpRuntime.Cache.Insert(key, state, null, DateTime.UtcNow.Add(CacheLifetime), Cache.NoSlidingExpiration);
            }
            return state.Active && state.Stamp != null && string.Equals(state.Stamp, stamp, StringComparison.Ordinal);
        }
    }
}
