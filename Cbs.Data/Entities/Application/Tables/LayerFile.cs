using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Application.Tables
{
    [Table("app_lt_layer_file")]
    public class LayerFile
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("file_name")]
        public string FileName { get; set; }
        [Column("date")]
        public DateTime? Date { get; set; }
        [Column("layer_name")]
        public string LayerName { get; set; }
        [Column("file_type")]
        public long FileType { get; set; }
        [Column("upload_purpose")]
        public string UploadPurpose { get; set; }
        [Column("explanation")]
        public string Explanation { get; set; }
        [Column("file_path")]
        public string FilePath { get; set; }
        [Column("type")]
        public string Type { get; set; }
        [Column("user_id")]
        public long UserId { get; set; }
        [Column("record_id")]
        public long RecordId { get; set; }
        [Column("extension")]
        public string Extension { get; set; }
        [Column("size")]
        public string Size { get; set; }
    }
}
