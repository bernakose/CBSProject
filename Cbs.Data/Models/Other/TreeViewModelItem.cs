using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.Other
{
    public class TreeViewModelItem
    {
        public int id { get; set; }
        public string text { get; set; }
        public int parentId { get; set; }
        public bool isSelected { get; set; }
    }
}
