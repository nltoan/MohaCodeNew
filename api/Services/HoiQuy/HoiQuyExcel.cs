using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Xml;
using System.Xml.Linq;
using System.Text.RegularExpressions;
namespace API.Services.HoiQuy
{
    public static class HoiQuyExcel
    {
        static readonly XNamespace S = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
        static readonly XNamespace R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
        static readonly XNamespace P = "http://schemas.openxmlformats.org/package/2006/relationships";
        static readonly XNamespace D = "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing";
        static readonly XNamespace A = "http://schemas.openxmlformats.org/drawingml/2006/main";
        static XDocument Read(ZipArchive zip, string path)
        {
            var entry = zip.GetEntry(path);
            if (entry == null || entry.Length > 32 * 1024 * 1024) throw new InvalidDataException("Cấu trúc Excel không hợp lệ: " + path);
            using (var stream = entry.Open())
            using (var reader = XmlReader.Create(stream, new XmlReaderSettings { DtdProcessing = DtdProcessing.Prohibit, XmlResolver = null, MaxCharactersInDocument = 32 * 1024 * 1024 })) return XDocument.Load(reader);
        }
        static string Resolve(string part, string target)
        {
            var uri = new Uri(new Uri("https://xlsx.local/" + part), target);
            if (uri.Host != "xlsx.local") throw new InvalidDataException("Excel chứa liên kết ngoài không hỗ trợ.");
            return Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/'));
        }
        static string RelPath(string part) { return Path.GetDirectoryName(part).Replace('\\', '/') + "/_rels/" + Path.GetFileName(part) + ".rels"; }
        static string Text(XElement element) { return string.Concat(element.Descendants(S + "t").Select(x => x.Value)); }
        static string Clean(string value) { return (value ?? "").Replace("_x000D_", "").Replace("\r\n", "\n").Trim(); }
        public static List<HoiQuyRecord> Parse(Stream stream, bool logos)
        {
            using (var zip = new ZipArchive(stream, ZipArchiveMode.Read, true))
            {
                if (zip.Entries.Count > 5000 || zip.Entries.Sum(e => e.Length) > 256L * 1024 * 1024) throw new InvalidDataException("File Excel vượt giới hạn giải nén.");
                var book = Read(zip, "xl/workbook.xml");
                var sheet = book.Descendants(S + "sheet").FirstOrDefault(x => (string)x.Attribute("name") == "HoiQuyTrungUong");
                if (sheet == null) throw new InvalidDataException("Không tìm thấy sheet HoiQuyTrungUong.");
                var rel = Read(zip, "xl/_rels/workbook.xml.rels").Descendants(P + "Relationship").FirstOrDefault(x => (string)x.Attribute("Id") == (string)sheet.Attribute(R + "id"));
                if (rel == null) throw new InvalidDataException("Thiếu sheet dữ liệu.");
                var part = Resolve("xl/workbook.xml", (string)rel.Attribute("Target"));
                var shared = zip.GetEntry("xl/sharedStrings.xml") == null ? new string[0] : Read(zip, "xl/sharedStrings.xml").Descendants(S + "si").Select(Text).ToArray();
                var doc = Read(zip, part);
                var rows = new List<HoiQuyRecord>();
                var expected = new[] { "STT", "Logo", "Tên đơn vị", "Loại", "Chủ tịch", "Địa chỉ", "Số điện thoại", "Email", "Website", "Tôn chỉ mục đích" };
                bool headerFound = false;
                foreach (var row in doc.Descendants(S + "row"))
                {
                    int rowNumber = (int)row.Attribute("r");
                    var cells = new string[10];
                    foreach (var cell in row.Elements(S + "c"))
                    {
                        var col = Regex.Match((string)cell.Attribute("r") ?? "", "^[A-Z]+").Value;
                        if (col.Length != 1 || col[0] < 'A' || col[0] > 'J') continue;
                        string value = (string)cell.Element(S + "v") ?? "";
                        if ((string)cell.Attribute("t") == "s") { int index; if (!int.TryParse(value, out index) || index < 0 || index >= shared.Length) throw new InvalidDataException("Dữ liệu ô Excel không hợp lệ."); value = shared[index]; }
                        else if ((string)cell.Attribute("t") == "inlineStr") value = Text(cell);
                        cells[col[0] - 'A'] = Clean(value);
                    }
                    for (int i = 0; i < 10; i++) cells[i] = cells[i] ?? "";
                    if (rowNumber == 3)
                    {
                        if (!expected.SequenceEqual(cells)) throw new InvalidDataException("Tiêu đề dòng 3 không khớp mẫu Excel Hội và Quỹ.");
                        headerFound = true;
                    }
                    if (rowNumber < 4 || cells.All(string.IsNullOrWhiteSpace)) continue;
                    if (rows.Count >= 10000) throw new InvalidDataException("Chỉ hỗ trợ tối đa 10.000 dòng.");
                    var record = new HoiQuyRecord { SourceRow = rowNumber, Name = cells[2], Type = cells[3], Chair = cells[4], Address = cells[5], Phone = cells[6], Email = cells[7], Website = cells[8], Purpose = cells[9] };
                    if (record.Name.Length == 0) record.Issues.Add("Thiếu tên đơn vị");
                    if (record.Type != "Hội" && record.Type != "Quỹ") record.Issues.Add("Loại phải là Hội hoặc Quỹ");
                    if (record.Name.Length > 1000 || record.Chair.Length > 1000 || record.Address.Length > 4000 || record.Phone.Length > 1000 || record.Email.Length > 1000 || record.Website.Length > 2000 || record.Purpose.Length > 100000) record.Issues.Add("Nội dung vượt độ dài cho phép");
                    if (row.Elements(S + "c").Any(c => c.Element(S + "f") != null)) record.Issues.Add("Dòng chứa công thức; cần chuyển thành giá trị");
                    rows.Add(record);
                }
                if (!headerFound || rows.Count == 0) throw new InvalidDataException("Excel không có dữ liệu hợp lệ.");
                foreach (var group in rows.Where(x => x.Name.Length > 0).GroupBy(x => x.Key).Where(g => g.Count() > 1)) foreach (var item in group) item.Issues.Add("Trùng tên và loại trong file");
                if (logos && zip.GetEntry(RelPath(part)) != null)
                {
                    var sheetRels = Read(zip, RelPath(part));
                    foreach (var drawing in doc.Descendants(S + "drawing"))
                    {
                        var dr = sheetRels.Descendants(P + "Relationship").FirstOrDefault(x => (string)x.Attribute("Id") == (string)drawing.Attribute(R + "id"));
                        if (dr == null) continue;
                        var drawingPart = Resolve(part, (string)dr.Attribute("Target"));
                        var drawingDoc = Read(zip, drawingPart);
                        var drawingRels = Read(zip, RelPath(drawingPart));
                        foreach (var anchor in drawingDoc.Root.Elements())
                        {
                            var from = anchor.Element(D + "from");
                            var embed = anchor.Descendants(A + "blip").Select(x => (string)x.Attribute(R + "embed")).FirstOrDefault();
                            if (from == null || embed == null) continue;
                            int rowNumber = (int)from.Element(D + "row") + 1;
                            var record = rows.FirstOrDefault(x => x.SourceRow == rowNumber);
                            if (record == null) continue;
                            var imgRel = drawingRels.Descendants(P + "Relationship").FirstOrDefault(x => (string)x.Attribute("Id") == embed);
                            if (imgRel == null) continue;
                            var imageEntry = zip.GetEntry(Resolve(drawingPart, (string)imgRel.Attribute("Target")));
                            if (imageEntry == null || imageEntry.Length > 20 * 1024 * 1024) throw new InvalidDataException("Logo vượt giới hạn 20 MB.");
                            using (var imageStream = imageEntry.Open())
                            using (var original = Image.FromStream(imageStream))
                            {
                                if ((long)original.Width * original.Height > 50000000) throw new InvalidDataException("Kích thước logo quá lớn.");
                                double scale = Math.Min(1, 320.0 / Math.Max(original.Width, original.Height));
                                using (var thumb = new Bitmap(Math.Max(1, (int)(original.Width * scale)), Math.Max(1, (int)(original.Height * scale))))
                                using (var graphics = Graphics.FromImage(thumb))
                                using (var output = new MemoryStream())
                                {
                                    graphics.DrawImage(original, 0, 0, thumb.Width, thumb.Height);
                                    thumb.Save(output, ImageFormat.Png); record.Logo = output.ToArray(); record.HasLogo = true;
                                }
                            }
                        }
                    }
                }
                return rows;
            }
        }
    }
}
