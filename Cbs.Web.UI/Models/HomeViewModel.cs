using Cbs.Data.Models.ResponceModels.Other;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cbs.Web.UI.Models
{
    public class HomeViewModel
    {
        public List<ServiceInfoResponceModelItem> GridSearchs { get; set; } = new List<ServiceInfoResponceModelItem>();

    }
}
