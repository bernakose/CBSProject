using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Core.Interfaces.ApplicationInterfaces
{
    public interface IMailService
    {
        bool SendMail(string title, string content, string sendMailAddress);
    }
}
