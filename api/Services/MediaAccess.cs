using System;
using System.Linq;
using API.Models;

namespace API.Services
{
    // Media trong CMS duoc tach theo thu muc user-{UserID}. File cu nam o goc Upload chi
    // hien voi role co quyen xem tat ca; URL /Upload van cong khai de noi dung da xuat ban
    // tren portal khong bi anh huong.
    internal static class MediaAccess
    {
        internal const string ViewAllPermission = "view-all-media";

        public static bool CanViewAll(CongTTDT_MOHAEntities context, int userId)
        {
            return context.User_Account.Any(u => u.UserID == userId && u.Role.RolePermissions.Any(p =>
                p.Permission.Name == ViewAllPermission));
        }

        public static string OwnerFolder(int userId)
        {
            return "user-" + userId;
        }

        public static bool CanAccessUploadPath(CongTTDT_MOHAEntities context, int userId, string uploadPath)
        {
            if (CanViewAll(context, userId)) return true;
            if (string.IsNullOrWhiteSpace(uploadPath)) return false;
            var normalized = uploadPath.Replace('\\', '/').TrimStart('/');
            return normalized.StartsWith("Upload/" + OwnerFolder(userId) + "/", StringComparison.OrdinalIgnoreCase);
        }
    }
}
