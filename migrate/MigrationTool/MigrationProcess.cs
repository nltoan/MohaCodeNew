using Microsoft.SharePoint;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;

namespace MigrationTool
{
    internal class MigrationProcess:IDisposable
    {
        private SharePointConnector spConn;
        private SQLConnector sqlConn;
        private Dictionary<string, FieldMappings> fieldMappings;
        private Dictionary<string, Dictionary<string, int>> migratedData;
        private string AttachmentFolder;
        public MigrationProcess(string siteUrl, string sqlConnStr) 
        {
            sqlConn = new SQLConnector(sqlConnStr);
            spConn = new SharePointConnector(siteUrl);
            string path = System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            fieldMappings = FieldMappings.GetFromFiles(System.IO.Path.Combine(path, ConfigurationManager.AppSettings["MappingFolder"]));
            migratedData = new Dictionary<string, Dictionary<string, int>>();
            AttachmentFolder = ConfigurationManager.AppSettings["AttachmentFolder"];
        }

        public void Execute()
        {
            foreach(KeyValuePair<string, FieldMappings> mappings in fieldMappings)
            {
                MigrateList(mappings.Value);
            }
        }

        public void DownloadAttachmentAgain(string folderText)
        {
            string siteURL = "KND";
            ScanFolder(folderText, System.IO.Path.Combine(folderText, siteURL));
        }

        private void ScanFolder(string rootFolder, string folderPath)
        {
            if (System.IO.Path.GetFileNameWithoutExtension(System.IO.Path.GetDirectoryName(folderPath)).Equals("Attachments"))
            {
                string relativePath = '/' + folderPath.Replace(rootFolder + "\\", string.Empty).Replace("\\", "/").TrimStart('/');
                spConn.DownloadFiles(relativePath, folderPath);
            }
            var directories = System.IO.Directory.GetDirectories(folderPath);
            foreach(var dir in directories)
            {
                ScanFolder(rootFolder, dir);
            }
        }

        public void MigrateList(FieldMappings mappingFields)
        {
            DateTime startTime = DateTime.Now;
            Logger.Info($"Start migrate list {mappingFields.SourceListName} to table {mappingFields.TargetTableName} - {startTime.ToString("dd-MM-yyyy HH:mm:ss")}");
            sqlConn.AddMigrationColumn(mappingFields.TargetTableName);
            var data = sqlConn.GetMigratedData(mappingFields.TargetTableName);
            if (!migratedData.ContainsKey(mappingFields.TargetTableName))
            {
                migratedData.Add(mappingFields.TargetTableName, data);
            }
            else
            {
                foreach(KeyValuePair<string, int> item in data)
                {
                    if (!migratedData[mappingFields.TargetTableName].ContainsKey(item.Key))
                    {
                        migratedData[mappingFields.TargetTableName].Add(item.Key, item.Value);
                    }
                }
            }

            if (mappingFields.MigrationOption.ToLower().Equals("skip"))
            {
                Logger.Info($"Complete migrate list {mappingFields.SourceListName} to table {mappingFields.TargetTableName} - {DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss")}");
                return;
            }

            if (mappingFields.MigrationOption.ToLower().Equals("reset"))
            {
                sqlConn.DeleteAll(mappingFields.TargetTableName);
            }

