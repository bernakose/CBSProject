using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Network.Tables
{
    [Table("gis_net_geo_olt")]
    public class Olt
    {
        [Key]
        [Column("olt_id")]
        public long OltId { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("up_link")]
        public long Uplink { get; set; }
        [Column("as_sec")]
        public long Assec { get; set; }
        [Column("city_street_code")]
        public long CityStreetCode { get; set; }
        [Column("type")]
        public long Type { get; set; }
        [Column("MI_PRINX")]
        public int MiPrinx { get; set; }
        [Column("MI_STYLE")]
        public string MiStyle { get; set; }
    }
}