using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cbs.Data.Entities.Application.Tables
{
    [Table("app_base_layer_language")]
    public class ApplicationBaseLayerLanguage
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("language_id")]
        public long LanguageId { get; set; }
        [Column("base_layer_id")]
        public long BaseLayerId { get; set; }
        [Column("layer_tag")]
        public long LayerTag { get; set; }


    }
}
