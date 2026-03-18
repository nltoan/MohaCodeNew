using API.Models;
using API.Services;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using HtmlAgilityPack;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Org.BouncyCastle.Crypto;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Mail;
using System.Security;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Windows.Media;
using System.Xml;
using System.Xml.Linq;

namespace API.Controllers
{
    [Route("api/Public/{action}", Name = "PublicApi")]
    public class PublicController : ApiController
    {
        static readonly string RelativePath = System.IO.Path.Combine("~/Upload");
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

        public string ReadPdfFile(string fileName)
        {
            StringBuilder text = new StringBuilder();

            if (System.IO.File.Exists(fileName))
            {
                PdfReader pdfReader = new PdfReader(fileName);

                for (int page = 1; page <= pdfReader.NumberOfPages; page++)
                {
                    ITextExtractionStrategy strategy = new SimpleTextExtractionStrategy();
                    string currentText = PdfTextExtractor.GetTextFromPage(pdfReader, page, strategy);

                    currentText = Encoding.UTF8.GetString(ASCIIEncoding.Convert(Encoding.Default, Encoding.UTF8, Encoding.Default.GetBytes(currentText)));
                    text.Append(currentText);
                }
                pdfReader.Close();
            }
            return text.ToString();
        }

        private static void InsertSoapEnvelopeIntoWebRequest(XmlDocument soapEnvelopeXml, HttpWebRequest webRequest)
        {
            using (Stream stream = webRequest.GetRequestStream())
            {
                soapEnvelopeXml.Save(stream);
            }
        }
        public static string StripHTML(string input)
        {
            return Regex.Replace(input, "<.*?>", String.Empty);
        }
        public static string GenerateTTSMp3(string vanban)
        {
            vanban = StripHTML(vanban);
            var _url = "http://tts.net/Service.asmx";
            try
            {
                XmlDocument soapEnvelopeXml = new XmlDocument();
                soapEnvelopeXml.LoadXml(
                    @"<?xml version=""1.0"" encoding=""utf-8""?>
                    <soap:Envelope 
                        xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"" 
                        xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" 
                        xmlns:xsd=""http://www.w3.org/2001/XMLSchema"">
                        <soap:Body>
                            <Demo4InputText xmlns=""http://tempuri.org/"">
                                <vanban>" + SecurityElement.Escape(vanban) + @"</vanban>
                            </Demo4InputText>
                        </soap:Body>
                    </soap:Envelope>");
                    HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(_url);
                    webRequest.Headers.Add("SOAP:Action");
                    webRequest.ContentType = "text/xml;charset=\"utf-8\"";
                    webRequest.Accept = "text/xml";
                    webRequest.Method = "POST";
                    InsertSoapEnvelopeIntoWebRequest(soapEnvelopeXml, webRequest);

                    IAsyncResult asyncResult = webRequest.BeginGetResponse(null, null);

                    asyncResult.AsyncWaitHandle.WaitOne();

                    string soapResult;
                    using (WebResponse webResponse = webRequest.EndGetResponse(asyncResult))
                    {
                        using (StreamReader rd = new StreamReader(webResponse.GetResponseStream()))
                        {
                            soapResult = rd.ReadToEnd();
                            XmlDocument soapDocument = new XmlDocument();
                            soapDocument.LoadXml(soapResult);
                            XmlNamespaceManager namespaceManager = new XmlNamespaceManager(soapDocument.NameTable);
                            namespaceManager.AddNamespace("soap", "http://schemas.xmlsoap.org/soap/envelope/");
                            namespaceManager.AddNamespace("tempuri", "http://tempuri.org/");

                            XmlNode resultNode = soapDocument.SelectSingleNode("//tempuri:Demo4InputTextResult", namespaceManager);

                            string resultValue = resultNode.InnerText;
                            return resultValue;
                        }
                    }

            }
            catch
            {
                return null;
            }
        }

        static string RemoveAllHtml(string html)
        {
            // Load the HTML document
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(html);

            // Remove all HTML content
            doc.DocumentNode.RemoveAll();

            // Get the text content without HTML
            return doc.DocumentNode.InnerText;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> lang(string lang)
        {
            string lan = lang ?? "vi";
            if (lan.Equals("en"))
            {
                lan = "i18nEnglish";
            } else {
                lan = "i18nVietnamese";
            }
            var data = _context.CauHinhs.Where(x => x.Ma == lan).Select(x => x.GiaTri).FirstOrDefault();
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(data, Encoding.UTF8, "application/json");
            return response;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> getPAKN()
        {
            string json = "";
            using (var client = new System.Net.WebClient())
            {
                client.Encoding = System.Text.Encoding.UTF8;
                json = client.DownloadString("https://phananh.moha.gov.vn/Integrated/getList");
                Console.WriteLine(json);
            }

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(json, Encoding.UTF8, "application/json");
            return response;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> getKNCT()
        {
            string json = "";
            using (var client = new System.Net.WebClient())
            {
                client.Encoding = System.Text.Encoding.UTF8;
                json = client.DownloadString("https://phananh.moha.gov.vn/Integrated/getListKNCT");
                Console.WriteLine(json);
            }

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(json, Encoding.UTF8, "application/json");
            return response;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> TTS(int ID)
        {
            var tintuc = _context.TinTucs.Find(ID);
            var filePath = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/tts"), "newmp3files", ID + ".mp3");
            if (System.IO.File.Exists(filePath))
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new StreamContent(new FileStream(filePath, FileMode.Open));
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("audio/mpeg");
                return response;
            };
            string ret = GenerateTTSMp3(tintuc.TieuDe + " " + tintuc.MoTa + " " + tintuc.NoiDung);

            byte[] data = Convert.FromBase64String(ret);
            System.IO.File.WriteAllBytes(filePath, data);

            FileStream filestream = new FileStream(filePath, FileMode.Open);
            HttpResponseMessage response2 = new HttpResponseMessage(HttpStatusCode.OK);
            response2.Content = new StreamContent(filestream);
            response2.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            response2.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("audio/mpeg");
            return response2;
        }
        [HttpGet]
        public HttpResponseMessage Proxy(string url)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream receiveStream = response.GetResponseStream();

            HttpResponseMessage response2 = new HttpResponseMessage(HttpStatusCode.OK);
            response2.Content = new StreamContent(receiveStream);
            response2.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            response2.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(response.ContentType);
            return response2;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> SendMail(FormDataCollection form)
        {

            var cauhinh = _context.ThamSoHeThongs.FirstOrDefault();
            if (cauhinh != null
                && !string.IsNullOrEmpty(cauhinh.EmailHost)
                && !string.IsNullOrEmpty(cauhinh.EmailPort)
                && !string.IsNullOrEmpty(cauhinh.EmailAddress)
                && !string.IsNullOrEmpty(cauhinh.EmailPassword)
            )
            {
                //Send email thay doi
                var smtpClient = new SmtpClient(cauhinh.EmailHost)
                {
                    Port = Convert.ToInt32(cauhinh.EmailPort),
                    Credentials = new NetworkCredential(cauhinh.EmailAddress, cauhinh.EmailPassword),
                    EnableSsl = true,
                };
                string fromUser = Convert.ToString(form.Get("fromUser"));
                string toUser = Convert.ToString(form.Get("toUser"));
                string fromEmail = Convert.ToString(form.Get("fromEmail"));
                string toEmail = Convert.ToString(form.Get("toEmail"));
                string title = Convert.ToString(form.Get("title"));
                string address = Convert.ToString(form.Get("address"));
                string content = Convert.ToString(form.Get("content"));
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(cauhinh.EmailAddress),
                    Subject = title,
                    Body = String.Format("Người dùng {0} gửi đến {1} bài viết tại {2} với nội dung nhắn như sau: <br /> {3}", fromUser, toUser, address, content),
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(new MailAddress(toEmail));

                smtpClient.Send(mailMessage);
            }


            return Request.CreateResponse(HttpStatusCode.OK, new { status = "ok" });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> SearchPdf(string keyword, DataSourceLoadOptions loadOptions)
        {
            var resizeFilePath = HttpContext.Current.Server.MapPath(RelativePath);

            List<dynamic> searchFileRets = new List<dynamic>();

            string[] filePaths = Directory.GetFiles(resizeFilePath, "*.pdf", SearchOption.TopDirectoryOnly);
            foreach (string aFile in filePaths)
            {
                string text = ReadPdfFile(aFile);
                string filename = System.IO.Path.GetFileName(aFile);
                int index = text.IndexOf(keyword, 0, StringComparison.CurrentCultureIgnoreCase);
                if (index >= 0)
                {
                    searchFileRets.Add(new { AnhDaiDienUrl = "", TenAnhDaiDien = "", FileUrl = RelativePath + "/" + filename, TieuDe = text, Mota = text });
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { searchFileRets });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Search(string keyword, string lang, DataSourceLoadOptions loadOptions)
        {
            int lan = 10;//chuyen muc: Tin tuc - su kien
            if (lang == "en")
            {
                lan = 10;
            }

            var topposts = _context.CollectionFromSql(@"
                WITH cte AS 
                (
                  SELECT c.ID, c.TenChuyenMuc, 0 AS Level
                  FROM ChuyenMuc c
                  WHERE IsVisible=1 and Id = @ID
	
                  UNION ALL
	
                  SELECT c.ID, c.TenChuyenMuc, Level+1 AS Level
                  FROM ChuyenMuc c JOIN cte i ON c.ChuyenMucCha = i.ID and c.IsVisible=1
                )
                select t.ID, t.TieuDe as TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl, 'tin-tuc' as Type from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID
                where t.IDChuyenMuc in (SELECT Id FROM cte) and (t.TieuDe like @keyword or t.MoTa like @keyword) and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                and t.TrangThai='public' order by t.NgayXuatBan desc
            ",
            new Dictionary<string, object> { { "@ID", lan }, { "@keyword", "%" + keyword + "%" } }).ToList();

            //var files = _context.CollectionFromSql(@"
            //    select f.ID, f.Ten as TieuDe, f.MoTa, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl, 'pdf-file' as Type
            //    from Files f
            //    where (f.Ten like '%' + @keyword + '%' or f.MoTa like '%' + @keyword + '%') and f.Ten like '%.pdf'",
            //new Dictionary<string, object> { { "@ID", lan }, { "@keyword", keyword } }).ToList();


            List<dynamic> retVal = new List<dynamic>();

            retVal.AddRange(topposts);
            //retVal.AddRange(files);
            var data = DataSourceLoader.Load(retVal, loadOptions);
            var response = Request.CreateResponse(data);
            return response;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Menu(string lang = "")
        {

            int lan = 1744;
            if (lang == "en")
            {
                lan = 2745;
            }
            DataSourceLoadOptions loadOptions = new DataSourceLoadOptions();
            var banners = _context.CollectionFromSql(@"
            WITH cte AS 
            (
		            SELECT m.*, 0 AS Level
		            FROM Menu_FrontEnd m
		            WHERE ID = @IDRoot

		            UNION ALL

		            SELECT m.*, Level+1 AS Level
		            FROM Menu_FrontEnd m JOIN cte i ON m.IDMenuCha = i.ID
            )
            SELECT * FROM cte where HienThi = 1 order by STT asc
            ",
            new Dictionary<string, object> { { "@IDRoot", lan } }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(banners, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BannerByViTri(int ID_ViTri)
        {
            var data = _context.CollectionFromSql(@"
                select b.*, f.Ten as AnhBanner, f.LinkLuuTru as AnhBannerUrl 
                from Banner b
                join Banner_ViTri bv on bv.ID_Banner = b.ID
                left join Files f on b.ID_File = f.ID
                where bv.ID_ViTri = @ID_ViTri
                order by bv.ThuTu asc
            ",
            new Dictionary<string, object> { { "@ID_ViTri", ID_ViTri } }).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Banner()
        {
            DataSourceLoadOptions loadOptions = new DataSourceLoadOptions();
            var banners = _context.CollectionFromSql(@"
            select * from Banner b
            left join Banner_ViTri bv on bv.ID_Banner = b.ID
            left join QuangCao_ViTri qv on qv.ID = bv.ID_ViTri
            order by bv.ThuTu asc",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(banners, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> DanhNgon(string lang = "")
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            DataSourceLoadOptions loadOptions = new DataSourceLoadOptions();
            var banners = _context.CollectionFromSql(@"
            select top 5 * from DanhNgon where TrangThai = 1 and NgonNgu = @lang ORDER BY ID desc
            ",
            new Dictionary<string, object> { { "@lang", lan } }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(banners, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> NghienCuuKhoaHocs(DataSourceLoadOptions loadOptions, int limit = 0)
        {
            var limitSql = @"";
            if (limit > 0)
            {
                limitSql = @"top " + limit;
            }

            var nckh = _context.CollectionFromSql(@"
                SELECT " + limitSql + @" nckh.* 
                from NghienCuuKhoaHoc nckh
                where NgayTao >= '2021-01-01 00:00:00.001'
                order by ID desc;
            ",
            new Dictionary<string, object> { }).ToList();
            return Request.CreateResponse(DataSourceLoader.Load(nckh, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> NghienCuuKhoaHocDetail(int ID)
        {
            var data = _context.NghienCuuKhoaHocs
                .Where(x => x.ID == ID).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> NghienCuuKhoaHocDetailByOldID(int ID)
        {
            string oldID = $"|##|{ID}";
            var data = _context.NghienCuuKhoaHocs
                .Where(x => x.Migrate_Source.EndsWith(oldID)).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> VanBanByLopVanBan(string id, DataSourceLoadOptions loadOptions, int limit = 0, string lang = "")
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var limitSql = @"";
            if (limit > 0)
            {
                limitSql = @"top " + limit;
            }

            var banners = _context.CollectionFromSql(@"

                WITH cte AS 
                (
	                SELECT lvb.ID, lvb.TenLopVanBan, 0 AS Level
	                FROM LopVanBan lvb
	                WHERE Id = @id

	                UNION ALL

	                SELECT lvb.ID, lvb.TenLopVanBan, Level+1 AS Level
	                FROM LopVanBan lvb 
                    JOIN cte i ON lvb.LopVanBanCha = i.ID
                )
                SELECT "+ limitSql + @" vb.*, ht.TenHinhThucVanBan, lv.TenLinhVuc, cq.TenCoQuanBanHanh, vblv.LinhVucID, vbcq.CoQuanBanHanhID, vblvb.LopVanBanID 
                from VanBan vb
                left join HinhThucVanBan ht on ht.ID = vb.ID
                left join VanBan_LopVanBan vblvb on vblvb.VanBanID = vb.ID
                left join LopVanBan lvb on vblvb.LopVanBanID = lvb.ID
                left join VanBan_LinhVuc vblv on vblv.VanBanID = vb.ID
                left join LinhVuc lv on lv.ID = vblv.LinhVucID
                left join VanBan_CoQuanBanHanh vbcq on vbcq.VanBanID = vb.ID
                left join CoQuanBanHanh cq on cq.ID = vbcq.CoQuanBanHanhID
                where vblvb.LopVanBanID in (select ID from cte) and vb.lang=@lang and vb.TrangThai=1
                order by vb.NgayBanHanh desc;
            ",
            new Dictionary<string, object> { { "@id", id }, { "@lang", lan } }).ToList();
            return Request.CreateResponse(DataSourceLoader.Load(banners, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> VanBan(string lang, DataSourceLoadOptions loadOptions)
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var data = _context.CollectionFromSql(@"
                select vb.*, ht.TenHinhThucVanBan, lv.TenLinhVuc, cq.TenCoQuanBanHanh, vblv.LinhVucID, vbcq.CoQuanBanHanhID, vblvb.LopVanBanID 
                from VanBan vb
                left join HinhThucVanBan ht on ht.ID = vb.ID
                left join VanBan_LopVanBan vblvb on vblvb.VanBanID = vb.ID
                left join LopVanBan lvb on vblvb.LopVanBanID = lvb.ID
                left join VanBan_LinhVuc vblv on vblv.VanBanID = vb.ID
                left join LinhVuc lv on lv.ID = vblv.LinhVucID
                left join VanBan_CoQuanBanHanh vbcq on vbcq.VanBanID = vb.ID
                left join CoQuanBanHanh cq on cq.ID = vbcq.CoQuanBanHanhID
                where vb.Lang = @lang and vb.TrangThai=1
                order by vb.ID desc
            ",
            new Dictionary<string, object> { { "lang", lan } }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> VanBanDuThao(string lang, DataSourceLoadOptions loadOptions)
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var data = _context.CollectionFromSql(@"
                select vb.*, ht.TenHinhThucVanBan, lv.TenLinhVuc, cq.TenCoQuanBanHanh, vblv.LinhVucID, vbcq.CoQuanID
                from VanBanDuThao vb
                left join HinhThucVanBan ht on ht.ID = vb.ID
                left join VanBanDuThao_LinhVucs vblv on vblv.VanBanDuThaoID = vb.ID
                left join LinhVuc lv on lv.ID = vblv.LinhVucID
                left join VanBanDuThao_CoQuanBanHanhs vbcq on vbcq.VanBanDuThaoID = vb.ID
                left join CoQuanBanHanh cq on cq.ID = vbcq.CoQuanID
                where vb.Lang = @lang and vb.TrangThai=1
                order by vb.ID desc
            ",
            new Dictionary<string, object> { { "lang", lan } }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> LopVanBan(DataSourceLoadOptions loadOptions)
        {
            var data = _context.CollectionFromSql(@"
                select * from LopVanBan where HienThi = 1 order by SoThuTu asc;
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> VanBanDetail(int ID)
        {
            return VanBanDetailById(ID);
        }
        private HttpResponseMessage VanBanDetailById(int ID)
        {
            var data = _context.VanBans
                .Include(s => s.HinhThucVanBan)
                .Include(s => s.VanBan_LopVanBan.Select(x => x.LopVanBan))
                .Include(s => s.VanBan_LienQuans.Select(x => x.VanBan))
                .Include(s => s.VanBan_CoQuanBanHanh.Select(x => x.CoQuanBanHanh))
                .Include(s => s.VanBan_Files.Select(x => x.File))
                .Include(s => s.VanBan_LinhVuc.Select(x => x.LinhVuc))
                .Where(x => x.ID == ID).FirstOrDefault();
            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> VanBanDetailByOldQPPLID(int ID)
        {
            string oldID = $"|##|Văn bản quy phạm pháp luật|##|{ID}";
            return VanBanDetailByOldID(oldID);
        }
        [HttpGet]
        public async Task<HttpResponseMessage> VanBanDetailByOldTBID(int ID)
        {
            string oldID = $"|##|Thông báo|##|{ID}";
            return VanBanDetailByOldID(oldID);
        }
        [HttpGet]
        public async Task<HttpResponseMessage> VanBanDetailByOldCDID(int ID)
        {
            string oldID = $"|##|Văn bản chỉ đạo điều hành|##|{ID}";
            return VanBanDetailByOldID(oldID);
        }

        private HttpResponseMessage VanBanDetailByOldID(string oldID)
        {
            var id = _context.VanBans
                .Where(x => x.Migrate_Source.EndsWith(oldID)).Select(s => s.ID).FirstOrDefault();

            return VanBanDetailById(id);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> VanBanDuThaoDetail(int ID)
        {
            return VanBanDuThaoDetailById(ID);
        }

        private HttpResponseMessage VanBanDuThaoDetailById(int ID)
        {
            var data = _context.VanBanDuThaos
                .Include(s => s.HinhThucVanBan)
                .Include(s => s.VanBanDuThao_CoQuanBanHanhs.Select(x => x.CoQuanBanHanh))
                .Include(s => s.VanBanDuThao_Files.Select(x => x.File))
                .Include(s => s.VanBanDuThao_LinhVucs.Select(x => x.LinhVuc))
                .Where(x => x.ID == ID).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> VanBanDuThaoDetailByOldId(int oldId)
        {
            string pattern = $"|##|{oldId}";
            var id = _context.VanBanDuThaos
                .Where(x => x.Migrate_Source.EndsWith(pattern)).Select(s => s.ID).FirstOrDefault();

            return VanBanDuThaoDetailById(id);
        }

        public class CommentModel
        {
            public string IDVBDT { get; set; }
            public string fullName { get; set; }
            public string phone { get; set; }
            public string email { get; set; }
            public string address { get; set; }
            public string content { get; set; }
            public string recaptcha { get; set; }
        }
        [HttpPost]
        public async Task<HttpResponseMessage> SendCommentVBDT([FromBody] CommentModel model)
        {
            var recaptchaService = new ReCaptchaValidator();
            var captchaResult = await recaptchaService.VerifyTokenAsync(model.recaptcha);

            // Check if the request to Google succeeded
            if (!captchaResult.Success)
            {
                // The token was invalid or expired
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "ReCaptcha validation failed.");
            }

            // Check the Action name (to prevent token reuse across different actions)
            if (captchaResult.Action != "sendcomment")
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid ReCaptcha action.");
            }

            // Check the Score (Threshold: 0.5)
            // If score < 0.5, it is likely a bot.
            if (captchaResult.Score < 0.6)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bot activity detected.");
            }

            var vbdt = _context.VanBanDuThaos.Find(Convert.ToInt32(model.IDVBDT));
            if (vbdt == null || vbdt.NgayBatDauLayYKien > DateTime.Now || vbdt.NgayHetHanLayYKien < DateTime.Now)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid document.");
            } 

            VanBanDuThao_GopY gopy = new VanBanDuThao_GopY();
            gopy.DiaChi = model.address;
            gopy.VanBanDuThaoID = Convert.ToInt32(model.IDVBDT);
            gopy.Email = model.email;
            gopy.SoDienThoai = model.phone;
            gopy.NoiDung = model.content;
            gopy.HoTen = model.fullName;
            _context.VanBanDuThao_GopY.Add(gopy);
            _context.SaveChanges();

            return Request.CreateResponse(HttpStatusCode.OK, new { Message = "Success" });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostDetail(int ID, string lang = "")
        {
            return PostDetailById(ID);
        }
        private HttpResponseMessage PostDetailById(int ID)
        {
            var post = _context.TinTucs
                .Include(s => s.ChuyenMuc)
                .Include(s => s.TinTuc_Files.Select(x => x.File))
                .Where(x => x.ID == ID)
                .FirstOrDefault();
            if (post == null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { data = (string)null });
            }
            post.PageCount = post.PageCount + 1 ?? 1;
            _context.Entry(post).Property(x => x.PageCount).IsModified = true;
            _context.SaveChanges();


            var parents = _context.CollectionFromSql(@"
                with name_tree as 
                (
                    select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, 0 AS Level
                    from ChuyenMuc i
                    where IsVisible=1 and i.ID = @ID
	 
                    union all
	 
                    select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, Level+1 AS Level
                    from ChuyenMuc i
                    join name_tree p on i.ID = p.ChuyenMucCha AND i.ID <> i.ChuyenMucCha and i.IsVisible=1
                )
                SELECT * FROM name_tree ORDER BY Level desc
            ",
            new Dictionary<string, object> { { "@ID", post.IDChuyenMuc } }).ToList();

            var username = User.Identity.GetUserName();
            return Request.CreateResponse(HttpStatusCode.OK, new { data = post, parents, username });
        }

        private HttpResponseMessage PostDetailByOldId(string oldID)
        {
            var id = _context.TinTucs
                .Where(x => x.Migrate_Source.EndsWith(oldID))
                .Select(s => s.ID).FirstOrDefault();
            return PostDetailById(id);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostDetailByoid(int ID, string lang = "")
        {
            string oldID = $"/knd/tt|##|Tin tức|##|{ID}";
            return PostDetailByOldId(oldID);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostDetailBybtid(int ID, string lang = "")
        {
            string oldID = $"|##|Tin trang bộ trưởng|##|{ID}";
            return PostDetailByOldId(oldID);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostDetailBynqid(int ID, string lang = "")
        {
            string oldID = $"|##|Tin Nghị quyết Trung ương 4|##|{ID}";
            return PostDetailByOldId(oldID);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostDetailBygtbtid(int ID, string lang = "")
        {
            string oldID = $"|##|Tin tức Infographics|##|{ID}";
            return PostDetailByOldId(oldID);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> ChuyenMucDetail(int ID, int limitTopPost = 6)
        {
            return ChuyenMucDetailById(ID, limitTopPost);
        }
        private HttpResponseMessage ChuyenMucDetailById(int ID, int limitTopPost = 6)
        {
            var chuyenmuc = _context.ChuyenMucs.Find(ID);

            var parents = _context.CollectionFromSql(@"
                with name_tree as 
                (
                    select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, i.Type, 0 AS Level
                    from ChuyenMuc i
                    where IsVisible=1 and i.ID = @ID
	 
                    union all
	 
                    select i.ID, i.TenChuyenMuc, i.ChuyenMucCha, i.LinkTinTuc, i.MoTa, i.IDQuyTrinh, i.TrangThai, i.DanhSachNguoiPhuTrach, i.DanhSachNhomPhuTrach, i.NgayTao, i.TenNguoiPhuTrach, i.TenNhomPhuTrach, i.SoThuTu, i.VungHienThi, i.LogThayDoi, i.DangKyNhanBaiViet, i.HienThiTieuDe, i.Type, Level+1 AS Level
                    from ChuyenMuc i
                    join name_tree p on i.ID = p.ChuyenMucCha AND i.ID <> i.ChuyenMucCha and i.IsVisible=1 
                )
                SELECT * FROM name_tree ORDER BY Level desc
            ",
            new Dictionary<string, object> { { "@ID", chuyenmuc.ID } }).ToList();

            var childs = _context.CollectionFromSql(@"
                select * from ChuyenMuc where ChuyenMucCha = @ChuyenMucCha and IsVisible=1 and TrangThai = 'HoatDong' order by SoThuTu asc
            ",
            new Dictionary<string, object> { { "@ChuyenMucCha", chuyenmuc.ID } }).ToList();

            var samelevels = new List<dynamic>();
            if (chuyenmuc.ChuyenMucCha != null)
            {
                samelevels = _context.CollectionFromSql(@"
                    select * from ChuyenMuc where ChuyenMucCha = @ChuyenMucCha and IsVisible=1 and TrangThai = 'HoatDong' order by SoThuTu asc
                ",
                new Dictionary<string, object> { { "@ChuyenMucCha", chuyenmuc.ChuyenMucCha } }).ToList();
            }

            var topposts = _context.CollectionFromSql(@"
                with name_tree as 
                (
			                select i.ID, i.ChuyenMucCha, 0 AS Level
			                from ChuyenMuc i
			                where IsVisible=1 and i.ID = @IDChuyenMuc

			                union all

			                select i.ID, i.ChuyenMucCha, Level+1 AS Level
			                from ChuyenMuc i
			                join name_tree p on p.ID = i.ChuyenMucCha AND i.ID <> p.ChuyenMucCha and i.IsVisible=1
                )
                select top " + limitTopPost + @" t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID
                where IDChuyenMuc in (SELECT ID FROM name_tree) and t.TrangThai='public' and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                order by t.NoiBat desc, t.NgayXuatBan desc
            ",
            new Dictionary<string, object> { { "@IDChuyenMuc", chuyenmuc.ID } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data = chuyenmuc, parents, childs, samelevels, topposts });
        }

        private HttpResponseMessage ChuyenMucDetailByOldId(string oldID, int limitTopPost = 6)
        {
            var id = _context.ChuyenMucs.Where(x => x.Migrate_Source.EndsWith(oldID)).Select(s => s.ID).FirstOrDefault(); ;
            return ChuyenMucDetailById(id, limitTopPost);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> ChuyenMucDetailByoid(int ID, int limitTopPost = 6)
        {
            string oldID = $"|##|Danh mục tin tức|##|{ID}";
            return ChuyenMucDetailByOldId(oldID, limitTopPost);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> ChuyenMucDetailBybtid(int ID, int limitTopPost = 6)
        {
            string oldID = $"|##|DanhmucTDKT|##|{ID}";
            return ChuyenMucDetailByOldId(oldID, limitTopPost);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> ChuyenMucDetailBynqid(int ID, int limitTopPost = 6)
        {
            string oldID = $"/KND/nghi-quyet-tw4/TT|##|Danhmuc|##|{ID}";
            return ChuyenMucDetailByOldId(oldID, limitTopPost);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostRelate(int ID, string lang, DataSourceLoadOptions loadOptions)
        {
            return PostRelateById(ID, lang, loadOptions);
        }
        private HttpResponseMessage PostRelateById(int ID, string lang, DataSourceLoadOptions loadOptions)
        {
            var post = _context.TinTucs
                .Include(s => s.ChuyenMuc)
                .Where(x => x.ID == ID)
                .FirstOrDefault();

            var related = _context.CollectionFromSql(@"
                with name_tree as 
                (
			                select i.ID, i.ChuyenMucCha, 0 AS Level
			                from ChuyenMuc i
			                where IsVisible=1 and i.ID = @IDChuyenMuc

			                union all

			                select i.ID, i.ChuyenMucCha, Level+1 AS Level
			                from ChuyenMuc i
			                join name_tree p on p.ID = i.ChuyenMucCha AND i.ID <> p.ChuyenMucCha and i.IsVisible=1
                )
                select t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID
                where IDChuyenMuc in (SELECT ID FROM name_tree) and t.ID <> @ID and t.TrangThai='public' and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                order by t.NgayXuatBan desc
            ",
            new Dictionary<string, object> { { "@IDChuyenMuc", post.IDChuyenMuc }, { "@ID", post.ID } }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(related, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> PostRelateByoid(int ID, string lang, DataSourceLoadOptions loadOptions)
        {
            string oldID = $"/knd/tt|##|Tin tức|##|{ID}";
            return PostRelateByOldId(oldID, lang, loadOptions);
        }
        [HttpGet]
        public async Task<HttpResponseMessage> PostRelateBybtid(int ID, string lang, DataSourceLoadOptions loadOptions)
        {
            string oldID = $"|##|Tin trang bộ trưởng|##|{ID}";
            return PostRelateByOldId(oldID, lang, loadOptions);
        }
        [HttpGet]
        public async Task<HttpResponseMessage> PostRelateBynqid(int ID, string lang, DataSourceLoadOptions loadOptions)
        {
            string oldID = $"|##|Tin Nghị quyết Trung ương 4|##|{ID}";
            return PostRelateByOldId(oldID, lang, loadOptions);
        }
        private HttpResponseMessage PostRelateByOldId(string oldID, string lang, DataSourceLoadOptions loadOptions)
        {
            var id = _context.TinTucs
                .Where(x => x.Migrate_Source.EndsWith(oldID))
                .Select(s => s.ID).FirstOrDefault();
            return PostRelateById(id, lang, loadOptions);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostsByCategory(int ID, [FromUri] int[] exId, DataSourceLoadOptions loadOptions)
        {
            return  PostsByCategoryById(ID, exId, loadOptions);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostsByCategoryBybtid(int ID, [FromUri] int[] exId, DataSourceLoadOptions loadOptions)
        {
            string oldID = $"|##|DanhmucTDKT|##|{ID}";
            return PostsByCategoryByOldId(oldID, exId, loadOptions);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostsByCategoryBynqid(int ID, [FromUri] int[] exId, DataSourceLoadOptions loadOptions)
        {
            string oldID = $"/KND/nghi-quyet-tw4/TT|##|Danhmuc|##|{ID}";
            return PostsByCategoryByOldId(oldID, exId, loadOptions);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PostsByCategoryByoid(int ID, [FromUri] int[] exId, DataSourceLoadOptions loadOptions)
        {
            string oldID = $"/knd|##|Danh mục tin tức|##|{ID}";
            return PostsByCategoryByOldId(oldID, exId, loadOptions);
        }

        private HttpResponseMessage PostsByCategoryById(int ID, [FromUri] int[] exId, DataSourceLoadOptions loadOptions)
        {

            var chuyenmuc = _context.ChuyenMucs.Find(ID);
            string exIdsStr = "";
            if (exId.Length > 0)
            {
                exIdsStr = string.Format("and t.ID not in ({0})", string.Join(", ", exId));
            }
            string sql = string.Format(@"
                WITH cte AS 
                (
	                SELECT c.ID, c.TenChuyenMuc, 0 AS Level
	                FROM ChuyenMuc c
	                WHERE IsVisible=1 and Id = {0}

	                UNION ALL

	                SELECT c.ID, c.TenChuyenMuc, Level+1 AS Level
	                FROM ChuyenMuc c JOIN cte i ON c.ChuyenMucCha = i.ID AND c.IsVisible=1 
                )

                select t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, t.NoiBat, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl 
                from TinTuc t 
                left join Files f on t.AnhDaiDien = f.ID
                where t.IDChuyenMuc in (SELECT Id FROM cte) 
                and t.TrangThai = 'public' and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                {1}
                ORDER BY NgayXuatBan desc
            ", ID, exIdsStr);

            var topposts = _context.CollectionFromSql(sql, new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(topposts, loadOptions));
        }

        private HttpResponseMessage PostsByCategoryByOldId(string oldID, [FromUri] int[] exId, DataSourceLoadOptions loadOptions)
        {
            var id = _context.ChuyenMucs.Where(x => x.Migrate_Source.EndsWith(oldID)).Select(s => s.ID).FirstOrDefault(); ;
            return PostsByCategoryById(id, exId, loadOptions);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> MenuDetail(int ID)
        {
            var menu = _context.Menu_FrontEnd.Find(ID);
            var childs = _context.CollectionFromSql(@"
                select * from Menu_FrontEnd where IDMenuCha = @IDMenuCha and HienThi = 1 ORDER BY STT asc
            ",
            new Dictionary<string, object> { { "@IDMenuCha", menu.ID } }).ToList();

            foreach (var child in childs)
            {
                var subchilds = _context.CollectionFromSql(@"
                    select * from Menu_FrontEnd where IDMenuCha = @IDMenuCha and HienThi = 1 ORDER BY STT asc
                ",
                new Dictionary<string, object> { { "@IDMenuCha", child.ID } }).ToList();
                child.SubChilds = subchilds;
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { data = menu, childs });
        }
        
        [HttpGet]
        public async Task<HttpResponseMessage> SendMail()
        {

            var cauhinh = _context.ThamSoHeThongs.FirstOrDefault();
            if (cauhinh != null
                && !string.IsNullOrEmpty(cauhinh.EmailHost)
                && !string.IsNullOrEmpty(cauhinh.EmailPort)
                && !string.IsNullOrEmpty(cauhinh.EmailAddress)
                && !string.IsNullOrEmpty(cauhinh.EmailPassword)
            )
            {
                //Send email thay doi
                var smtpClient = new SmtpClient(cauhinh.EmailHost)
                {
                    Port = Convert.ToInt32(cauhinh.EmailPort),
                    Credentials = new NetworkCredential(cauhinh.EmailAddress, cauhinh.EmailPassword),
                    EnableSsl = true,
                };
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(cauhinh.EmailAddress),
                    Subject = "Thông báo có sự thay đổi nội dung tin tức",
                    Body = "Bài viết  có sự thay đổi <br /> Truy cập link sau: <a href='http://123.31.19.244:3333/baiviet/</a>",
                    IsBodyHtml = true,
                };
                string[] arrEmails = _context.User_Account
                    .Where(x => !string.IsNullOrEmpty(x.EmailAddress))
                    .Select(x => x.EmailAddress).ToArray();
                foreach (string i in arrEmails)
                {
                    mailMessage.To.Add(i);
                }

                smtpClient.Send(mailMessage);
            }

            return Request.CreateResponse(HttpStatusCode.OK, new { });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxHighLight(int limit, string lang = "")
        {
            int lan = 10;//chuyen muc: Tin tuc - su kien
            if (lang == "en")
            {
                lan = 10;
            }
            var data = _context.CollectionFromSql(@"
                WITH cte AS 
                (
                  SELECT c.ID, c.TenChuyenMuc, 0 AS Level
                  FROM ChuyenMuc c
                  WHERE IsVisible=1 and Id = @ID
	
                  UNION ALL
	
                  SELECT c.ID, c.TenChuyenMuc, Level+1 AS Level
                  FROM ChuyenMuc c JOIN cte i ON c.ChuyenMucCha = i.ID AND c.IsVisible=1 
                )
                select top " + limit + @" tt.*, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc tt 
                left join Files f on tt.AnhDaiDien = f.ID
                where tt.IDChuyenMuc in (SELECT Id FROM cte) and tt.TrangThai = 'public' and tt.NgayXuatBan >= '2021-01-01 00:00:00.001'
                ORDER BY NgayXuatBan desc
            ",
            new Dictionary<string, object> { { "@ID", lan } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxNew(int ID, int limit, [FromUri] int[] exId)
        {
            var chuyenmuc = _context.ChuyenMucs.Find(ID);
            string exIdsStr = "";
            if (exId.Length > 0)
            {
                exIdsStr = string.Format("and t.ID not in ({0})", string.Join(", ", exId));
            }
            string sql = string.Format(@"
                WITH cte AS 
                (
                  SELECT c.ID, c.TenChuyenMuc, 0 AS Level
                  FROM ChuyenMuc c
                  WHERE IsVisible=1 and Id = {0}
	
                  UNION ALL
	
                  SELECT c.ID, c.TenChuyenMuc, Level+1 AS Level
                  FROM ChuyenMuc c JOIN cte i ON c.ChuyenMucCha = i.ID AND c.IsVisible=1 
                )
                select top {1} t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t 
                left join Files f on t.AnhDaiDien = f.ID
                where t.IDChuyenMuc in (SELECT Id FROM cte) 
                and t.TrangThai = 'public' and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                {2}
                ORDER BY t.NoiBat desc, t.NgayXuatBan desc
            ", ID, limit, exIdsStr);
            var topposts = _context.CollectionFromSql(sql, new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data = chuyenmuc, topposts });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Box8News(int ID)
        {
            var chuyenmuc = _context.ChuyenMucs.Find(ID);
            string sql = string.Format(@"
                SELECT ID, TenChuyenMuc
	                FROM ChuyenMuc WHERE IsVisible=1 and ChuyenMucCha = @ID ORDER BY SoThuTu asc
            ");

            var subCates = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@ID", ID } }).ToList();

            foreach(var cate in subCates)
            {
                string sqlPosts = string.Format(@"
                    select top 1 t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl 
                    from TinTuc t 
                    left join Files f on t.AnhDaiDien = f.ID
                    where t.IDChuyenMuc = @IDChuyenMuc 
                    and t.TrangThai = 'public' and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                    ORDER BY NgayXuatBan desc
                ");
                var topposts = _context.CollectionFromSql(sqlPosts, new Dictionary<string, object> { { "@IDChuyenMuc", cate.ID } }).FirstOrDefault();
                cate.TopPost = topposts;
            }

            return Request.CreateResponse(HttpStatusCode.OK, new { subCates });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PhotoAlbums(DataSourceLoadOptions loadOptions)
        {
            string sql = string.Format(@"
                select t.ID, t.TieuDe, t.MoTa, t.ThoiGianXuatBan, f.Ten as TenAnh, f.LinkLuuTru as UrlAnh 
                from ABL_AlbumAnh t 
                left join Files f on t.AnhDaiDien = f.ID
                and t.TrangThai = '1'
                ORDER BY ThoiGianXuatBan desc
            ");

            var albums = _context.CollectionFromSql(sql, new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(albums, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PhotoAlbumInfo(string ID)
        {
            int id = Convert.ToInt32(ID);
            var data = _context.ABL_AlbumAnh
                .Include(s => s.AlbumAnh_Files.Select(i => i.File))
                .Where(x => x.ID == id).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, data);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> VideoAlbums(DataSourceLoadOptions loadOptions)
        {
            string sql = string.Format(@"
                select t.ID, t.TieuDe, t.MoTa, t.ThoiGianXuatBan, f.Ten as TenAnh, f.LinkLuuTru as UrlAnh 
                from ABL_AlbumVideo t 
                left join Files f on t.AnhDaiDien = f.ID
                and t.TrangThai = '1'
                ORDER BY ThoiGianXuatBan desc
            ");

            var albums = _context.CollectionFromSql(sql, new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(albums, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> VideosByChuyenMuc(int ID, DataSourceLoadOptions loadOptions)
        {
            string sql = string.Format(@"
                select top 1 t.ID, t.TieuDe, t.MoTa, t.ThoiGianXuatBan, f.Ten as TenAnh, f.LinkLuuTru as UrlAnh 
                from ABL_AlbumVideo t 
                left join Files f on t.AnhDaiDien = f.ID
                and t.TrangThai = '1'
                WHERE IDChuyenMucAlbumVideo = @IDChuyenMuc
                ORDER BY ThoiGianXuatBan desc
            ");

            var albums = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@IDChuyenMuc", ID } }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(albums, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PhotosByChuyenMuc(int ID, DataSourceLoadOptions loadOptions)
        {
            string sql = string.Format(@"
                select top 1 t.ID, t.TieuDe, t.MoTa, t.ThoiGianXuatBan, f.Ten as TenAnh, f.LinkLuuTru as UrlAnh 
                from ABL_AlbumAnh t 
                left join Files f on t.AnhDaiDien = f.ID
                and t.TrangThai = '1'
                WHERE IDChuyenMucAlbumAnh = @IDChuyenMuc
                ORDER BY ThoiGianXuatBan desc
            ");

            var albums = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@IDChuyenMuc", ID } }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(albums, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> AudiosByChuyenMuc(int ID, DataSourceLoadOptions loadOptions)
        {
            string sql = string.Format(@"
                select top 1 t.ID, t.TieuDe, t.MoTa, t.ThoiGianXuatBan, f.Ten as TenAnh, f.LinkLuuTru as UrlAnh 
                from ABL_AlbumAudio t 
                left join Files f on t.AnhDaiDien = f.ID
                and t.TrangThai = '1'
                WHERE IDChuyenMucAlbumAudio = @IDChuyenMuc
                ORDER BY ThoiGianXuatBan desc
            ");

            var albums = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@IDChuyenMuc", ID } }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(albums, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> VideoAlbumInfo(string ID)
        {
            int id = Convert.ToInt32(ID);
            var data = _context.ABL_AlbumVideo
                .Include(s => s.AlbumVideo_Files.Select(i => i.File))
                .Where(x => x.ID == id).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, data);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> AudioAlbums(DataSourceLoadOptions loadOptions)
        {
            string sql = string.Format(@"
                select t.ID, t.TieuDe, t.MoTa, t.ThoiGianXuatBan, f.Ten as TenAnh, f.LinkLuuTru as UrlAnh 
                from ABL_AlbumAudio t 
                left join Files f on t.AnhDaiDien = f.ID
                and t.TrangThai = '1'
                ORDER BY ThoiGianXuatBan desc
            ");

            var albums = _context.CollectionFromSql(sql, new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(albums, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> AudioAlbumInfo(string ID)
        {
            int id = Convert.ToInt32(ID);
            var data = _context.ABL_AlbumAudio
                .Include(s => s.AlbumAudio_Files.Select(i => i.File))
                .Where(x => x.ID == id).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, data);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> BoxMediaVi()
        {
            var childs = _context.CollectionFromSql(@"select * from Menu_FrontEnd where IDMenuCha = @IDMenuCha and HienThi = 1 ORDER BY STT asc", 
                                                        new Dictionary<string, object> { { "@IDMenuCha", 2789 } }).ToList();
            var categories = new List<dynamic>();
            var posts = new List<dynamic>();
            var tabs = new List<dynamic>();
            foreach (var child in childs)
            {
                string url = child.URL;
                tabs.Add(new { label = child.TenMenu, url = url, icon = child.IconDaiDien });
                var cate = new { icon = child.IconDaiDien, title = child.TenMenu, url = url, items = new List<dynamic>() };
                if (url.ToLower().Contains("/chuyen-muc/"))
                {
                    int idChuyenMuc = Convert.ToInt32(url.Substring(url.LastIndexOf("---id") + 5));
                    var topposts = _context.CollectionFromSql(@"
                                with name_tree as 
                                (
			                                select i.ID, i.ChuyenMucCha, 0 AS Level
			                                from ChuyenMuc i
			                                where IsVisible=1 and i.ID = @IDChuyenMuc

			                                union all

			                                select i.ID, i.ChuyenMucCha, Level+1 AS Level
			                                from ChuyenMuc i 
			                                join name_tree p on p.ID = i.ChuyenMucCha AND i.ID <> p.ChuyenMucCha and i.IsVisible=1 
                                )
                                select top 6 t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                                left join Files f on t.AnhDaiDien = f.ID
                                where IDChuyenMuc in (SELECT ID FROM name_tree) and t.TrangThai='public' and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                                order by t.NoiBat desc, t.NgayXuatBan desc
                            ",
                            new Dictionary<string, object> { { "@IDChuyenMuc", idChuyenMuc } }).ToList();
                    int count = 0;
                    foreach (var post in topposts)
                    {
                        if(count++ == 0)
                        {
                            posts.Add(new { url = $"/tin-tuc/{Utils.ToUnsignString(post.TieuDe)}---id{post.ID}", image = post.AnhDaiDienUrl, title = post.TieuDe, date = post.NgayXuatBan });
                        }
                        else
                        {
                            cate.items.Add(new { url = $"/tin-tuc/{Utils.ToUnsignString(post.TieuDe)}---id{post.ID}", image = post.AnhDaiDienUrl, title = post.TieuDe, date = post.NgayXuatBan });
                        }
                    }
                }
                else if (url.ToLower().Contains("/multimedia/photo"))
                {
                    var medias = _context.CollectionFromSql(@"
                        select top 6 c.*, f.LinkLuuTru from ABL_AlbumAnh c
                        left join Files f on c.AnhDaiDien = f.ID
                        where c.TrangThai = '1' order by c.ThoiGianXuatBan desc
                    ", new Dictionary<string, object> ()).ToList();
                    int count = 0;
                    foreach (var media in medias)
                    {
                        if (count++ == 0)
                        {
                            posts.Add(new { url = $"/photo/{Utils.ToUnsignString(media.TieuDe)}---id{media.ID}", image = media.LinkLuuTru, title = media.TieuDe, date = media.ThoiGianXuatBan });
                        }
                        else
                        {
                            cate.items.Add(new { url = $"/photo/{Utils.ToUnsignString(media.TieuDe)}---id{media.ID}", image = media.LinkLuuTru, title = media.TieuDe, date = media.ThoiGianXuatBan });
                        }
                    }
                }
                else if (url.ToLower().Contains("/multimedia/video"))
                {
                    var medias = _context.CollectionFromSql(@"
                        select top 6 c.*, f.LinkLuuTru from ABL_AlbumVideo c
                        left join Files f on c.AnhDaiDien = f.ID
                        where c.TrangThai = '1' order by c.ThoiGianXuatBan desc
                    ", new Dictionary<string, object>()).ToList();
                    foreach (var media in medias)
                    {
                        cate.items.Add(new { url = $"/video/{Utils.ToUnsignString(media.TieuDe)}---id{media.ID}", image = media.LinkLuuTru, title = media.TieuDe, date = media.ThoiGianXuatBan });
                    }
                }
                else if (url.ToLower().Contains("/multimedia/audio"))
                {
                    var medias = _context.CollectionFromSql(@"
                        select top 6 c.*, f.LinkLuuTru from ABL_AlbumAudio c
                        left join Files f on c.AnhDaiDien = f.ID
                        where c.TrangThai = '1' order by c.ThoiGianXuatBan desc
                    ", new Dictionary<string, object>()).ToList();
                    foreach (var media in medias)
                    {
                        cate.items.Add(new { url = $"/audio/{Utils.ToUnsignString(media.TieuDe)}---id{media.ID}", image = media.LinkLuuTru, title = media.TieuDe, date = media.ThoiGianXuatBan });
                    }
                }

                categories.Add(cate);
            }

            return Request.CreateResponse(HttpStatusCode.OK, new { tabs, posts, categories });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> BoxMediaEn()
        {
            var infographics = _context.CollectionFromSql(@"
                select top 1 t.*, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID
                where IDChuyenMuc = 11517
                order by t.NgayXuatBan desc
            ",
            new Dictionary<string, object> { }).FirstOrDefault();

            var medias = _context.CollectionFromSql(@"
                select top 1 c.* from Crawler_LienKet c
                join Crawler_Nguon cn on cn.ID = c.ID_NguonTin
                join Crawler_ChuDe cc on cc.ID = cn.ChuDeID
                where cc.ID = 57 and c.TrangThai = 1 order by c.NoiBat desc, c.NgayXuatBan desc
											 
            ",
            new Dictionary<string, object> { }).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, new { infographics, medias });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> BoxSuKien(string lang = "")
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var data = _context.SuKienHoiThaos
                .Include(s => s.LoaiSuKien).Where(x => x.Lang == lan).OrderByDescending(x => x.ThoiGianTu).Take(3);

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxTinTongHop(int ID)
        {
            var top = _context.CollectionFromSql(@"
                select top 1 t.*, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID 
                where t.ID in (
	                select tb.TinTucID from TinTuc_Block tb
	                join Block b on b.ID = tb.BlockID
	                where b.Path = 'BoxTongHop'
                )
                ORDER BY t.ID desc
            ",
            new Dictionary<string, object> { }).FirstOrDefault();
            var data = _context.CollectionFromSql(@"
                WITH cte AS 
                (
	                SELECT c.ID, c.TenChuyenMuc, 0 AS Level
	                FROM ChuyenMuc c
	                WHERE IsVisible=1 and Id = @ID

	                UNION ALL

	                SELECT c.ID, c.TenChuyenMuc, Level+1 AS Level
	                FROM ChuyenMuc c JOIN cte i ON c.ChuyenMucCha = i.ID AND c.IsVisible=1 
                )

                select top 5 t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl 
                from TinTuc t 
                left join Files f on t.AnhDaiDien = f.ID
                where t.IDChuyenMuc in (SELECT Id FROM cte) 
                and t.TrangThai = 'public' and t.ID <> @idTop and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                ORDER BY NgayXuatBan desc
            ", new Dictionary<string, object> { { "@ID", ID }, { "@idTop", top.ID } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data, top });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxTinNoiBatEn(int ID)
        {
            var data = _context.CollectionFromSql(@"
                select top 6 t.*, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID 
                where t.ID in (
	                select tb.TinTucID from TinTuc_Block tb
	                join Block b on b.ID = tb.BlockID
	                where b.Path = 'BoxTinNoiBatEn'
                )
                and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                ORDER BY t.ID desc
            ",
            new Dictionary<string, object> { }).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxHotVi()
        {
            var data = _context.CollectionFromSql(@"
                select top 6 t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID 
                where t.ID in (
	                select tb.TinTucID from TinTuc_Block tb
	                join Block b on b.ID = tb.BlockID
	                where b.Path = 'BoxHot'
                ) and t.TrangThai = 'public' and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                ORDER BY t.NgayXuatBan desc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxHotEn()
        {
            var data = _context.CollectionFromSql(@"
                select top 6 t.ID, t.TieuDe, t.MoTa, t.NgayXuatBan, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID 
                where t.ID in (
	                select tb.TinTucID from TinTuc_Block tb
	                join Block b on b.ID = tb.BlockID
	                where b.Path = 'BoxHotEn'
                ) and t.TrangThai = 'public' and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                ORDER BY t.NgayXuatBan desc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> BoxNotification()
        {
            var datanotifys = _context.CollectionFromSql(@"
                select top 3 t.*, f.Ten as TenAnhDaiDien, f.LinkLuuTru as AnhDaiDienUrl from TinTuc t
                left join Files f on t.AnhDaiDien = f.ID 
                WHERE t.IDChuyenMuc = 27 and t.NgayXuatBan >= '2021-01-01 00:00:00.001'
                ORDER BY t.NgayXuatBan desc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { datanotifys });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> BoxAnnouncement()
        {
            var data = _context.CollectionFromSql(@"
                SELECT TOP 3
                    t.ID,
                    t.TieuDe,
                    t.NgayDang,
                    t.DonViBanHanh,
                    t.NoiDung,
                    -- Nesting the files query here
                    (
                        SELECT f.ID, f.Ten, f.LinkTaiFile
                        FROM ThongBao_Files tf
                        JOIN Files f ON tf.FileID = f.ID
                        WHERE tf.ThongBaoId = t.ID
                        FOR JSON PATH
                    ) AS DanhSachFile
                FROM ThongBao t
                WHERE t.NgayDang >= '2021-01-01 00:00:00.001'
                ORDER BY t.NgayDang DESC
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }

        private object _FaqStatistic = null;
        public object FaqStatistic
        {
            get
            {
                if (_FaqStatistic == null)
                {
                    _FaqStatistic = (HttpContext.Current.Cache["FaqStatistic"] as object);
                    if (_FaqStatistic == null)
                    {
                        _FaqStatistic = getFAQStatistic();
                        HttpContext.Current.Cache.Insert("FaqStatistic", _FaqStatistic, null, DateTime.Now.AddHours(12), Cache.NoSlidingExpiration, CacheItemPriority.Default, null);
                    }
                }
                return _FaqStatistic;
            }
            set
            {
                HttpContext.Current.Cache.Insert("FaqStatistic", _FaqStatistic, null, DateTime.Now.AddHours(12), Cache.NoSlidingExpiration, CacheItemPriority.Default, null);
            }
        }

        public static object getFAQStatistic()
        {
            // From Web
            var url = "https://bovoinddn.molisa.gov.vn/phan-anh-kien-nghi";
            var web = new HtmlWeb();
            var htmlDoc = web.Load(url);
            var datraloi = htmlDoc.DocumentNode.SelectSingleNode("//div[contains(@class, 'border')]/ul/li[1]/p/span/text()");
            var chuatraloi = htmlDoc.DocumentNode.SelectSingleNode("//div[contains(@class, 'border')]/ul/li[2]/p/span/text()");
            var khonghople = htmlDoc.DocumentNode.SelectSingleNode("//div[contains(@class, 'border')]/ul/li[3]/p/span/text()");
            var total = Convert.ToInt32(datraloi.InnerText) + Convert.ToInt32(chuatraloi.InnerText) + Convert.ToInt32(khonghople.InnerText);
            return new { total, datraloi = Convert.ToInt32(datraloi.InnerText), chuatraloi = Convert.ToInt32(chuatraloi.InnerText), khonghople = Convert.ToInt32(khonghople.InnerText) };
        }

        [HttpGet]
        public async Task<HttpResponseMessage> BoxNDDN(int limit)
        {
            var phcs = _context.CollectionFromSql(@"
                select top 3 c.* from Crawler_LienKet c
                join Crawler_Nguon cn on cn.ID = c.ID_NguonTin
                join Crawler_ChuDe cc on cc.ID = cn.ChuDeID
                where cc.ID = 38 and c.TrangThai = 1 order by c.NoiBat desc, c.NgayXuatBan desc
            ",
            new Dictionary<string, object> { }).ToList();

            var news = _context.CollectionFromSql(@"
                select top 3 c.* from Crawler_LienKet c
                join Crawler_Nguon cn on cn.ID = c.ID_NguonTin
                join Crawler_ChuDe cc on cc.ID = cn.ChuDeID
                where cc.ID = 56 and c.TrangThai = 1 order by c.NoiBat desc, c.NgayXuatBan desc
            ",
            new Dictionary<string, object> { }).ToList();
            //https://bovoinddn.molisa.gov.vn/phan-anh-kien-nghi
            var faq = FaqStatistic;
            return Request.CreateResponse(HttpStatusCode.OK, new { news, phcs, faq });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxVBPLEn(int limit)
        {
            int lan = 1033;
            var sql = @"
                select tmp.ID from (
	                SELECT distinct top " + limit + @" vb.ID, vb.NgayBanHanh  FROM Vanban vb 
	                join VanBan_LopVanBan lvb on lvb.VanBanID = vb.ID
	                where vb.ID!=0  and vb.lang=@lang and vb.TrangThai = 1 and lvb.LopVanBanID = @id
	                order by NgayBanHanh desc
                ) tmp
            ";
            var ids = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@id", 101 }, { "@lang", lan } }).Select(x => (int)x.ID).ToList();
            var cddhs = _context.VanBans
                .Include(s => s.VanBan_Files.Select(x => x.File))
                .OrderByDescending(x => x.NgayBanHanh)
                .Where(x => ids.Contains(x.ID)).ToList();

            var duthaos = _context.CollectionFromSql(@"
                select top " + limit + @" * from Crawler_LienKet where ID_NguonTin = @ID_NguonTin order by NgayXuatBan desc
            ",
            new Dictionary<string, object> { { "@ID_NguonTin", 80 } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { cddhs, duthaos });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> BoxVBPLVi(int limit)
        {
            int lan = 1066;
            var sql = @"
                select tmp.ID from (
	                SELECT distinct top " + limit + @" vb.ID, vb.NgayBanHanh FROM Vanban vb 
	                join VanBan_LopVanBan lvb on lvb.VanBanID = vb.ID
	                where vb.ID!=0  and vb.lang=@lang and vb.TrangThai = 1 and lvb.LopVanBanID = @id
	                order by NgayBanHanh desc
                ) tmp
            ";
            var ids = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@id", 104 }, { "@lang", lan } }).Select(x => (int)x.ID).ToList();
            var cddhs = _context.VanBans
                .Include(s => s.VanBan_Files.Select(x => x.File))
                .Where(x => ids.Contains(x.ID))
                .OrderByDescending(x => x.NgayBanHanh)
                .ToList();

            sql = @"
                select tmp.ID from (
	                SELECT distinct top " + limit + @" vb.ID, vb.NgayBanHanh  FROM Vanban vb 
	                join VanBan_LopVanBan lvb on lvb.VanBanID = vb.ID
	                where vb.ID!=0  and vb.lang=@lang and vb.TrangThai = 1 and lvb.LopVanBanID = @id
	                order by NgayBanHanh desc
                ) tmp
            ";

            ids = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@id", 101 }, { "@lang", lan } }).Select(x => (int)x.ID).ToList();
            var qppls = _context.VanBans
                .Include(s => s.VanBan_Files.Select(x => x.File))
                .Where(x => ids.Contains(x.ID))
                .OrderByDescending(x => x.NgayBanHanh)
                .ToList();

            sql = @"
                select tmp.ID from (
	                SELECT distinct top " + limit + @" vb.ID, vb.NgayBatDauLayYKien FROM Vanbanduthao vb 
                    where vb.ID !=0  and vb.lang=@lang and vb.TrangThai = 1 
                    order by vb.NgayBatDauLayYKien desc
                ) tmp
            ";

            ids = _context.CollectionFromSql(sql, new Dictionary<string, object> { { "@lang", lan } }).Select(x => (int)x.ID).ToList();
            var duthaos = _context.VanBanDuThaos
                .Where(x => ids.Contains(x.ID))
                .OrderByDescending(x => x.NgayBatDauLayYKien)
                .Select(x => new
                {
                    x.ID,
                    x.NgayBatDauLayYKien,
                    x.NgayHetHanLayYKien,
                    x.TieuDe,
                    TenHinhThucVanBan = x.HinhThucVanBan.TenHinhThucVanBan,
                    DangKhaDung = x.NgayBatDauLayYKien <= DateTime.Now && x.NgayHetHanLayYKien >= DateTime.Now,
                    Files = x.VanBanDuThao_Files.Select(f => f.File).ToList()
                })
                .ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new { cddhs, qppls, duthaos });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxPartners()
        {

            var data = _context.CollectionFromSql(@"
                select b.*, f.Ten as AnhBanner, f.LinkLuuTru as AnhBannerUrl 
                from Banner b
                join Banner_ViTri bv on bv.ID_Banner = b.ID
                left join Files f on b.ID_File = f.ID
                where bv.ID_ViTri = 3217
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BoxPartnersEn()
        {

            var data = _context.CollectionFromSql(@"
                select b.*, f.Ten as AnhBanner, f.LinkLuuTru as AnhBannerUrl 
                from Banner b
                join Banner_ViTri bv on bv.ID_Banner = b.ID
                left join Files f on b.ID_File = f.ID
                where bv.ID_ViTri = 3221
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> Partners(DataSourceLoadOptions loadOptions)
        {
            var data = _context.CollectionFromSql(@"
                select b.*, f.Ten as AnhBanner, f.LinkLuuTru as AnhBannerUrl 
                from Banner b
                join Banner_ViTri bv on bv.ID_Banner = b.ID
                left join Files f on b.ID_File = f.ID
                where bv.ID_ViTri = 3217
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> PartnersEn(DataSourceLoadOptions loadOptions)
        {
            var data = _context.CollectionFromSql(@"
                select b.*, f.Ten as AnhBanner, f.LinkLuuTru as AnhBannerUrl 
                from Banner b
                join Banner_ViTri bv on bv.ID_Banner = b.ID
                left join Files f on b.ID_File = f.ID
                where bv.ID_ViTri = 3221
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> DanhMucThongTin()
        {

            var data = _context.CollectionFromSql(@"
                select * from DanhMucThongTin order by ID desc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> DanhMucThongTinDetail(int ID)
        {
            var data = _context.DanhMucThongTins.Find(ID);

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> ThoiKyPhatTrien()
        {

            var data = _context.CollectionFromSql(@"
                select * from ThoiKyPhatTrien order by id asc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> ThoiKyPhatTrienDetail(int ID)
        {
            var data = _context.ThoiKyPhatTriens.Find(ID);

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> BlockConfig(int ID)
        {
            var data = _context.BlockConfigs.Find(ID);

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> NhanSuMoi(DataSourceLoadOptions loadOptions)
        {
            var data = _context.CollectionFromSql(@"
                select tt.* from ThongTinLanhDao tt
                where tt.TrangThai = 1 and Lang = 1066 and tt.NgayQDBoNhiem is not null
                order by tt.NgayQDBoNhiem desc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> LanhDaoThoiKy()
        {
            var data = _context.CollectionFromSql(@"
                
                select tt.* from ThongTinLanhDao tt
                join LanhDao_ThoiKy lt on lt.IDLanhDao = tt.ID
                where loailanhdao=1
                order by tt.TrangThai desc, lt.ID desc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> ThongTinLanhDaoDetail(int ID)
        {
            var data = _context.CollectionFromSql(@"
                select 
                    tt.ID, tt.HoTenLanhDao, tt.TieuSuBanThan, tt.SoDienThoai, tt.AnhDaiDien, 
                    tt.NgaySinh, tt.DanToc, tt.TonGiao, tt.NguyenQuan, tt.ChucVuDang, tt.ChucDanh,
                    tt.NgayVaoDang, tt.NgayVaoDangChinhThuc, tt.TrinhDo, tt.TrinhDoLLCT, 
	                dvld.Hang, dvld.Cot, cd.ChucVi, cd.Title, tt.ThuKy, tt2.HoTenLanhDao as HoTenThuKy, tt2.SoDienThoai as SoDienThoaiThuKy
                from  ThongTinLanhDao tt
                left join DonVi_LanhDao dvld on  tt.ID = dvld.IDLanhDao
                left join ThongTinLanhDao tt2 on tt2.ID = tt.ThuKy
                left join ChucDanh cd on cd.ID = dvld.ChucVu
                where tt.ID = @ID
            ",
            new Dictionary<string, object> { { "@ID", ID } }).FirstOrDefault();
            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> MediaNoiBat(string type, DataSourceLoadOptions loadOptions)
        {
            string sqlQuery = @"
                select c.* from Crawler_LienKet c
                join Crawler_Nguon cn on cn.ID = c.ID_NguonTin
                join Crawler_ChuDe cc on cc.ID = cn.ChuDeID
                where cc.ID = @IDChuDe and c.TrangThai = 1 order by NgayXuatBan desc, ThoiGianCrawl desc
            ";
            int? id = null;
            if (type == "video")
            {
                id = 1;
            }
            else if (type == "audio")
            {
                id = 58;
            }
            else if (type == "anh")
            {
                id = 59;
            }
            var data = _context.CollectionFromSql(sqlQuery,
            new Dictionary<string, object> { { "@IDChuDe", id } }).ToList();
            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> ThiTruongLaoDong(DataSourceLoadOptions loadOptions)
        {
            var data = _context.ThiTruongLaoDongs
                .Include(x => x.ThiTruongLaoDong_Files.Select(y => y.File))
                .Where(x => x.LoaiTin == 1)
                .OrderByDescending(x => x.ID)
                .ToList();

            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> CoQuanBanHanh(string lang = "")
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var data = _context.CollectionFromSql(@"
                select * from CoQuanBanHanh where HienThi = 1 and Lang = @lang order by SoThuTu asc
            ",
            new Dictionary<string, object> { { "@lang", lan } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> CoQuanBanHanhDetail(int ID)
        {
            var data = _context.CoQuanBanHanhs.Find(ID);
            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> CoCauToChuc(string IDDVCha, string lang = "")
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            if (IDDVCha != null)
            {
                var data2 = _context.CollectionFromSql(@"
	                with name_tree as 
	                (
			                select i.*, 0 AS Level
			                from CoCauToChuc i
			                where i.ID = @IDDVCha

			                union all

			                select i.*, Level+1 AS Level
			                from CoCauToChuc i
			                join name_tree p on i.IDDVCha = p.ID 
	                )
	                SELECT * FROM name_tree WHERE ID <> @IDDVCha and HienThi = 1 ORDER BY Level, SoThuTu asc
                ",
                new Dictionary<string, object> { { "@IDDVCha", IDDVCha }, { "@lang", lan } }).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, new { data = data2 });
            }
            var data = _context.CollectionFromSql(@"SELECT * FROM CoCauToChuc where HienThi=1 and lang=@lang order by SoThuTu asc",
            new Dictionary<string, object> { { "@lang", lan } }).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> CoCauToChucDetail(int ID)
        {
            var data = _context.CoCauToChucs.Find(ID);
            var childs = _context.CollectionFromSql(@"
                select * from CoCauToChuc where IDDVCha = @ID and HienThi = 1 order by SoThuTu asc
            ",
            new Dictionary<string, object> { { "@ID", data.ID } }).ToList();
            var parents = new List<CoCauToChuc>();
            if (data.IDDVCha != null)
            {
                _context.CollectionFromSql(@"
                select * from CoCauToChuc where ID = @ID order by SoThuTu asc
                ",
                new Dictionary<string, object> { { "@ID", data.IDDVCha } }).ToList();
            }

            var idLoai = _context.CollectionFromSql(@"
                with name_tree as 
                (
                        select i.*, 0 AS Level
                        from CoCauToChuc i
                        where i.ID = @IDDV

                        union all

                        select i.*, Level+1 AS Level
                        from CoCauToChuc i
                        join name_tree p on i.ID = p.IDDVCha 
                )
                SELECT ID FROM name_tree WHERE HienThi = 1 
                ORDER BY Level desc
                OFFSET 1 ROWS
                FETCH NEXT 1 ROWS ONLY
            ",
            new Dictionary<string, object> { { "@IDDV", ID } }).Select(x => x.ID).Cast<int>().FirstOrDefault();

            var relates = _context.CollectionFromSql(String.Format(@"
                with name_child as 
                (
				    select i.*, 0 AS Level, CAST(concat(i.ID,'/') AS VARCHAR(5000)) as path
				    from CoCauToChuc i

				    union all

				    select i.*, Level+1 AS Level, CAST(concat(p.path,i.ID,'/') AS VARCHAR(5000)) as path
				    from CoCauToChuc i
				    join name_child p on i.IDDVCha = p.ID 

                )

                select cc2.*, 1 as IsHead from CoCauToChuc cc2
                WHERE cc2.HienThi = 1 and cc2.ID = {0} 

                UNION

                select cc2.*, 0 as IsHead from CoCauToChuc cc2
                join name_child nc on nc.ID = cc2.ID
                where path like '%/{0}/%'
                and cc2.IsRelate = 1 and cc2.HienThi = 1 
                ORDER BY cc2.SoThuTu asc
            ", idLoai),
            new Dictionary<string, object> { }).ToList();

            var lanhdaos = _context.CollectionFromSql(@"
                select tt.ID, tt.HoTenLanhDao, tt.SoDienThoai, tt.AnhDaiDien, dvld.Hang, dvld.Cot, cd.ChucVi, cd.Title, tt.ThuKy, tt2.HoTenLanhDao as HoTenThuKy, tt2.SoDienThoai as SoDienThoaiThuKy
                from DonVi_LanhDao dvld
                join ThongTinLanhDao tt on tt.ID = dvld.IDLanhDao
                left join ThongTinLanhDao tt2 on tt2.ID = tt.ThuKy
                join ChucDanh cd on cd.ID = dvld.ChucVu
                where IDDonVi = @ID and tt.TrangThai = 1 order by dvld.Hang, dvld.Cot
            ",
            new Dictionary<string, object> { { "@ID", data.ID } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data, childs, parents, relates, lanhdaos });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> LinhVucDuAn()
        {

            var data = _context.CollectionFromSql(@"
                select * from LinhVucDuAn where HienThi = 1 order by SoThuTu asc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> LinhVucDuAnDetail(int ID)
        {

            var data = _context.LinhVucDuAns.Find(ID);

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_LoaiDuAn()
        {

            var data = _context.CollectionFromSql(@"
                select * from QLDA_LoaiDuAn ORDER BY STT asc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_GiaiDoan()
        {

            var data = _context.CollectionFromSql(@"
                select * from QLDA_GiaiDoan ORDER BY STT asc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_PhamVi()
        {

            var data = _context.CollectionFromSql(@"
                select * from QLDA_PhamVi ORDER BY STT asc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_LinhVuc()
        {

            var data = _context.QLDA_LinhVuc.Include(x => x.Childs).Where(x => x.IDCha == null).OrderBy(x => x.Stt).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_DonVi()
        {

            var data = _context.CollectionFromSql(@"
                select * from QLDA_DonVi ORDER BY STT asc
            ",
            new Dictionary<string, object> { }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_DuAnDeAn(DataSourceLoadOptions loadOptions)
        {
            var data = _context.QLDA_DuAnDeAn
                .Include(s => s.QLDA_LinhVuc)
                .Include(s => s.QLDA_LoaiDuAn)
                .Include(s => s.QLDA_PhamVi)
                .Include(s => s.Childs);

            return Request.CreateResponse(DataSourceLoader.Load(data, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> QLDA_DuAnDeAnDetail(int id)
        {

            var data = _context.QLDA_DuAnDeAn
                .Include(s => s.QLDA_LinhVuc)
                .Include(s => s.QLDA_LoaiDuAn)
                .Include(s => s.QLDA_PhamVi)
                .Include(s => s.QLDA_VanBan.Select(x => x.QLDA_VanBan_Files.Select(y => y.File)))
                .Include(s => s.QLDA_GiaiDoan)
                .Include(s => s.QLDA_HoSo.Select(x => x.QLDA_HoSo_Files.Select(y => y.File)))
                .Where(x => x.id == id).FirstOrDefault();
            var relates = _context.CollectionFromSql(@"
                select * from QLDA_DuAnDeAn 
                where ID <> @ID and TrangThai = 1 and LoaiID = @LoaiID ORDER BY ID desc
            ",
            new Dictionary<string, object> { { "@ID", id }, { "@LoaiID", data.LoaiID } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data, relates });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> LinhVuc(string lang = "")
        {

            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var data = _context.CollectionFromSql(@"
                select * from LinhVuc where HienThi = 1 and Lang = @lang ORDER BY SoThuTu asc
            ",
            new Dictionary<string, object> { { "@lang", lan } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> VanBans_GetLookUpNguoiKy(string lang = "")
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var vanbans = _context.VanBans
                .Where(i => i.Lang == lan)
                .Select(i => new {
                    Name = i.NguoiKy
                })
                .Distinct();
            return Request.CreateResponse(HttpStatusCode.OK, vanbans);
        }
        [HttpGet]
        public async Task<HttpResponseMessage> VanBans_GetLookUpChucDanh(string lang = "")
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var vanbans = _context.VanBans
                .Where(i => i.Lang == lan)
                .Select(i => new {
                    Name = i.ChucDanh
                })
                .Distinct();
            return Request.CreateResponse(HttpStatusCode.OK, vanbans);
        }
        [HttpGet]
        public async Task<HttpResponseMessage> HinhThucVanBan(string lang = "")
        {

            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var data = _context.CollectionFromSql(@"
                select * from HinhThucVanBan where HienThi = 1 and Lang = @lang ORDER BY SoThuTu asc
            ",
            new Dictionary<string, object> { { "@lang", lan } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> SuKienHoiThao(string lang, DataSourceLoadOptions loadOptions)
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var ids = _context.CollectionFromSql(@"
                select top 5 ID from SuKienHoiThao where TrangThai = 1 and Lang=@lang order by ThoiGianTu desc
            ",
            new Dictionary<string, object> { { "@lang", lan } }).Select(x => (int)x.ID).ToList();

            var sukiens = _context.SuKienHoiThaos
                .Where(x => ids.Contains(x.ID))
                .OrderByDescending(x => x.ThoiGianTu)
                .Select(x => new
                {
                    x.ID,
                    x.TenHoiThao,
                    x.ThoiGianTu,
                    x.DiaDiemToChuc,
                    x.ThanhPhanThamGia,
                    x.ThoiGianDen,
                    TenLoaiHoiThao= x.LoaiSuKien.TenLoaiSuKien,
                    Files = x.SuKienHoiThao_Files.Select(f => f.File).ToList()
                })
                .ToList();

            return Request.CreateResponse(DataSourceLoader.Load(sukiens, loadOptions));
        }
        [HttpGet]
        public async Task<HttpResponseMessage> FileDetail(int ID)
        {
            var data = _context.Files
                .Where(x => x.ID == ID).FirstOrDefault();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }
        [HttpGet]
        public async Task<HttpResponseMessage> SuKienHoiThaoDetail(int ID)
        {
            var data = _context.SuKienHoiThaos
                .Include(s => s.LoaiSuKien)
                .Include(s => s.SuKienHoiThao_Files.Select(y => y.File))
                .Where(x => x.ID == ID).FirstOrDefault();

            var relates = _context.SuKienHoiThaos
                .Include(s => s.LoaiSuKien)
                .Include(s => s.SuKienHoiThao_Files.Select(y => y.File))
                .Where(x => x.ID != ID)
                .Where(x => x.LoaiHoiThao == data.LoaiHoiThao)
                .OrderByDescending(x => x.ID).Take(5).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new { data, relates });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> ThongBaoDetail(int ID)
        {
            var data = _context.ThongBaos
                .Include(s => s.ThongBao_Files.Select(y => y.File))
                .Where(x => x.ID == ID).FirstOrDefault();

            var relates = _context.ThongBaos
                .Include(s => s.ThongBao_Files.Select(y => y.File))
                .Where(x => x.ID != ID)
                .OrderByDescending(x => x.NgayDang).Take(5).ToList();
            return Request.CreateResponse(HttpStatusCode.OK, new { data, relates });
        }

        [HttpGet]
        public async Task<HttpResponseMessage> LoaiSuKien(string lang = "")
        {
            int lan = 1066;
            if (lang == "en")
            {
                lan = 1033;
            }
            var data = _context.CollectionFromSql(@"
                select * from LoaiSuKien where Lang = @Lang ORDER BY TenLoaiSuKien asc
            ",
            new Dictionary<string, object> { { "@Lang", lan } }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new { data });
        }

        [HttpGet]
        [Route("api/Public/GetBotMetaForTinTuc")]
        public async Task<HttpResponseMessage> GetBotMetaForTinTuc(int id)
        {
            var article = _context.TinTucs.FirstOrDefault(x => x.ID == id);

            if (article == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            string plainDescription = System.Text.RegularExpressions.Regex.Replace(article.MoTa ?? "", "<.*?>", string.Empty);
            if (plainDescription.Length > 200) plainDescription = plainDescription.Substring(0, 197) + "...";
            
            string imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + "/images/Quoc_Huy_Viet_Nam.png";
            if (!string.IsNullOrEmpty(article.AnhDaiDien)) 
            {
                int anhDaiDienId = Convert.ToInt32(article.AnhDaiDien);
                var anhDaiDien = _context.Files.FirstOrDefault(x => x.ID == anhDaiDienId);
                imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + anhDaiDien.LinkLuuTru;
            }

            string html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <title>{article.TieuDe}</title>
                    <meta name='description' content='{plainDescription}' />
                    <meta property='og:title' content='{article.TieuDe}' />
                    <meta property='og:description' content='{plainDescription}' />
                    <meta property='og:image' content='{imageUrl}' />
                    <meta property='og:type' content='article' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='{article.TieuDe}' />
                    <meta name='twitter:description' content='{plainDescription}' />
                    <meta name='twitter:image' content='{imageUrl}' />
                </head>
                <body>
                    <h1>{article.TieuDe}</h1>
                    <p>{plainDescription}</p>
                </body>
                </html>";

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(html, Encoding.UTF8, "text/html");
            return response;
        }

        [HttpGet]
        [Route("api/Public/GetBotMetaForThongBao")]
        public async Task<HttpResponseMessage> GetBotMetaForThongBao(int id)
        {
            var article = _context.ThongBaos.FirstOrDefault(x => x.ID == id);

            if (article == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            string plainDescription = System.Text.RegularExpressions.Regex.Replace(article.NoiDung ?? "", "<.*?>", string.Empty);
            if (plainDescription.Length > 200) plainDescription = plainDescription.Substring(0, 197) + "...";

            string imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + "/images/Quoc_Huy_Viet_Nam.png";

            string html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <title>{article.TieuDe}</title>
                    <meta name='description' content='{plainDescription}' />
                    <meta property='og:title' content='{article.TieuDe}' />
                    <meta property='og:description' content='{plainDescription}' />
                    <meta property='og:image' content='{imageUrl}' />
                    <meta property='og:type' content='article' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='{article.TieuDe}' />
                    <meta name='twitter:description' content='{plainDescription}' />
                    <meta name='twitter:image' content='{imageUrl}' />
                </head>
                <body>
                    <h1>{article.TieuDe}</h1>
                    <p>{plainDescription}</p>
                </body>
                </html>";

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(html, Encoding.UTF8, "text/html");
            return response;
        }

        [HttpGet]
        [Route("api/Public/GetBotMetaForVanBan")]
        public async Task<HttpResponseMessage> GetBotMetaForVanBan(int id)
        {
            var article = _context.VanBans.FirstOrDefault(x => x.ID == id);

            if (article == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            string plainDescription = System.Text.RegularExpressions.Regex.Replace(article.TrichYeu ?? "", "<.*?>", string.Empty);
            if (plainDescription.Length > 200) plainDescription = plainDescription.Substring(0, 197) + "...";

            string imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + "/images/Quoc_Huy_Viet_Nam.png";

            string html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <title>{article.SoKyHieu}</title>
                    <meta name='description' content='{plainDescription}' />
                    <meta property='og:title' content='{article.SoKyHieu}' />
                    <meta property='og:description' content='{plainDescription}' />
                    <meta property='og:image' content='{imageUrl}' />
                    <meta property='og:type' content='article' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='{article.SoKyHieu}' />
                    <meta name='twitter:description' content='{plainDescription}' />
                    <meta name='twitter:image' content='{imageUrl}' />
                </head>
                <body>
                    <h1>{article.SoKyHieu}</h1>
                    <p>{plainDescription}</p>
                </body>
                </html>";

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(html, Encoding.UTF8, "text/html");
            return response;
        }

        [HttpGet]
        [Route("api/Public/GetBotMetaForVanBanDuThao")]
        public async Task<HttpResponseMessage> GetBotMetaForVanBanDuThao(int id)
        {
            var article = _context.VanBanDuThaos.FirstOrDefault(x => x.ID == id);

            if (article == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            string plainDescription = System.Text.RegularExpressions.Regex.Replace(article.TrichYeu ?? "", "<.*?>", string.Empty);
            if (plainDescription.Length > 200) plainDescription = plainDescription.Substring(0, 197) + "...";

            string imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + "/images/Quoc_Huy_Viet_Nam.png";

            string html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <title>{article.TieuDe}</title>
                    <meta name='description' content='{plainDescription}' />
                    <meta property='og:title' content='{article.TieuDe}' />
                    <meta property='og:description' content='{plainDescription}' />
                    <meta property='og:image' content='{imageUrl}' />
                    <meta property='og:type' content='article' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='{article.TieuDe}' />
                    <meta name='twitter:description' content='{plainDescription}' />
                    <meta name='twitter:image' content='{imageUrl}' />
                </head>
                <body>
                    <h1>{article.TieuDe}</h1>
                    <p>{plainDescription}</p>
                </body>
                </html>";

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(html, Encoding.UTF8, "text/html");
            return response;
        }

        [HttpGet]
        [Route("api/Public/GetBotMetaForNghienCuu")]
        public async Task<HttpResponseMessage> GetBotMetaForNghienCuu(int id)
        {
            var article = _context.NghienCuuKhoaHocs.FirstOrDefault(x => x.ID == id);

            if (article == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            string plainDescription = System.Text.RegularExpressions.Regex.Replace(article.NoiDung ?? "", "<.*?>", string.Empty);
            if (plainDescription.Length > 200) plainDescription = plainDescription.Substring(0, 197) + "...";

            string imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + "/images/Quoc_Huy_Viet_Nam.png";

            string html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <title>{article.TenDeTai}</title>
                    <meta name='description' content='{plainDescription}' />
                    <meta property='og:title' content='{article.TenDeTai}' />
                    <meta property='og:description' content='{plainDescription}' />
                    <meta property='og:image' content='{imageUrl}' />
                    <meta property='og:type' content='article' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='{article.TenDeTai}' />
                    <meta name='twitter:description' content='{plainDescription}' />
                    <meta name='twitter:image' content='{imageUrl}' />
                </head>
                <body>
                    <h1>{article.TenDeTai}</h1>
                    <p>{plainDescription}</p>
                </body>
                </html>";

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(html, Encoding.UTF8, "text/html");
            return response;
        }

        [HttpGet]
        [Route("api/Public/GetBotMetaForPhoto")]
        public async Task<HttpResponseMessage> GetBotMetaForPhoto(int id)
        {
            var article = _context.ABL_AlbumAnh.FirstOrDefault(x => x.ID == id);
            
            if (article == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            string plainDescription = System.Text.RegularExpressions.Regex.Replace(article.MoTa ?? "", "<.*?>", string.Empty);
            if (plainDescription.Length > 200) plainDescription = plainDescription.Substring(0, 197) + "...";

            string imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + "/images/Quoc_Huy_Viet_Nam.png";
            if (!string.IsNullOrEmpty(article.AnhDaiDien))
            {
                int anhDaiDienId = Convert.ToInt32(article.AnhDaiDien);
                var anhDaiDien = _context.Files.FirstOrDefault(x => x.ID == anhDaiDienId);
                imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + anhDaiDien.LinkLuuTru;
            }

            string html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <title>{article.TieuDe}</title>
                    <meta name='description' content='{plainDescription}' />
                    <meta property='og:title' content='{article.TieuDe}' />
                    <meta property='og:description' content='{plainDescription}' />
                    <meta property='og:image' content='{imageUrl}' />
                    <meta property='og:type' content='article' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='{article.TieuDe}' />
                    <meta name='twitter:description' content='{plainDescription}' />
                    <meta name='twitter:image' content='{imageUrl}' />
                </head>
                <body>
                    <h1>{article.TieuDe}</h1>
                    <p>{plainDescription}</p>
                </body>
                </html>";

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(html, Encoding.UTF8, "text/html");
            return response;
        }

        [HttpGet]
        [Route("api/Public/GetBotMetaForVideo")]
        public async Task<HttpResponseMessage> GetBotMetaForVideo(int id)
        {
            var article = _context.ABL_AlbumVideo.FirstOrDefault(x => x.ID == id);

            if (article == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            string plainDescription = System.Text.RegularExpressions.Regex.Replace(article.MoTa ?? "", "<.*?>", string.Empty);
            if (plainDescription.Length > 200) plainDescription = plainDescription.Substring(0, 197) + "...";

            string imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + "/images/Quoc_Huy_Viet_Nam.png";
            if (!string.IsNullOrEmpty(article.AnhDaiDien))
            {
                int anhDaiDienId = Convert.ToInt32(article.AnhDaiDien);
                var anhDaiDien = _context.Files.FirstOrDefault(x => x.ID == anhDaiDienId);
                imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + anhDaiDien.LinkLuuTru;
            }

            string html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <title>{article.TieuDe}</title>
                    <meta name='description' content='{plainDescription}' />
                    <meta property='og:title' content='{article.TieuDe}' />
                    <meta property='og:description' content='{plainDescription}' />
                    <meta property='og:image' content='{imageUrl}' />
                    <meta property='og:type' content='article' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='{article.TieuDe}' />
                    <meta name='twitter:description' content='{plainDescription}' />
                    <meta name='twitter:image' content='{imageUrl}' />
                </head>
                <body>
                    <h1>{article.TieuDe}</h1>
                    <p>{plainDescription}</p>
                </body>
                </html>";

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(html, Encoding.UTF8, "text/html");
            return response;
        }

        [HttpGet]
        [Route("api/Public/GetBotMetaForAudio")]
        public async Task<HttpResponseMessage> GetBotMetaForAudio(int id)
        {
            var article = _context.ABL_AlbumAudio.FirstOrDefault(x => x.ID == id);

            if (article == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            string plainDescription = System.Text.RegularExpressions.Regex.Replace(article.MoTa ?? "", "<.*?>", string.Empty);
            if (plainDescription.Length > 200) plainDescription = plainDescription.Substring(0, 197) + "...";

            string imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + "/images/Quoc_Huy_Viet_Nam.png";
            if (!string.IsNullOrEmpty(article.AnhDaiDien))
            {
                int anhDaiDienId = Convert.ToInt32(article.AnhDaiDien);
                var anhDaiDien = _context.Files.FirstOrDefault(x => x.ID == anhDaiDienId);
                imageUrl = ConfigurationManager.AppSettings["frontendSiteUrl"] + anhDaiDien.LinkLuuTru;
            }

            string html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8' />
                    <title>{article.TieuDe}</title>
                    <meta name='description' content='{plainDescription}' />
                    <meta property='og:title' content='{article.TieuDe}' />
                    <meta property='og:description' content='{plainDescription}' />
                    <meta property='og:image' content='{imageUrl}' />
                    <meta property='og:type' content='article' />
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content='{article.TieuDe}' />
                    <meta name='twitter:description' content='{plainDescription}' />
                    <meta name='twitter:image' content='{imageUrl}' />
                </head>
                <body>
                    <h1>{article.TieuDe}</h1>
                    <p>{plainDescription}</p>
                </body>
                </html>";

            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(html, Encoding.UTF8, "text/html");
            return response;
        }
    }
}