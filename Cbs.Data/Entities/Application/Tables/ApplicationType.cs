using Cbs.Data.Entities.UserOperations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Application.Tables
{
    [Table("app_type")]
    public class ApplicationType
    {
        [Key]
        [Column("type_id")]
        public long Id { get; set; }
        [Column("type_name")]
        public string ApplicationName { get; set; }

        public ICollection<Function> Functions { get; set; }
    }
}
