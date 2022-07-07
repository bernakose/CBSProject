using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Application.Tables
{
    [Table("app_operation_language")]
    public class AppOperationLanguage
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("appoperation_id")]
        public long AppOperationId { get; set; }
        [Column("operation_title")]
        public string OperationTitle { get; set; }
        [Column("operation_content")]
        public string OperationContent { get; set; }
        [Column("language_id")]
        public long LanguageId { get; set; }
        public AppOperationLanguage Copy()
        {
            return (AppOperationLanguage)this.MemberwiseClone();
        }
    }
}
