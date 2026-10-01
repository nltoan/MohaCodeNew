IF OBJECT_ID('dbo.HoiQuyTrungUong','U') IS NULL
BEGIN
 CREATE TABLE dbo.HoiQuyTrungUong(
 ID int IDENTITY PRIMARY KEY, Name nvarchar(1000) NOT NULL, Type nvarchar(10) NOT NULL,
 Chair nvarchar(1000) NOT NULL, Address nvarchar(4000) NOT NULL, Phone nvarchar(1000) NOT NULL,
 Email nvarchar(1000) NOT NULL, Website nvarchar(2000) NOT NULL, Purpose nvarchar(max) NOT NULL,
 SearchName nvarchar(1000) NOT NULL, ImportKey varchar(64) NOT NULL UNIQUE,
 Logo varbinary(max) NULL, SourceRow int NOT NULL, SourceFile nvarchar(260) NOT NULL,
 UpdatedBy nvarchar(256) NOT NULL, UpdatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
 );
END;
IF NOT EXISTS(SELECT 1 FROM dbo.Permission WHERE Name='manage-hoiquy')
 INSERT dbo.Permission(Name,Description,Removable) VALUES('manage-hoiquy',N'Quản lý và import Hội và Quỹ Trung ương',0);
-- Grant to existing account administrators. Other roles can be granted explicitly in admin.
INSERT dbo.RolePermission(RoleId,PermissionId)
 SELECT DISTINCT rp.RoleId,p.ID FROM dbo.RolePermission rp
 JOIN dbo.Permission oldp ON oldp.ID=rp.PermissionId AND oldp.Name='manage-user'
 CROSS JOIN dbo.Permission p WHERE p.Name='manage-hoiquy'
 AND NOT EXISTS(SELECT 1 FROM dbo.RolePermission x WHERE x.RoleId=rp.RoleId AND x.PermissionId=p.ID);
