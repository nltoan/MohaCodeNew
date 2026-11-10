using DevExtreme.AspNet.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Text.RegularExpressions;

namespace API.Models
{
    public static class Utils
    {
        public static bool isArray(object aFilter)
        {
            if (aFilter is Newtonsoft.Json.Linq.JArray)
            {
                return true;
            }
            return false;
        }

        public static void nomArray(IList list)
        {
            var isPreArray = false;
            for (int i = 0; i < list.Count; i++)
            {
                var aFilter = list[i];
                if(isPreArray && Utils.isArray(aFilter))
                {
                    list.Insert(i, "and");
                }
                if (aFilter is Newtonsoft.Json.Linq.JArray)
                {
                    isPreArray = true;
                }
                else
                {
                    isPreArray = false;
                }
            }
        }

        // Ten cot/selector tu client chi duoc la dinh danh don gian; gia tri duoc nhan doi dau nhay don.
        private static readonly Regex SafeIdentifier = new Regex(@"^[A-Za-z_][A-Za-z0-9_]*$", RegexOptions.CultureInvariant);
        private static readonly string[] ComparisonOperators = { "=", "<>", "<", ">", "<=", ">=" };

        private static string SafeColumn(string name)
        {
            if (name == null || !SafeIdentifier.IsMatch(name)) throw new ArgumentException("Invalid field name in load options.");
            return name;
        }

        private static string SqlLiteral(string value)
        {
            return (value ?? "").Replace("'", "''");
        }

        public static string GetQuery(IList data)
        {
            var retStr = "";
            Utils.nomArray(data);
            var isNestedArr = false;
            for (int i = 0; i < data.Count; i++)
            {
                if (Utils.isArray(data[i]))
                {
                    isNestedArr = true;
                    break;
                }
            }

            if (!isNestedArr && data.Count == 3)
            {
                var first = SafeColumn(Convert.ToString(data[0]));
                var middle = Convert.ToString(data[1]);
                var second = SqlLiteral(Convert.ToString(data[2]));
                if (middle == "contains") {
                    return string.Format(" LOWER(ttttmp1.{0}) like LOWER(N'%{1}%') ", first, second);
                }
                if (middle == "startswith")
                {
                    return string.Format(" LOWER(ttttmp1.{0}) like LOWER(N'{1}%') ", first, second);
                }
                if (middle == "endswith")
                {
                    return string.Format(" LOWER(ttttmp1.{0}) like LOWER(N'%{1}') ", first, second);
                }
                if (middle == "notcontains")
                {
                    return string.Format(" LOWER(ttttmp1.{0}) NOT like LOWER(N'%{1}%') ", first, second);
                }
                if (data[2] == null &&  middle == "="){
                    return "ttttmp1."+first + " is null ";
                }
                if (data[2] == null &&  middle == "<>"){
                    return "ttttmp1." + first + " is not null ";
                }
                if (middle == "<>"){
                    return " (ttttmp1." + first + " <> '" + second + "' OR ttttmp1." + first + " IS NULL) ";
                }
                if (!ComparisonOperators.Contains(middle)) throw new ArgumentException("Unsupported filter operator.");
                return string.Format(" ttttmp1.{0} {1} '{2}' ", first, middle,second);
            }
            // dump($data);
            for (int i = 0; i < data.Count; i++)
            {
                if (Utils.isArray(data[i]))
                {
                    var aList = ((JArray)data[i]).ToObject<List<object>>();
                    retStr += "("+Utils.GetQuery(aList) +")";
                }
                else
                {
                    var connector = Convert.ToString(data[i]).Trim().ToLowerInvariant();
                    if (connector == "!") connector = "not";
                    if (connector != "and" && connector != "or" && connector != "not") throw new ArgumentException("Unsupported filter connector.");
                    retStr += " " + connector + " ";
                }
            }

            return retStr;
        }

        public static object DatasourceLoaderRawQuery(this DbContext dbContext, string query, Dictionary<string, object> parameters, DataSourceLoadOptions loadOptions)
        {
            var condition = "";
            if (loadOptions.Filter != null && loadOptions.Filter.Count > 0)
            {
                var filterCondition = Utils.GetQuery(loadOptions.Filter);
                condition += " and " + filterCondition + " ";
            }
            var tmpQuery = string.Format("select * from ( {0} ) ttttmp1 where 1=1 {1}", query, condition);

