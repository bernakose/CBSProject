using Cbs.Data.Entities.UserOperations;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Core
{
    public class SessionUser
    {
        public static User _sessionUser { get; set; }
        public static string ApplicationName { get; set; }
    }
}
