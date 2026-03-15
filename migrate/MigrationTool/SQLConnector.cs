using Microsoft.SharePoint.BusinessData.Administration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Runtime;
using System.Text;

namespace MigrationTool
{
    internal class SQLConnector
    {
        public string ConnectionString { get; internal set; }

        public SQLConnector(string connectionString)
        {
            ConnectionString = connectionString;
        }

        public int Upsert(Entity entity, FieldMappings mappingFields)
        {
            int recordId = 0;
            string migrateSourceValue = $"{mappingFields.SitePath}|##|{mappingFields.SourceListName}|##|{entity.Properties["ID"]}";

            if (!entity.Properties.ContainsKey("Migrate_Source"))
            {
                entity.Properties.Add("Migrate_Source", migrateSourceValue);
            }

            entity.Properties.Remove("ID");

            var columnNames = entity.Properties.Keys.ToList();
            var columns = string.Join(", ", columnNames);

            var updateClause = string.Join(", ", columnNames.Select(col => $"{col} = @{col}"));
            var parameters = string.Join(", ", columnNames.Select(col => "@" + col));

            StringBuilder sql = new StringBuilder();
            sql.AppendLine($"MERGE {mappingFields.TargetTableName} AS Target");
            sql.AppendLine($"USING (SELECT @Migrate_Source AS Migrate_Source) AS Source");
            sql.AppendLine("ON (Target.Migrate_Source = Source.Migrate_Source)");

            // If record exists, update it
            sql.AppendLine("WHEN MATCHED THEN");
            sql.AppendLine($"    UPDATE SET {updateClause}");

            // If record does not exist, insert it
            sql.AppendLine("WHEN NOT MATCHED THEN");
            sql.AppendLine($"    INSERT ({columns}) VALUES ({parameters})");

            // Output the ID (works for both Insert and Update)
            sql.AppendLine("OUTPUT inserted.ID;");

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand(sql.ToString(), connection))
                    {
                        foreach (var kvp in entity.Properties)
                        {
                            command.Parameters.AddWithValue("@" + kvp.Key, kvp.Value ?? DBNull.Value);
                        }

                        connection.Open();
                        object result = command.ExecuteScalar();
                        if (result != null && int.TryParse(result.ToString(), out int parsedId))
                        {
                            recordId = parsedId;
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                Logger.Error($"Upsert Data into {mappingFields.TargetTableName} failed.", ex);
            }

            return recordId;
        }

        public int UpsertFile(string filePath)
        {
            return UpsertFile(Path.GetFileName(filePath), filePath);
        }

        public int UpsertFile(string fileName, string filePath)
        {
            int recordId = 0;

            StringBuilder sql = new StringBuilder();
            sql.AppendLine("MERGE Files AS Target");
            sql.AppendLine("USING (SELECT @Link AS LinkLuuTru) AS Source");
            sql.AppendLine("ON (Target.LinkLuuTru = Source.LinkLuuTru)");

            sql.AppendLine("WHEN MATCHED THEN");
            sql.AppendLine("    UPDATE SET Ten = @Name, MoTa = @Desc, TrangThai = 'active'");

            sql.AppendLine("WHEN NOT MATCHED THEN");
            sql.AppendLine("    INSERT (Ten, MoTa, LinkLuuTru, TrangThai) ");
            sql.AppendLine("    VALUES (@Name, @Desc, @Link, 'active')");

            sql.AppendLine("OUTPUT inserted.ID;");

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand(sql.ToString(), connection))
                    {
                        command.Parameters.AddWithValue("@Name", fileName);
                        command.Parameters.AddWithValue("@Desc", "File uploaded: " + fileName);
                        command.Parameters.AddWithValue("@Link", filePath);

                        connection.Open();
                        object result = command.ExecuteScalar();

                        if (result != null && int.TryParse(result.ToString(), out int parsedId))
                        {
                            recordId = parsedId;
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                Logger.Error("Upsert file into Files table failed.", ex);
            }

            return recordId;
        }

