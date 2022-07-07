using Cbs.Data.Entities.Application.Tables;
using Cbs.Data.Entities.Application.Views;
using Cbs.Data.Models.Application;
using Cbs.Data.Models.ResponceModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Cbs.Core.Interfaces.ApplicationInterfaces
{
    public interface ILayerFileService
    {
        BaseResponceModel UploadFile(FileModel file);
        LayerFileResponceModel GetFiles(string layerName, long recordId);
        BaseResponceModel DeleteFile(long id);
        bool Delete(LayerFile layerFile);
        LayerFile Get(long id);
        string DownloadFile(long id, string targetPath);
        bool IsServerData(string tableName, string dbPKColunmName, long Id);
        IQueryable<VLayerFile> GetViewDatas();
        string GetServerPathFile(long id);
        bool FileNameDuplicateControl(string layerName, long recordId, string fileName);
    }
}
