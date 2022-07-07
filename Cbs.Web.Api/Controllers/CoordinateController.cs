using Cbs.Core.DatabaseProvider;
using Cbs.Web.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using VYS.CacheManager.Core;

namespace Cbs.Web.Api.Controllers
{
    //[Produces("application/json")]
    [Route("api/[controller]")]
    public class CoordinateController : ControllerBase
    {
        ICacheManager cache;
        IDatabaseProvider db { get; set; }
        private readonly ILogger<CoordinateController> _logger;

        public CoordinateController(IDatabaseProvider _db, ICacheManager _cache, ILogger<CoordinateController> logger)
        {
            this._logger = logger;
            db = _db;
            cache = _cache;
        }
        [HttpGet("GetCoordinate")]
        public CoordinateResponce GetCoordinate(string x, string y)
        {
            CoordinateResponce res = new CoordinateResponce();
            var projList = cache.Get<List<string>>("ProjectionProjJS");
            string proj = projList.First().Replace("#", "\"");
            var transformedCoordinates = new double[] { double.Parse(x.Replace(".", ",")), double.Parse(y.Replace(".", ",")) };

            if (Request.Host.Value.Contains("cbstcdd"))
            {
                res.GoogleX = x;
                res.GoogleY = y;
            }
            else
            {
                res.GoogleX = x.Replace(".", ",");
                res.GoogleY = y.Replace(".", ",");
            }

            res.DMSX = DecimalToDegrees(decimal.Parse(res.GoogleX)) + " N";
            res.DMSY = DecimalToDegrees(decimal.Parse(res.GoogleY)) + " E";
            res.GoogleUrl = "https://www.google.com/maps/@" + res.GoogleY.Replace(",", ".") + "," + res.GoogleX.Replace(",", ".") + ",21z";
            return res;
        }
        protected string DecimalToDegrees(decimal decimalValue)
        {
            try
            {
                return Convert.ToInt32(decimal.Truncate(decimalValue)) + "° " + Convert.ToInt32((decimal.Truncate(Math.Abs(decimalValue) * 60)) % 60) + "' " + Math.Round((Math.Abs(decimalValue) * 3600) % 60, 2) + "''";
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}