            Dictionary<string, int> retVal = new Dictionary<string, int>();
            using (var web = spConn.Site.OpenWeb(mappingFields.SitePath))
            {
                var sourceList = web.Lists.TryGetList(mappingFields.SourceListName);
                if (sourceList != null)
                {
                    var sourceIds = spConn.GetAllItemIds(sourceList);
                    List<Int32> itemIDs = null;
                    if (!string.IsNullOrEmpty(mappingFields.ItemIDs))
                    {
                        itemIDs = mappingFields.ItemIDs.Split(',').Select(int.Parse).ToList();
                    }
                    foreach (var sourceId in sourceIds)
                    {
                        if (itemIDs == null || itemIDs.Contains(sourceId))
                        {
                            SPListItem item = sourceList.GetItemById(sourceId);
                            try
                            {
                                Entity entity = new Entity();
                                string migrateAttachmentTo = string.Empty;
                                Dictionary<string, string> addMultilookupTo = new Dictionary<string, string>();

                                #region Mapping fields
                                foreach (KeyValuePair<string, FieldMapping> mapping in mappingFields)
                                {
                                    string targetType = mapping.Value.Target.FieldType;
                                    string sourceType = mapping.Value.Source.FieldType;
                                    switch (sourceType.ToLower())
                                    {
                                        case "text":
                                            if (targetType.ToLower().Equals("text"))
                                            {
                                                if (mapping.Value.Source.FieldName.ToLower().Equals("title") && string.IsNullOrEmpty(Convert.ToString(item[mapping.Value.Source.FieldName])))
                                                {
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, "NoTitle");
                                                }
                                                else
                                                {
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, item[mapping.Value.Source.FieldName]);
                                                }
                                            }
                                            else if (targetType.ToLower().Equals("lookup"))
                                            {
                                                var value = Convert.ToString(item[mapping.Value.Source.FieldName]);
                                                var ids = value.Split(new string[] { ";#" }, StringSplitOptions.RemoveEmptyEntries);
                                                if (ids.Length == 0)
                                                {
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, null);
                                                }
                                                else
                                                {
                                                    int lookupValue = -1;
                                                    int lookupId = Convert.ToInt32(ids[0]);
                                                    if (migratedData.ContainsKey(mapping.Value.Target.LookupList))
                                                    {
                                                        var temp = migratedData[mapping.Value.Target.LookupList];
                                                        if (temp.ContainsKey($"{mapping.Value.Source.LookupSite}|##|{mapping.Value.Source.LookupList}|##|{lookupId}"))
                                                        {
                                                            lookupValue = temp[$"{mapping.Value.Source.LookupSite}|##|{mapping.Value.Source.LookupList}|##|{lookupId}"];
                                                        }
                                                    }
                                                    if (lookupValue == -1)
                                                        throw new IndexOutOfRangeException($"Cannot find source item id {lookupId} in table {mapping.Value.Target.LookupList}");
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, lookupValue);
                                                }
                                            }
                                            break;
                                        case "int":
                                            entity.Properties.Add(mapping.Value.Target.FieldName, item[mapping.Value.Source.FieldName]);
                                            break;
                                        case "double":
                                            entity.Properties.Add(mapping.Value.Target.FieldName, item[mapping.Value.Source.FieldName]);
                                            break;
                                        case "datetime":
                                            entity.Properties.Add(mapping.Value.Target.FieldName, item[mapping.Value.Source.FieldName]);
                                            break;
                                        case "bool":
                                            if (targetType.ToLower().Equals("bool"))
                                            {
                                                entity.Properties.Add(mapping.Value.Target.FieldName, item[mapping.Value.Source.FieldName]);
                                            }
                                            else if (targetType.ToLower().Equals("int"))
                                            {
                                                var value = Convert.ToBoolean(item[mapping.Value.Source.FieldName]);
                                                entity.Properties.Add(mapping.Value.Target.FieldName, value ? 1 : 0);
                                            }
                                            break;
                                        case "lookup":
                                            if (targetType.ToLower().Equals("text"))
                                            {
                                                if (item[mapping.Value.Source.FieldName] != null)
                                                {
                                                    SPFieldLookupValue lookup = new SPFieldLookupValue(Convert.ToString(item[mapping.Value.Source.FieldName]));
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, lookup.LookupValue);
                                                }
                                            }
                                            else
                                            {
                                                if (item[mapping.Value.Source.FieldName] == null || string.IsNullOrEmpty(item[mapping.Value.Source.FieldName].ToString()))
                                                {
                                                    if (mapping.Value.Target.FieldType.Contains("|##|"))
                                                    {
                                                        string[] types = mapping.Value.Target.FieldType.Split(new string[] { "|##|" }, StringSplitOptions.RemoveEmptyEntries);
                                                        var id = Convert.ToInt32(types[1]);
                                                        entity.Properties.Add(mapping.Value.Target.FieldName, id);
                                                    }
                                                    else
                                                    {
                                                        entity.Properties.Add(mapping.Value.Target.FieldName, null);
                                                    }
                                                }
                                                else
                                                {
                                                    SPFieldLookupValue lookup = new SPFieldLookupValue(Convert.ToString(item[mapping.Value.Source.FieldName]));
                                                    int lookupValue = -1;
                                                    if (migratedData.ContainsKey(mapping.Value.Target.LookupList))
                                                    {
                                                        var temp = migratedData[mapping.Value.Target.LookupList];
                                                        if (temp.ContainsKey($"{mapping.Value.Source.LookupSite}|##|{mapping.Value.Source.LookupList}|##|{lookup.LookupId}"))
                                                        {
                                                            lookupValue = temp[$"{mapping.Value.Source.LookupSite}|##|{mapping.Value.Source.LookupList}|##|{lookup.LookupId}"];
                                                        }
                                                    }
                                                    if (lookupValue == -1)
                                                        throw new IndexOutOfRangeException($"Cannot find source item id {lookup.LookupId} in table {mapping.Value.Target.LookupList}");
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, lookupValue);
                                                }
                                            }
                                            break;
                                        case "multilookup":
                                            {
                                                string[] lookupTargetInfo = mapping.Value.Target.LookupList.Split(new string[] { "|##|" }, StringSplitOptions.RemoveEmptyEntries);
                                                SPFieldLookupValueCollection lookupValues = new SPFieldLookupValueCollection(Convert.ToString(item[mapping.Value.Source.FieldName]));
                                                string targetLookupTable = lookupTargetInfo[1] + "|##|" + lookupTargetInfo[2];
                                                string targetLookupValues = string.Empty;
                                                foreach (SPFieldLookupValue v in lookupValues)
                                                {
                                                    int lookupValue = -1;
                                                    if (migratedData.ContainsKey(lookupTargetInfo[0]))
                                                    {
                                                        var temp = migratedData[lookupTargetInfo[0]];
                                                        if (temp.ContainsKey($"{mapping.Value.Source.LookupSite}|##|{mapping.Value.Source.LookupList}|##|{v.LookupId}"))
                                                        {
                                                            lookupValue = temp[$"{mapping.Value.Source.LookupSite}|##|{mapping.Value.Source.LookupList}|##|{v.LookupId}"];
                                                        }
                                                    }
                                                    if (lookupValue == -1)
                                                        throw new IndexOutOfRangeException($"Cannot find source item id {v.LookupId} in table {mapping.Value.Target.LookupList}");
                                                    targetLookupValues += lookupValue + "|##|";
                                                }
                                                addMultilookupTo.Add(mapping.Value.Target.FieldName + "|##|" + targetLookupTable, targetLookupValues);
                                            }
                                            break;
                                        case "approvalstatus":
                                            //SharePoint Values
                                            //4 - Chờ kiểm duyệt
                                            //3 - Bản nháp
                                            //2 - Chờ xuất bản
                                            //1 - Trả về
                                            //0 - Đã xuất bản

                                            //new CMS Values
                                            //cancelpublic - Hủy xuất bản
                                            //public - Xuất bản
                                            //waitapprove - Chờ duyệt
                                            //rejectapprove - Trả về
                                            //draft - Lưu nháp
                                            {
                                                var value = Convert.ToInt32(item[mapping.Value.Source.FieldName]);
                                                switch (value)
                                                {
                                                    case 0:
                                                        entity.Properties.Add(mapping.Value.Target.FieldName, "public");
                                                        break;
                                                    case 1:
                                                        entity.Properties.Add(mapping.Value.Target.FieldName, "rejectapprove");
                                                        break;
                                                    case 2:
                                                        entity.Properties.Add(mapping.Value.Target.FieldName, "waitapprove");
                                                        break;
                                                    case 3:
                                                        entity.Properties.Add(mapping.Value.Target.FieldName, "draft");
                                                        break;
                                                    case 4:
                                                        entity.Properties.Add(mapping.Value.Target.FieldName, "waitapprove");
                                                        break;
                                                    default:
                                                        entity.Properties.Add(mapping.Value.Target.FieldName, "waitapprove");
                                                        break;
                                                }
                                            }
                                            break;
                                        case "fixedvalue":
                                            switch (targetType.ToLower())
                                            {
                                                case "text":
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, mapping.Value.Target.Value);
                                                    break;
                                                case "int":
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, Convert.ToInt32(mapping.Value.Target.Value));
                                                    break;
                                                case "double":
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, Convert.ToDouble(mapping.Value.Target.Value));
                                                    break;
                                                case "datetime":
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, Convert.ToDateTime(mapping.Value.Target.Value));
                                                    break;
                                                case "bool":
                                                    entity.Properties.Add(mapping.Value.Target.FieldName, Convert.ToBoolean(mapping.Value.Target.Value));
                                                    break;
                                                case "multilookup":
                                                    addMultilookupTo.Add(mapping.Value.Target.FieldName + "|##|" + mapping.Value.Target.LookupList, mapping.Value.Target.Value);
                                                    break;
                                            }
                                            break;
                                        case "fileupload":
                                            {
                                                var value = Convert.ToString(item[mapping.Value.Source.FieldName]);
                                                entity.Properties.Add(mapping.Value.Target.FieldName, sqlConn.UpsertFile(value));
                                            }
                                            break;
                                        case "attachments":
                                            migrateAttachmentTo = mapping.Value.Target.LookupList;
                                            break;
                                    }
                                }
                                #endregion Mapping fields

                                var insertedId = sqlConn.Upsert(entity, mappingFields);
                                if (insertedId == 0)
                                {
                                    Logger.Result(startTime, mappingFields.SitePath, mappingFields.SourceListName, item.ID, insertedId, "Failed");
                                }
                                else
                                {
                                    if (!migratedData.ContainsKey(mappingFields.TargetTableName))
                                    {
                                        migratedData.Add(mappingFields.TargetTableName, new Dictionary<string, int>());
                                    }

                                    if (!migratedData[mappingFields.TargetTableName].ContainsKey($"{mappingFields.SitePath}|##|{mappingFields.SourceListName}|##|{item.ID}"))
                                    {
                                        migratedData[mappingFields.TargetTableName].Add($"{mappingFields.SitePath}|##|{mappingFields.SourceListName}|##|{item.ID}", insertedId);
                                    }

                                    if (!string.IsNullOrEmpty(migrateAttachmentTo) && item.Attachments.Count > 0)
                                    {
                                        var attachments = item.Attachments;
                                        string relativeAttachmentPath = attachments.UrlPrefix.Replace(web.Site.Url, string.Empty).TrimStart('/');
                                        foreach (string attachment in attachments)
                                        {
                                            var fileContent = web.GetFile(Utils.GetSafeServerRelativeUrl(attachments.UrlPrefix.TrimEnd('/') + "/" + attachment)).OpenBinary();
                                            string directoryPath = System.IO.Path.Combine(AttachmentFolder, relativeAttachmentPath.Replace("/", "\\"));
                                            if (!System.IO.Directory.Exists(directoryPath))
                                            {
                                                System.IO.Directory.CreateDirectory(directoryPath);
                                            }
                                            string filePath = System.IO.Path.Combine(directoryPath, Guid.NewGuid().ToString() + "." + System.IO.Path.GetExtension(attachment));
                                            System.IO.File.WriteAllBytes(filePath, fileContent);
                                            sqlConn.UpsertAttachment(AttachmentFolder, attachment, filePath, insertedId, migrateAttachmentTo);
                                        }
                                    }

                                    foreach(KeyValuePair<string, string> ml in addMultilookupTo)
                                    {
                                        string[] lookupInfo = ml.Key.Split(new string[] { "|##|" }, StringSplitOptions.RemoveEmptyEntries);
                                        string[] lookupValues = ml.Value.Split(new string[] { "|##|" }, StringSplitOptions.RemoveEmptyEntries);
                                        foreach(string v in lookupValues)
                                        {
                                            if (string.IsNullOrEmpty(v))
                                                continue;

                                            sqlConn.UpsertMultiLookup(lookupInfo[1], lookupInfo[2], lookupInfo[0], insertedId, Convert.ToInt32(v));
                                        }
                                    }

                                    Logger.Result(startTime, mappingFields.SitePath, mappingFields.SourceListName, item.ID, insertedId, "Success");
                                }
                            }
                            catch (Exception ex)
                            {
                                Logger.Error($"Error when copying item {item.ID} from list {mappingFields.SourceListName}", ex);
                                Logger.Result(startTime, mappingFields.SitePath, mappingFields.SourceListName, item.ID, 0, "Failed", ex.Message);
                            }
                        }
                    }
                }
            }

            Logger.Info($"Complete migrate list {mappingFields.SourceListName} to table {mappingFields.TargetTableName} - {DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss")}");
        }

        public void Dispose()
        {
            if(spConn != null)
            {
                spConn.Dispose();
            }
        }
    }
}