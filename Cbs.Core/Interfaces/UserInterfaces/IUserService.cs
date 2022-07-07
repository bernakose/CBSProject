using Cbs.Data.Entities.UserOperations;
using Cbs.Data.Models.Application;
using Cbs.Data.Models.RequestModels.Other;
using Cbs.Data.Models.ResponceModels.Other;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Core.Interfaces.UserInterfaces
{
    public interface IUserService
    {
        List<LdapUser> GetLdapUsers();
        LoginResponceModel Login(string username, string password, int applicationTypeCode);
        List<User> GetUsers();

    }
}
