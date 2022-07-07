using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.Application
{
    public class SessionUserAuthItemModel
    {
        public decimal AuthId { get; set; }
        public string AuthName { get; set; }
        public string AuthTag { get; set; }
        public decimal UpAuthId { get; set; }
        public string AuthTooltip { get; set; }
    }
}
