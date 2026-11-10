-- Read-only diagnostics: never return a password, OTP, hash or 2FA secret.
-- Set this to the account name to be investigated; confirm the selected DB.
DECLARE @LoginName nvarchar(255) = N'kiennt';
SELECT DB_NAME() AS TenCoSoDuLieu;

SELECT a.TenTruyCap, a.TrangThai, a.IsTwoFA,
       CASE WHEN a.Authenticator_Secret IS NULL OR a.Authenticator_Secret = N'' THEN 0 ELSE 1 END AS Co2FASecret,
       CASE WHEN a.MatKhau IS NULL OR a.MatKhau = N'' THEN 'empty'
            WHEN a.MatKhau LIKE N'PBKDF2-SHA256$%' THEN 'pbkdf2'
            ELSE 'legacy' END AS DinhDangMatKhau,
       CASE WHEN r.ID IS NULL THEN 0 ELSE 1 END AS CoNhomQuyen
FROM dbo.User_Account AS a LEFT JOIN dbo.Role AS r ON a.RoleId = r.ID
WHERE a.TenTruyCap = @LoginName;

SELECT c.name AS TenCot, t.name AS Kieu, c.max_length AS DoDaiByte, c.collation_name AS Collation
FROM sys.columns AS c JOIN sys.types AS t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID(N'dbo.User_Account') AND c.name IN (N'MatKhau', N'TrangThai');
