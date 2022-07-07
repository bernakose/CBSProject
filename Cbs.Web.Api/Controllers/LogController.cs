using Cbs.Core.DatabaseProvider;
using Cbs.Data.Entities.Application.Tables;
using Cbs.Data.Entities.Other;
using Cbs.Web.Api.Filters;
using Cbs.Web.Api.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cbs.Web.Api.Controllers
{
    [BasicAuthFilter]
    [Route("api/[controller]")]
    [ApiController]
    public class LogController : ControllerBase
    {
        IDatabaseProvider db { get; set; }
        private readonly ILogger<LogController> _logger;
        public LogController(IDatabaseProvider _db, ILogger<LogController> logger)
        {
            db = _db;
            _logger = logger;
        }

        [HttpGet("AppOperations")]
        public List<AppOperationLanguage> GetAppOperation()
        {
            List<AppOperationLanguage> data = db.Context.AppOperationLanguages.AsNoTracking().ToList();
            return data;
        }

        [HttpGet("AppOperations/{langId}")]
        public List<AppOperationLanguage> GetAppOperation(decimal langId)
        {
            List<AppOperationLanguage> data = db.Context.AppOperationLanguages.AsNoTracking().Where(a => a.LanguageId == langId).ToList();
            return data;
        }

        [HttpPost("WriteLog")]
        [ProducesResponseType(typeof(List<LogHelperModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult WriteLog(List<LogHelperModel> model)
        {
            try
            {
                foreach (var item in model)
                {
                    var user = UserHelper.User;

                    AppUserOperationLog log = new AppUserOperationLog();
                    log.AppOperationId = Convert.ToInt64(item.operationId);
                    log.OperationContent = item.content;
                    log.OperationDate = DateTime.Now;
                    log.OperationTitle = item.title;
                    log.UserName = user.Username;

                    db.Context.AppUserOperationLogs.Add(log);
                    db.Context.SaveChanges();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());

                return StatusCode(500, ex.ToString());
            }
        }
    }
}