using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Models;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();
        public ActionResult Index()
        {
            return View("Index");
        }
        public ActionResult BaiViet(int id)
        {
            TinTuc tmp = _context.TinTucs.Where(x => x.ID == id).FirstOrDefault();
            ViewBag.Title = tmp?.TieuDe;
            ViewBag.MoTa = tmp?.MoTa;
            ViewBag.Url = Request.Path;
            ViewBag.Image = tmp?.AnhDaiDien;
            return View("Index");
        }

        public ActionResult ChuyenMuc(int id)
        {
            ChuyenMuc tmp = _context.ChuyenMucs.Where(x => x.ID == id).FirstOrDefault();
            ViewBag.Title = tmp?.TenChuyenMuc;
            ViewBag.Url = Request.Path;
            return View("Index");
        }

    }
}