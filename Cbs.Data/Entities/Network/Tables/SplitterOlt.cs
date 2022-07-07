using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Network.Tables
{
    [Table("gis_net_lt_splitter_olt")]
    public class SplitterOlt
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("splitter_id")]
        public long SplitterId { get; set; }
        [Column("olt_id")]
        public long OltId { get; set; }
        [Column("slot_number")]
        public long SlotNumber { get; set; }
        [Column("port_number")]
        public long PortNumber { get; set; }
        [Column("calculated_port_number")]
        public long CalculatedPortNumber { get; set; }
    }
}