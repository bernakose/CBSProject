using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.RequestModels.Other
{
    public class MapZoomMultiValRequestModelItem
    {
        public string TableName { get; set; }
        public string UniqColumn { get; set; }
        public string ColumnValue { get; set; }
        public string WhereClause { get; set; }
    }
}
