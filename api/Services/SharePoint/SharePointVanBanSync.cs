using API.Controllers;
using API.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Hosting;

namespace API.Services.SharePoint
{
    public class SharePointSyncResult
    {
        public DateTime StartedUtc { get; set; }
        public DateTime FinishedUtc { get; set; }
        public bool Full { get; set; }
        public int Read { get; set; }
        public int Created { get; set; }
        public int Updated { get; set; }
        public int Hidden { get; set; }
        public int Skipped { get; set; }
        public int Failed { get; set; }
        public List<string> Errors { get; set; }
    }

    // Dong bo mot chieu: thu vien tai lieu SharePoint "VanBan" -> bang VanBan / Files trong SQL.
    // SharePoint la nguon chinh; portal van doc tu SQL nen khong phu thuoc SharePoint luc chay.
    // Khoa doi chieu: VanBan.Migrate_Source = "sharepoint:" + UniqueId cua muc.
    public static class SharePointVanBanSync
    {
        const string SourcePrefix = "sharepoint:";
        const int LangVi = 1066;
        static readonly SemaphoreSlim gate = new SemaphoreSlim(1, 1);
        static readonly Regex GuidLike = new Regex("^[0-9a-fA-F-]{8,40}$", RegexOptions.Compiled);

        static string StatePath { get { return HostingEnvironment.MapPath("~/App_Data/sharepoint-sync.json"); } }

        public static SharePointSyncResult LastResult()
        {
            try { return System.IO.File.Exists(StatePath) ? JsonConvert.DeserializeObject<SharePointSyncResult>(System.IO.File.ReadAllText(StatePath)) : null; }
            catch { return null; }
        }

        // Tra ve null neu dang co lan chay khac.
        public static async Task<SharePointSyncResult> RunAsync(bool full, CancellationToken ct)
        {
            var settings = SharePointSettings.Load();
            if (!settings.Enabled) throw new SharePointException("SharePointSiteUrl is not configured.");
            if (!await gate.WaitAsync(0)) return null;
            try
            {
                var result = new SharePointSyncResult { StartedUtc = DateTime.UtcNow, Full = full, Errors = new List<string>() };
                var previous = LastResult();
                // Lui 5 phut de khong sot muc sua trong luc lan truoc dang chay (lech dong ho giua hai may).
                DateTime? since = (!full && previous != null && previous.Failed == 0) ? (DateTime?)previous.StartedUtc.AddMinutes(-5) : null;
                int? lopVanBanId = null;
                int parsedLop;
                if (int.TryParse(ConfigurationManager.AppSettings["SharePointVanBanLopVanBanId"], out parsedLop) && parsedLop > 0) lopVanBanId = parsedLop;

                using (var client = new SharePointClient(settings))
                {
                    var items = await client.GetItemsAsync(settings.VanBanList, since, ct);
                    result.Read = items.Count;
                    foreach (var item in items)
                    {
                        ct.ThrowIfCancellationRequested();
                        try { await SyncItemAsync(client, item, lopVanBanId, result, ct); }
                        catch (Exception ex) when (!(ex is OperationCanceledException))
                        {
                            result.Failed++;
                            if (result.Errors.Count < 20) result.Errors.Add("Id " + (string)item["Id"] + ": " + ex.Message);
                        }
                    }
                }
                result.FinishedUtc = DateTime.UtcNow;
                try { Directory.CreateDirectory(Path.GetDirectoryName(StatePath)); System.IO.File.WriteAllText(StatePath, JsonConvert.SerializeObject(result)); } catch { }
                return result;
            }
            finally { gate.Release(); }
        }

