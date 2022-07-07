using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Other.Tables
{
    [Table("app_web_menu")]
    public class WebMenu
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("menu_name")]
        public string MenuName { get; set; }
        [Column("menu_icon")]
        public string MenuIcon { get; set; }
        [Column("parent_menu_id")]
        public long ParentMenuId { get; set; }
        [Column("is_query_window")]
        public long IsQueryWindow { get; set; }
        [Column("call_function_name")]
        public string CallFunctionName { get; set; }
        [Column("auth_function_tag")]
        public string AuthFunctionTag { get; set; }
        [Column("menu_order")]
        public long MenuOrder { get; set; }
        [Column("query_service_name")]
        public string QueryServiceName { get; set; }
        [Column("query_uniq_field_name")]
        public string QueryUniqFieldName { get; set; }
        [Column("query_table_name")]
        public string QueryTableName { get; set; }
        [Column("query_uniq_column_name")]
        public string QueryUniqColumnName { get; set; }
    }
}
