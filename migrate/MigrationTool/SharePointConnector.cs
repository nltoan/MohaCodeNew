using Microsoft.SharePoint;
using Microsoft.SharePoint.Administration;
using Microsoft.SharePoint.BusinessData.Runtime;
using Microsoft.SharePoint.Utilities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Security.Policy;

namespace MigrationTool
{
    internal class SharePointConnector : IDisposable
    {
        public string SiteUrl { get; internal set; }
        public SPSite Site { get; internal set; }

        public SharePointConnector(string siteUrl)
        {
            SiteUrl = siteUrl;

            //SPWebApplication webApplication = SPWebApplication.Lookup(new Uri(SiteUrl));
            //var a = webApplication.Sites;
            Site = new SPSite(SiteUrl);
           
        }

        public List<int> GetAllItemIds(SPList list)
        {
            try
            {
                List<int> allItemIds = new List<int>();

                if (list != null)
                {
                    SPQuery query = new SPQuery();
                    query.ViewFields = "<FieldRef Name='ID' />";
                    query.RowLimit = 1000;

                    string listItemCollectionPositionNext = null;

                    if(ConfigurationManager.AppSettings["ModifiedDateToFilter"] != null && !string.IsNullOrEmpty(ConfigurationManager.AppSettings["ModifiedDateToFilter"]))
                    {
                        string dateToFilter = ConfigurationManager.AppSettings["ModifiedDateToFilter"];
                        if (DateTime.TryParseExact(dateToFilter, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
                        {
                            string isoDate = SPUtility.CreateISO8601DateTimeFromSystemDateTime(date);

                            query.Query = $@"
                                               <Where>
                                                  <Geq>
                                                     <FieldRef Name='Modified' />
                                                     <Value IncludeTimeValue='FALSE' Type='DateTime'>{isoDate}</Value>
                                                  </Geq>
                                               </Where>";
                        }
                    }

                    do
                    {
                        query.ListItemCollectionPosition = listItemCollectionPositionNext != null ? new SPListItemCollectionPosition(listItemCollectionPositionNext) : null;
                        SPListItemCollection items = list.GetItems(query);
                        listItemCollectionPositionNext = items.ListItemCollectionPosition != null ? items.ListItemCollectionPosition.PagingInfo : null;
                        foreach (SPListItem item in items)
                        {
                            allItemIds.Add(item.ID);
                        }

                    } while (listItemCollectionPositionNext != null);
                }

                return allItemIds;
            }
            catch (Exception ex)
            {
                Logger.Error("GetAllItemIds", ex);
            }
            return null;
        }

        public void DownloadFiles(string relativeFolderPath, string downloadFolderPath)
        {
            try
            {
                string webRelativeUrl = relativeFolderPath.Substring(0, relativeFolderPath.LastIndexOf("/Lists/"));
                using(SPWeb web = Site.OpenWeb(webRelativeUrl)) 
                {
                    SPFolder folder = web.GetFolder(relativeFolderPath);
                    if (folder != null && folder.Exists)
                    {
                        foreach (SPFile file in folder.Files)
                        {
                            string downloadFilePath = System.IO.Path.Combine(downloadFolderPath, file.Name);
                            var contents = file.OpenBinary();
                            System.IO.File.WriteAllBytes(downloadFilePath, contents);
                            Logger.Info($"Downloaded file: {downloadFilePath}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error("DownloadFiles", ex);
            }
        }

        public void Dispose()
        {
            if(Site != null)
            {
                Site.Dispose(); 
            }
        }
    }
}
