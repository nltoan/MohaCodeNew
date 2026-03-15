using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using API.Models;

[Authorize]
[Route("api/VanBanDuThao_GopYs/{action}", Name = "VanBanDuThao_GopYsApi")]
public class VanBanDuThao_GopYsController : ApiController
{
    private CongTTDT_MOHAEntities _context = new CongTTDT_MOHAEntities();

    [HttpGet]
    public async Task<HttpResponseMessage> Get(DataSourceLoadOptions loadOptions)
    {
        var source = _context.VanBanDuThao_GopY.Select(i => new
        {
            i.ID,
            i.VanBanDuThaoID,
            i.HoTen,
            i.SoDienThoai,
            i.Email,
            i.DiaChi,
            i.NgayGui,
            i.NoiDung
        });

        return Request.CreateResponse(await DataSourceLoader.LoadAsync(source, loadOptions));
    }

    [HttpPost]
    public async Task<HttpResponseMessage> Post(FormDataCollection form)
    {
        var model = new VanBanDuThao_GopY();
        var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
        PopulateModel(model, values);

        Validate(model);
        if (!ModelState.IsValid)
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

        _context.VanBanDuThao_GopY.Add(model);
        await _context.SaveChangesAsync();

        return Request.CreateResponse(HttpStatusCode.Created, new { model.ID });
    }

    [HttpPut]
    public async Task<HttpResponseMessage> Put(FormDataCollection form)
    {
        var key = Convert.ToInt32(form.Get("key"));
        var model = await _context.VanBanDuThao_GopY.FirstOrDefaultAsync(item => item.ID == key);
        if (model == null) return Request.CreateResponse(HttpStatusCode.Conflict, "Object not found");

        var values = JsonConvert.DeserializeObject<IDictionary>(form.Get("values"));
        PopulateModel(model, values);

        Validate(model);
        if (!ModelState.IsValid)
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, GetFullErrorMessage(ModelState));

        await _context.SaveChangesAsync();
        return Request.CreateResponse(HttpStatusCode.OK);
    }

    [HttpDelete]
    public async Task Delete(FormDataCollection form)
    {
        var key = Convert.ToInt32(form.Get("key"));
        var model = await _context.VanBanDuThao_GopY.FirstOrDefaultAsync(item => item.ID == key);
        if (model != null)
        {
            _context.VanBanDuThao_GopY.Remove(model);
            await _context.SaveChangesAsync();
        }
    }

    private void PopulateModel(VanBanDuThao_GopY model, IDictionary values)
    {
        string VB_ID = nameof(VanBanDuThao_GopY.VanBanDuThaoID);
        string HO_TEN = nameof(VanBanDuThao_GopY.HoTen);
        string SDT = nameof(VanBanDuThao_GopY.SoDienThoai);
        string EMAIL = nameof(VanBanDuThao_GopY.Email);
        string DIA_CHI = nameof(VanBanDuThao_GopY.DiaChi);
        string NGAY_GUI = nameof(VanBanDuThao_GopY.NgayGui);
        string NOI_DUNG = nameof(VanBanDuThao_GopY.NoiDung);

        if (values.Contains(VB_ID)) model.VanBanDuThaoID = values[VB_ID] != null ? Convert.ToInt32(values[VB_ID]) : (int?)null;
        if (values.Contains(HO_TEN)) model.HoTen = Convert.ToString(values[HO_TEN]);
        if (values.Contains(SDT)) model.SoDienThoai = Convert.ToString(values[SDT]);
        if (values.Contains(EMAIL)) model.Email = Convert.ToString(values[EMAIL]);
        if (values.Contains(DIA_CHI)) model.DiaChi = Convert.ToString(values[DIA_CHI]);
        if (values.Contains(NGAY_GUI)) model.NgayGui = values[NGAY_GUI] != null ? Convert.ToDateTime(values[NGAY_GUI]) : (DateTime?)null;
        if (values.Contains(NOI_DUNG)) model.NoiDung = Convert.ToString(values[NOI_DUNG]);
    }

    private string GetFullErrorMessage(ModelStateDictionary modelState)
    {
        var messages = new List<string>();
        foreach (var entry in modelState)
            foreach (var error in entry.Value.Errors)
                messages.Add(error.ErrorMessage);
        return String.Join(" ", messages);
    }
}