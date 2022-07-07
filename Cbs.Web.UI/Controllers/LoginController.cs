using Cbs.Data.Framework;
using Cbs.Web.UI.Helpers;
using Cbs.Web.UI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cbs.Web.UI.Controllers
{
    public class LoginController : Controller
    {
        private readonly IHttpContextAccessor _accessor;
        private ISession _session => _accessor.HttpContext.Session;
        private readonly ILogger<LoginController> _logger;
        public LoginController(IHttpContextAccessor accessor, ILogger<LoginController> logger)
        {
            _accessor = accessor;
            this._logger = logger;
        }
        public IActionResult Index()
        {
            _logger.LogInformation("Login Start...");
            LoginViewModel model = new LoginViewModel(AppHelper.SelectedLanguageKey);
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return View(model);
        }
        [HttpPost]
        public IActionResult Index(LoginViewModel model)
        {
            ClaimsIdentity identity = null;

            string clientInfo = "";

            clientInfo = "IP: " + _accessor.HttpContext.Connection.RemoteIpAddress.ToString() + ", " + Environment.NewLine;
            clientInfo += "Browser: " + (Request.Headers.Keys.Contains("User-Agent") ? Request.Headers["User-Agent"][0] : "Unknown");

            var responce = UserHelper.Login(model.Username, model.Password, clientInfo, 20);

            if (responce.IsException)
            {
                model.Messages = new List<string>();
                model.Messages.Add(responce.ExceptionMessage);
            }
            else
            {
                
                    _logger.LogInformation("Responce.IsException: " + responce.IsException);
                    _logger.LogInformation("Responce.ExceptionMessage: " + responce.ExceptionMessage);
                    _logger.LogInformation("Responce.ExceptionMessageCode: " + responce.ExceptionMessageCode);

                    //_session.SetString("LogonUser", responce.SessionUser.SessionId);

                    identity = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.Name, responce.SessionUser.Username),
                        new Claim(ClaimTypes.SerialNumber,responce.SessionUser.SessionId),
                        //new Claim(ClaimTypes.UserData,JsonConvert.SerializeObject(responce.SessionUser)),
                        new Claim(ClaimTypes.Role, responce.SessionUser.IsSystemAdmin ? nameof(ProfileForCookie.Admin) : nameof(ProfileForCookie.User))
                    },
                    CookieAuthenticationDefaults.AuthenticationScheme
                    );


                    var login = HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                                                        new ClaimsPrincipal(identity),
                                                        new AuthenticationProperties
                                                        {
                                                            AllowRefresh = true,
                                                            IssuedUtc = DateTime.Now,
                                                            ExpiresUtc = DateTime.UtcNow.AddDays(365),
                                                            IsPersistent = true
                                                        });




                    return RedirectToAction("Index", "Home");
             


            }
            return View(model);
        }
        public IActionResult LogOut()
        {
            UserHelper.LogOut();
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return RedirectToAction("Index");
        }

    }
}
