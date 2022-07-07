using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("v_app_user")]
    public class VUser
    {
        [Key]
        [Column("user_id")]
        public long Id { get; set; }
        [Column("user_name")]
        public string Username { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("sur_name")]
        public string Surname { get; set; }
        [Column("display_name")]
        public string DisplayName { get; set; }
        [Column("mail_address")]
        public string Mail { get; set; }
        [Column("password")]
        public string Password { get; set; }
        [Column("group_id")]
        public long GroupId { get; set; }
        [Column("group_name")]
        public string GroupName { get; set; }
        [Column("status")]
        public long Status { get; set; }
        [Column("is_system_admin")]
        public long IsSystemAdmin { get; set; }
        [Column("avatar_image")]
        public string AvatarImage { get; set; }
        [Column("input_type")]
        public string InputType { get; set; }
    }
}
