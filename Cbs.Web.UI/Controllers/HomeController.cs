using Cbs.Data.Framework;
using Cbs.Data.Models.ResponceModels.Other;
using Cbs.Web.UI.Helpers;
using Cbs.Web.UI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cbs.Web.UI.Controllers
{
    public class HomeController : Controller
    {
        //[Authorize]
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _host;
        private static IHttpContextAccessor _httpContextAccessor;
        private static Random random = new Random();
        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment host, IHttpContextAccessor httpContextAccessor)
        {
            this._logger = logger;
            this._host = host;
            _httpContextAccessor = httpContextAccessor;
        }
        public IActionResult Index()
        {
            var name = User.Identity.Name;
            var role = User.FindFirst(claim => claim.Type == System.Security.Claims.ClaimTypes.Role)?.Value;
            if (name == null && role == null)
            {
                return RedirectToAction("Index", "Login");
            }

            _logger.LogInformation("Home Controller...");
            HomeViewModel model = new HomeViewModel();


            var client = RestHelper.GetClient("/api/QueryServiceInfo/GetSearchGrids");
            var request = RestHelper.GetRequest(Method.GET, null);

            IRestResponse response = client.Execute(request);
            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                model.GridSearchs = Newtonsoft.Json.JsonConvert.DeserializeObject<List<ServiceInfoResponceModelItem>>(response.Content);
            }
            else
            {
                model.GridSearchs = new List<ServiceInfoResponceModelItem>();
            }

            return View(model);
        }
        //public JsonResult SaveFile(List<IFormFile> postedFiles)
        //{
        //    BasarList res = new BasarList();
        //    try
        //    {
        //        res.Text = string.Empty;
        //        res.Value = false;
        //        var _user = UserHelper.GetUser();
        //        var Pth = "UploadedFolder//" + _user.Id;
        //        DirectoryInfo di = Directory.CreateDirectory(System.IO.Path.Combine(_host.WebRootPath, Pth));
        //        var file = postedFiles[0];
        //        string fileName = file.FileName;
        //        string sentFileName = RemoveDiacritics(fileName);
        //        sentFileName = RandomString(2) + DateTime.Now.ToString("mmss") + sentFileName;
        //        string savedFileName = Path.Combine(di.FullName, sentFileName);
        //        string urlToFile = _httpContextAccessor.HttpContext?.Request?.Host + "/" + Pth.Replace("//", "/") + "/" + sentFileName;
        //        if (_httpContextAccessor.HttpContext.Request.IsHttps)
        //            urlToFile = "https://" + urlToFile;
        //        else
        //            urlToFile = "http://" + urlToFile;
        //        string extensionOfFile = Path.GetExtension(savedFileName).ToUpper();
        //        bool checker = false;
        //        switch (extensionOfFile)
        //        {
        //            case ".XLS":
        //                checker = true;
        //                break;
        //            case ".XLSX":
        //                checker = true;
        //                break;
        //        }
        //        if (!checker)
        //            return Json(JsonConvert.SerializeObject(res));
        //        using (FileStream stream = new FileStream(savedFileName, FileMode.Create))
        //        {
        //            postedFiles[0].CopyTo(stream);
        //            res.Text = urlToFile;
        //            res.Value = true;
        //            res.ExtraValue = sentFileName;
        //            res.ExtraNextValue = savedFileName;
        //            return Json(JsonConvert.SerializeObject(res));
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(JsonConvert.SerializeObject(res));
        //    }
        //}
        //public JsonResult RemoveFile(string fileName)
        //{
        //    BasarList res = new BasarList();
        //    try
        //    {
        //        res.Text = string.Empty;
        //        res.Value = false;
        //        var _user = UserHelper.GetUser();
        //        var Pth = "UploadedFolder\\" + _user.Id;
        //        var dirPath = System.IO.Path.Combine(_host.WebRootPath, Pth, fileName);
        //        if (System.IO.File.Exists(dirPath))
        //        {
        //            System.IO.File.Delete(dirPath);
        //            res.Value = true;
        //        }
        //        return Json(JsonConvert.SerializeObject(res));
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(JsonConvert.SerializeObject(res));
        //    }
        //}
        //public static string RandomString(int length)
        //{
        //    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        //    return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        //}
        //public static string RemoveDiacritics(string text)
        //{
        //    System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        //    Encoding srcEncoding = Encoding.UTF8;
        //    Encoding destEncoding = Encoding.GetEncoding(1252); // Latin alphabet

        //    text = destEncoding.GetString(Encoding.Convert(srcEncoding, destEncoding, srcEncoding.GetBytes(text)));

        //    string normalizedString = text.Normalize(NormalizationForm.FormD);
        //    StringBuilder result = new StringBuilder();

        //    for (int i = 0; i < normalizedString.Length; i++)
        //    {
        //        if (!System.Globalization.CharUnicodeInfo.GetUnicodeCategory(normalizedString[i]).Equals(System.Globalization.UnicodeCategory.NonSpacingMark))
        //        {
        //            result.Append(normalizedString[i]);
        //        }
        //    }

        //    return result.ToString();
        //}

    }    
}
