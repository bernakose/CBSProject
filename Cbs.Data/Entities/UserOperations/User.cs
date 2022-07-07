using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("Kullanici")]
    public class User
    {
        [Key]
        [Column("id")]
        public int UserId { get; set; }
        [Column("kullanici_adi")]
        public string UserName { get; set; }
        [Column("ad")]
        public string Name { get; set; }
        [Column("soyad")]
        public string SurName { get; set; }
        [Column("tc")]
        public string TC { get; set; }
        [Column("mail")]
        public string MailAddress { get; set; }
        [Column("sifre")]
        public string Password { get; set; }
        [Column("kullanici_grup_id")]
        public int GroupId { get; set; }

        public virtual ICollection<UserFunctions> UserFunctions { get; set; }
    }
}
