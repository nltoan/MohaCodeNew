# Security hardening candidate — 2026-10-02

Do not deploy this candidate until staging validates the new authentication/permissions and proxy/TLS configuration.

Deploy API and admin together. Merge these API appSettings into the existing production Web.config; do not overwrite connection strings or secrets:

- AllowedCorsOrigins: https://moha.gov.vn,https://www.moha.gov.vn,https://quantri-portal.moha.gov.vn (comma separated exact origins).
- AllowInsecureOAuthHttp: false. Local Dev.ps1 overrides true for loopback only. If TLS terminates at WAF and IIS receives HTTP, verify a trusted HTTPS-aware deployment path before release; do not enable insecure token access to solve this without reviewing the architecture.
- customErrors On, compilation debug false. API error details are suppressed in both OWIN and GlobalConfiguration.

Copy api/Upload/web.config into the API Upload folder, and merge equivalent static-only handler/extension protection on any other host serving uploaded files. Do not replace an existing nested configuration without merging it. Block public access to UploadTemp and backup files. Test images/video/document downloads after applying IIS policy.

User list endpoints require manage-user; Roles/Permissions require manage-role; settings/AD require manage-setting; backups require manage-backup; menus require manage-menu; file management requires an appropriate content-management permission. Audit production role assignments before release. Other legacy content APIs still need a complete role/workflow/object ownership review.

LDAP token login now fails closed because the old implementation had its actual LDAP bind commented out. Configure and test an authenticated TLS LDAP provider before re-enabling that mode.

Legacy public Proxy and SendMail endpoints are disabled (410). The current portal does not call them; audit integrations outside this repository before release.

New/reset passwords use PBKDF2-HMAC-SHA256 (600,000 iterations, random salt). Existing plaintext passwords are accepted during transition and are upgraded after a successful password/2FA login. No schema migration is needed (existing MatKhau nvarchar(255)). Existing accounts that have not logged in remain plaintext: plan a coordinated bulk migration or enforced reset. Any other application reading the same account table must support this format first. Once hashes are stored, rolling back to the old password-equality API will break those users' login; preserve this compatible authentication implementation in rollback packages. Review and rotate compromised credentials/tokens if the previous anonymous exposure existed in production.

Admin sessions remain bearer tokens in browser storage; use XSS protection and a subsequent session redesign to HttpOnly cookies if required. Tokens carry a pwd_stamp claim derived from the stored password hash (api/Services/TokenRevocation.cs): a password change, account lock or deletion revokes existing bearer tokens (401). The revocation check uses an in-memory cache of about 20 s per API instance, so other nodes reject old tokens within about 20 s. Tokens issued by the previous build have no pwd_stamp and are rejected: all admin users must sign in again once after the first deploy of this build.

Multi-node API (HSYC plans 2 API VMs): every node MUST share one explicit `<machineKey>` (same validationKey/decryptionKey and algorithms) in the production Web.config. OWIN bearer tokens are protected with the machine key; with AutoGenerate or differing keys, a token issued by one node is rejected by the other (random 401s behind the load balancer). Generate the key once, keep it outside git, copy it identically to every node; changing it invalidates all current tokens. In-memory login rate limits and the revocation cache are per instance, so production should enforce distributed/WAF login limits too. See DEPLOY-MOHA.md section 2 item 4.

CSP must be merged at the server/WAF returning the effective header, not added as a second competing header. See CSP-PORTAL.txt for Google Analytics; validate frame-ancestors/base-uri/object-src in staging.

Admin CSP now ships in the admin web.config (deployment/admin-candidate.web.config.sample.xml in the package, with production API/portal/media origins filled in): script-src 'self' (no 'unsafe-inline'/'unsafe-eval'; window.env moved to runtime-config.js, CKEditor 4 inline handlers handled by ckeditor-csp.js), style-src 'unsafe-inline' (DevExtreme/CKEditor/grapesjs), object-src 'none', base-uri 'self', frame-ancestors 'none', plus X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy and Permissions-Policy. Merge these customHeaders into the production admin Web.config; the WAF/reverse proxy must not add a second Content-Security-Policy for the admin host (browsers enforce both, so the stricter one breaks the editor). Verify locally with scripts/Test-AdminCsp.cjs. This local review does not certify the production WAF/TLS/header policy.

Frontend/admin dependencies still have known advisories, including the legacy SunEditor and CRA tooling. See archive/SECURITY-REVIEW-20261002.md; do not run forced major-version fixes without a separate migration/regression plan. The local NuGet audit checked 51 packages against the official vulnerability feed and found no matching advisories at review time. Review CKEditor/DevExtreme support, server access and backup protection before release.

Reference: OWASP Authorization, File Upload, Web Frontend Security and Password Storage Cheat Sheets.

## Bí mật không nằm trong git

- Mật khẩu CSDL không còn trong `api/Web.config` (giá trị `CHANGE_ME`); production giữ chuỗi kết nối riêng trên server. Các khóa tùy chọn (ví dụ khóa reCAPTCHA) đọc từ `api/appSettings.local.config`, file này bị git bỏ qua và không nằm trong gói triển khai.
- Backup DB, thư mục `output/` và file .docx độc lập cũng đã bỏ khỏi git; lấy backup ngoài kênh git (xem DEV-SETUP.md).
- Các giá trị cũ vẫn còn trong lịch sử git: phải đổi (rotate) mật khẩu DB và secret reCAPTCHA trên production, không chỉ xóa khỏi file.
- Việc xóa lịch sử bằng `git filter-repo` là quyết định của nhóm, chưa được chốt. Tới khi chốt, coi mọi bí mật từng commit là đã lộ.
