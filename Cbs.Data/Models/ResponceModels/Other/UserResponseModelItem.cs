using Cbs.Data.Models.Other;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels.Other
{
    public class UserResponseModelItem
    {
        public decimal Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string DisplayName { get; set; }
        public string Mail { get; set; }
        public string Password { get; set; }
        public decimal GroupId { get; set; }
        public string GroupName { get; set; }
        public string InputType { get; set; }
        public decimal Status { get; set; }
        public decimal IsSystemAdmin { get; set; }
        public List<decimal> AuthList { get; set; }
        public List<TreeViewModelItem> FunctionList { get; set; } = new List<TreeViewModelItem>();
    }
}
