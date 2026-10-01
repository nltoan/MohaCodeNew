-- Run in the confirmed application database after migration/import.
SELECT DB_NAME() AS CurrentDatabase;
SELECT COUNT(*) AS TotalRecords,
 SUM(CASE WHEN Name=N'' THEN 1 ELSE 0 END) AS MissingNames,
 SUM(CASE WHEN Logo IS NOT NULL THEN 1 ELSE 0 END) AS Logos
FROM dbo.HoiQuyTrungUong;
SELECT ImportKey,COUNT(*) AS DuplicateCount FROM dbo.HoiQuyTrungUong
GROUP BY ImportKey HAVING COUNT(*)>1;
SELECT r.Name AS RoleName,p.Name AS PermissionName
FROM dbo.RolePermission rp JOIN dbo.Role r ON r.ID=rp.RoleId
JOIN dbo.Permission p ON p.ID=rp.PermissionId WHERE p.Name='manage-hoiquy';
-- A fresh import should produce 718 records; reconcile with existing data otherwise.
