using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "baiviet",
                url: "baiviet/{id}",
                defaults: new { controller = "Home", action = "BaiViet", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "topic",
                url: "topic/{id}",
                defaults: new { controller = "Home", action = "BaiViet", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "chuyenmuc",
                url: "chuyenmuc/{id}",
                defaults: new { controller = "Home", action = "ChuyenMuc", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "category",
                url: "category/{id}",
                defaults: new { controller = "Home", action = "ChuyenMuc", id = UrlParameter.Optional }
            );
            routes.MapRoute("RouteName", "{*url}", new { controller = "Home", action = "Index" });

        }
    }
}
