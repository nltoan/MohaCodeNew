-- Bo sung quyen (Permission) con thieu va cap cho cac nhom da co quyen manage-user. Chay lai nhieu lan an toan.
-- Cac controller ghi (Post/Put/Delete) yeu cau quyen tuong ung voi menu quan tri (xem api/Controllers/API).
SET NOCOUNT ON;
DECLARE @p TABLE(Name nvarchar(100) NOT NULL, Description nvarchar(1000) NOT NULL);
INSERT @p(Name,Description) VALUES
 (N'manage-tintuc',N'Quản lý tin tức, thông báo, chuyên mục, album'),
 (N'manage-vanban',N'Quản lý văn bản'),
 (N'manage-nckh',N'Quản lý nghiên cứu khoa học'),
 (N'manage-sukien',N'Quản lý hội nghị, sự kiện'),
 (N'manage-banner',N'Quản lý banner, quảng cáo'),
 (N'manage-library',N'Quản lý thư viện tệp'),
 (N'manage-setting',N'Quản lý cấu hình hệ thống'),
 (N'manage-user',N'Quản lý tài khoản người dùng'),
 (N'manage-role',N'Quản lý nhóm quyền'),
 (N'manage-menu',N'Quản lý menu'),
 (N'manage-backup',N'Sao lưu cơ sở dữ liệu'),
 (N'manage-hoiquy',N'Quản lý và import Hội và Quỹ Trung ương'),
 (N'manage-block',N'Quản lý block và cấu hình block'),
 (N'manage-chitieu',N'Quản lý chỉ tiêu'),
 (N'manage-cocautochuc',N'Quản lý cơ cấu tổ chức, lãnh đạo, chức danh'),
 (N'manage-dgyk_hdpl',N'Quản lý hỏi đáp pháp luật và đóng góp ý kiến'),
 (N'manage-quytrinh',N'Quản lý quy trình kiểm duyệt tin'),
 (N'manage-thoiky',N'Quản lý thời kỳ phát triển');

INSERT dbo.Permission(Name,Description,Removable)
 SELECT p.Name,p.Description,0 FROM @p p
 WHERE NOT EXISTS(SELECT 1 FROM dbo.Permission x WHERE x.Name=p.Name);

-- Cap cho tat ca nhom hien co quyen manage-user (quan tri tai khoan). Cac nhom khac duoc cap thu cong trong trang Role.
INSERT dbo.RolePermission(RoleId,PermissionId)
 SELECT DISTINCT rp.RoleId,np.ID FROM dbo.RolePermission rp
 JOIN dbo.Permission oldp ON oldp.ID=rp.PermissionId AND oldp.Name='manage-user'
 CROSS JOIN dbo.Permission np
 WHERE np.Name IN (SELECT Name FROM @p)
 AND NOT EXISTS(SELECT 1 FROM dbo.RolePermission x WHERE x.RoleId=rp.RoleId AND x.PermissionId=np.ID);
