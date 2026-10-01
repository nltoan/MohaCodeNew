using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using Newtonsoft.Json;
namespace API.Services.HoiQuy
{
    public class HoiQuyRecord
    {
        public int ID { get; set; }
        public int SourceRow { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Chair { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public string Purpose { get; set; }
        public bool HasLogo { get; set; }
        public List<string> Issues { get; set; } = new List<string>();
        [JsonIgnore] public byte[] Logo { get; set; }
        [JsonIgnore] public string Key { get { using (var sha = SHA256.Create()) return BitConverter.ToString(sha.ComputeHash(Encoding.UTF8.GetBytes(Normalize(Name) + "|" + Type))).Replace("-", "").ToLowerInvariant(); } }
        public static string Normalize(string value)
        {
            var chars = (value ?? "").Normalize(NormalizationForm.FormD).Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark).ToArray();
            return Regex.Replace(new string(chars).Replace('đ', 'd').Replace('Đ', 'D').ToLowerInvariant(), @"\s+", " ").Trim();
        }
    }
    public class ImportPreview
    {
        public string Token { get; set; }
        public string FileName { get; set; }
        public List<HoiQuyRecord> Rows { get; set; }
        [JsonIgnore] public string Owner { get; set; }
        [JsonIgnore] public object Sync { get; } = new object();
        [JsonIgnore] public bool Committed { get; set; }
    }
    public class ImportCommit
    {
        public string Token { get; set; }
        public bool UpdateExisting { get; set; }
        public bool IncludeLogos { get; set; } = true;
        public bool SkipInvalid { get; set; } = true;
        public bool SkipDuplicates { get; set; } = true;
    }
}
