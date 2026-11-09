-- Existing articles are Vietnamese, as confirmed for this rollout.
-- Re-running must not overwrite articles subsequently classified as English.
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.TinTuc', N'U') IS NULL
    THROW 50001, 'dbo.TinTuc is missing; migration was not applied.', 1;
IF COL_LENGTH(N'dbo.TinTuc', N'NgonNgu') IS NULL
BEGIN
    ALTER TABLE dbo.TinTuc ADD NgonNgu nvarchar(2) NULL
        CONSTRAINT DF_TinTuc_NgonNgu DEFAULT (N'vi') WITH VALUES;
END;
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID(N'dbo.TinTuc') AND name = N'CK_TinTuc_NgonNgu')
    EXEC(N'ALTER TABLE dbo.TinTuc WITH CHECK ADD CONSTRAINT CK_TinTuc_NgonNgu CHECK (NgonNgu IS NULL OR NgonNgu IN (N''vi'', N''en''))');
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID(N'dbo.TinTuc') AND name = N'IX_TinTuc_NgonNgu')
    EXEC(N'CREATE INDEX IX_TinTuc_NgonNgu ON dbo.TinTuc (NgonNgu, TrangThai, IDChuyenMuc)');
COMMIT TRANSACTION;
