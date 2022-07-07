using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("app_user_login_logout")]
    public class AppUserLoginLogout
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("user_name")]
        public string Username { get; set; }
        [Column("login_time")]
        public DateTime LoginTime { get; set; }
        [Column("logout_time")]
        public DateTime? LogoutTime { get; set; }
        [Column("client_info")]
        public string ClientInfo { get; set; }
        [Column("ip_address")]
        public string IpAddress { get; set; }
        [Column("app_type_code")]
        public long AppTypeCode { get; set; }

        public AppUserLoginLogout Copy()
        {
            return (AppUserLoginLogout)this.MemberwiseClone();
        }
    }
}
