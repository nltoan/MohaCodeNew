$webUrl = 'http://win-70r37r4sk71/KND/vb/vbqp'
$webUrl1 = 'http://win-70r37r4sk71/KND/vb'
$listName = "Văn bản quy phạm pháp luật"
$listName1 = "Người ký"
$lookupFieldName = "IdNguoiKy" # Tên nội bộ (Internal Name) của cột chính
$additionalColumnInternalName = "IdNguoiKy_ChucDanh" # Cột muốn hiển thị thêm từ list NguoiKy

try {
    $web = Get-SPWeb $webUrl
    $web1 = Get-SPWeb $webUrl1
    $list = $web.Lists[$listName]
    $list1 = $web1.Lists[$listName1]
    
    # Lấy trường Lookup chính
    $primaryLookupField = $list.Fields.GetFieldByInternalName($lookupFieldName) -as [Microsoft.SharePoint.SPFieldLookup]

    if ($primaryLookupField -ne $null) {
        if (!$list.Fields.ContainsField($additionalColumnInternalName)) {
            Write-Host "Dang them cot '$additionalColumnInternalName' cho field '$lookupFieldName'..." -ForegroundColor Cyan
            
            $newField = $list.Fields.Add($additionalColumnInternalName, 'Text',$false);

            Write-Host "Thanh cong! Cot da duoc them: $newDependentField" -ForegroundColor Green
        } else {
            Write-Host "Cot '$additionalColumnInternalName' da ton tai." -ForegroundColor Yellow
        }

        $items = $list.Items

        Write-Host "Dang cap nhat du lieu cho $($items.Count) items..." -ForegroundColor Cyan

        foreach ($item in $items) {
            if($item[$lookupFieldName] -ne $null){
                $nguoiKy = new-object Microsoft.SharePoint.SPFieldLookupValue($item[$lookupFieldName].ToString())
                $itemNguoiKy = $list1.GetItemById($nguoiKy.LookupId)
                Write-Host $itemNguoiKy.Title
                $item[$additionalColumnInternalName] = $itemNguoiKy["MoTa"]
                $item.SystemUpdate($false)
            }
        }
        Write-Host "Cap nhat hoan tat! Vui long kiem tra lai danh sach." -ForegroundColor Green
    } else {
        Write-Host "Khong tim thay cot Lookup chinh co ten: $lookupFieldName" -ForegroundColor Red
    }
}
catch {
    Write-Host "Co loi xay ra: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    if ($web) { $web.Dispose() }
    if ($web1) { $web1.Dispose() }
}



delete tintuc
delete TinTuc_BinhLuan
delete TinTuc_Block
delete TinTuc_History
delete TinTuc_LienQuan
delete TinTuc_QuyTrinh
delete TinTuc_Temp
delete TinTuc_Files
delete chuyenmuc where ID > 9

DBCC CHECKIDENT ('tintuc', RESEED, 0);
DBCC CHECKIDENT ('chuyenmuc', RESEED, 9);
DBCC CHECKIDENT ('TinTuc_Files', RESEED, 0);
DBCC CHECKIDENT ('TinTuc_BinhLuan', RESEED, 0);
DBCC CHECKIDENT ('TinTuc_Block', RESEED, 0);
DBCC CHECKIDENT ('TinTuc_History', RESEED, 0);
DBCC CHECKIDENT ('TinTuc_LienQuan', RESEED, 0);
DBCC CHECKIDENT ('TinTuc_QuyTrinh', RESEED, 0);
DBCC CHECKIDENT ('TinTuc_Temp', RESEED, 0);


delete NghienCuuKhoaHoc
DBCC CHECKIDENT ('NghienCuuKhoaHoc', RESEED, 0);

delete PhanAnhKienNghi
delete PhanAnhKienNghi_CoQuan
delete PhanAnhKienNghi_LinhVuc
DBCC CHECKIDENT ('PhanAnhKienNghi', RESEED, 0);
DBCC CHECKIDENT ('PhanAnhKienNghi_CoQuan', RESEED, 0);
DBCC CHECKIDENT ('PhanAnhKienNghi_LinhVuc', RESEED, 0);

delete DongGopYKien
delete DongGopYKien_ChuDe
DBCC CHECKIDENT ('DongGopYKien', RESEED, 0);
DBCC CHECKIDENT ('DongGopYKien_ChuDe', RESEED, 0);

