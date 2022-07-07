using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cbs.Data.Entities.Application.Views
{
    [Table("v_app_base_layer_language")]
    public class VApplicationBaseLayer
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("language_id")]
        public long LanguageId { get; set; }
        [Column("base_layer_id")]
        public long BaseLayerId { get; set; }
        [Column("layer_title")]
        public string LayerTitle { get; set; }
        [Column("layer_name")]
        public string LayerName { get; set; }
        [Column("image_name")]
        public string ImageName { get; set; }
        [Column("is_tile_server")]
        public long IsTileServer { get; set; }
        [Column("application_type_id")]
        public long ApplicationTypeId { get; set; }
        [Column("path")]
        public string Path { get; set; }
        [Column("language_name")]
        public string LanguageName { get; set; }
        [Column("language_short_name")]
        public string LangguageShortName { get; set; }
        [Column("application_type_name")]
        public string ApplicationTypeName { get; set; }
        [Column("cross_origin")]
        public string CrossOrigin { get; set; }
        [Column("map_key")]
        public string MapKey { get; set; }
        [Column("orders")]
        public long Order { get; set; }
        [Column("is_default_layer")]
        public long IsDefault { get; set; }
        public VApplicationBaseLayer Copy()
        {
            return (VApplicationBaseLayer)this.MemberwiseClone();
        }
    }
}
