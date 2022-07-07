using FluentMigrator;

namespace Cbs.FluentMigrator.Migrations
{
    [Migration(20211020202910, "v1.0.8")]
    public class InitialMigration : Migration
    {
        public override void Up()
        {
            #region Kullanıcı İşlemleri
            Create.Table("Kullanici")
              .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
              .WithColumn("kullanici_adi").AsString(50).NotNullable()
              .WithColumn("ad").AsString(50).NotNullable()
              .WithColumn("soyad").AsString(50).NotNullable()
              .WithColumn("tc").AsString(50).NotNullable()
              .WithColumn("mail").AsString(50).NotNullable()
              .WithColumn("sifre").AsString(50).NotNullable()
              .WithColumn("kullanici_grup_id").AsInt64().NotNullable();

            Create.Table("Kullanici_Grup")
              .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
              .WithColumn("grup_id").AsInt64().NotNullable()
              .WithColumn("grup_adi").AsString(50).NotNullable()
              .WithColumn("silinebilir_mi").AsBoolean().NotNullable();


            Create.Table("Kullanici_Fonksiyon")
             .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
             .WithColumn("fonksiyon_id").AsInt64().NotNullable()
             .WithColumn("fonksiyon_adi").AsString(50).NotNullable()
             .WithColumn("fonksiyon_aciklama").AsString(100).NotNullable();

            Create.Table("Kullanici_Grup_Fonksiyon")
             .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
             .WithColumn("grup_id").AsInt64().NotNullable()
             .WithColumn("fonksiyon_id").AsInt64().NotNullable();

            Create.Table("app_user_login_logout")
              .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
              .WithColumn("user_name").AsString(150).NotNullable()
              .WithColumn("login_time").AsDateTime().NotNullable()
              .WithColumn("logout_time").AsDateTime().NotNullable()
              .WithColumn("client_info").AsString(100).NotNullable()
              .WithColumn("ip_address").AsString(100).NotNullable()
              .WithColumn("app_type_code").AsInt64().NotNullable();

            Create.Table("app_settings")
             .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
             .WithColumn("name").AsString(50).NotNullable()
             .WithColumn("value").AsString(50).NotNullable()
             .WithColumn("extra_value").AsString(100).NotNullable();

            Create.Table("app_user_setting")
            .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
            .WithColumn("kullanici_id").AsInt64().NotNullable()
            .WithColumn("scale").AsString(100).Nullable()
            .WithColumn("coordinatex").AsString(100).Nullable()
            .WithColumn("coordinatey").AsString(100).Nullable();

            #endregion

            #region Application

            #region Tables

            
            Create.Table("app_base_layer")
             .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
             .WithColumn("lang_name").AsString(100).Nullable()
             .WithColumn("image_name").AsString(100).Nullable()
             .WithColumn("is_tile_server").AsInt32().Nullable()
             .WithColumn("application_type_id").AsInt64().NotNullable()
             .WithColumn("directory").AsString(100).Nullable();

            Create.Table("app_layer")
             .WithColumn("id").AsInt64().NotNullable().PrimaryKey().Identity()
             .WithColumn("layer_name").AsString(100).Nullable()
             .WithColumn("uniq_column_name").AsString(100).Nullable()
             .WithColumn("helper_column_name").AsString(100).Nullable()
             .WithColumn("layer_image_url").AsString(100).Nullable()
             .WithColumn("is_info").AsInt64().Nullable()
             .WithColumn("layer_row").AsInt64().Nullable()
             .WithColumn("max_zoom").AsInt64().Nullable()
             .WithColumn("min_zoom").AsInt64().Nullable()
             .WithColumn("group_key").AsString(100).Nullable()
             .WithColumn("layer_service_id").AsInt64().Nullable()
             .WithColumn("default_open_close").AsInt64().Nullable()
             .WithColumn("uniq_seq_name").AsString(100).Nullable()
             .WithColumn("is_detail").AsInt64().Nullable()
             .WithColumn("controller_name").AsString(100).Nullable()
             .WithColumn("uniq_field_name").AsString(100).Nullable();


            
            #endregion

            #endregion
        }
        public override void Down()
        {
            #region Kullanıcı İşlemleri
            Delete.Table("Kullanici");
            Delete.Table("Kullanici_Grup");
            Delete.Table("Kullanici_Fonksiyon");
            Delete.Table("Kullanici_Grup_Fonksiyon");
            Delete.Table("app_user_login_logout");
            Delete.Table("app_user_settings");            
            #endregion
        }


    }
}
