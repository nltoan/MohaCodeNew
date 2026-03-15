using log4net;
using System;
using System.Configuration;
using System.IO;
using System.Reflection;

namespace MigrationTool
{
    internal static class Logger
    {
        private static readonly ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private static readonly string ResultPath = ConfigurationManager.AppSettings["ResultFolder"];
        public static void Debug(string message)
        {
            log.Debug(message);
        }

        public static void Info(string message)
        {
            log.Info(message);
        }

        public static void Warn(string message)
        {
            log.Warn(message);
        }

        public static void Error(string message, Exception ex = null)
        {
            if (ex == null)
            {
                log.Error(message);
            }
            else
            {
                log.Error(message, ex);
            }
        }

        public static void Fatal(string message, Exception ex = null)
        {
            if (ex == null)
            {
                log.Fatal(message);
            }
            else
            {
                log.Fatal(message, ex);
            }
        }

        public static void Result(DateTime startTime, string siteUrl, string listName, int itemID, int recordId, string result, string message = "")
        {
            try
            {
                string log = $"{DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss")},{itemID},{recordId},{result}{(string.IsNullOrEmpty(message) ? "" : ("," + message))}{Environment.NewLine}";
                string path = Path.Combine(ResultPath, $"{siteUrl.Replace("/","_").Trim('_')}_{listName}_{startTime.ToString("yyyyMMdd_HHmmss")}.csv");
                File.AppendAllText(path, log);
            }
            catch (Exception ex) 
            {
                log.Error("Write result", ex);
            }
        }
    }

    internal class Utils
    {
        public static string GetSafeServerRelativeUrl(string absoluteUrl)
        {
            string decodedUrl = System.Web.HttpUtility.UrlDecode(absoluteUrl);
            Uri uri = new Uri(decodedUrl);
            return uri.AbsolutePath;
        }
    }
}
