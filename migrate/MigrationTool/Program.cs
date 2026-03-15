using log4net;
using log4net.Config;
using System;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

namespace MigrationTool
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            var logsPath = Path.Combine(AppContext.BaseDirectory, "logs");
            if (!Directory.Exists(logsPath)) Directory.CreateDirectory(logsPath);

            // Configure log4net from external file and watch for changes
            var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
            var configFile = new FileInfo("log4net.config");
            if (configFile.Exists)
            {
                XmlConfigurator.ConfigureAndWatch(logRepository, configFile);
            }
            else
            {
                BasicConfigurator.Configure(logRepository);
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Form1());
        }
    }
}
