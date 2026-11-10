-- TinTuc_History thieu cac cot ma TinTuc co: NgonNgu, NoiBat, NguoiTaoID, BuocQuyTrinhID.
-- API ghi cac cot nay bang SQL tham so hoa (khong co trong EF model); chua chay file nay thi API van chay binh thuong.
IF COL_LENGTH('dbo.TinTuc_History','NgonNgu') IS NULL ALTER TABLE dbo.TinTuc_History ADD NgonNgu nvarchar(2) NULL;
IF COL_LENGTH('dbo.TinTuc_History','NoiBat') IS NULL ALTER TABLE dbo.TinTuc_History ADD NoiBat int NULL;
IF COL_LENGTH('dbo.TinTuc_History','NguoiTaoID') IS NULL ALTER TABLE dbo.TinTuc_History ADD NguoiTaoID int NULL;
IF COL_LENGTH('dbo.TinTuc_History','BuocQuyTrinhID') IS NULL ALTER TABLE dbo.TinTuc_History ADD BuocQuyTrinhID int NULL;
