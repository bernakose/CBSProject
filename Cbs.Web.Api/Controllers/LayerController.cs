using Cbs.Core.DatabaseProvider;
using Cbs.Data.Entities.Address.Tables;
using Cbs.Data.Entities.Application.Views;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cbs.Web.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LayerController : ControllerBase
    {
        public IDatabaseProvider db { get; set; }
        private readonly ILogger<LayerController> _logger;
        public LayerController(IDatabaseProvider _db, ILogger<LayerController> logger)
        {
            this._logger = logger;
            db = _db;
        }
        /// <summary>
        /// Returning Base Layers
        /// </summary>
        /// <returns></returns>
        [HttpGet("BaseLayers")]
        public List<VApplicationBaseLayer> GetBaseLayers()
        {
            return db.Context.VApplicationBaseLayers.AsNoTracking().ToList();
        }
        /// <summary>
        /// Returning Base Layers With Language Key
        /// </summary>
        /// <param name="languageKey"></param>
        /// <returns></returns>

        [HttpGet("BaseLayers/{languageKey}")]
        public List<VApplicationBaseLayer> GetBaseLayers(string languageKey)
        {
            return db.Context.VApplicationBaseLayers.AsNoTracking().Where(a => a.LangguageShortName == languageKey).ToList();
        }

        [HttpGet("DoorsBuildings/{buildingid}")]
        public Building DoorsBuildings(long buildingid)
        {
            return db.Context.Buildings.FirstOrDefault(a => a.BuildingId == buildingid);
        }

        [HttpGet("GetOLT/{splitterid}")]
        public string GetOLT(long splitterid)
        {
            var splitterolt = db.Context.SplitterOlts.FirstOrDefault(a => a.SplitterId == splitterid);
            if (splitterolt != null)
            {
                var olt = db.Context.Olts.FirstOrDefault(a => a.OltId == splitterolt.OltId);
                if (olt != null)
                    return "1#" + olt.OltId.ToString();
            }
            return "0#";
        }
    }
}
