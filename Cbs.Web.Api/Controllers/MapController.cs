using Cbs.Core.DatabaseProvider;
using Cbs.Data.Models.RequestModels.Other;
using Cbs.Data.Models.ResponceModels.Other;
using Cbs.Web.Api.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using VYS.UtilsStandart;

namespace Cbs.Web.Api.Controllers
{
    /// <summary>
    /// Spatial Map Operations
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {
        public IDatabaseProvider db { get; set; }
        //public ITraceService TraceService { get; set; }
        private readonly ILogger<MapController> _logger;
        public MapController(IDatabaseProvider _db, ILogger<MapController> logger/*, ITraceService _traceService*/)
        {
            this._logger = logger;
            db = _db;
            //TraceService = _traceService;
        }
        
        [BasicAuthFilter]
        [HttpPost("GetMapObjects")]
        [ProducesResponseType(typeof(List<MapZoomResponceModelItem>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetMapObjects(List<MapZoomRequestModelItem> model)
        {
            List<MapZoomResponceModelItem> lst = new List<MapZoomResponceModelItem>();
            if (model == null || model.Count <= 0)
            {
                return NotFound();
            }

            foreach (var item in model)
            {

                string sql = "";
                try
                {
                    sql = "Select st_astext((st_transform(st_geomfromtext(st_astext(\"SP_GEOMETRY\"),932634),3857))) from " + item.TableName + " where " + item.UniqColumn + "=" + item.ColumnValue;

                    DataTable result = db.Context.ExecuteDatatable(sql);
                    if (result != null && result.Rows.Count > 0)
                    {
                        for (int i = 0; i < result.Rows.Count; i++)
                        {
                            MapZoomResponceModelItem wktItem = new MapZoomResponceModelItem();
                            wktItem.ColumnValue = item.ColumnValue;
                            wktItem.TableName = item.TableName;
                            wktItem.UniqColumn = item.UniqColumn;
                            wktItem.Wkt = result.Rows[i][0].ToString();
                            lst.Add(wktItem);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.ToString() + " SQL: " + sql);
                }
            }

            return Ok(lst);
        }

        [BasicAuthFilter]
        [HttpPost("GetMapMultiObjects")]
        [ProducesResponseType(typeof(List<MapZoomMultiValResponceModelItem>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetMapMultiObjects(List<MapZoomMultiValRequestModelItem> model)
        {
            List<MapZoomMultiValResponceModelItem> lst = new List<MapZoomMultiValResponceModelItem>();
            if (model == null || model.Count <= 0)
            {
                return NotFound();
            }

            foreach (var item in model)
            {
                string sql = "";
                try
                {

                    var splitdgr = item.WhereClause.Split(',');

                    if (splitdgr.Length > 0)
                    {

                        foreach (var itemsplt in splitdgr)
                        {
                            //if (splitdgr.Length==1)
                            //{
                            //    sql = "Select st_astext((st_transform(st_geomfromtext(st_astext(\"SP_GEOMETRY\"),932634),3857))) from gis_adr_geo_building b where b.building_id in (select d.building_id from gis_adr_geo_door d where d.door_id in " + item.WhereClause;
                            //}
                            //else
                            //{
                            sql = "Select st_astext((st_transform(st_geomfromtext(st_astext(\"SP_GEOMETRY\"),932634),3857))) from " + itemsplt;
                            //}
                            DataTable result = db.Context.ExecuteDatatable(sql);
                            if (result != null && result.Rows.Count > 0)
                            {
                                for (int i = 0; i < result.Rows.Count; i++)
                                {
                                    MapZoomMultiValResponceModelItem wktItem = new MapZoomMultiValResponceModelItem();
                                    wktItem.ColumnValue = item.ColumnValue;
                                    wktItem.TableName = item.TableName;
                                    wktItem.UniqColumn = item.UniqColumn;
                                    wktItem.Wkt = result.Rows[i][0].ToString();
                                    lst.Add(wktItem);
                                }
                            }
                        }

                    }
                    else
                    {
                        return Ok(lst);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.ToString() + " SQL: " + sql);
                }
            }
            return Ok(lst);
        }

        [BasicAuthFilter]
        [HttpPost("GetMapForPDevice")]
        [ProducesResponseType(typeof(List<MapZoomResponceModelItem>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetMapForPDevice(List<MapZoomRequestModelItem> model)
        {
            List<MapZoomResponceModelItem> lst = new List<MapZoomResponceModelItem>();
            if (model == null || model.Count <= 0)
            {
                return NotFound();
            }

            foreach (var item in model)
            {
                string sql = "";
                try
                {
                    sql = "Select st_astext((st_transform(st_geomfromtext(st_astext(\"SP_GEOMETRY\"),932634),3857))) from " + item.TableName + " where " + item.UniqColumn + "=" + item.ColumnValue;

                    DataTable result = db.Context.ExecuteDatatable(sql);
                    if (result.Rows.Count == 0)
                    {
                        var tablenew = "gis_net_geo_ldevice";
                        var uniqcolnew = "ldevice_id";
                        sql = "Select st_astext((st_transform(st_geomfromtext(st_astext(\"SP_GEOMETRY\"),932634),3857))) from " + tablenew + " where " + uniqcolnew + "=" + item.ColumnValue;
                        result = db.Context.ExecuteDatatable(sql);
                    }

                    if (result != null && result.Rows.Count > 0)
                    {
                        for (int i = 0; i < result.Rows.Count; i++)
                        {
                            MapZoomResponceModelItem wktItem = new MapZoomResponceModelItem();
                            wktItem.ColumnValue = item.ColumnValue;
                            wktItem.TableName = item.TableName;
                            wktItem.UniqColumn = item.UniqColumn;
                            wktItem.Wkt = result.Rows[i][0].ToString();
                            lst.Add(wktItem);
                        }
                    }
                    else
                    {

                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.ToString() + " SQL: " + sql);
                }
            }
            return Ok(lst);
        }

        //[HttpGet("BufferValue")]
        //public long GetBufferValue()
        //{
        //    var settings = db.Context.Settings.FirstOrDefault(a => a.Name == "MAP_BUFFER").Value;

        //    return settings.ToLongCustom();
        //}

        //[BasicAuthFilter]
        //[HttpPost("NetworkTrace")]
        //[ProducesResponseType(typeof(List<MapZoomMultiValResponceModelItem>), StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //[ProducesResponseType(StatusCodes.Status500InternalServerError)]
        //public IActionResult NetworkTrace(NetworkTraceRequestModel model)
        //{
        //    List<MapZoomMultiValResponceModelItem> lst = new List<MapZoomMultiValResponceModelItem>();
        //    if (model == null)
        //    {
        //        return NotFound();
        //    }

        //    List<BasarList> traceResultItems = TraceService.AnalysRoute(model.LayerName, model.ColumnValue, model.UniqColumn, model.TraceType);

        //    foreach (var item in traceResultItems)
        //    {
        //        string sql = "";
        //        try
        //        {
        //            var whereClause = item.Text + " where " + item.ExtraValue + " = " + item.Value;

        //            sql = "Select st_astext((st_transform(st_geomfromtext(st_astext(\"SP_GEOMETRY\"),932634),3857))) from " + whereClause;
        //            DataTable result = db.Context.ExecuteDatatable(sql);
        //            if (result != null && result.Rows.Count > 0)
        //            {
        //                for (int i = 0; i < result.Rows.Count; i++)
        //                {
        //                    MapZoomMultiValResponceModelItem wktItem = new MapZoomMultiValResponceModelItem();
        //                    wktItem.ColumnValue = item.Value.ToString();
        //                    wktItem.TableName = item.Text;
        //                    wktItem.UniqColumn = item.ExtraValue;
        //                    wktItem.Wkt = result.Rows[i][0].ToString();
        //                    lst.Add(wktItem);
        //                }
        //            }
        //            else
        //            {
        //                return Ok(lst);
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            _logger.LogError(ex.ToString() + " SQL: " + sql);
        //        }
        //    }

        //    return Ok(lst);
        //}

    }
}
