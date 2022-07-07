using System;
using System.Collections.Generic;
using System.Text;

namespace Cbs.Data.Models
{
    public class Kullanici_Grup
    {
        public int id { get; set; }
        public int grup_id { get; set; }
        public string grup_adi { get; set; }
        public bool silinebilir_mi { get; set; }

    }
}