delete ChiTieu
delete ChiTieu_DanhMuc
DBCC CHECKIDENT ('ChiTieu', RESEED, 0);
DBCC CHECKIDENT ('ChiTieu_DanhMuc', RESEED, 0);

delete ThongBao_Files
delete ThongBao
DBCC CHECKIDENT ('ThongBao', RESEED, 0);
DBCC CHECKIDENT ('ThongBao_Files', RESEED, 0);

delete VanBan_BiTacDong
delete VanBan_CoQuanBanHanh
delete VanBan_LienQuan
delete VanBan_LinhVuc
delete VanBan_Files
delete VanBan
delete VanBanDuThao_CoQuanBanHanhs
delete VanBanDuThao_LinhVucs
delete VanBanDuThao_GopY
delete VanBanDuThao_Files
delete VanBanDuThao
delete CoQuanBanHanh
delete LinhVuc
delete HinhThucVanBan
DBCC CHECKIDENT ('VanBan_BiTacDong', RESEED, 0);
DBCC CHECKIDENT ('VanBan_CoQuanBanHanh', RESEED, 0);
DBCC CHECKIDENT ('VanBan_LienQuan', RESEED, 0);
DBCC CHECKIDENT ('VanBan_LinhVuc', RESEED, 0);
DBCC CHECKIDENT ('VanBan_Files', RESEED, 0);
DBCC CHECKIDENT ('VanBan', RESEED, 0);
DBCC CHECKIDENT ('VanBanDuThao_CoQuanBanHanhs', RESEED, 0);
DBCC CHECKIDENT ('VanBanDuThao_LinhVucs', RESEED, 0);
DBCC CHECKIDENT ('VanBanDuThao_GopY', RESEED, 0);
DBCC CHECKIDENT ('VanBanDuThao_Files', RESEED, 0);
DBCC CHECKIDENT ('VanBanDuThao', RESEED, 0);
DBCC CHECKIDENT ('CoQuanBanHanh', RESEED, 0);
DBCC CHECKIDENT ('LinhVuc', RESEED, 0);
DBCC CHECKIDENT ('HinhThucVanBan', RESEED, 0);

delete GioiThieuVanBan_Files
delete GioiThieuVanBan
DBCC CHECKIDENT ('GioiThieuVanBan_Files', RESEED, 0);
DBCC CHECKIDENT ('GioiThieuVanBan', RESEED, 0);

delete AlbumAnh_Files
delete AlbumAudio_Files
delete AlbumVideo_Files
delete ABL_AlbumAnh
delete ABL_AlbumVideo
delete ABL_AlbumAudio
delete ABL_Anh
delete ABL_Audio
delete ABL_Video
delete ABL_ChuyenMucAlbumAnh
delete ABL_ChuyenMucAlbumAudio
delete ABL_ChuyenMucAlbumVideo
DBCC CHECKIDENT ('AlbumAnh_Files', RESEED, 0);
DBCC CHECKIDENT ('AlbumAudio_Files', RESEED, 0);
DBCC CHECKIDENT ('AlbumVideo_Files', RESEED, 0);
DBCC CHECKIDENT ('ABL_AlbumAnh', RESEED, 0);
DBCC CHECKIDENT ('ABL_AlbumVideo', RESEED, 0);
DBCC CHECKIDENT ('ABL_AlbumAudio', RESEED, 0);

delete BinhChon_CauHoi
delete BinhChon_KetQua
delete BinhChon_TraLoi
delete BinhLuan
delete CKTD_VanBan
delete DangKyNhanMail
delete DanhMucThongTin
delete DanhNgon
delete DM_DiaChi
delete DM_GiaDat
delete DM_GiaiDoan
delete DM_LoaiDat
delete DM_LoaiTin
delete DongSuKien
delete DTVB_CoQuanPhuTrach
delete DTVB_DuThaoVanBan
delete DTVB_LoaiDuThaoVanBan
delete DTVB_YKienDongGop
delete DuAnDauThau
delete DVC_BuocQuyTrinh
delete DVC_DichVuCong3
delete DVC_DonViDangKy
delete DVC_FormMau
delete DVC_HoSo
delete DVC_NhomQuyen
delete DVC_QuyTrinh
delete DVC_ThongTinXuLyHoSo
delete DVC_TraoDoi
delete DVC2_CoQuan
delete DVC2_LinhVuc
delete DVC2_ThuTucHanhChinh
delete GLTT_CauHoi
delete GLTT_ChuDe
delete GLTT_PhienGiaoLuu
delete HoiDap_ChuDe
delete HoiDap_DonVi
delete HoiDap_TraLoi
delete HoiDap_CauHoi
delete ImageSize
delete LinhVucDuAn
delete LoaiDuAn
delete LoaiSuKien
delete NiemGiamThongKe
delete QLDA_DonVi
delete QLDA_DuAnDeAn
delete QLDA_GiaiDoan
delete QLDA_HoSo
delete QLDA_HoSo_Files
delete QLDA_LinhVuc
delete QLDA_LoaiDuAn
delete QLDA_PhamVi
delete QLDA_VanBan
delete QLDA_VanBan_Files
delete SuKienHoiThao
delete SuKienHoiThao_Files
DBCC CHECKIDENT ('SuKienHoiThao', RESEED, 0);
DBCC CHECKIDENT ('SuKienHoiThao_Files', RESEED, 0);
delete ThiTruongLaoDong
delete ThiTruongLaoDong_Files
delete ThongTinUyQuyen
delete ThongTinDoanhNghiep
delete VDO_Video
delete VDO_ChuyenMucVideo


