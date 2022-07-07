using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.RequestModels.Other
{
    public class GroupRequestModel
    {
        public decimal GroupId { get; set; }
        public string GroupName { get; set; }
        public List<decimal> UserList { get; set; }
        public List<decimal> AuthList { get; set; }
        public bool UpdateUsers { get; set; }
    }
}
