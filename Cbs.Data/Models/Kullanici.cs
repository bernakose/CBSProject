using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models
{
    public class Kullanici
    {
        public int id { get; set; }
        public string kullanici_adi { get; set; }
        public string ad { get; set; }
        public string soyad { get; set; }
        public string tc { get; set; }
        public string mail { get; set; }
        public string sifre { get; set; }
        public int kullanici_grup_id { get; set; }

    }
}
