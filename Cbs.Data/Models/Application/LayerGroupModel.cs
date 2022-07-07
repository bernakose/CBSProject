using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.Application
{
    public class LayerGroupModel
    {
        public string GroupName { get; set; }
        public long Id { get; set; }
        public List<LayerItemModel> Layers { get; set; }
        public string GroupKey { get; set; }
        public LayerGroupModel()
        {
            Layers = new List<LayerItemModel>();
        }
    }
}
