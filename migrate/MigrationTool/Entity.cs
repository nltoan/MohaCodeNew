using System.Collections.Generic;

namespace MigrationTool
{
    internal class Entity
    {
        public string Source { get; set; }
        public Dictionary<string, object> Properties { get; set; }

        public Entity()
        {
            Properties = new Dictionary<string, object>();
        }
    }
}