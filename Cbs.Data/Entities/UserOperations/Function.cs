using Cbs.Data.Entities.Application.Tables;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.UserOperations
{
    [Table("app_user_function")]
    public class Function
    {
        [Key]
        [Column("func_id")]
        public long FuncId { get; set; }
        [Column("func_name")]
        public string FuncName { get; set; }
        [Column("tag")]
        public string Tag { get; set; }
        [Column("up_func_id")]
        public long UpFuncId { get; set; }
        [Column("type_id")]
        public long ApplicationTypeId { get; set; }
        [Column("tooltip")]
        public string Tooltip { get; set; }

        public ApplicationType ApplicationType { get; set; }

        public ICollection<UserFunctions> UserFunctions { get; set; }
        //public ICollection<Function> Functions { get; set; }
        [NotMapped]
        public ICollection<GroupFunctions> GroupFunctions { get; set; }
        public virtual Function UpFunc { get; set; }

    }
}
