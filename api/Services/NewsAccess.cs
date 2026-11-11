using System;
using System.Linq;
using API.Models;

namespace API
{
    // Quyen xem tin: admin (manage-user) hoac nguoi phe duyet xem duoc moi tin; nguoi khac chi xem tin do chinh ho tao.
    // Dung chung cho TinTucsController va cac controller bang con (TinTuc_Files, _BinhLuan, _History, _QuyTrinh, ...).
    internal static class NewsAccess
    {
        public static bool CanViewAll(CongTTDT_MOHAEntities context, int userId)
        {
            if (context.UserBuocQuyTrinhs.Any(u => u.UserID == userId)) return true;
            return context.User_Account.Any(u => u.UserID == userId && u.Role.RolePermissions.Any(p => p.Permission.Name == "manage-user"));
        }

        public static bool CanView(CongTTDT_MOHAEntities context, int userId, int? tinTucId)
        {
            if (!tinTucId.HasValue) return false;
            if (CanViewAll(context, userId)) return true;
            return context.TinTucs.Any(t => t.ID == tinTucId.Value && t.NguoiTaoID == userId);
        }
    }
}