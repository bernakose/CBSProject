using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Cbs.Data.Entities.Other.Tables
{
    [Table("app_grid_search")]
    public class SearchGrid
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }
        [Column("column_json")]
        public string ColumnJson { get; set; }
        [Column("grid_name")]
        public string GridName { get; set; }
        [Column("namespace")]
        public string Namespace { get; set; }
        [Column("app_type_id")]
        public long AppTypeId { get; set; }
        [Column("entity_name")]
        public string EntityName { get; set; }
        [Column("service_name")]
        public string ServiceName { get; set; }
        [Column("show_on_map_button")]
        public string ShowOnMap { get; set; }
        [Column("show_open_search_button")]
        public string ShowOpenSearch { get; set; }
        [Column("table_name")]
        public string TableName { get; set; }
        [Column("uniq_column_name")]
        public string UnqColName { get; set; }
        [Column("unq_field_name")]
        public string UnqFieldName { get; set; }
        [Column("show_whereclause")]
        public string ShowWhereClause { get; set; }
        [Column("search_table")]
        public string SearchTable { get; set; }
        [Column("helper_col")]
        public string HelperCol { get; set; }
        [Column("helper_col_subscriber")]
        public string HelperColSubscrb { get; set; }
        [Column("helper_for_user_col")]
        public string HelperColUser { get; set; }
    }

    public class Summary
    {
        public string SummaryItemType { get; set; }
        public string FormatLangName { get; set; }
    }

    public class AppFormJson
    {
        public string FieldName { get; set; }
        public string Name { get; set; }
        public bool Visible { get; set; } = true;
        public int VisibleIndex { get; set; } = 0;
        public string Tag { get; set; }
        public Summary Summary { get; set; }
        public string FieldType { get; set; }
        public string OnMapBtn { get; set; }
        public string OpenSearchBtn { get; set; }
        public string TableName { get; set; }
        public string UnqColName { get; set; }
        public string UnqFieldName { get; set; }
        public string ShowWhereClause { get; set; }
        public string SearchTable { get; set; }
        public string HelperCol { get; set; }
        public string HelperColSubscrb { get; set; }
        public string HelperColUser { get; set; }
    }
}
