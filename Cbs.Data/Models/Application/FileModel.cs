using Cbs.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Cbs.Data.Models.Application
{
    /// <summary>
    /// Dosya Modeli
    /// </summary>
    public class FileModel
    {
        /// <summary>
        /// Dosya Adı
        /// </summary>
        [Required]
        public string FileName { get; set; }

        public string FilePath { get; set; }
        /// <summary>
        /// Dosyanın byte arrayi
        /// </summary>
        [Required]
        public byte[] Source { get; set; }
        /// <summary>
        /// Dosyanın eklenme zamanı
        /// </summary>
        [Required]
        public DateTime Date { get; set; }
        /// <summary>
        /// Dosyanın hangi katmana eklendiği bilgisi. Örn CBS_SEB_GEO_SONDAJ
        /// </summary>
        [Required]
        public string LayerName { get; set; }
        /// <summary>
        /// Dosyanın hangi kayda karşılık eklendiği bilgisi.
        /// </summary>
        [Required]
        public long RecordId { get; set; }
        [Required]
        public long UserId { get; set; }
        [Required]
        public FileType FileType { get; set; }
        [Required]
        public string Extension { get; set; }
        /// <summary>
        /// Dosyanın tür bilgisi
        /// </summary>
        public string YuklemeAmaci { get; set; }
        public string Aciklama { get; set; }
        public string Size { get; set; }
    }
}