            var sqlCount = String.Format(@"select count(*) as Total from (" + tmpQuery + ") ttttmpCount1");
            if(loadOptions.Group != null)
            {
                var aGroup = loadOptions.Group[0];
                SafeColumn(aGroup.Selector);
                var groupBy = string.Format(" GROUP BY {0} ORDER BY {1} {2} ", aGroup.Selector, aGroup.Selector, (aGroup.Desc == true)?" desc ": " asc ");


                tmpQuery = string.Format("select  *  from ( {0} ) ttttmp1 where 1=1 {1}", query, condition);
                if (aGroup.IsExpanded == false)
                {
                    tmpQuery = string.Format("select  DISTINCT {0}  as [key] from ( {1} ) ttttmp1 where 1=1 {2}", aGroup.Selector, query, condition);
                }

                sqlCount = String.Format(@"select count(*) as Total from (" + tmpQuery + string.Format(" GROUP BY {0} ", aGroup.Selector) + ") ttttmpCount1");
                tmpQuery += groupBy;

                tmpQuery += " OFFSET " + loadOptions.Skip + " ROWS ";
                if (loadOptions.Take > 0)
                {
                    tmpQuery += "FETCH NEXT " + loadOptions.Take + " ROWS ONLY ";
                }
                var sql2 = tmpQuery;

                var total2 = dbContext.CollectionFromSql(sqlCount, parameters).Select(x => x.Total).FirstOrDefault();
                var datas2 = dbContext.CollectionFromSql(sql2, parameters).ToList();
                return new
                {
                    data = datas2,
                    totalCount = total2
                };
            }
            if (loadOptions.Sort != null && loadOptions.Sort.Count() > 0)
            {
                tmpQuery += " ORDER BY ";
                for (int i = 0; i < loadOptions.Sort.Count(); i++)
                {
                    var aOption = loadOptions.Sort[i];
                    if (i > 0)
                    {
                        tmpQuery += ",";
                    }
                    tmpQuery += SafeColumn(aOption.Selector) + (aOption.Desc ? " desc " : " asc ");
                }
            }
            else
            {
                tmpQuery += " ORDER BY ID desc ";
            }
            tmpQuery += " OFFSET " + loadOptions.Skip + " ROWS ";
            if (loadOptions.Take > 0)
            {
                tmpQuery += "FETCH NEXT " + loadOptions.Take + " ROWS ONLY ";
            }
            
            var sql = tmpQuery;

            var total = dbContext.CollectionFromSql(sqlCount, parameters).Select(x => x.Total).FirstOrDefault();
            var datas = dbContext.CollectionFromSql(sql, parameters).ToList();
            return new
            {
                data = datas,
                totalCount = total
            };
        }

        public static IEnumerable<dynamic> CollectionFromSql(this DbContext dbContext, string Sql, Dictionary<string, object> Parameters)
        {
            using (var cmd = dbContext.Database.Connection.CreateCommand())
            {
                cmd.CommandText = Sql;
                bool wasOpen = cmd.Connection.State == ConnectionState.Open;
                if (!wasOpen) cmd.Connection.Open();
                try
                {
                    foreach (KeyValuePair<string, object> param in Parameters)
                    {
                        DbParameter dbParameter = cmd.CreateParameter();
                        dbParameter.ParameterName = param.Key;
                        dbParameter.Value = param.Value;
                        cmd.Parameters.Add(dbParameter);
                    }

                    //var retObject = new List<dynamic>();
                    using (var dataReader = cmd.ExecuteReader())
                    {

                        while (dataReader.Read())
                        {
                            var dataRow = GetDataRow(dataReader);
                            yield return dataRow;

                        }
                    }
                }
                finally
                {
                    if (!wasOpen) cmd.Connection.Close();
                }
            }
        }

        private static dynamic GetDataRow(DbDataReader dataReader)
        {
            var dataRow = new ExpandoObject() as IDictionary<string, object>;
            for (var fieldCount = 0; fieldCount < dataReader.FieldCount; fieldCount++)
                dataRow.Add(dataReader.GetName(fieldCount), dataReader[fieldCount]);
            return dataRow;
        }
    }
}