using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Address.Tables
{
    [Table("gis_adr_geo_building")]
    public class Building
    {
        [Key]
        [Column("building_id")]
        public long BuildingId { get; set; }
        [Column("building_name")]
        public string BuildingName { get; set; }
        [Column("flat")]
        public long Flat { get; set; }
        [Column("workplace")]
        public long Workplace { get; set; }
        [Column("floor")]
        public long Floor { get; set; }
    }
}