        public int UpsertMultiLookup(string tableName, string mainRecordColumn, string lookupColumn, int mainRecordId, int lookupId)
        {
            int recordId = 0;

            StringBuilder sql = new StringBuilder();
            sql.AppendLine($"MERGE {tableName} AS Target");
            sql.AppendLine($"USING (SELECT @{mainRecordColumn} AS {mainRecordColumn}, @{lookupColumn} AS {lookupColumn}) AS Source");
            sql.AppendLine($"ON (Target.{mainRecordColumn} = Source.{mainRecordColumn} AND Target.{lookupColumn} = Source.{lookupColumn})");

            sql.AppendLine("WHEN MATCHED THEN");
            sql.AppendLine($"    UPDATE SET {mainRecordColumn} = @{mainRecordColumn}, {lookupColumn} = @{lookupColumn}");

            sql.AppendLine("WHEN NOT MATCHED THEN");
            sql.AppendLine($"    INSERT ({mainRecordColumn}, {lookupColumn}) ");
            sql.AppendLine($"    VALUES (@{mainRecordColumn}, @{lookupColumn})");

            sql.AppendLine("OUTPUT inserted.ID;");

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand(sql.ToString(), connection))
                    {
                        command.Parameters.AddWithValue($"@{mainRecordColumn}", mainRecordId);
                        command.Parameters.AddWithValue($"@{lookupColumn}", lookupId);

                        connection.Open();
                        object result = command.ExecuteScalar();

                        if (result != null && int.TryParse(result.ToString(), out int parsedId))
                        {
                            recordId = parsedId;
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                Logger.Error($"Upsert multilookup into Files {tableName} failed.", ex);
            }

            return recordId;
        }

        public void UpsertAttachment(string attachmentFolder, string fileName, string filePath, int recordId, string tableInfo)
        {
            string[] info = tableInfo.Split(new string[] { "|##|" }, StringSplitOptions.RemoveEmptyEntries);
            if (info.Length < 2) return;

            string targetTable = info[0];
            string recordColumn = info[1];
            string relativeFilePath ="/" + filePath.Replace(Path.GetDirectoryName(attachmentFolder), string.Empty).Replace("\\", "/").TrimStart('/');
            int fileId = UpsertFile(fileName, relativeFilePath);

            if (fileId > 0)
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendLine($"MERGE {targetTable} AS Target");
                sql.AppendLine($"USING (SELECT @RecordId AS {recordColumn}, @FileId AS FileID) AS Source");
                sql.AppendLine($"ON (Target.{recordColumn} = Source.{recordColumn} AND Target.FileID = Source.FileID)");

                sql.AppendLine("WHEN MATCHED THEN");
                sql.AppendLine($"    UPDATE SET {recordColumn} = Source.{recordColumn}");

                sql.AppendLine("WHEN NOT MATCHED THEN");
                sql.AppendLine($"    INSERT ({recordColumn}, FileID) VALUES (@RecordId, @FileId);");

                try
                {
                    using (SqlConnection connection = new SqlConnection(ConnectionString))
                    {
                        using (SqlCommand command = new SqlCommand(sql.ToString(), connection))
                        {
                            command.Parameters.AddWithValue("@RecordId", recordId);
                            command.Parameters.AddWithValue("@FileId", fileId);

                            connection.Open();
                            command.ExecuteNonQuery();
                        }
                    }
                }
                catch (SqlException ex)
                {
                    Logger.Error($"Upsert attachment mapping into {targetTable} failed.", ex);
                }
            }
        }

        public Dictionary<string, int> GetMigratedData(string tableName)
        {
            Dictionary<string, int> retVal =  new Dictionary<string, int>();
            string sqlQuery = $"SELECT Id, Migrate_Source FROM {tableName}";

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                    {
                        connection.Open();

                        // Use a DataReader to efficiently read data row by row
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var id = reader.GetInt32(reader.GetOrdinal("Id"));

                                int sourceOrdinal = reader.GetOrdinal("Migrate_Source");
                                if (!reader.IsDBNull(sourceOrdinal))
                                {
                                    retVal.Add(reader.GetString(sourceOrdinal), id);
                                }
                            }
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                Logger.Error($"Get Migrated Data {tableName}", ex);
            }
            
            return retVal;
        }

        public void DeleteAll(string tableName)
        {
            string sqlQuery = $"DELETE {tableName}";

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                    {
                        connection.Open();
                        command.ExecuteNonQuery();
                        Logger.Info($"Data deleted on table '{tableName}' successfully.");
                    }
                }
            }
            catch (SqlException ex)
            {
                Logger.Error($"Delete All {tableName}", ex);
            }
        }

        public void AddMigrationColumn(string tableName)
        {
            // Use a T-SQL batch script to perform the check and alter in one go
            string sqlCommandText = $@"
                            IF NOT EXISTS (
                                SELECT column_name
                                FROM INFORMATION_SCHEMA.COLUMNS
                                WHERE table_name = '{tableName}' AND column_name = 'Migrate_Source'
                            )
                            BEGIN
                                ALTER TABLE {tableName}
                                ADD Migrate_Source NVARCHAR(500) NULL;
                                PRINT 'Column Migrate_Source added to {tableName}.';
                            END
                            ELSE
                            BEGIN
                                PRINT 'Column Migrate_Source already exists in {tableName}.';
                            END;";

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    using (SqlCommand command = new SqlCommand(sqlCommandText, connection))
                    {
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (SqlException ex)
            {
                Logger.Error($"Add Migration Column to table {tableName}", ex);
            }
        }
    }
}
