using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("Kullanici_Fonksiyon")]
    public class UserFunctions
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Column("fonksiyon_id")]
        public int FuncId { get; set; }
        [Column("user_id")]
        public long UserId { get; set; }
        [Column("fonksiyon_adi")]
        public string FuncName { get; set; }
        [Column("fonksiyon_aciklama")]
        public string FuncDescription { get; set; }

        public User User { get; set; }
        
        //[NotMapped]
        public ICollection<GroupFunctions> GroupFunctions { get; set; }
    }
}
