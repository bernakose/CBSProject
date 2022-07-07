using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels.Other
{
    public class WebMenuResponseModelItem
    {
        public decimal Id { get; set; }
        public string MenuName { get; set; }
        public string MenuIcon { get; set; }
        public List<WebMenuResponseModelItem> Childs { get; set; } = new List<WebMenuResponseModelItem>();
        public bool IsQueryWindow { get; set; }
        public string CallFunctionName { get; set; }
        public string AuthFunctionTag { get; set; }
        public string QueryServiceName { get; set; }
        public string QueryUniqFieldName { get; set; }
        public string QueryTableName { get; set; }
        public string QueryUniqColumnName { get; set; }
    }
}
