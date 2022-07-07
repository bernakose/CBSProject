using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels.Other
{
    public class MapZoomMultiValResponceModelItem
    {
        public string TableName { get; set; }
        public string UniqColumn { get; set; }
        public string ColumnValue { get; set; }
        public string Wkt { get; set; }
    }
}
