-- Media va tin bai: mac dinh chi chu so huu duoc xem trong CMS.
-- Cac role quan tri, Pho giam doc va Truong phong duoc cap quyen xem tat ca.
-- Script idempotent; sau khi chay, kiem tra role thuc te trong trang Role neu ten role production khac.
SET NOCOUNT ON;

IF OBJECT_ID(N'dbo.Permission', N'U') IS NULL OR OBJECT_ID(N'dbo.RolePermission', N'U') IS NULL OR OBJECT_ID(N'dbo.Role', N'U') IS NULL
    THROW 50001, 'Permission, Role or RolePermission table is missing.', 1;

DECLARE @permissions TABLE(Name nvarchar(100) NOT NULL, Description nvarchar(1000) NOT NULL);
INSERT @permissions(Name, Description) VALUES
 (N'view-all-media', N'Xem và quản lý toàn bộ thư viện media'),
 (N'view-all-tintuc', N'Xem toàn bộ tin, bài trong CMS');

INSERT dbo.Permission(Name, Description, Removable)
SELECT p.Name, p.Description, 0
FROM @permissions p
WHERE NOT EXISTS (SELECT 1 FROM dbo.Permission x WHERE x.Name = p.Name);

-- Cac role quan tri/chuc danh duoc nhan dien theo ten/mo ta;
-- neu don vi dat ten khac, cap hai quyen nay trong trang Role sau migration.
INSERT dbo.RolePermission(RoleId, PermissionId)
SELECT DISTINCT r.ID, p.ID
FROM dbo.Role r
CROSS JOIN dbo.Permission p
WHERE p.Name IN (N'view-all-media', N'view-all-tintuc')
  AND (
      r.Name COLLATE Latin1_General_100_CI_AI LIKE N'%admin%'
      OR r.Name COLLATE Latin1_General_100_CI_AI LIKE N'%quan tri%'
      OR r.Description COLLATE Latin1_General_100_CI_AI LIKE N'%quan tri%'
      OR r.Name COLLATE Latin1_General_100_CI_AI LIKE N'%pho giam doc%'
      OR r.Description COLLATE Latin1_General_100_CI_AI LIKE N'%pho giam doc%'
      OR r.Name COLLATE Latin1_General_100_CI_AI LIKE N'%truong phong%'
      OR r.Description COLLATE Latin1_General_100_CI_AI LIKE N'%truong phong%'
  )
  AND NOT EXISTS (SELECT 1 FROM dbo.RolePermission x WHERE x.RoleId = r.ID AND x.PermissionId = p.ID);
