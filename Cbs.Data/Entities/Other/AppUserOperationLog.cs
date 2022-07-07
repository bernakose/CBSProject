using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Other
{
    [Table("app_user_operation_log")]
    public class AppUserOperationLog
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("app_operation_id")]
        public long AppOperationId { get; set; }
        [Column("operation_date")]
        public DateTime OperationDate { get; set; }
        [Column("operation_title")]
        public string OperationTitle { get; set; }
        [Column("operation_content")]
        public string OperationContent { get; set; }
        [Column("user_name")]
        public string UserName { get; set; }
    }
}
