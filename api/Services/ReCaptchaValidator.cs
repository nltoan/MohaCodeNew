using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace API.Services
{
    public class ReCaptchaResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("score")]
        public float Score { get; set; } // 0.0 (bot) - 1.0 (human)

        [JsonProperty("action")]
        public string Action { get; set; }

        [JsonProperty("challenge_ts")]
        public DateTime ChallengeTimestamp { get; set; }

        [JsonProperty("hostname")]
        public string Hostname { get; set; }

        [JsonProperty("error-codes")]
        public List<string> ErrorCodes { get; set; }
    }

    public class ReCaptchaValidator
    {
        private const string GoogleApiUrl = "https://www.google.com/recaptcha/api/siteverify";
        private readonly string _secretKey;

        public ReCaptchaValidator()
        {
            string secretKey = ConfigurationManager.AppSettings["recaptcha"];
            _secretKey = secretKey;
        }

        public async Task<ReCaptchaResponse> VerifyTokenAsync(string token)
        {
            // Fail closed: thieu khoa bi mat (appSettings.local.config) hoac khong co token -> tu choi, khong goi Google.
            if (string.IsNullOrWhiteSpace(_secretKey))
            {
                System.Diagnostics.Trace.TraceError("ReCaptcha: appSetting 'recaptcha' (secret key) chua duoc cau hinh - tu choi xac thuc. Dat khoa trong api/appSettings.local.config.");
                return new ReCaptchaResponse { Success = false, ErrorCodes = new List<string> { "missing-input-secret" } };
            }
            if (string.IsNullOrWhiteSpace(token))
                return new ReCaptchaResponse { Success = false, ErrorCodes = new List<string> { "missing-input-response" } };
            using (var client = new HttpClient())
            {
                // Prepare the form data
                var content = new FormUrlEncodedContent(new[]
                {
                new KeyValuePair<string, string>("secret", _secretKey),
                new KeyValuePair<string, string>("response", token)
            });

                // Call Google
                var response = await client.PostAsync(GoogleApiUrl, content);

                // Read response
                var jsonString = await response.Content.ReadAsStringAsync();

                // Deserialize
                return JsonConvert.DeserializeObject<ReCaptchaResponse>(jsonString);
            }
        }
    }
}