using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.Linq;
namespace API.Services.HoiQuy
{
    public static class HoiQuyStore
    {
        public static SqlConnection Open()
        {
            var builder = new EntityConnectionStringBuilder(ConfigurationManager.ConnectionStrings["CongTTDT_MOHAEntities"].ConnectionString);
            var connection = new SqlConnection(builder.ProviderConnectionString); connection.Open(); return connection;
        }
        static HoiQuyRecord Record(SqlDataReader reader)
        {
            return new HoiQuyRecord { ID = (int)reader["ID"], Name = (string)reader["Name"], Type = (string)reader["Type"], Chair = (string)reader["Chair"], Address = (string)reader["Address"], Phone = (string)reader["Phone"], Email = (string)reader["Email"], Website = (string)reader["Website"], Purpose = (string)reader["Purpose"], SourceRow = (int)reader["SourceRow"], HasLogo = (bool)reader["HasLogo"] };
        }
        public static object Search(string name, int page)
        {
            var normalized = HoiQuyRecord.Normalize(name);
            if (normalized.Length == 0 || normalized.Length > 200) throw new ArgumentException("Vui lòng nhập tên tổ chức (tối đa 200 ký tự).");
            if (page < 1 || page > 10000) throw new ArgumentException("Trang không hợp lệ.");
            var pattern = "%" + normalized.Replace("~", "~~").Replace("%", "~%").Replace("_", "~_").Replace("[", "~[") + "%";
            using (var db = Open())
            using (var cmd = db.CreateCommand())
            {
                cmd.CommandText = "SELECT COUNT(*) FROM dbo.HoiQuyTrungUong WHERE SearchName LIKE @name ESCAPE '~'";
                cmd.Parameters.Add("@name", SqlDbType.NVarChar, 1000).Value = pattern;
                int total = (int)cmd.ExecuteScalar();
                cmd.CommandText = "SELECT ID,Name,Type,Chair,Address,Phone,Email,Website,Purpose,SourceRow,CAST(CASE WHEN Logo IS NULL THEN 0 ELSE 1 END AS bit) HasLogo FROM dbo.HoiQuyTrungUong WHERE SearchName LIKE @name ESCAPE '~' ORDER BY Name,ID OFFSET @offset ROWS FETCH NEXT 10 ROWS ONLY";
                cmd.Parameters.Add("@offset", SqlDbType.Int).Value = (page - 1) * 10;
                var rows = new List<HoiQuyRecord>(); using (var reader = cmd.ExecuteReader()) while (reader.Read()) rows.Add(Record(reader));
                return new { Rows = rows, Total = total, Page = page, PageSize = 10 };
            }
        }
        public static byte[] Logo(int id)
        {
            using (var db = Open()) using (var cmd = db.CreateCommand())
            { cmd.CommandText = "SELECT Logo FROM dbo.HoiQuyTrungUong WHERE ID=@id"; cmd.Parameters.Add("@id", SqlDbType.Int).Value = id; return cmd.ExecuteScalar() as byte[]; }
        }
        public static object Commit(ImportPreview preview, ImportCommit options)
        {
            var invalid = preview.Rows.Where(x => x.Issues.Any(i => i != "Trùng tên và loại trong file")).ToList();
            var duplicates = preview.Rows.Where(x => x.Issues.Contains("Trùng tên và loại trong file")).ToList();
            if ((!options.SkipInvalid && invalid.Count > 0) || (!options.SkipDuplicates && duplicates.Count > 0)) throw new ArgumentException("Cần xử lý lỗi/trùng dữ liệu hoặc chọn bỏ qua các dòng này.");
            var eligible = preview.Rows.Where(x => !invalid.Contains(x) && !duplicates.Contains(x)).ToList();
            int added = 0, updated = 0, existing = 0;
            using (var db = Open()) using (var transaction = db.BeginTransaction(IsolationLevel.Serializable))
            {
                foreach (var row in eligible)
                using (var cmd = db.CreateCommand())
                {
                    cmd.Transaction = transaction;
                    cmd.CommandText = "SELECT ID FROM dbo.HoiQuyTrungUong WHERE ImportKey=@key";
                    cmd.Parameters.Add("@key", SqlDbType.VarChar, 64).Value = row.Key;
                    var id = cmd.ExecuteScalar();
                    if (id != null && !options.UpdateExisting) { existing++; continue; }
                    cmd.Parameters.Add("@name", SqlDbType.NVarChar, 1000).Value = row.Name;
                    cmd.Parameters.Add("@type", SqlDbType.NVarChar, 10).Value = row.Type;
                    cmd.Parameters.Add("@chair", SqlDbType.NVarChar, 1000).Value = row.Chair;
                    cmd.Parameters.Add("@address", SqlDbType.NVarChar, 4000).Value = row.Address;
                    cmd.Parameters.Add("@phone", SqlDbType.NVarChar, 1000).Value = row.Phone;
                    cmd.Parameters.Add("@email", SqlDbType.NVarChar, 1000).Value = row.Email;
                    cmd.Parameters.Add("@website", SqlDbType.NVarChar, 2000).Value = row.Website;
                    cmd.Parameters.Add("@purpose", SqlDbType.NVarChar, -1).Value = row.Purpose;
                    cmd.Parameters.Add("@search", SqlDbType.NVarChar, 1000).Value = HoiQuyRecord.Normalize(row.Name);
                    cmd.Parameters.Add("@logo", SqlDbType.VarBinary, -1).Value = options.IncludeLogos && row.Logo != null ? (object)row.Logo : DBNull.Value;
                    cmd.Parameters.Add("@row", SqlDbType.Int).Value = row.SourceRow;
                    cmd.Parameters.Add("@file", SqlDbType.NVarChar, 260).Value = preview.FileName;
                    cmd.Parameters.Add("@user", SqlDbType.NVarChar, 256).Value = preview.Owner;
                    if (id == null)
                    {
                        cmd.CommandText = "INSERT dbo.HoiQuyTrungUong(Name,Type,Chair,Address,Phone,Email,Website,Purpose,SearchName,ImportKey,Logo,SourceRow,SourceFile,UpdatedBy) VALUES(@name,@type,@chair,@address,@phone,@email,@website,@purpose,@search,@key,@logo,@row,@file,@user)"; added++;
                    }
                    else
                    {
                        cmd.CommandText = "UPDATE dbo.HoiQuyTrungUong SET Name=@name,Type=@type,Chair=@chair,Address=@address,Phone=@phone,Email=@email,Website=@website,Purpose=@purpose,SearchName=@search,Logo=COALESCE(@logo,Logo),SourceRow=@row,SourceFile=@file,UpdatedBy=@user,UpdatedAt=SYSUTCDATETIME() WHERE ImportKey=@key"; updated++;
                    }
                    cmd.ExecuteNonQuery();
                }
                transaction.Commit();
            }
            return new { Added = added, Updated = updated, Existing = existing, Skipped = preview.Rows.Count - eligible.Count, Total = preview.Rows.Count };
        }
    }
}
