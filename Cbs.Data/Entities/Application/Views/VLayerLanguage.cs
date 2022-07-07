using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Application.Views
{
    [Table("v_app_layer_language")]
    public class VLayerLanguage
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("layer_id")]
        public long LayerId { get; set; }
        [Column("layer_title_name")]
        public string LayerTitleName { get; set; }
        [Column("language_id")]
        public long LanguageCode { get; set; }
        [Column("layer_name")]
        public string LayerName { get; set; }
        [Column("group_id")]
        public long GroupId { get; set; }
        [Column("layer_group_name")]
        public string GroupName { get; set; }
        [Column("uniq_column_name")]
        public string UniqColumnName { get; set; }
        [Column("helper_column_name")]
        public string HelperColumnName { get; set; }
        [Column("is_info")]
        public long BilgiAlinacakMi { get; set; }
        [Column("layer_row")]
        public long KatmanSira { get; set; }
        [Column("layer_image_url")]
        public string LayerImageUrl { get; set; }
        [Column("max_zoom")]
        public long MaxZoom { get; set; }
        [Column("min_zoom")]
        public long MinZoom { get; set; }
        [Column("sequence_name")]
        public string SeqName { get; set; }
        [Column("application_type_id")]
        public long ApplicationTypeCode { get; set; }
        [Column("application_type_name")]
        public string ApplicationTypeName { get; set; }
        [Column("layer_service_id")]
        public long LayerServiceCode { get; set; }
        [Column("layer_service_type_id")]
        public long LayerServiceTypeCode { get; set; }
        [Column("service_url")]
        public string LayerServiceUrl { get; set; }
        [Column("service_password")]
        public string ServicePassword { get; set; }
        [Column("service_user_name")]
        public string ServiceUsername { get; set; }
        [Column("workspace_name")]
        public string WorkspaceName { get; set; }
        [Column("service_type_name")]
        public string ServiceTypeName { get; set; }
        [Column("layer_default_is_open")]
        public long? LayerDefaultIsOpen { get; set; }
        [Column("group_key")]
        public string GroupKey { get; set; }
        [Column("is_detail")]
        public long? IsDetail { get; set; }
        [Column("controller_name")]
        public string ControllerName { get; set; }
        [Column("uniq_field_name")]
        public string UniqFieldName { get; set; }

        public VLayerLanguage Copy()
        {
            return (VLayerLanguage)this.MemberwiseClone();
        }
    }
}
