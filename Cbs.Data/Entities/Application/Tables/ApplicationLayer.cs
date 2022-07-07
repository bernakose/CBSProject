using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Application.Tables
{
    [Table("app_layer")]
    public class ApplicationLayer
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("layer_name")]
        public string LayerName { get; set; }
        [Column("uniq_column_name")]
        public string UniqColumnName { get; set; }
        [Column("helper_column_name")]
        public string HelperColumnName { get; set; }
        [Column("layer_image_url")]
        public string LayerImageUrl { get; set; }
        [Column("is_info")]
        public long IsInfow { get; set; }
        [Column("layer_row")]
        public long Index { get; set; }
        [Column("max_zoom")]
        public long MaxZoom { get; set; }
        [Column("min_zoom")]
        public long MinZoom { get; set; }

        [Column("group_key")]
        public string GroupKey { get; set; }
        [Column("layer_service_id")]
        public long LayerServiceId { get; set; }
        [Column("default_open_close")]
        public long? DefaultOpenClose { get; set; }
        [Column("uniq_seq_name")]
        public string UniqSeqName { get; set; }
        [Column("is_detail")]
        public long IsDetail { get; set; }
        [Column("controller_name")]
        public string ControllerName { get; set; }
        [Column("uniq_field_name")]
        public string UniqFieldName { get; set; }
        [NotMapped]
        public string UniqColumnValue { get; set; }

    }
}

