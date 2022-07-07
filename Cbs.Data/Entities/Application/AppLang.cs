using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cbs.Data.Entities.Application
{
    [Serializable]
    [Table("app_language")]
    public class AppLang
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("lang_name")]
        public string LangName { get; set; }
        [Column("abbreviation")]
        public string Abbreviation { get; set; }
        public AppLang Copy()
        {
            return (AppLang)this.MemberwiseClone();
        }
    }
}
