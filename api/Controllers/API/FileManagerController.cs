using API.OAuth.Providers;
using System.Web.Http.Filters;
using System.Web.Http.Controllers;
using System.Security.Claims;
using Newtonsoft.Json.Linq;
﻿using API.Models;
using DevExtreme.AspNet.Mvc.FileManagement;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;

namespace API.Controllers
{
    public sealed class MediaUploadValidationAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext context)
        {
            // Validate before any upload handler writes a file, including direct legacy upload endpoints.
            var request = HttpContext.Current.Request;
            // Upload theo phan (DevExtreme): phan du lieu duoc gui duoi dang blob khong co ten ("blob"),
            // ten file that nam trong chunkMetadata va duoc kiem tra ben duoi / trong FileSystem().
            var isChunkUpload = !string.IsNullOrEmpty(request.Form["chunkMetadata"]) ||
                string.Equals(request["command"], "UploadChunk", StringComparison.OrdinalIgnoreCase);
            foreach (string key in request.Files) {
                var file = request.Files[key];
                if ((!isChunkUpload && !FileManagerController.SafeUploadName(file.FileName)) || file.ContentLength <= 0 || file.ContentLength > 80 * 1024 * 1024)
                    { context.Response = context.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid upload file."); return; }
            }
            if (!string.IsNullOrEmpty(request.Form["chunkMetadata"])) {
                try {
                    var metadata = JObject.Parse(request.Form["chunkMetadata"]);
                    Guid guid;
                    if (!FileManagerController.SafeUploadName((string)metadata["FileName"]) || !Guid.TryParse((string)metadata["FileGuid"], out guid) ||
                        (int)metadata["TotalCount"] < 1 || (int)metadata["TotalCount"] > 10000 || (int)metadata["Index"] < 0 || (int)metadata["Index"] >= (int)metadata["TotalCount"])
                        { context.Response = context.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid upload metadata."); return; }
                } catch { { context.Response = context.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid upload metadata."); return; } }
            }
        }
    }
    [PermissionAuthorize("manage-library", "manage-tintuc", "manage-vanban", "manage-nckh", "manage-banner", "manage-setting", "manage-sukien")]
    [MediaUploadValidation]
    [Route("api/FileManager/{action}", Name = "FileManagersApi")]
    public class FileManagerController : ApiController
    {
        static readonly string[] SafeUploadExtensions = {
            ".jpg", ".jpeg", ".png", ".gif", ".tiff", ".tif", ".webp", ".avif", ".bmp", ".ico",
            ".zip", ".rar", ".7z", ".tar", ".gz", ".mp4", ".mov", ".avi", ".mkv", ".webm", ".mp3", ".wav", ".aac", ".flac", ".mpeg",
            ".pdf", ".docx", ".doc", ".rtf", ".txt", ".xlsx", ".xls", ".csv", ".pptx", ".ppt"
        };
        internal static bool SafeUploadName(string name) {
            return !string.IsNullOrWhiteSpace(name) && name.Length <= 200 && name.IndexOfAny(new[] { '/', '\\', ':', '<', '>', '\"', '|', '?', '*' }) < 0 &&
                name == Path.GetFileName(name) && SafeUploadExtensions.Contains(Path.GetExtension(name), StringComparer.OrdinalIgnoreCase);
        }
        internal static bool SafeDirectoryName(string name) {
            return !string.IsNullOrWhiteSpace(name) && name.Length <= 200 && name.IndexOfAny(new[] { '/', '\\', ':', '<', '>', '\"', '|', '?', '*' }) < 0 &&
                name == Path.GetFileName(name) && name.Trim('.', ' ').Length > 0;
        }
        public FileManagerController()
        {

            var fullThumbnailsDirectoryPath = Path.Combine(HttpContext.Current.Server.MapPath("~/Upload"), "Thumb");
            ThumbnailsDirectory = new DirectoryInfo(fullThumbnailsDirectoryPath);
        }
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();
        static readonly string RelativePath = "~/Upload";
        //static string UploadURL = "https://molisa.tefli.vn//Uploads/";
        static string UploadURL = "/Upload/";
        static int ClampImageSize(int value)
        {
            return Math.Max(1, Math.Min(4000, value));
        }

        // Resize to exactly width x height (JPEG); GDI+ objects are disposed so the source file is not left locked.
        static void SaveResizedJpeg(string sourcePath, string targetPath, int width, int height)
        {
            using (var image = System.Drawing.Image.FromFile(sourcePath))
            using (var thumbBitmap = new System.Drawing.Bitmap(width, height))
            {
                using (var thumbGraph = System.Drawing.Graphics.FromImage(thumbBitmap))
                {
                    thumbGraph.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                    thumbGraph.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    thumbGraph.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    thumbGraph.DrawImage(image, new Rectangle(0, 0, width, height));
                }
                thumbBitmap.Save(targetPath, System.Drawing.Imaging.ImageFormat.Jpeg);
            }
        }

        [HttpPost]
        public async Task<HttpResponseMessage> FileImageUpload(int? Width = null, int? Height = null)
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var docfiles = new List<API.Models.File>();
                    foreach (string file in httpRequest.Files)
                    {
                        var postedFile = httpRequest.Files[file];
                        var newName = System.Guid.NewGuid();
                        var filePath = Path.Combine(HttpContext.Current.Server.MapPath(RelativePath), newName + postedFile.FileName);
                        postedFile.SaveAs(filePath);

                        if (Width != null && Height != null)
                        {
                            var targetWidth = ClampImageSize(Width.Value);
                            var targetHeight = ClampImageSize(Height.Value);
                            var sizePrefix = string.Format("{0}x{1}", targetWidth, targetHeight);
                            var resizeFilePath = Path.Combine(HttpContext.Current.Server.MapPath(RelativePath), sizePrefix + newName + postedFile.FileName);
                            SaveResizedJpeg(filePath, resizeFilePath, targetWidth, targetHeight);

                            Models.File tmpFile = _context.Files.Add(new Models.File
                            {
                                Ten = postedFile.FileName,
                                MoTa = postedFile.FileName,
                                KichThuoc = sizePrefix,
                                NgayTao = DateTime.Now,
                                LinkLuuTru = UploadURL + sizePrefix + newName + postedFile.FileName,
                                TrangThai = "active"
                            });
                            _context.SaveChanges();
                            docfiles.Add(tmpFile);
                        }
                        else
                        {

                            Models.File tmpFile = _context.Files.Add(new Models.File
                            {
                                Ten = postedFile.FileName,
                                MoTa = postedFile.FileName,
                                NgayTao = DateTime.Now,
                                LinkLuuTru = UploadURL + newName + postedFile.FileName,
                                TrangThai = "active"
                            });
                            _context.SaveChanges();
                            docfiles.Add(tmpFile);
                            //docfiles.Add("/Uploads/" + postedFile.FileName);
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.Created, new { docfiles });
                }
                return Request.CreateResponse(HttpStatusCode.Created, new { });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { error = "Không xử lý được file." });
            }
        }
        [HttpPost]
        public async Task<HttpResponseMessage> FileVideoUpload()
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<API.Models.File>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var newName = System.Guid.NewGuid();
                    var filePath = Path.Combine(HttpContext.Current.Server.MapPath(RelativePath), newName + postedFile.FileName);
                    postedFile.SaveAs(filePath);

                    Models.File tmpFile = _context.Files.Add(new Models.File
                    {
                        Ten = postedFile.FileName,
                        MoTa = postedFile.FileName,
                        NgayTao = DateTime.Now,
                        LinkLuuTru = UploadURL + newName + postedFile.FileName,
                        TrangThai = "active"
                    });
                    _context.SaveChanges();
                    docfiles.Add(tmpFile);
                }
                return Request.CreateResponse(HttpStatusCode.Created, new { docfiles });
            }
            return Request.CreateResponse(HttpStatusCode.Created, new { });
        }
        [HttpPost]
        public async Task<HttpResponseMessage> ImageUpload(int? Width = null, int? Height = null)
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var newName = System.Guid.NewGuid();
                    var filePath = Path.Combine(HttpContext.Current.Server.MapPath(RelativePath), newName + postedFile.FileName);
                    postedFile.SaveAs(filePath);

                    if (Width != null && Height != null)
                    {
                        var targetWidth = ClampImageSize(Width.Value);
                        var targetHeight = ClampImageSize(Height.Value);
                        var sizePrefix = string.Format("{0}x{1}", targetWidth, targetHeight);
                        var resizeFilePath = Path.Combine(HttpContext.Current.Server.MapPath(RelativePath), sizePrefix + newName + postedFile.FileName);
                        SaveResizedJpeg(filePath, resizeFilePath, targetWidth, targetHeight);
                        docfiles.Add(UploadURL + sizePrefix + newName + postedFile.FileName);
                    }
                    else
                    {

                        docfiles.Add(UploadURL + newName + postedFile.FileName);
                    }
                }
                return Request.CreateResponse(HttpStatusCode.Created, new { docfiles });
            }
            return Request.CreateResponse(HttpStatusCode.Created, new { });
        }
        [HttpPost]
        public async Task<HttpResponseMessage> VideoUpload()
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var newName = System.Guid.NewGuid();
                    var filePath = Path.Combine(HttpContext.Current.Server.MapPath(RelativePath), newName + postedFile.FileName);
                    postedFile.SaveAs(filePath);
                    docfiles.Add(UploadURL + newName + postedFile.FileName);
                }
                return Request.CreateResponse(HttpStatusCode.Created, new { docfiles });
            }
            return Request.CreateResponse(HttpStatusCode.Created, new { });
        }

        public class ChunkMetadata
        {
            public int Index { get; set; }
            public int TotalCount { get; set; }
            public int FileSize { get; set; }
            public string FileName { get; set; }
            public string FileType { get; set; }
            public string FileGuid { get; set; }
        }
        [HttpPost]
        public async Task<HttpResponseMessage> FileUpload()
        {
            var request = HttpContext.Current.Request;
            string chunkMetadata = request.Form["chunkMetadata"];
            var files = new List<Models.File>();
            string tempFileLocation = HttpContext.Current.Server.MapPath("~/UploadTemp");
            HttpPostedFile file = request.Files["files[]"];
            var targetLocation = HttpContext.Current.Server.MapPath(RelativePath);
            try
            {
                if (!string.IsNullOrEmpty(chunkMetadata))
                {
                    ChunkMetadata metaDataObject = JsonConvert.DeserializeObject<ChunkMetadata>(chunkMetadata);

                    string[] allExtensions = {
                            // Images
                            ".jpg", ".jpeg", ".png", ".gif", ".tiff", ".tif", ".psd", ".webp", ".avif",
                            // Compression
                            ".zip", ".rar", ".7z", ".tar", ".gz", ".iso", ".dmg",
                            // Media (Video & Audio)
                            ".mp4", ".mov", ".avi", ".mkv", ".webm", ".mp3", ".wav", ".aac", ".flac", ".mpeg",
                            // Office & Documents
                            ".pdf", ".docx", ".doc", ".rtf", ".txt", ".xlsx", ".xls", ".csv", ".pptx", ".ppt"
                        };

                    if (!allExtensions.Contains(Path.GetExtension(metaDataObject.FileName), StringComparer.OrdinalIgnoreCase))
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "file extension is invalid");
                    }

                    if (!Directory.Exists(tempFileLocation))
                        Directory.CreateDirectory(tempFileLocation);

                    var tempFilePath = Path.Combine(tempFileLocation, ((System.Security.Claims.ClaimsPrincipal)User).FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value + "-" + metaDataObject.FileGuid + ".tmp");

                    // Appends the chunk to the file
                    AppendContentToFile(tempFilePath, file);

                    // Saves the file if all chunks are received
                    if (metaDataObject.Index == (metaDataObject.TotalCount - 1))
                    {
                        string newFileName = Guid.NewGuid().ToString() + metaDataObject.FileName;
                        System.IO.File.Copy(tempFilePath, Path.Combine(targetLocation, newFileName));
                        System.IO.File.Delete(tempFilePath);
                        Models.File tmpFile = _context.Files.Add(new Models.File
                        {
                            Ten = metaDataObject.FileName,
                            MoTa = metaDataObject.FileName,
                            NgayTao = DateTime.Now,
                            LinkLuuTru = UploadURL + newFileName,
                            TrangThai = "active"
                        });
                        _context.SaveChanges();
                        files.Add(tmpFile);
                        return Request.CreateResponse(HttpStatusCode.Created, new { files });
                    }
                }
            }
            catch(Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Không xử lý được file.");
            }
            return Request.CreateResponse(HttpStatusCode.Created, new { });
        }

        [HttpPost]
        public async Task<HttpResponseMessage> CKEditorImageUpload()
        {
            var request = HttpContext.Current.Request;
            HttpPostedFile file = request.Files["upload"];
            var targetLocation = HttpContext.Current.Server.MapPath(RelativePath);
            string jsonResponse = "";
            try
            {
                string[] allExtensions = {
                            // Images
                            ".jpg", ".jpeg", ".png", ".gif", ".tiff", ".tif", ".psd", ".webp", ".avif",
                        };

                if (!allExtensions.Contains(Path.GetExtension(file.FileName), StringComparer.OrdinalIgnoreCase))
                {
                    jsonResponse = "{\"error\":{\"number\":105,\"message\":\"Invalid file extension.\"}}";
                }
                else
                {
                    string fileGuid = Guid.NewGuid().ToString();
                    var newFileName = fileGuid + file.FileName;
                    file.SaveAs(Path.Combine(targetLocation, newFileName));
                    string fileUrlInFrontEnd = RelativePath.Replace("~", "") + "/" + newFileName;
                    jsonResponse = "{\"fileName\": \"" + newFileName +"\",\"uploaded\": 1,\"url\": \"" + fileUrlInFrontEnd + "\"}";
                }
            }
            catch (Exception)
            {
                jsonResponse = "{\"error\":{\"number\":105,\"message\":\"Không thể tải tệp lên.\"}}";
            }
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(jsonResponse, Encoding.UTF8, "application/json");
            return response;
        }

        void CheckMaxSize(FileStream stream)
        {
            if (stream.Length > 1024 * 1200000)
                throw new Exception("File is too large");
        }

        void AppendContentToFile(string path, HttpPostedFile content)
        {
            using (FileStream stream = new FileStream(path, FileMode.Append, FileAccess.Write))
            {
                content.InputStream.CopyTo(stream);
                CheckMaxSize(stream);
            }
        }

        // The upload root holds a web.config that blocks script execution; a CMS user must not be able to delete, move,
        // rename, overwrite or download it. Throwing FileSystemException makes the command processor return its normal
        // failure result (success=false + errorText) to the file manager client.
        sealed class GuardedFileSystemProvider : PhysicalFileSystemProvider
        {
            public GuardedFileSystemProvider(string rootDirectoryPath, Action<FileSystemInfo, FileSystemItem> prepareFileSystemItemCallback)
                : base(rootDirectoryPath, prepareFileSystemItemCallback) { }

            static bool IsProtectedName(string value)
            {
                if (string.IsNullOrEmpty(value)) return false;
                var name = value.Substring(value.LastIndexOfAny(new[] { '/', '\\' }) + 1).Trim();
                return name.Equals("web.config", StringComparison.OrdinalIgnoreCase);
            }

            static void Guard(FileSystemItemInfo item)
            {
                if (item != null && (IsProtectedName(item.Name) || IsProtectedName(item.Path) || IsProtectedName(item.Key)))
                    throw new FileSystemException(FileSystemErrorCode.NoAccess, "This file is protected.");
            }

            static void Guard(string name)
            {
                if (IsProtectedName(name)) throw new FileSystemException(FileSystemErrorCode.NoAccess, "This file is protected.");
            }

            public override void RenameItem(FileSystemRenameItemOptions options) { Guard(options.Item); Guard(options.ItemNewName); base.RenameItem(options); }
            public override void MoveItem(FileSystemMoveItemOptions options) { Guard(options.Item); base.MoveItem(options); }
            public override void CopyItem(FileSystemCopyItemOptions options) { Guard(options.Item); base.CopyItem(options); }
            public override void DeleteItem(FileSystemDeleteItemOptions options) { Guard(options.Item); base.DeleteItem(options); }
            public override void UploadFile(FileSystemUploadFileOptions options) { Guard(options.FileName); base.UploadFile(options); }
            public override void CreateDirectory(FileSystemCreateDirectoryOptions options) { Guard(options.DirectoryName); base.CreateDirectory(options); }
            public override Stream GetFileContent(FileSystemLoadFileContentOptions options) { Guard(options.File); return base.GetFileContent(options); }
        }

        [AcceptVerbs("GET", "POST")]
        public object FileSystem()
        {
            var request = new HttpContextWrapper(HttpContext.Current).Request;
            FileSystemCommand command;
            Enum.TryParse(request["command"], out command);
            string arguments = request["arguments"];
            if (command == FileSystemCommand.UploadChunk) {
                try {
                    var args = JObject.Parse(arguments);
                    var metadata = JObject.Parse((string)args["chunkMetadata"]);
                    Guid uploadId;
                    int index = (int)metadata["Index"], total = (int)metadata["TotalCount"];
                    long size = (long)metadata["FileSize"];
                    if (!SafeUploadName((string)metadata["FileName"]) || !Guid.TryParse((string)metadata["UploadId"], out uploadId) || total < 1 || total > 10000 || index < 0 || index >= total || size <= 0 || size > 80L * 1024 * 1024)
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid upload metadata.");
                } catch { return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid upload metadata."); }
            }
            else if (command == FileSystemCommand.Rename) {
                try {
                    var args = JObject.Parse(arguments);
                    var newName = (string)args["name"];
                    var isDirectory = args["isDirectory"] != null && args["isDirectory"].Type == JTokenType.Boolean && (bool)args["isDirectory"];
                    if (isDirectory ? !SafeDirectoryName(newName) : !SafeUploadName(newName))
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid file name.");
                } catch { return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid upload arguments."); }
            }

            var config = new FileSystemConfiguration
            {
                Request = request,
                FileSystemProvider = new GuardedFileSystemProvider(
                    HttpContext.Current.Server.MapPath(RelativePath),
                    (fileSystemItem, clientItem) =>
                    {
                        if (!clientItem.IsDirectory)
                            clientItem.CustomFields["url"] = GetFileItemUrl(fileSystemItem);

                        if (clientItem.IsDirectory || !CanGenerateThumbnail(fileSystemItem))
                            return;

                        if (!(fileSystemItem is FileInfo fileInfo))
                            return;

                        var thumbnail = GetThumbnail(fileInfo);
                        if (thumbnail != null)
                        {
                            var relativeThumbnailPath = Path.Combine("Upload", ThumbnailsDirectory.Name, thumbnail.Directory?.Name, thumbnail.Name);
                            clientItem.CustomFields["thumbnailUrl"] = relativeThumbnailPath;
                        }
                    }
                ),
                //uncomment the code below to enable file/directory management
                AllowCopy = true,
                AllowCreate = true,
                AllowMove = true,
                AllowDelete = true,
                AllowRename = true,
                AllowUpload = true,
                AllowDownload = true,
                TempDirectory = HttpContext.Current.Server.MapPath("~/UploadTemp")
            };
            var processor = new FileSystemCommandProcessor(config);
            // Check if the command is "Upload" and the file already exists
            //if (command == FileSystemCommand.UploadChunk && System.IO.File.Exists(arguments))
            //{
            //    System.IO.File.Delete(arguments); // Delete the existing file
            //}
            var commandResult = processor.Execute(command, arguments);
            var result = commandResult.GetClientCommandResult();
            if (commandResult.Success && command == FileSystemCommand.GetDirContents)
            {
                List<Dictionary<string, object>> resultList = (List<Dictionary<string, object>>)result.GetType().GetProperty("result").GetValue(result, null);
                resultList = resultList.OrderByDescending(x => x["dateModified"]).ToList();
                var dynamicObj = new
                {
                    errorCode = (int?)null,
                    errorText = "",
                    result = resultList,
                    success = true
                };
                return Request.CreateResponse(dynamicObj);

            }

            return command == FileSystemCommand.Download && commandResult.Success ? CreateDownloadResponse(result) : Request.CreateResponse(result);
        }

        DirectoryInfo ThumbnailsDirectory { get; }
        const int ThumbnailWidth = 100, ThumbnailHeight = 100;
        static readonly IReadOnlyCollection<string> AllowedFileExtensions = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase) {
            ".png", ".gif", ".jpg", ".jpeg", ".ico", ".bmp"
        };
        string GetFileItemUrl(FileSystemInfo fileSystemItem)
        {
            var relativeUrl = "~/" + fileSystemItem.FullName
                .Replace(HostingEnvironment.ApplicationPhysicalPath, "")
                .Replace(Path.DirectorySeparatorChar, '/');
            return Url.Content(relativeUrl);
        }

        HttpResponseMessage CreateDownloadResponse(object result)
        {
            var fileContent = result as System.Web.Mvc.FileStreamResult;
            if (fileContent == null)
                return Request.CreateResponse(result);

            var response = new HttpResponseMessage()
            {
                Content = new StreamContent(fileContent.FileStream)
            };
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = fileContent.FileDownloadName
            };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            return response;
        }



        FileInfo GetThumbnail(FileInfo file)
        {
            var thumbnailFile = new FileInfo(GetThumbnailFilePath(file));

            if (!HasFreshThumbnail(file, thumbnailFile))
            {
                using (var thumbnailStream = file.OpenRead())
                {
                    if (!GenerateThumbnail(thumbnailStream, thumbnailFile))
                        return null;
                }
            }

            return thumbnailFile;
        }

        static bool GenerateThumbnail(Stream file, FileInfo thumbnailFile)
        {
            try
            {
                if (thumbnailFile.Exists)
                    thumbnailFile.Delete();

                if (!Directory.Exists(thumbnailFile.DirectoryName))
                    Directory.CreateDirectory(thumbnailFile.DirectoryName);

                GenerateThumbnailCore(file, thumbnailFile, ThumbnailWidth, ThumbnailHeight);
                return true;
            }
            catch
            {
                return false;
            }
        }
        static void GenerateThumbnailCore(Stream file, FileInfo thumbnailFile, int width, int height)
        {
            using (var originalImage = Image.FromStream(file))
            using (var thumbnail = ChangeImageSize(originalImage, width, height))
            {
                try
                {
                    thumbnail.Save(thumbnailFile.FullName);
                }
                catch
                {
                    // ignored
                }
            }
        }
        static Bitmap ChangeImageSize(Image original, int width, int height)
        {
            var thumbnail = new Bitmap(width, height);

            var newHeight = original.Height;
            var newWidth = original.Width;
            if (original.Height > height || original.Width > width)
            {
                newHeight = (original.Height > original.Width) ? height : (height * original.Height / original.Width);
                newWidth = (original.Width > original.Height) ? width : (width * original.Width / original.Height);
            }

            var g = Graphics.FromImage(thumbnail);
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;

            var top = (height - newHeight) / 2;
            var left = (width - newWidth) / 2;
            g.DrawImage(original, left, top, newWidth, newHeight);

            return thumbnail;
        }

        static bool HasFreshThumbnail(FileSystemInfo file, FileSystemInfo thumbnail)
        {
            return thumbnail.Exists && file.LastWriteTime <= thumbnail.LastWriteTime;
        }

        static bool CanGenerateThumbnail(FileSystemInfo fileSystemInfo)
        {
            return AllowedFileExtensions.Contains(fileSystemInfo.Extension);
        }
        string GetThumbnailFilePath(FileSystemInfo file)
        {
            var thumbnailName = GetThumbnailFileName(file);
            return Path.Combine(ThumbnailsDirectory.FullName, thumbnailName.Substring(0, 3), thumbnailName);
        }
        string GetThumbnailFileName(FileSystemInfo file)
        {
            return GetSHA1Hash(Encoding.UTF8.GetBytes(file.FullName)) + file.Extension;
        }
        string GetSHA1Hash(byte[] data)
        {
            var CryptoProvider = new SHA1CryptoServiceProvider();
            var hashBytes = CryptoProvider.ComputeHash(data);
            return string.Concat(
                Array.ConvertAll(hashBytes, b => b.ToString("x2"))
            );
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
