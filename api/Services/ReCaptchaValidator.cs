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

        // Loi mang/timeout khi goi Google (khong phai token sai)
        [JsonIgnore]
        public bool IsNetworkError
        {
            get { return ErrorCodes != null && ErrorCodes.Contains(ReCaptchaValidator.NetworkErrorCode); }
        }
    }

    public class ReCaptchaValidator
    {
        public const string NetworkErrorCode = "network-error";
        private const string GoogleApiUrl = "https://www.google.com/recaptcha/api/siteverify";

        // Dung chung 1 HttpClient, timeout ngan de may chu khong co internet khong treo request
        private static readonly HttpClient SharedClient = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };

        private readonly string _secretKey;

        public ReCaptchaValidator()
        {
            string secretKey = ConfigurationManager.AppSettings["recaptcha"];
            _secretKey = secretKey;
        }

        private static ReCaptchaResponse Fail(string code)
        {
            return new ReCaptchaResponse { Success = false, ErrorCodes = new List<string> { code } };
        }

        public async Task<ReCaptchaResponse> VerifyTokenAsync(string token)
        {
            // Fail closed: thieu khoa bi mat (appSettings.local.config) hoac khong co token -> tu choi, khong goi Google.
            if (string.IsNullOrWhiteSpace(_secretKey))
            {
                System.Diagnostics.Trace.TraceError("ReCaptcha: appSetting 'recaptcha' (secret key) chua duoc cau hinh - tu choi xac thuc. Dat khoa trong api/appSettings.local.config.");
                return Fail("missing-input-secret");
            }
            if (string.IsNullOrWhiteSpace(token))
                return Fail("missing-input-response");

            try
            {
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("secret", _secretKey),
                    new KeyValuePair<string, string>("response", token)
                });

                using (var response = await SharedClient.PostAsync(GoogleApiUrl, content).ConfigureAwait(false))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        System.Diagnostics.Trace.TraceError("ReCaptcha: Google tra ve HTTP " + (int)response.StatusCode + ".");
                        return Fail(NetworkErrorCode);
                    }

                    var jsonString = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                    var result = JsonConvert.DeserializeObject<ReCaptchaResponse>(jsonString);
                    if (result == null)
                    {
                        System.Diagnostics.Trace.TraceError("ReCaptcha: phan hoi rong tu Google.");
                        return Fail(NetworkErrorCode);
                    }
                    return result;
                }
            }
            catch (HttpRequestException ex)
            {
                System.Diagnostics.Trace.TraceError("ReCaptcha: khong ket noi duoc Google: " + ex.Message);
                return Fail(NetworkErrorCode);
            }
            catch (TaskCanceledException)
            {
                System.Diagnostics.Trace.TraceError("ReCaptcha: het thoi gian cho Google.");
                return Fail(NetworkErrorCode);
            }
            catch (JsonException ex)
            {
                System.Diagnostics.Trace.TraceError("ReCaptcha: phan hoi Google khong hop le: " + ex.Message);
                return Fail(NetworkErrorCode);
            }
        }
    }
}
