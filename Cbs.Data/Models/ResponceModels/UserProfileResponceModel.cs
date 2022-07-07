using Cbs.Data.Models.Application;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels
{
    public class UserProfileResponceModel
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string MailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public SessionUserAuthGroupModel AuthGroup { get; set; }
        public SessionUserTitle Title { get; set; }
        //public List<VAppUserLoginLogout> LoginLogouts { get; set; }
        //public List<VUserOperationLog> Operations { get; set; }
        public string AvatarImage { get; set; }
    }
}