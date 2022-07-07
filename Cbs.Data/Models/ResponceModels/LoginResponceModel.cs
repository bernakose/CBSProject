using Cbs.Data.Models.Application;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.ResponceModels.Other
{
    public class LoginResponceModel
    {
        public SessionUserModel SessionUser { get; set; }
        public bool IsException { get; set; }
        public string ExceptionMessageCode { get; set; }
        public string ExceptionMessage { get; set; }
        public LoginResponceModel()
        {
            SessionUser = new SessionUserModel();
        }
    }
}
