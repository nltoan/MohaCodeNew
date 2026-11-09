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

Admin sessions remain bearer tokens in browser storage; use XSS protection and a subsequent session redesign to HttpOnly cookies if required. Existing access tokens are not invalidated merely by a password change; plan session revocation. In-memory login rate limits are per instance, so production should enforce distributed/WAF limits too.

CSP must be merged at the server/WAF returning the effective header, not added as a second competing header. See CSP-PORTAL.txt for Google Analytics; validate frame-ancestors/base-uri/object-src and admin CSP in staging. This local review does not certify the production WAF/TLS/header policy.

Frontend/admin dependencies still have known advisories, including the legacy SunEditor and CRA tooling. See SECURITY-REVIEW-20261002.md; do not run forced major-version fixes without a separate migration/regression plan. The local NuGet audit checked 51 packages against the official vulnerability feed and found no matching advisories at review time. Review CKEditor/DevExtreme support, server access and backup protection before release.

Reference: OWASP Authorization, File Upload, Web Frontend Security and Password Storage Cheat Sheets.
