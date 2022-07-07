using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("Kullanici_Grup")]
    public class UserGroup
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Column("grup_id")]
        public int GroupId { get; set; }
        [Column("grup_adi")]
        public string GroupName { get; set; }
        [Column("silinebilir_mi")]
        public bool IsDeleteTable { get; set; }

        public virtual ICollection<GroupFunctions> GroupFunctions { get; set; }

    }
}