delete files
DBCC CHECKIDENT ('files', RESEED, 0);

-- table Nghien Cuc Khoa Hoc
CREATE TABLE [dbo].[NghienCuuKhoaHoc]
(
    -- Primary Key
    [ID] INT IDENTITY(1,1) PRIMARY KEY,
    [TenDeTai] NVARCHAR(500) NOT NULL, 
    [CapQuanLy] NVARCHAR(255) NULL, 
    [LinhVuc] NVARCHAR(255) NULL, 
    [DonViChuTri] NVARCHAR(255) NULL, 
    [ThoiGianThucHien] NVARCHAR(255) NULL, 
    [MoTa] NVARCHAR(2000) NULL, 
    [NoiDung] NVARCHAR(MAX) NULL, 
    [NgayTao] DATETIME DEFAULT GETDATE(),       -- Created Date
    [NguoiTao] NVARCHAR(255) NULL,              -- Created By
    [NgayCapNhat] DATETIME NULL,                -- Modified Date
    [NguoiCapNhat] NVARCHAR(255) NULL,          -- Modified By
);
GO

-- table Phan Anh Kien Nghi
CREATE TABLE PhanAnhKienNghi_LinhVuc (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TenLinhVuc NVARCHAR(255) NOT NULL,
    MoTa NVARCHAR(500)
);

CREATE TABLE PhanAnhKienNghi_CoQuan (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TenCoQuan NVARCHAR(255) NOT NULL,
    MoTa NVARCHAR(500)
);

CREATE TABLE PhanAnhKienNghi (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TenCauHoi NVARCHAR(MAX) NOT NULL,
    TenNguoiGui NVARCHAR(255),
    Email NVARCHAR(255),
    SoDienThoai VARCHAR(100),
    IPNguoiGui VARCHAR(45),
    LinhVucId INT, 
    CoQuanId INT,
    NgayHoi DATETIME DEFAULT GETDATE(),
    NguoiTraLoi NVARCHAR(255),
    LuotXem INT,
    HienThiLuotXem BIT DEFAULT 1,
    NoiDungCauHoi NVARCHAR(MAX),
    NoiDungCauTraLoi NVARCHAR(MAX),
    
    CONSTRAINT FK_PhanAnh_LinhVuc FOREIGN KEY (LinhVucId) 
        REFERENCES PhanAnhKienNghi_LinhVuc(ID),
    CONSTRAINT FK_PhanAnh_CoQuan FOREIGN KEY (CoQuanId) 
        REFERENCES PhanAnhKienNghi_CoQuan(ID)
);

-- table Dong Gop Y Kien
CREATE TABLE DongGopYKien_ChuDe (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TieuDe NVARCHAR(255) NOT NULL,
    MoTa NVARCHAR(500)
);

CREATE TABLE DongGopYKien (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ChuDeId INT, 
    TieuDe NVARCHAR(MAX) NOT NULL,
    TenNguoiGui NVARCHAR(255),
    CMND NVARCHAR(20),
    Email NVARCHAR(255),
    SoDienThoai VARCHAR(100),
    NoiDung NVARCHAR(MAX),
    [NgayTao] DATETIME DEFAULT GETDATE(),       -- Created Date
    [NguoiTao] NVARCHAR(255) NULL,              -- Created By
    [NgayCapNhat] DATETIME NULL,                -- Modified Date
    [NguoiCapNhat] NVARCHAR(255) NULL,          -- Modified By

    CONSTRAINT FK_YKien_ChuDe FOREIGN KEY (ChuDeId) 
        REFERENCES DongGopYKien_ChuDe(ID),
);

