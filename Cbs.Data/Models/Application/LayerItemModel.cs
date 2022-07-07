using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.Application
{
    public class LayerItemModel
    {
        public long Id { get; set; }
        public string LayerName { get; set; }
        public string WorkspaceName { get; set; }
        public bool IsDefaultOpen { get; set; }
        public string LayerTitle { get; set; }
        public string Url { get; set; }
        public long Order { get; set; } = 0;
        /// <summary>
        /// Uygulama çalışma anında açık olup olmadığı bilgisi tutulacak
        /// </summary>
        public bool IsOpen { get; set; }
    }
}
