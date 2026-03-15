using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace MigrationTool
{
    internal class FieldInfo
    {
        public string FieldName { get; set; }
        public string FieldType { get; set; }
        public string LookupSite { get; set; }
        public string LookupList { get; set; }
        public string Value { get; set; }
    }

    internal class FieldMapping
    {
        public FieldInfo Source { get; set; }
        public FieldInfo Target { get; set; }
    }

    internal class FieldMappingsFileSchema
    {
        public string SitePath { get; set; }
        public string SourceListName { get; set; }
        public string TargetTableName { get; set; }
        public string MigrationOption { get; set; }
        public string ItemIDs { get; set; }
        public List<FieldMapping> MappingsList { get; set; }
    }

    internal class FieldMappings :IEnumerable<KeyValuePair<string, FieldMapping>>
    {
        private Dictionary<string, FieldMapping> mappings;
        public string SitePath { get; set; }
        public string SourceListName { get; internal set; }
        public string TargetTableName { get; internal set; }
        public string MigrationOption { get; internal set; }
        public string ItemIDs { get; internal set; }

        public FieldMappings(string fileMapping)
        {
            mappings = new Dictionary<string, FieldMapping>();

            string jsonContent = File.ReadAllText(fileMapping);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var schemaData = JsonSerializer.Deserialize<FieldMappingsFileSchema>(jsonContent, options);
            if (schemaData != null)
            {
                SourceListName = schemaData.SourceListName;
                TargetTableName = schemaData.TargetTableName;
                SitePath = schemaData.SitePath;
                MigrationOption = schemaData.MigrationOption;
                ItemIDs = schemaData.ItemIDs;

                foreach (var mapping in schemaData.MappingsList)
                {
                    if (mapping?.Source?.FieldName != null && !mappings.ContainsKey(mapping.Source.FieldName))
                    {
                        mappings.Add(mapping.Source.FieldName, mapping);
                    }
                }
            }
            else
            {
                throw new InvalidDataException($"Could not deserialize mapping file: {fileMapping}");
            }
        }

        public static Dictionary<string, FieldMappings> GetFromFiles(string folder)
        {
            var files = System.IO.Directory.GetFiles(folder, "*.json");
            Dictionary<string, FieldMappings> retVal =  new Dictionary<string, FieldMappings>();
            foreach (var file in files)
            {
                var mapping = new FieldMappings(file);
                retVal.Add($"{mapping.SitePath}_{mapping.SourceListName}", mapping);
            }

            return retVal;
        }

        public IEnumerator<KeyValuePair<string, FieldMapping>> GetEnumerator()
        {
            return mappings.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}