-- table Danh muc Chi Tieu
CREATE TABLE ChiTieu_DanhMuc (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TieuDe NVARCHAR(255) NOT NULL,
    TenDanhMuc NVARCHAR(500),
    KeyDanhMucChiTieu NVARCHAR(500),
    DanhMucCha INT,
);

CREATE TABLE ChiTieu (
    ID INT PRIMARY KEY IDENTITY(1,1),
    DanhMucId INT, 
    TieuDe NVARCHAR(MAX) NOT NULL,
    ChiSo FLOAT,
    KeyChiTietChiTieu NVARCHAR(500),
    NamThucHien INT

    CONSTRAINT FK_ChiTieuDanhMuc FOREIGN KEY (DanhMucId) 
        REFERENCES ChiTieu_DanhMuc(ID),
);

-- table Thong Bao
CREATE TABLE ThongBao (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TieuDe NVARCHAR(500) NOT NULL,
    SoVanBan NVARCHAR(100),
    NgayDang DATETIME DEFAULT GETDATE(),
    DonViBanHanh NVARCHAR(255),
    NoiDung NVARCHAR(MAX),
    HienThiTrangChu BIT DEFAULT 1,
    TenFileHienThi NVARCHAR(255),
    DuongDanFile NVARCHAR(MAX)
);

CREATE TABLE ThongBao_Files (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ThongBaoId INT not null, 
    FileID INT NOT NULL

    CONSTRAINT FK_ThongBaoFile_files FOREIGN KEY (FileID) 
        REFERENCES Files(ID),
    CONSTRAINT FK_ThongBaoFile_Thongbao FOREIGN KEY (ThongBaoId) 
        REFERENCES ThongBao(ID),
);


CREATE TABLE AlbumAnh_Files (
    ID INT PRIMARY KEY IDENTITY(1,1),
    AlbumID INT not null, 
    FileID INT NOT NULL

    CONSTRAINT FK_albumanhfile_files FOREIGN KEY (FileID) 
        REFERENCES Files(ID),
    CONSTRAINT FK_albumanhfile_album FOREIGN KEY (AlbumID) 
        REFERENCES ABL_AlbumAnh(ID),
);

CREATE TABLE AlbumAudio_Files (
    ID INT PRIMARY KEY IDENTITY(1,1),
    AlbumID INT not null, 
    FileID INT NOT NULL

    CONSTRAINT FK_albumaudiofile_files FOREIGN KEY (FileID) 
        REFERENCES Files(ID),
    CONSTRAINT FK_albumaudiofile_album FOREIGN KEY (AlbumID) 
        REFERENCES ABL_AlbumAudio(ID),
);

CREATE TABLE AlbumVideo_Files (
    ID INT PRIMARY KEY IDENTITY(1,1),
    AlbumID INT not null, 
    FileID INT NOT NULL

    CONSTRAINT FK_albumvideofile_files FOREIGN KEY (FileID) 
        REFERENCES Files(ID),
    CONSTRAINT FK_albumvideofile_album FOREIGN KEY (AlbumID) 
        REFERENCES ABL_AlbumVideo(ID),
);

delete DonVi_LanhDao
delete CoCauToChuc
DBCC CHECKIDENT ('CoCauToChuc', RESEED, 0);
DBCC CHECKIDENT ('DonVi_LanhDao', RESEED, 0);
insert into CoCauToChuc (TenDonVi, Lang, HienThi) values (N'Cây Tiếng Việt',1066,1)
insert into CoCauToChuc (TenDonVi, Lang, HienThi) values (N'Cây Tiếng Anh',1033,1)

insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (1, 1, N'Tổ chức hành chính',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (1, 2, N'Các đơn vị sự nghiệp công lập',1066,1)

insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 1, N'Vụ Tổ chức - Biên chế',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 2, N'Vụ Chính quyền địa phương',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 3, N'Vụ Công chức - Viên chức',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 4, N'Vụ Tổ chức phi chính phủ',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 5, N'Vụ Cải cách hành chính',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 6, N'Vụ Công tác thanh niên và Bình đẳng giới',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 7, N'Vụ Hợp tác quốc tế',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 8, N'Vụ Tổ chức cán bộ',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 9, N'Vụ Pháp chế',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 10, N'Vụ Kế hoạch - Tài chính',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 11, N'Thanh tra Bộ',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 12, N'Văn phòng Bộ',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 13, N'Cục Văn thư và Lưu trữ nhà nước',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 14, N'Cục Tiền lương và Bảo hiểm xã hội',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 15, N'Cục Việc làm',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 16, N'Cục Quản lý lao động ngoài nước',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 17, N'Cục Người có công',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (3, 18, N'Ban Thi đua - khen thưởng Trung ương',1066,1)

insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (4, 1, N'Trung tâm Công nghệ thông tin',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (4, 2, N'Viên Khoa học Tổ chức nhà nước và Lao động',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (4, 3, N'Tạp chí Tổ chức nhà nước và Lao động',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (4, 4, N'Báo Dân trí',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (4, 5, N'Trường Đại học Lao động - Xã hội',1066,1)
insert into CoCauToChuc (IDDVCha, SoThuTu, TenDonVi, Lang, HienThi) values (4, 6, N'Trung tâm Lao động ngoài nước',1066,1)


IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'dbo.CoCauToChuc') 
    AND name = N'LinkBaiViet'
)
BEGIN
    ALTER TABLE dbo.CoCauToChuc
    ADD LinkBaiViet VARCHAR(500) NULL;
END



/****** Object:  Table [dbo].[VanBanDuThao]    Script Date: 12/23/2025 7:50:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[VanBanDuThao](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[TieuDe] nvarchar(300) NULL,
	[ID_HinhThucVanBan] [int] NULL,
	[TrichYeu] [ntext] NULL,
	[NgayBatDauLayYKien] [datetime] NULL,
	[NgayHetHanLayYKien] [datetime] NULL,
	[TrangThai] [int] NULL,
	[Lang] [int] NULL,
	[NoiDung] [ntext] NULL,
	[Migrate_Source] [nvarchar](500) NULL,
 CONSTRAINT [PK_VanBanDuThao] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[VanBanDuThao]  WITH CHECK ADD  CONSTRAINT [VanBanDuThao_HinhThuc_FK] FOREIGN KEY([ID_HinhThucVanBan])
REFERENCES [dbo].[HinhThucVanBan] ([ID])
GO

ALTER TABLE [dbo].[VanBanDuThao] CHECK CONSTRAINT [VanBanDuThao_HinhThuc_FK]
GO


/****** Object:  Table [dbo].[VanBanDuThao_Files]    Script Date: 12/23/2025 7:54:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[VanBanDuThao_Files](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[VanBanDuThaoID] [int] NOT NULL,
	[FileID] [int] NOT NULL,
 CONSTRAINT [PK_VanBanDuThao_Files] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[VanBanDuThao_Files]  WITH CHECK ADD  CONSTRAINT [VanBanDuThao_Files_File_FK] FOREIGN KEY([FileID])
REFERENCES [dbo].[Files] ([ID])
GO

ALTER TABLE [dbo].[VanBanDuThao_Files] CHECK CONSTRAINT [VanBanDuThao_Files_File_FK]
GO

ALTER TABLE [dbo].[VanBanDuThao_Files]  WITH CHECK ADD  CONSTRAINT [VanBanDuThao_Files_VBDT_FK] FOREIGN KEY([VanBanDuThaoID])
REFERENCES [dbo].[VanBanDuThao] ([ID])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[VanBanDuThao_Files] CHECK CONSTRAINT [VanBanDuThao_Files_VBDT_FK]
GO

/****** Object:  Table [dbo].[VanBanDuThao_GopY]    Script Date: 12/23/2025 7:50:19 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[VanBanDuThao_GopY](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[VanBanDuThaoID] [int] NULL,
	[HoTen] [nvarchar](200) NULL,
	[SoDienThoai] [nvarchar](200) NULL,
	[Email] [nvarchar](200) NULL,
	[DiaChi] [nvarchar](200) NULL,
	[NgayGui] [datetime] NULL,
	[NoiDung] [ntext] NULL,
	[Migrate_Source] [nvarchar](500) NULL,
 CONSTRAINT [PK_VanBanDuThao_GopY] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[VanBanDuThao_GopY]  WITH CHECK ADD  CONSTRAINT [VanBanDuThao_GopY_VB_FK] FOREIGN KEY([VanBanDuThaoID])
REFERENCES [dbo].[VanBanDuThao] ([ID])
GO

ALTER TABLE [dbo].[VanBanDuThao_GopY] CHECK CONSTRAINT [VanBanDuThao_GopY_VB_FK]
GO

/****** Object:  Table [dbo].[VanBanDuThao_CoQuanBanHanhs]    Script Date: 12/23/2025 7:54:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[VanBanDuThao_CoQuanBanHanhs](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[VanBanDuThaoID] [int] NOT NULL,
	[CoQuanID] [int] NOT NULL,
 CONSTRAINT [PK_VanBanDuThao_CoQuanBanHanhs] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[VanBanDuThao_CoQuanBanHanhs]  WITH CHECK ADD  CONSTRAINT [VanBanDuThao_CoQuanBanHanhs_CQ_FK] FOREIGN KEY([CoQuanID])
REFERENCES [dbo].[CoQuanBanHanh] ([ID])
GO

ALTER TABLE [dbo].[VanBanDuThao_CoQuanBanHanhs] CHECK CONSTRAINT [VanBanDuThao_CoQuanBanHanhs_CQ_FK]
GO

ALTER TABLE [dbo].[VanBanDuThao_CoQuanBanHanhs]  WITH CHECK ADD  CONSTRAINT [VanBanDuThao_CoQuanBanHanhs_VBDT_FK] FOREIGN KEY([VanBanDuThaoID])
REFERENCES [dbo].[VanBanDuThao] ([ID])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[VanBanDuThao_CoQuanBanHanhs] CHECK CONSTRAINT [VanBanDuThao_CoQuanBanHanhs_VBDT_FK]
GO

/****** Object:  Table [dbo].[VanBanDuThao_LinhVucs]    Script Date: 12/23/2025 7:54:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[VanBanDuThao_LinhVucs](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[VanBanDuThaoID] [int] NOT NULL,
	[LinhVucID] [int] NOT NULL,
 CONSTRAINT [PK_VanBanDuThao_LinhVucs] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[VanBanDuThao_LinhVucs]  WITH CHECK ADD  CONSTRAINT [VanBanDuThao_LinhVucs_LV_FK] FOREIGN KEY([LinhVucID])
REFERENCES [dbo].[LinhVuc] ([ID])
GO

ALTER TABLE [dbo].[VanBanDuThao_LinhVucs] CHECK CONSTRAINT [VanBanDuThao_LinhVucs_LV_FK]
GO

ALTER TABLE [dbo].[VanBanDuThao_LinhVucs]  WITH CHECK ADD  CONSTRAINT [VanBanDuThao_LinhVucs_VBDT_FK] FOREIGN KEY([VanBanDuThaoID])
REFERENCES [dbo].[VanBanDuThao] ([ID])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[VanBanDuThao_LinhVucs] CHECK CONSTRAINT [VanBanDuThao_LinhVucs_VBDT_FK]
GO



-- table Gioi thieu van ban
CREATE TABLE GioiThieuVanBan (
    ID INT PRIMARY KEY IDENTITY(1,1),
    TieuDe NVARCHAR(500) NOT NULL,
    IDVanBanQPPL int,
    IDVanBanDT int,
    MoTa NVARCHAR(MAX),
    NoiDung NVARCHAR(MAX),
    NgayXuatBan datetime,
    TacGia nvarchar(200),
    AnhDaiDien int
    CONSTRAINT FK_GioiThieuVanBan_VBQPPL FOREIGN KEY (IDVanBanQPPL) 
        REFERENCES VanBan(ID),
    CONSTRAINT FK_GioiThieuVanBan_VBDT FOREIGN KEY (IDVanBanDT) 
        REFERENCES VanBanDuThao(ID),
    CONSTRAINT FK_GioiThieuVanBan_AnhDaiDien FOREIGN KEY (AnhDaiDien) 
        REFERENCES Files(ID),
);

CREATE TABLE GioiThieuVanBan_Files (
    ID INT PRIMARY KEY IDENTITY(1,1),
    GioiThieuVanBanId INT not null, 
    FileID INT NOT NULL

    CONSTRAINT FK_GioiThieuVanBanFile_files FOREIGN KEY (FileID) 
        REFERENCES Files(ID),
    CONSTRAINT FK_GioiThieuVanBanFile_GTVB FOREIGN KEY (GioiThieuVanBanId) 
        REFERENCES ThongBao(ID),
);
