using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.RequestModels.Other
{
    public class UserRequestModel
    {
        public decimal Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string MailAddress { get; set; }
        public decimal GroupId { get; set; }
        public decimal Status { get; set; }
        public List<decimal> AuthList { get; set; }
    }
}
