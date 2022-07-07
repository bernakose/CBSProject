using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("Kullanici_Grup_Fonksiyon")]
    public class GroupFunctions
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Column("grup_id")]
        public int GroupId { get; set; }
        [Column("fonksiyon_id")]
        public int FuncId { get; set; }        
        public virtual UserGroup Group { get; set; }
    }
}
