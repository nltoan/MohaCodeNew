-- Read-only audit. Run in the intended database; no rows are modified.
SELECT DB_NAME() AS TenCoSoDuLieu;

SELECT N'Chuyên mục đang hoạt động' AS Loai, COUNT_BIG(*) AS Tong,
       SUM(CONVERT(bigint, CASE WHEN NgayTao IS NULL THEN 1 ELSE 0 END)) AS ThieuNgay
FROM dbo.ChuyenMuc WHERE IsVisible = 1 AND TrangThai = N'HoatDong'
UNION ALL
SELECT N'Tin công khai', COUNT_BIG(*),
       SUM(CONVERT(bigint, CASE WHEN NgayXuatBan IS NULL THEN 1 ELSE 0 END))
FROM dbo.TinTuc WHERE TrangThai = N'public'
UNION ALL
SELECT N'Thông báo', COUNT_BIG(*),
       SUM(CONVERT(bigint, CASE WHEN NgayDang IS NULL THEN 1 ELSE 0 END))
FROM dbo.ThongBao
UNION ALL
SELECT N'Văn bản (toàn bộ)', COUNT_BIG(*),
       SUM(CONVERT(bigint, CASE WHEN NgayBanHanh IS NULL AND NgayXuatBan IS NULL THEN 1 ELSE 0 END))
FROM dbo.VanBan;

-- VanBanDuThao currently has no publication or creation date field in the model;
-- the consultation start/end dates do not establish a document's issue date.
