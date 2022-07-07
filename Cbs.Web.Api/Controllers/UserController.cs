using Cbs.Core.DatabaseProvider;
using Cbs.Core.Interfaces.ApplicationInterfaces;
using Cbs.Core.Interfaces.UserInterfaces;
using Cbs.Data.Entities.Other.Tables;
using Cbs.Data.Entities.UserOperations;
using Cbs.Data.Models.Application;
using Cbs.Data.Models.Other;
using Cbs.Data.Models.RequestModels;
using Cbs.Data.Models.RequestModels.Other;
using Cbs.Data.Models.ResponceModels;
using Cbs.Data.Models.ResponceModels.Other;
using Cbs.Web.Api.Filters;
using Cbs.Web.Api.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VYS.CacheManager.Core;
using VYS.UtilsStandart;

namespace Cbs.Web.Api.Controllers
{
    /// <summary>
    /// User Operations
    /// </summary>
    [SwaggerTag("Any User Operations. Ie: Login, Logout, UserInfo")]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        IUserService userService { get; set; }
        ICacheManager cacheManager { get; set; }
        IDatabaseProvider db { get; set; }
        private readonly ILogger<UserController> _logger;
        public UserController(IUserService _userService, ICacheManager _cacheManager, IDatabaseProvider _db, ILogger<UserController> logger)
        {
            this._logger = logger;
            userService = _userService;
            cacheManager = _cacheManager;
            db = _db;
        }
        /// <summary>
        /// Login To System
        /// </summary>
        /// <param name="requestModel"></param>
        /// <returns></returns>

        [HttpPost("Login")]
        public LoginResponceModel Login(LoginRequestModel requestModel)
        {
            LoginResponceModel responce = new LoginResponceModel();
            try
            {
                var pass = Md5Hashing.GetMd5Hash(requestModel.Password);


                    responce = userService.Login(requestModel.Username, pass, (int)requestModel.ApplicationTypeCode);

                    if (!responce.IsException)
                    {
                        if (string.IsNullOrEmpty(responce.SessionUser.AvatarImage))
                        {
                            responce.SessionUser.AvatarImage = UserHelper.DefaultUserAvatar;
                        }

                        AppUserLoginLogout loginLogout = new AppUserLoginLogout();
                        loginLogout.AppTypeCode = (long)requestModel.ApplicationTypeCode;
                        loginLogout.ClientInfo = requestModel.ClientInfo;
                        loginLogout.LoginTime = DateTime.Now;
                        loginLogout.Username = responce.SessionUser.Username;

                        db.Context.AppUserLoginLogouts.Add(loginLogout);
                        db.Context.SaveChanges();

                        responce.SessionUser.LastLoginLogId = loginLogout.Id;

                        var userAuthTags = responce.SessionUser.AuthList.Select(a => a.AuthTag).ToList();

                        if (requestModel.UserTimeOut <= 0)
                            requestModel.UserTimeOut = 20;

                        responce.SessionUser.TimeOut = (int)requestModel.UserTimeOut;

                        var userSetting = db.Context.UserSettings.AsNoTracking().FirstOrDefault(a => a.UserId == responce.SessionUser.Id);

                        if (userSetting != null)
                        {
                            responce.SessionUser.WebCenterX = userSetting.CenterX;
                            responce.SessionUser.WebCenterY = userSetting.CenterY;
                            responce.SessionUser.WebZoom = (int)userSetting.Zoom;
                        }

                        cacheManager.Set(responce.SessionUser.SessionId, responce.SessionUser, 8765);
                    }
             


            }
            catch (Exception ex)
            {
                responce.IsException = true;
                responce.ExceptionMessage = ex.ToString();
                _logger.LogError(ex.ToString());
            }
            return responce;


        }
        private List<WebMenuResponseModelItem> FindChilds(WebMenu node, List<WebMenu> menuItems)
        {
            List<WebMenuResponseModelItem> lst = new List<WebMenuResponseModelItem>();
            if (node != null && menuItems != null)
            {
                var subMenus = menuItems.Where(a => a.ParentMenuId == node.Id).OrderBy(a => a.MenuOrder).ToList();
                if (subMenus != null && subMenus.Count > 0)
                {
                    foreach (var item in subMenus)
                    {
                        lst.Add(new WebMenuResponseModelItem()
                        {
                            AuthFunctionTag = item.AuthFunctionTag,
                            CallFunctionName = item.CallFunctionName,
                            Childs = FindChilds(item, menuItems),
                            Id = item.Id,
                            IsQueryWindow = item.IsQueryWindow == 1,
                            MenuIcon = item.MenuIcon,
                            MenuName = item.MenuName,
                            QueryServiceName = item.QueryServiceName,
                            QueryTableName = item.QueryTableName,
                            QueryUniqColumnName = item.QueryUniqColumnName,
                            QueryUniqFieldName = item.QueryUniqFieldName
                        });
                    }
                }
            }
            return lst;
        }

