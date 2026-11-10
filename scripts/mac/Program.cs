using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;

namespace MohaDevHost
{
    // Dev-only OWIN self-host for running the API under Mono on macOS.
    // Mono has no DPAPI/machineKey, so OAuth token protection is replaced by AES+HMAC with a key
    // generated on first run and stored next to the exe (dataprotection.key, not tracked).
    public static class Program
    {
        static byte[] LoadKey()
        {
            string p = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dataprotection.key");
            if (File.Exists(p)) return File.ReadAllBytes(p);
            var k = new byte[64];
            using (var r = RandomNumberGenerator.Create()) r.GetBytes(k);
            File.WriteAllBytes(p, k);
            try { System.Diagnostics.Process.Start("chmod", "600 \"" + p + "\"").WaitForExit(); } catch { }
            return k;
        }

        static byte[] Protect(byte[] master, string[] purposes, byte[] data)
        {
            byte[] encKey, macKey; Derive(master, purposes, out encKey, out macKey);
            using (var aes = Aes.Create())
            {
                aes.Key = encKey; aes.GenerateIV();
                byte[] ct = aes.CreateEncryptor().TransformFinalBlock(data, 0, data.Length);
                byte[] body = aes.IV.Concat(ct).ToArray();
                using (var h = new HMACSHA256(macKey)) return body.Concat(h.ComputeHash(body)).ToArray();
            }
        }

        static byte[] Unprotect(byte[] master, string[] purposes, byte[] data)
        {
            byte[] encKey, macKey; Derive(master, purposes, out encKey, out macKey);
            if (data == null || data.Length < 16 + 16 + 32) return null;
            byte[] body = data.Take(data.Length - 32).ToArray(), mac = data.Skip(data.Length - 32).ToArray();
            using (var h = new HMACSHA256(macKey))
            {
                var exp = h.ComputeHash(body);
                int diff = 0; for (int i = 0; i < 32; i++) diff |= exp[i] ^ mac[i];
                if (diff != 0) return null;
            }
            try
            {
                using (var aes = Aes.Create())
                {
                    aes.Key = encKey; aes.IV = body.Take(16).ToArray();
                    var ct = body.Skip(16).ToArray();
                    return aes.CreateDecryptor().TransformFinalBlock(ct, 0, ct.Length);
                }
            }
            catch { return null; }
        }

        static void Derive(byte[] master, string[] purposes, out byte[] enc, out byte[] mac)
        {
            string ps = string.Join("|", purposes ?? new string[0]);
            using (var h = new HMACSHA256(master))
            {
                enc = h.ComputeHash(System.Text.Encoding.UTF8.GetBytes("enc|" + ps));
                mac = h.ComputeHash(System.Text.Encoding.UTF8.GetBytes("mac|" + ps));
            }
        }

        public static int Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += (s, e) =>
                Console.Error.WriteLine("[UNHANDLED] " + e.ExceptionObject);
            string url = args.Length > 0 ? args[0] : "http://localhost:55104";
            byte[] master = LoadKey();
            try
            {
                Action<Owin.IAppBuilder> startup = app =>
                {
                    app.Properties["security.DataProtectionProvider"] =
                        (Func<string[], Tuple<Func<byte[], byte[]>, Func<byte[], byte[]>>>)(purposes =>
                            Tuple.Create<Func<byte[], byte[]>, Func<byte[], byte[]>>(
                                d => Protect(master, purposes, d), d => Unprotect(master, purposes, d)));
                    new API.OAuth.Startup().Configuration(app);
                };
                using (Microsoft.Owin.Hosting.WebApp.Start(url, startup))
                {
                    Console.WriteLine("API listening on " + url);
                    Thread.Sleep(Timeout.Infinite);
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("[FATAL] " + ex);
                return 1;
            }
            return 0;
        }
    }
}