        static async Task SyncItemAsync(SharePointClient client, JObject item, int? lopVanBanId, SharePointSyncResult result, CancellationToken ct)
        {
            var uid = (string)item["UniqueId"];
            if (string.IsNullOrEmpty(uid) || !GuidLike.IsMatch(uid)) throw new SharePointException("Item has no valid UniqueId.");
            var key = SourcePrefix + uid;
            var published = string.Equals((string)item["TrangThai"], "Published", StringComparison.OrdinalIgnoreCase);

            using (var db = new CongTTDT_MOHAEntities())
            {
                var vb = db.VanBans.FirstOrDefault(x => x.Migrate_Source == key);
                if (!published)
                {
                    // Muc bi go khoi trang thai cong bo: an khoi portal, khong xoa.
                    if (vb != null && vb.TrangThai != 0) { vb.TrangThai = 0; db.SaveChanges(); result.Hidden++; } else result.Skipped++;
                    return;
                }

                var fileName = (string)item["FileLeafRef"];
                var fileRef = (string)item["FileRef"];
                if (!FileManagerController.SafeUploadName(fileName)) throw new SharePointException("File name or extension is not allowed: " + fileName);
                var bytes = await client.DownloadFileAsync(fileRef, ct);

                bool isNew = vb == null;
                if (isNew) vb = new VanBan { Migrate_Source = key };
                vb.SoKyHieu = (string)item["SoKyHieu"];
                vb.TrichYeu = (string)item["Title"];
                vb.NguoiKy = Cut((string)item["NguoiKy"], 500);
                vb.ChucDanh = Cut((string)item["ChucDanh"], 500);
                vb.NgayBanHanh = ParseDate(item["NgayBanHanh"]);
                vb.NgayXuatBan = vb.NgayBanHanh;
                vb.NgayCoHieuLuc = ParseDate(item["NgayCoHieuLuc"]);
                vb.Lang = LangVi;
                vb.TrangThai = 1;
                if (isNew) db.VanBans.Add(vb);
                db.SaveChanges();

                if (isNew && lopVanBanId.HasValue)
                    db.VanBan_LopVanBan.Add(new VanBan_LopVanBan { VanBanID = vb.ID, LopVanBanID = lopVanBanId.Value });

                var link = db.VanBan_Files.Where(x => x.VanBanID == vb.ID).ToList();
                var fileRow = link.Select(x => x.File).FirstOrDefault(f => f != null && f.Ten == fileName);
                var relDir = "~/Upload/SharePoint/" + uid;
                var absDir = HostingEnvironment.MapPath(relDir);
                Directory.CreateDirectory(absDir);
                var absFile = Path.Combine(absDir, fileName);
                var baseDir = Path.GetFullPath(HostingEnvironment.MapPath("~/Upload/SharePoint")) + Path.DirectorySeparatorChar;
                if (!Path.GetFullPath(absFile).StartsWith(baseDir, StringComparison.OrdinalIgnoreCase)) throw new SharePointException("Unsafe target path.");
                System.IO.File.WriteAllBytes(absFile, bytes);

                var publicUrl = "/Upload/SharePoint/" + uid + "/" + Uri.EscapeDataString(fileName);
                if (fileRow == null)
                {
                    // Ten tep doi: thay lien ket cu bang tep moi (dong File cu giu lai, khong xoa).
                    foreach (var old in link) db.VanBan_Files.Remove(old);
                    fileRow = db.Files.Add(new API.Models.File { Ten = fileName, MoTa = fileName, NgayTao = DateTime.Now, TrangThai = "active" });
                    fileRow.LinkLuuTru = publicUrl;
                    fileRow.KichThuoc = bytes.Length.ToString(CultureInfo.InvariantCulture);
                    db.SaveChanges();
                    db.VanBan_Files.Add(new VanBan_Files { VanBanID = vb.ID, FileID = fileRow.ID });
                }
                else
                {
                    fileRow.LinkLuuTru = publicUrl;
                    fileRow.KichThuoc = bytes.Length.ToString(CultureInfo.InvariantCulture);
                }
                db.SaveChanges();
                if (isNew) result.Created++; else result.Updated++;
            }
        }

        // Viet Nam UTC+7, khong co gio mua he.
        static readonly TimeSpan VietNamOffset = TimeSpan.FromHours(7);

        // SharePoint REST tra cot ngay theo UTC: ngay 20/11 nhap o gio Viet Nam ve thanh "2026-11-19T17:00:00Z".
        // Doi sang gio Viet Nam roi moi lay phan ngay, neu khong ngay ban hanh bi lui mot ngay.
        static DateTime? ParseDate(JToken t)
        {
            if (t == null || t.Type == JTokenType.Null) return null;
            DateTimeOffset d;
            if (t.Type == JTokenType.Date)
            {
                // Json.NET co the da tu doi chuoi ISO thanh DateTime.
                var v = (DateTime)t;
                d = v.Kind == DateTimeKind.Unspecified ? new DateTimeOffset(v, TimeSpan.Zero) : new DateTimeOffset(v.ToUniversalTime(), TimeSpan.Zero);
            }
            else
            {
                var s = (string)t;
                if (string.IsNullOrWhiteSpace(s)) return null;
                if (!DateTimeOffset.TryParse(s, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out d)) return null;
            }
            return DateTime.SpecifyKind(d.ToOffset(VietNamOffset).Date, DateTimeKind.Unspecified);
        }

        static string Cut(string s, int max) { return s == null ? null : (s.Length <= max ? s : s.Substring(0, max)); }
    }
}
