using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("app_user_layer")]
    public class UserLayer
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("user_id")]
        public long UserId { get; set; }
        [Column("layer_id")]
        public long LayerId { get; set; }
        [Column("is_open")]
        public long IsOpen { get; set; }
        [Column("layer_order")]
        public long LayerOrder { get; set; }
    }
}
