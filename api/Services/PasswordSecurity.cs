using System;
using System.Security.Cryptography;
using System.Text;
namespace API.Services
{
    public static class PasswordSecurity
    {
        const string Prefix = "PBKDF2-SHA256$";
        const int Iterations = 600000;
        static bool Equal(byte[] a, byte[] b) { int diff = a.Length ^ b.Length; for (int i = 0; i < Math.Min(a.Length, b.Length); i++) diff |= a[i] ^ b[i]; return diff == 0; }
        public static bool IsHash(string value) { return value != null && value.StartsWith(Prefix, StringComparison.Ordinal); }
        public static string Hash(string password)
        {
            var salt = new byte[16]; using (var rng = RandomNumberGenerator.Create()) rng.GetBytes(salt);
            using (var derive = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256))
                return Prefix + Iterations + "$" + Convert.ToBase64String(salt) + "$" + Convert.ToBase64String(derive.GetBytes(32));
        }
        public static bool Verify(string password, string stored)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(stored) || password.Length > 1000) return false;
            if (!IsHash(stored)) return Equal(Encoding.UTF8.GetBytes(password), Encoding.UTF8.GetBytes(stored));
            try {
                var parts = stored.Split('$'); int count;
                if (parts.Length != 4 || !int.TryParse(parts[1], out count) || count < Iterations || count > 2000000) return false;
                var salt = Convert.FromBase64String(parts[2]); var hash = Convert.FromBase64String(parts[3]);
                if (salt.Length != 16 || hash.Length != 32) return false;
                using (var derive = new Rfc2898DeriveBytes(password, salt, count, HashAlgorithmName.SHA256)) return Equal(derive.GetBytes(32), hash);
            } catch (FormatException) { return false; }
        }
    }
}
