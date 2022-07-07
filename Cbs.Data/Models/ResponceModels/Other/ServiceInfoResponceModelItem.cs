using Cbs.Data.Entities.Other.Tables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels.Other
{
    public class ServiceInfoResponceModelItem
    {
        public string EntityName { get; set; }
        public string Namespace { get; set; }
        public List<AppFormJson> Properties { get; set; } = new List<AppFormJson>();
        public string KeyField { get; set; }
        public string ServiceName { get; set; }
        public decimal AppTypeId { get; set; } = 1;
        public bool IsDbObject { get; set; } = false;
        public string ShowOnMapBtn { get; set; }
        public string ShowOpenSearchBtn { get; set; }
        public string TableNameBtn { get; set; }
        public string UnqColNameBtn { get; set; }
        public string UnqFieldNameBtn { get; set; }
        public string ShowWhereClause { get; set; }
        public string SearchTable { get; set; }
        public string HelperCol { get; set; }
        public string HelperColSubscrb { get; set; }
        public string HelperColUser { get; set; }
    }
}
