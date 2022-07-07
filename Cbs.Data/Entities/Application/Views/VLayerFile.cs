using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Application.Views
{
    [Table("v_app_layer_file")]
    public class VLayerFile
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("file_name")]
        public string FileName { get; set; }
        [Column("date")]
        public DateTime Date { get; set; }
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
        [Column("user_name")]
        public string UserName { get; set; }
        [Column("record_id")]
        public long RecordId { get; set; }
        [Column("extension")]
        public string Extension { get; set; }
        [Column("download_url")]
        public string DownloadUrl { get; set; }
        [Column("size")]
        public string Size { get; set; }
    }
}
