using System;
using System.Linq;
using API.Models;

namespace API
{
    // Quyen xem tin: chi role co quyen view-all-tintuc duoc xem toan bo.
    // Nguoi phe duyet van xem duoc cac tin dang cho duyet duoc giao qua danh sach ownerApproving,
    // nhung khong duoc mo toan bo kho tin cua nguoi khac.
    // Dung chung cho TinTucsController va cac controller bang con (TinTuc_Files, _BinhLuan, _History, _QuyTrinh, ...).
    internal static class NewsAccess
    {
        public static bool CanViewAll(CongTTDT_MOHAEntities context, int userId)
        {
            return context.User_Account.Any(u => u.UserID == userId && u.Role.RolePermissions.Any(p =>
                p.Permission.Name == "view-all-tintuc"));
        }

        public static bool CanView(CongTTDT_MOHAEntities context, int userId, int? tinTucId)
        {
            if (!tinTucId.HasValue) return false;
            if (CanViewAll(context, userId)) return true;
            return context.TinTucs.Any(t => t.ID == tinTucId.Value && t.NguoiTaoID == userId);
        }
    }
}
