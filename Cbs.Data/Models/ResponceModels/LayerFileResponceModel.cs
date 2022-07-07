using Cbs.Data.Entities.Application.Views;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels
{
    public class LayerFileResponceModel
    {
        public List<VLayerFile> LayerFiles { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
    }
}
