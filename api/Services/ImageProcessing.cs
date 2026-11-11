using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;

namespace API.Services
{
    // Thu nho/ma hoa lai anh bang GDI+, dung chung cho anh thu nho khi hien thi (ImageOptimizer)
    // va anh duoc ep nho ngay luc admin tai len (UploadImageOptimizer).
    internal static class ImageProcessing
    {
        public const long MaxSourcePixels = 80L * 1000 * 1000;

        // Thu nho de vua khung maxWidth x maxHeight, giu ti le, xoay theo EXIF.
        // Tra ve null neu anh da vua khung (scale >= skipIfScaleAbove, va forceReencode = false) hoac khong doc duoc/qua lon.
        public static byte[] ResizeToFit(byte[] source, int maxWidth, int maxHeight, bool png, int jpegQuality, bool forceReencode = false, double skipIfScaleAbove = 1.0)
        {
            using (var input = new MemoryStream(source))
            using (var image = System.Drawing.Image.FromStream(input, false, false))
            {
                if ((long)image.Width * image.Height > MaxSourcePixels) return null;
                ApplyExifOrientation(image);
                double scale = Math.Min((double)maxWidth / image.Width, (double)maxHeight / image.Height);
                if (scale >= skipIfScaleAbove)
                {
                    if (!forceReencode) return null;
                    scale = Math.Min(scale, 1);
                }
                int w = Math.Max(1, (int)Math.Round(image.Width * scale));
                int h = Math.Max(1, (int)Math.Round(image.Height * scale));
                using (var bitmap = new Bitmap(w, h, png ? PixelFormat.Format32bppArgb : PixelFormat.Format24bppRgb))
                {
                    bitmap.SetResolution(96, 96);
                    using (var g = Graphics.FromImage(bitmap))
                    using (var attributes = new ImageAttributes())
                    {
                        attributes.SetWrapMode(WrapMode.TileFlipXY);
                        g.Clear(png ? Color.Transparent : Color.White);
                        g.CompositingQuality = CompositingQuality.HighQuality;
                        g.SmoothingMode = SmoothingMode.HighQuality;
                        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        g.DrawImage(image, new Rectangle(0, 0, w, h), 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, attributes);
                    }
                    return Encode(bitmap, png, jpegQuality);
                }
            }
        }

        public static byte[] Encode(Bitmap bitmap, bool png, int jpegQuality)
        {
            using (var output = new MemoryStream())
            {
                if (png)
                {
                    bitmap.Save(output, ImageFormat.Png);
                }
                else
                {
                    ImageCodecInfo codec = ImageCodecInfo.GetImageEncoders().First(c => c.FormatID == ImageFormat.Jpeg.Guid);
                    using (var parameters = new EncoderParameters(1))
                    {
                        parameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, (long)jpegQuality);
                        bitmap.Save(output, codec, parameters);
                    }
                }
                return output.ToArray();
            }
        }

        // Anh chup tu dien thoai luu huong xoay trong EXIF; trinh duyet tu xoay anh goc nen ban thu nho phai xoay theo.
        private static void ApplyExifOrientation(System.Drawing.Image image)
        {
            const int OrientationId = 0x0112;
            if (!image.PropertyIdList.Contains(OrientationId)) return;
            var item = image.GetPropertyItem(OrientationId);
            if (item == null || item.Value == null || item.Value.Length < 2) return;
            switch (BitConverter.ToUInt16(item.Value, 0))
            {
                case 2: image.RotateFlip(RotateFlipType.RotateNoneFlipX); break;
                case 3: image.RotateFlip(RotateFlipType.Rotate180FlipNone); break;
                case 4: image.RotateFlip(RotateFlipType.Rotate180FlipX); break;
                case 5: image.RotateFlip(RotateFlipType.Rotate90FlipX); break;
                case 6: image.RotateFlip(RotateFlipType.Rotate90FlipNone); break;
                case 7: image.RotateFlip(RotateFlipType.Rotate270FlipX); break;
                case 8: image.RotateFlip(RotateFlipType.Rotate270FlipNone); break;
            }
        }
    }

    // Ep nho anh ngay luc admin tai len: canh dai toi da MaxSide, JPEG chat luong cao, giu PNG (nen giu duoc nen trong suot).
    // Ghi de tai cho (cung ten/duoi file nen link trong CSDL khong doi). Chi ghi khi ket qua thuc su nho hon;
    // moi loi deu bo qua va giu nguyen file goc. Viec nay cung bo EXIF (vi tri GPS, thiet bi chup) khoi anh cong khai.
    internal static class UploadImageOptimizer
    {
        public const int MaxSide = 2560;
        public const int JpegQuality = 90;
        private const long RecompressAboveBytes = 1024L * 1024;
        private const double RecompressMinSaving = 0.2;
        private const long MaxFileBytes = 100L * 1024 * 1024;

        public static bool IsOptimizable(string path)
        {
            string ext = Path.GetExtension(path);
            return ext.Equals(".jpg", StringComparison.OrdinalIgnoreCase) || ext.Equals(".jpeg", StringComparison.OrdinalIgnoreCase) || ext.Equals(".png", StringComparison.OrdinalIgnoreCase);
        }

        public static bool OptimizeInPlace(string path)
        {
            try
            {
                if (!IsOptimizable(path) || !File.Exists(path)) return false;
                var info = new FileInfo(path);
                if (info.Length > MaxFileBytes) return false;
                bool png = path.EndsWith(".png", StringComparison.OrdinalIgnoreCase);
                byte[] source = File.ReadAllBytes(path);

                byte[] result = ImageProcessing.ResizeToFit(source, MaxSide, MaxSide, png, JpegQuality);
                if (result == null && !png && source.Length > RecompressAboveBytes)
                {
                    // Anh da vua khung nhung nang (vd. JPEG chat luong 100): ma hoa lai, chi nhan neu tiet kiem du nhieu.
                    byte[] again = ImageProcessing.ResizeToFit(source, MaxSide, MaxSide, false, JpegQuality - 2, true);
                    if (again != null && again.Length <= source.Length * (1 - RecompressMinSaving)) result = again;
                }
                if (result == null || result.Length >= source.Length) return false;

                string tmp = path + "." + Guid.NewGuid().ToString("N") + ".tmp";
                File.WriteAllBytes(tmp, result);
                try { File.Replace(tmp, path, null); }
                catch { try { File.Delete(tmp); } catch { } throw; }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
