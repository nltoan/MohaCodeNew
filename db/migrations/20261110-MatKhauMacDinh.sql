-- Mat khau mac dinh: cho phep dang nhap toi da N lan (mac dinh 3, cau hinh o appSettings
-- DefaultPasswordMaxLogins), sau do bat buoc doi mat khau + bat Google Authenticator (2FA).
-- CHAY SCRIPT NAY TRUOC KHI DEPLOY API MOI (API se doc 2 cot nay khi dang nhap).
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.User_Account', N'U') IS NULL
    THROW 50001, 'dbo.User_Account is missing; migration was not applied.', 1;
IF COL_LENGTH(N'dbo.User_Account', N'MatKhauMacDinh') IS NULL
    ALTER TABLE dbo.User_Account ADD MatKhauMacDinh int NOT NULL
        CONSTRAINT DF_User_Account_MatKhauMacDinh DEFAULT (0) WITH VALUES;
IF COL_LENGTH(N'dbo.User_Account', N'SoLanDangNhapMacDinh') IS NULL
    ALTER TABLE dbo.User_Account ADD SoLanDangNhapMacDinh int NOT NULL
        CONSTRAINT DF_User_Account_SoLanDangNhapMacDinh DEFAULT (0) WITH VALUES;
COMMIT TRANSACTION;

-- Danh dau cac tai khoan DANG DUNG mat khau mac dinh (sua danh sach theo thuc te roi chay):
-- UPDATE dbo.User_Account
-- SET MatKhauMacDinh = 1, SoLanDangNhapMacDinh = 0
-- WHERE TenTruyCap IN (N'<tai_khoan_1>', N'<tai_khoan_2>');
--
-- Xem truoc cac tai khoan con luu mat khau dang chu thuong (chua bam) de can nhac danh dau:
-- SELECT UserID, TenTruyCap, TrangThai FROM dbo.User_Account
-- WHERE MatKhau IS NOT NULL AND MatKhau <> N'' AND MatKhau NOT LIKE N'PBKDF2-SHA256$%';
