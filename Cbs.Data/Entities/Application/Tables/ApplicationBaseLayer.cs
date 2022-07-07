using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Application.Tables
{
    [Table("app_base_layer")]
    public class ApplicationBaseLayer
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("layer_name")]
        public string LayerName { get; set; }
        [Column("image_name")]
        public string ImageName { get; set; }
        [Column("is_tile_server")]
        public int IsTileServer { get; set; }
        [Column("application_type_id")]
        public long ApplicationTypeId { get; set; }
        [Column("directory")]
        public string Directory { get; set; }
        [Column("cross_orign")]
        public string CrossOrign { get; set; }
        [Column("map_key")]
        public string MapKey { get; set; }
        [Column("is_default_layer")]
        public long IsDefaultLayer { get; set; }
        [Column("sira")]
        public long Sira { get; set; }
        public virtual ApplicationType AppType { get; set; }
        public ApplicationBaseLayer Copy()
        {
            return (ApplicationBaseLayer)this.MemberwiseClone();
        }
    }
}
