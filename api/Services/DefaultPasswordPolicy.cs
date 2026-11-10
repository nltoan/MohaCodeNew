using System.Configuration;
using System.Data.Entity;
using System.Linq;
namespace API.Services
{
    // Mat khau mac dinh (do quan tri cap) chi duoc dung dang nhap MaxLogins lan.
    // Sau do phien dang nhap bi han che: chi duoc doi mat khau + bat 2FA (xem Startup).
    // Dung SQL truc tiep de khong phai sua MohaModel.edmx. Can chay db/migrations/20261110-MatKhauMacDinh.sql truoc.
    public static class DefaultPasswordPolicy
    {
        public const string SetupClaim = "setup_required";

        public class State { public int MatKhauMacDinh { get; set; } public int SoLanDangNhapMacDinh { get; set; } }

        public static int MaxLogins
        {
            get
            {
                int n;
                return int.TryParse(ConfigurationManager.AppSettings["DefaultPasswordMaxLogins"], out n) && n > 0 ? n : 3;
            }
        }

        public static State Get(DbContext db, int userId)
        {
            return db.Database.SqlQuery<State>(
                "SELECT MatKhauMacDinh, SoLanDangNhapMacDinh FROM dbo.User_Account WHERE UserID = @p0", userId).FirstOrDefault()
                ?? new State();
        }

        public static void CountLogin(DbContext db, int userId)
        {
            db.Database.ExecuteSqlCommand(
                "UPDATE dbo.User_Account SET SoLanDangNhapMacDinh = SoLanDangNhapMacDinh + 1 WHERE UserID = @p0", userId);
        }

        // Quan tri vua cap/dat lai mat khau -> mat khau nay la mat khau mac dinh.
        public static void MarkDefault(DbContext db, int userId)
        {
            db.Database.ExecuteSqlCommand(
                "UPDATE dbo.User_Account SET MatKhauMacDinh = 1, SoLanDangNhapMacDinh = 0 WHERE UserID = @p0", userId);
        }

        // Nguoi dung tu dat mat khau moi -> het mat khau mac dinh.
        public static void Clear(DbContext db, int userId)
        {
            db.Database.ExecuteSqlCommand(
                "UPDATE dbo.User_Account SET MatKhauMacDinh = 0, SoLanDangNhapMacDinh = 0 WHERE UserID = @p0", userId);
        }
    }
}
