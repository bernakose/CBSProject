using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cbs.Web.Api.Models
{
    public class CoordinateResponce
    {
        public string GoogleX { get; set; }
        public string GoogleY { get; set; }
        public string DMSX { get; set; }
        public string DMSY { get; set; }
        public string GoogleUrl { get; set; }
    }
}
