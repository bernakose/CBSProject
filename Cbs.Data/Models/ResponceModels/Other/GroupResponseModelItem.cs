using Cbs.Data.Models.Other;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels.Other
{
    public class GroupResponseModelItem
    {
        public decimal Id { get; set; }
        public string GroupName { get; set; }
        public List<decimal> UserIds { get; set; }
        public List<decimal> FunctionIds { get; set; }
        public List<TreeViewModelItem> FunctionList { get; set; } = new List<TreeViewModelItem>();
    }
}
