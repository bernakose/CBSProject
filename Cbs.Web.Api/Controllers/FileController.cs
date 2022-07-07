using Cbs.Core.Interfaces.ApplicationInterfaces;
using Cbs.Data.Models.Application;
using Cbs.Data.Models.ResponceModels;
using Cbs.Web.Api.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VYS.UtilsStandart;

namespace Cbs.Web.Api.Controllers
{
    [BasicAuthFilter]
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private ILayerFileService layerFileService { get; set; }
        public FileController(ILayerFileService _layerFileService)
        {
            layerFileService = _layerFileService;
        }
        /// <summary>
        /// Katmanlara dosya yüklemek için kullanılmaktadır.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("UploadFile")]
        public IActionResult UploadFile(FileModel file)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    StringBuilder errors = new StringBuilder();
                    int sayac = 0;
                    foreach (var item in ModelState.Values.ToList())
                    {
                        if (item.Errors.Count != 0)
                        {
                            sayac++;
                            errors.Append(sayac);
                            errors.Append(") ");
                            errors.Append(item.Errors[0].Exception);
                        }
                    }
                    return BadRequest(errors.ToString());
                }
                var responce = layerFileService.UploadFile(file);
                return Ok(responce);
            }
            catch (Exception ex)
            {
                BaseResponceModel r = new BaseResponceModel();
                r.Message = ex.ToString();
                r.IsSuccess = false;
                return StatusCode(500, r);
            }
        }


        /// <summary>
        /// Katmanlara ait dosyaları getirmek için kullanılmaktadır.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetFiles")]
        [ProducesResponseType(typeof(BaseResponceModel), StatusCodes.Status500InternalServerError)]
        public IActionResult GetFiles(string layerName, long recordId)
        {
            try
            {
                var responce = layerFileService.GetFiles(layerName, recordId);
                return Ok(responce);
            }
            catch (Exception ex)
            {
                BaseResponceModel r = new BaseResponceModel();
                r.Message = ex.ToString();
                r.IsSuccess = false;
                return StatusCode(500, r);
            }
        }

        /// <summary>
        /// Katmanlara ait dosyayı silmek için kullanılmaktadır.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("DeleteFile")]
        public IActionResult DeleteFile(long id)
        {
            try
            {
                var responce = layerFileService.DeleteFile(id);
                return Ok(responce);
            }
            catch (Exception ex)
            {
                BaseResponceModel r = new BaseResponceModel();
                r.Message = ex.ToString();
                r.IsSuccess = false;
                return StatusCode(500, r);
            }
        }
        /// <summary>
        /// Katmanlara ait dosyaları getirmek için kullanılmaktadır.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetFilesWithModel")]
        public IActionResult GetFilesWithModel(string layerName, long recordId)
        {
            try
            {
                var responce = layerFileService.GetFiles(layerName, recordId).LayerFiles.Select(a => new
                {
                    name = a.FileName,
                    dateModified = a.Date,
                    isDirectory = false,
                    hasSubDirectories = false,
                    id = a.Id,
                    fileType = a.Extension,
                    filePath = a.FilePath + "/" + a.FileName,
                    downloadUrl = a.DownloadUrl,
                    customSize = a.Size,
                    explanation = a.Explanation
                });

                return Ok(responce);
            }
            catch (Exception ex)
            {
                BaseResponceModel r = new BaseResponceModel();
                r.Message = ex.ToString();
                r.IsSuccess = false;
                return StatusCode(500, r);
            }
        }

        //[HttpPost("UploadFiles")]
        //public async System.Threading.Tasks.Task<IActionResult> Post(System.Collections.Generic.List<IFormFile> files)
        //{
        //    long size = files.Sum(f => f.Length);

        //    // full path to file in temp location
        //    var filePath = System.IO.Path.GetTempFileName();

        //    foreach (var formFile in files)
        //    {
        //        if (formFile.Length > 0)
        //        {
        //            using (var stream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
        //            {
        //                await formFile.CopyToAsync(stream);
        //            }
        //        }
        //    }

        //    // process uploaded files
        //    // Don't rely on or trust the FileName property without validation.

        //    return Ok(new { count = files.Count, size, filePath });
        //}
        /// <summary>
        /// Web uygulamasından dosya yüklenirken kullanılır, request içindeki dosyaları parametrede gönderilen bilgilerle kaydeder.
        /// </summary>
        /// <param name="layerName"></param>
        /// <param name="recordId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpPost("FileUploadWithoutModel")]
        public ActionResult FileUpload(string layerName, string recordId, string userId, string explanation)
        {
            BaseResponceModel responce = new BaseResponceModel();
            try
            {
                var httpCtx = this.HttpContext;

                var files = httpCtx.Request.Form.Files;

                foreach (FormFile fileItem in files)
                {
                    if (fileItem.Length > -1)
                    {
                        using (var ms = new MemoryStream())
                        {
                            fileItem.CopyTo(ms);
                            var fileBytes = ms.ToArray();

                            FileModel file = new FileModel();
                            file.FileName = fileItem.FileName;
                            file.Source = fileBytes;
                            file.Date = DateTime.Now;
                            file.Extension = Path.GetExtension(fileItem.FileName);
                            file.FilePath = layerName + "/" + recordId;
                            file.LayerName = layerName;
                            file.RecordId = recordId.ToLongCustom();
                            file.UserId = userId.ToLongCustom();
                            file.Aciklama = explanation;

                            StringBuilder errors = new StringBuilder();
                            int sayac = 0;
                            foreach (var item in ModelState.Values.ToList())
                            {
                                if (item.Errors.Count != 0)
                                {
                                    sayac++;
                                    errors.Append(sayac);
                                    errors.Append(") ");
                                    errors.Append(item.Errors[0].Exception);
                                }
                            }

                            responce = layerFileService.UploadFile(file);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                BaseResponceModel r = new BaseResponceModel();
                r.Message = ex.ToString();
                r.IsSuccess = false;
                return StatusCode(500, r);
            }

            return Ok(responce);
        }

        [HttpGet("DownloadFile")]
        public IActionResult GetBlobDownload(long fileId, string fileName)
        {
            byte[] fileBytes = System.IO.File.ReadAllBytes(layerFileService.GetServerPathFile(fileId));

            return File(fileBytes, "application/force-download", fileName);
        }

        [HttpGet("FileNameControl")]
        public IActionResult FileNameControl(string layerName, long recordId, string fileName)
        {
            try
            {
                if (layerFileService.FileNameDuplicateControl(layerName, recordId, fileName))
                    return StatusCode(StatusCodes.Status409Conflict);
                else
                    return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                BaseResponceModel r = new BaseResponceModel();
                r.Message = ex.ToString();
                r.IsSuccess = false;
                return StatusCode(500, r);
            }
        }
    }
}
