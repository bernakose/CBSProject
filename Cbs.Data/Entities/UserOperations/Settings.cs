using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("app_settings")]
    public class Settings
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("value")]
        public string Value { get; set; }
        [Column("extra_value")]
        public string ExtraValue { get; set; }
    }
}
