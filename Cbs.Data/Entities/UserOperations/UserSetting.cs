using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("app_user_setting")]
    public class UserSetting
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("user_id")]
        public long UserId { get; set; }
        [Column("zoom")]
        public decimal Zoom { get; set; }
        [Column("center_x")]
        public decimal CenterX { get; set; }
        [Column("center_y")]
        public decimal CenterY { get; set; }
    }
}
