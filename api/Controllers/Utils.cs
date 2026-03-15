using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace API.Controllers
{
    public static class Utils
    {
        public static string ToUnsignString(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return "";
            // 1. Chuyển thành chữ thường (nếu bạn muốn giữ nguyên hoa thường thì bỏ dòng này)
            input = input.ToLower().Trim();

            // 2. Xử lý riêng ký tự "đ" vì Unicode FormD không tự tách được
            input = input.Replace("đ", "d").Replace("Đ", "D");

            // 3. Chuẩn hóa chuỗi sang Unicode FormD (tách ký tự gốc và dấu)
            string normalized = input.Normalize(NormalizationForm.FormD);
            StringBuilder builder = new StringBuilder();

            foreach (char c in normalized)
            {
                // Lọc bỏ các dấu (NonSpacingMark)
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(c);
                }
            }

            // Chuyển về lại FormC để có chuỗi không dấu hoàn chỉnh
            string result = builder.ToString().Normalize(NormalizationForm.FormC);

            // 4. Thay thế tất cả các ký tự KHÔNG phải là chữ cái hoặc số bằng dấu gạch ngang
            // Pattern [^a-z0-9] nghĩa là: tìm những ký tự không nằm trong khoảng a-z và 0-9
            result = Regex.Replace(result, @"[^a-z0-9]", "-");

            // 6. Cắt bỏ dấu gạch ngang ở đầu và cuối chuỗi (nếu có)
            return result.Trim('-');
        }
    }
}