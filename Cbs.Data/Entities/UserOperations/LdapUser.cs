using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("app_ldap_user")]
    public class LdapUser
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("user_name")]
        public string Username { get; set; }
        [Column("display_name")]
        public string DisplayName { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("sur_name")]
        public string Surname { get; set; }
        [Column("group")]
        public string Group { get; set; }
        [Column("mail_address")]
        public string MailAddress { get; set; }
    }
}