        /// <summary>
        /// Domain kullanıcılarını listeler
        /// </summary>
        /// <returns></returns>
        [BasicAuthFilter]
        [HttpGet("GetDomainUsers")]
        [ProducesResponseType(typeof(SessionUserModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetDomainUsers()
        {
            var data = userService.GetLdapUsers();
            return Ok(data);
        }

        /// <summary>
        /// Get User Information with Authentication
        /// </summary>
        /// <returns></returns>
        [BasicAuthFilter]
        [HttpGet("GetSessionUser")]
        [ProducesResponseType(typeof(SessionUserModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetSessionUser()
        {
            var user = UserHelper.User;
            if (user == null || user.Id <= 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(user);
            }

        }

        /// <summary>
        /// Log Off to session user
        /// </summary>
        [BasicAuthFilter]
        [HttpPost("LogOff")]
        public IActionResult LogOff()
        {
            var user = UserHelper.User;
            if (user != null && user.Id > 0)
            {
                var logonlogoff = db.Context.AppUserLoginLogouts.FirstOrDefault(a => a.Id == user.LastLoginLogId);
                if (logonlogoff != null)
                {
                    logonlogoff.LogoutTime = DateTime.Now;
                    db.Context.SaveChanges();
                }
                cacheManager.Remove(user.SessionId);
            }
            return Ok();
        }

        [BasicAuthFilter]
        [HttpGet("UserList")]
        public List<SelectListItemModel> GetUsers()
        {
            List<SelectListItemModel> lst = new List<SelectListItemModel>();

            var data = userService.GetUsers();
            foreach (var item in data)
            {
                lst.Add(new SelectListItemModel()
                {
                    Text = string.Format("{0} {1}", item.Name, item.SurName),
                    Value = item.UserId.ToString()
                });
            }

            return lst;
        }

        //[BasicAuthFilter]
        //[HttpGet("{userId}")]
        //[ProducesResponseType(typeof(UserResponseModelItem), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //public IActionResult GetUser(decimal userId)
        //{
        //    UserResponseModelItem responce = new UserResponseModelItem();

        //    var user = db.Context.VUsers.AsNoTracking().FirstOrDefault(a => a.Id == userId);
        //    if (user != null)
        //    {
        //        responce.DisplayName = user.DisplayName;
        //        responce.GroupId = user.GroupId;
        //        responce.GroupName = user.GroupName;
        //        responce.Id = user.Id;
        //        responce.IsSystemAdmin = user.IsSystemAdmin;
        //        responce.Mail = user.Mail;
        //        responce.Name = user.Name;
        //        responce.Password = user.Password;
        //        responce.Status = user.Status;
        //        responce.Surname = user.Surname;
        //        responce.Username = user.Username;
        //        responce.InputType = user.InputType;
        //        responce.AuthList = db.Context.UserFunctions.Where(a => a.UserId == user.Id).Select(a => (decimal)a.FuncId).ToList();

        //        var authList = db.Context.UserFunctions.OrderBy(a => a.FuncName).ToList();
        //        foreach (var item in authList)
        //        {
        //            if (item.FuncId == item.UpFuncId)
        //            {
        //                item.UpFuncId = 0;
        //            }
        //            responce.FunctionList.Add(new TreeViewModelItem()
        //            {
        //                id = (int)item.FuncId,
        //                isSelected = responce.AuthList.Contains((decimal)item.FuncId),
        //                parentId = (int)item.UpFuncId,
        //                text = item.FuncName
        //            });
        //        }

        //        foreach (var item in responce.FunctionList)
        //        {
        //            if (item.isSelected)
        //            {
        //                if (responce.FunctionList.Any(a => a.parentId == item.id))
        //                {
        //                    var _childCount = responce.FunctionList.Where(a => a.parentId == item.id).Count();
        //                    var _selectedChildCount = responce.FunctionList.Where(a => a.parentId == item.id && a.isSelected).Count();

        //                    if (_childCount != _selectedChildCount)
        //                    {
        //                        item.isSelected = false;
        //                    }
        //                }
        //            }
        //        }

        //        return Ok(responce);
        //    }
        //    else
        //    {
        //        return NotFound();
        //    }
        //}

        /// <summary>
        /// Add New User
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        //[BasicAuthFilter]
        //[HttpPost("AddUser")]
        //[ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //[ProducesResponseType(StatusCodes.Status409Conflict)]
        //[ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status500InternalServerError)]
        //public IActionResult AddUser(UserRequestModel model)
        //{
        //    var user = db.Context.Users.AsNoTracking().FirstOrDefault(a => a.UserName.Trim().ToLower() == model.Username.Trim().ToLower());

        //    if (user == null)
        //    {
        //        var userldap = db.Context.LdapUsers.AsNoTracking().FirstOrDefault(a => a.Username.Trim().ToLower() == model.Username.Trim().ToLower());
        //        if (userldap == null)
        //        {
        //            try
        //            {
        //                string password = BasarExtensions.GeneratePassword(6, true, true, true, false);
        //                string passwordHash = Md5Hashing.GetMd5Hash(password);

        //                user = new User();
        //                user.GroupId = (long)model.GroupId;
        //                user.IsSystemAdmin = 0;
        //                user.MailAddress = model.MailAddress;
        //                user.Password = passwordHash;
        //                user.Name = model.Name;
        //                user.Status = (long)model.Status;
        //                user.InputType = "api";
        //                user.RegisterType = "1";
        //                user.SurName = model.Surname;
        //                user.UserName = model.Username;
        //                user.AvatarImage = UserHelper.DefaultUserAvatar;

        //                db.Context.Users.Add(user);
        //                db.Context.SaveChanges();

        //                if (model.AuthList != null && model.AuthList.Count > 0)
        //                {
        //                    foreach (var item in model.AuthList)
        //                    {
        //                        UserFunctions userFunctions = new UserFunctions();
        //                        userFunctions.UserId = user.UserId;
        //                        userFunctions.FuncId = (long)item;
        //                        db.Context.UserFunctions.Add(userFunctions);
        //                        db.Context.SaveChanges();
        //                    }
        //                }
        //                string mailContent = "Your account created successfully." + Environment.NewLine + "Your username: " + user.UserName + " " + Environment.NewLine + "Your password: " + password;
        //                mailService.SendMail("TCDD Password", mailContent, user.MailAddress);

        //                BaseResponceModel response = new BaseResponceModel();
        //                response.IsSuccess = true;
        //                response.MessageCode = password;
        //                return Ok(response);
        //            }
        //            catch (Exception ex)
        //            {
        //                BaseResponceModel response = new BaseResponceModel();
        //                response.IsSuccess = false;
        //                response.Message = ex.ToString();
        //                return StatusCode(500, response);
        //            }
        //        }
        //        else
        //        {
        //            return Conflict("This username is using in LDAP table. Please change this username.");
        //        }
        //    }
        //    else
        //    {
        //        return Conflict("This username is using. Please change this username.");
        //    }
        //}

        /// <summary>
        /// Delete User
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [BasicAuthFilter]
        [HttpPost("Delete/{userId}")]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteUser(decimal userId)
        {
            try
            {
                var user = db.Context.Users.FirstOrDefault(a => a.UserId == userId);
                if (user != null)
                {
                    var userFuncs = db.Context.UserFunctions.Where(a => a.UserId == userId).ToList();
                    if (userFuncs != null && userFuncs.Count > 0)
                    {
                        db.Context.UserFunctions.RemoveRange(userFuncs);
                        db.Context.SaveChanges();
                    }

                    db.Context.Users.Remove(user);
                    db.Context.SaveChanges();
                    BaseResponceModel response = new BaseResponceModel();
                    response.IsSuccess = true;
                    response.Message = "User deleted successfully";
                    return Ok(response);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                BaseResponceModel response = new BaseResponceModel();
                response.IsSuccess = false;
                response.Message = ex.ToString();
                return StatusCode(500, response);
            }
        }

        /// <summary>
        /// Update User
        /// </summary>
        /// <param name="model"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        //[BasicAuthFilter]
        //[HttpPost("Update/{userId}")]
        //[ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //[ProducesResponseType(StatusCodes.Status409Conflict)]
        //[ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status500InternalServerError)]
        //public IActionResult UpdateUser([FromBody] UserRequestModel model, decimal userId)
        //{
        //    var user = db.Context.Users.FirstOrDefault(a => a.UserId == userId);

        //    if (user != null)
        //    {
        //        try
        //        {

        //            if (model.AuthList != null && model.AuthList.Count > 0)
        //            {
        //                var _funcs = db.Context.UserFunctions.AsNoTracking().ToList();

        //                List<decimal> lst = new List<decimal>();
        //                foreach (var item in model.AuthList)
        //                {
        //                    lst.Add(item);

        //                    var _func = _funcs.FirstOrDefault(a => a.FuncId == item);
        //                    if (_func != null)
        //                    {

        //                        if (_func.UpFuncId != 0 && !model.AuthList.Contains(_func.UpFuncId))
        //                        {
        //                            if (!lst.Contains(_func.UpFuncId))
        //                            {
        //                                lst.Add(_func.UpFuncId);
        //                            }
        //                        }
        //                    }
        //                }
        //                model.AuthList = lst;
        //            }

        //            user.GroupId = (long)model.GroupId;
        //            user.MailAddress = model.MailAddress;
        //            user.Name = model.Name;
        //            user.Status = (long)model.Status;
        //            user.SurName = model.Surname;

        //            db.Context.SaveChanges();

        //            if (model.AuthList != null && model.AuthList.Count > 0)
        //            {
        //                var functs = db.Context.UserFunctions.Where(a => a.UserId == user.UserId).ToList();
        //                if (functs != null && functs.Count > 0)
        //                {
        //                    db.Context.UserFunctions.RemoveRange(functs);
        //                    db.Context.SaveChanges();
        //                }

        //                List<UserFunctions> userFunctions = new List<UserFunctions>();
        //                foreach (var item in model.AuthList)
        //                {
        //                    userFunctions.Add(new UserFunctions()
        //                    {
        //                        FuncId = (long)item,
        //                        UserId = user.UserId
        //                    });

        //                }
        //                db.Context.UserFunctions.AddRange(userFunctions);
        //                db.Context.SaveChanges();
        //            }

        //            BaseResponceModel response = new BaseResponceModel();
        //            response.IsSuccess = true;
        //            return Ok(response);
        //        }
        //        catch (Exception ex)
        //        {
        //            BaseResponceModel response = new BaseResponceModel();
        //            response.IsSuccess = false;
        //            response.Message = ex.ToString();
        //            _logger.LogError(ex.ToString());
        //            return StatusCode(500, response);
        //        }
        //    }
        //    else
        //    {
        //        return NotFound();
        //    }
        //}

        /// <summary>
        /// Generate 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        //[BasicAuthFilter]
        //[HttpPost("GeneratePassword/{userId}")]
        //[ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //[ProducesResponseType(StatusCodes.Status409Conflict)]
        //[ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status500InternalServerError)]
        //public IActionResult GeneratePassword(decimal userId)
        //{
        //    try
        //    {
        //        string password = BasarExtensions.GeneratePassword(6, true, true, true, false);
        //        string passwordHash = Md5Hashing.GetMd5Hash(password);

        //        var user = db.Context.Users.FirstOrDefault(a => a.UserId == userId);
        //        if (user != null)
        //        {
        //            user.Password = passwordHash;
        //            db.Context.SaveChanges();

        //            string mailContent = "Your password reseted successfully." + Environment.NewLine + "Your username: " + user.UserName + " " + Environment.NewLine + "Your password: " + password;
        //            mailService.SendMail("TCDD Password", mailContent, user.MailAddress);

        //            BaseResponceModel response = new BaseResponceModel();
        //            response.IsSuccess = true;
        //            response.Message = "Password reseted.";

        //            return Ok(response);
        //        }
        //        else
        //        {
        //            return NotFound();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        BaseResponceModel response = new BaseResponceModel();
        //        response.IsSuccess = false;
        //        response.Message = ex.ToString();
        //        _logger.LogError(ex.ToString());
        //        return StatusCode(500, response);
        //    }
        //}

        /// <summary>
        /// Change Password
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        [BasicAuthFilter]
        [HttpPost("ChangePassword/{password}")]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status500InternalServerError)]
        public IActionResult ChangePassword(string password)
        {
            try
            {
                var sessionUser = UserHelper.User;

                var user = db.Context.Users.FirstOrDefault(a => a.UserId == sessionUser.Id);
                if (user != null)
                {
                    user.Password = Md5Hashing.GetMd5Hash(password);
                    db.Context.SaveChanges();

                    BaseResponceModel response = new BaseResponceModel();
                    response.IsSuccess = true;
                    response.Message = "Password changed.";

                    return Ok(response);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                BaseResponceModel response = new BaseResponceModel();
                response.IsSuccess = false;
                response.Message = ex.ToString();
                _logger.LogError(ex.ToString());
                return StatusCode(500, response);
            }
        }

        [BasicAuthFilter]
        [HttpPost("SaveWorkspace")]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status500InternalServerError)]
        public IActionResult SaveWorkspace(WorkspaceSaveRequestModel model)
        {
            try
            {
                var user = UserHelper.User;

                var userSetting = db.Context.UserSettings.FirstOrDefault(a => a.UserId == user.Id);
                if (userSetting == null)
                {
                    userSetting = new UserSetting();
                    userSetting.CenterX = model.CenterX;
                    userSetting.CenterY = model.CenterY;
                    userSetting.UserId = user.Id;
                    userSetting.Zoom = model.Zoom;

                    db.Context.UserSettings.Add(userSetting);
                    db.Context.SaveChanges();

                    if (model.LayerList != null)
                    {
                        var userLayers = db.Context.UserLayers.Where(a => a.UserId == user.Id).ToList();
                        db.Context.UserLayers.RemoveRange(userLayers);

                        db.Context.SaveChanges();

                        var addList = new List<UserLayer>();

                        foreach (var group in model.LayerList)
                        {
                            foreach (var layer in group.Layers)
                            {
                                UserLayer uLayer = new UserLayer();
                                uLayer.IsOpen = layer.IsOpen ? 1 : 0;
                                uLayer.LayerId = layer.Id;
                                uLayer.LayerOrder = layer.Order;
                                uLayer.UserId = user.Id;
                                addList.Add(uLayer);
                            }
                        }

                        db.Context.UserLayers.AddRange(addList);
                        db.Context.SaveChanges();
                    }

                    BaseResponceModel res = new BaseResponceModel();
                    res.IsSuccess = true;
                    res.Message = "";

                    return Ok(res);
                }
                else
                {
                    userSetting.CenterX = model.CenterX;
                    userSetting.CenterY = model.CenterY;
                    userSetting.UserId = user.Id;
                    userSetting.Zoom = model.Zoom;

                    db.Context.SaveChanges();

                    if (model.LayerList != null)
                    {
                        var userLayers = db.Context.UserLayers.Where(a => a.UserId == user.Id).ToList();
                        db.Context.UserLayers.RemoveRange(userLayers);

                        db.Context.SaveChanges();

                        var addList = new List<UserLayer>();

                        foreach (var group in model.LayerList)
                        {
                            foreach (var layer in group.Layers)
                            {
                                UserLayer uLayer = new UserLayer();
                                uLayer.IsOpen = layer.IsOpen ? 1 : 0;
                                uLayer.LayerId = layer.Id;
                                uLayer.LayerOrder = layer.Order;
                                uLayer.UserId = user.Id;
                                addList.Add(uLayer);
                            }
                        }

                        db.Context.UserLayers.AddRange(addList);
                        db.Context.SaveChanges();
                    }

                    BaseResponceModel res = new BaseResponceModel();
                    res.IsSuccess = true;
                    res.Message = "";

                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                BaseResponceModel res = new BaseResponceModel();
                res.IsSuccess = false;
                res.Message = ex.ToString();
                _logger.LogError(ex.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, res);

            }
        }

        [BasicAuthFilter]
        [HttpGet("Profile")]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status500InternalServerError)]
        public IActionResult GetProfileInfo()
        {
            try
            {
                UserProfileResponceModel model = new UserProfileResponceModel();
                var user = UserHelper.User;
                var userforavatar = db.Context.Users.FirstOrDefault(a => a.UserId == user.Id);
                model.AuthGroup = user.AuthGroup;
                model.Id = user.Id;
                model.MailAddress = user.MailAddress;
                model.Name = user.Name;
                model.PhoneNumber = user.PhoneNumber;
                model.Surname = user.Surname;
                model.Title = user.Title;
                model.Username = user.Username;
                //model.AvatarImage = userforavatar != null ? userforavatar.AvatarImage : user.AvatarImage;
                //model.LoginLogouts = db.Context.VAppUserLoginLogouts.AsNoTracking().Where(a => a.UserName == model.Username).OrderByDescending(a => a.Id).Take(10).ToList();
                //model.Operations = db.Context.VUserOperationLogs.AsNoTracking().Where(a => a.Username == model.Username).OrderByDescending(a => a.Id).Take(10).ToList();
                return Ok(model);
            }
            catch (Exception ex)
            {
                BaseResponceModel model = new BaseResponceModel();
                model.IsSuccess = false;
                model.Message = ex.ToString();
                _logger.LogError(ex.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, model);
            }
        }
    }
}
