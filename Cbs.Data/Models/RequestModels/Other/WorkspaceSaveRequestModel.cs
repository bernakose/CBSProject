using Cbs.Data.Models.Application;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models.RequestModels.Other
{
    /// <summary>
    /// Workspace save settings
    /// </summary>
    public class WorkspaceSaveRequestModel
    {
        /// <summary>
        /// Zoom
        /// </summary>
        public decimal Zoom { get; set; }
        /// <summary>
        /// Map Center X
        /// </summary>
        public decimal CenterX { get; set; }
        /// <summary>
        /// Map Center Y
        /// </summary>
        public decimal CenterY { get; set; }
        /// <summary>
        /// Layer Order List
        /// </summary>
        public List<LayerGroupModel> LayerList { get; set; }
    }
}
