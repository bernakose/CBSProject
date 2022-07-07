using Cbs.Data.Entities.Address.Tables;
using Cbs.Data.Entities.Application.Tables;
using Cbs.Data.Entities.Application.Views;
using Cbs.Data.Entities.Network.Tables;
using Cbs.Data.Entities.Other;
using Cbs.Data.Entities.Other.Tables;
using Cbs.Data.Entities.UserOperations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Cbs.Data.Framework
{
    public class CbsDbContext : DbContext, IDatabaseContext
    {
        public CbsDbContext()
        {
        }

        public CbsDbContext(DbContextOptions<CbsDbContext> options) : base(options)
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<UserFunctions> UserFunctions { get; set; }
        public DbSet<GroupFunctions> GroupFunctions { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<AppUserLoginLogout> AppUserLoginLogouts { get; set; }
        public DbSet<WebMenu> WebMenus { get; set; }
        public DbSet<VLayerLanguage> VLayerLanguages { get; set; }
        public DbSet<UserLayer> UserLayers { get; set; }
        public DbSet<UserSetting> UserSettings { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<VApplicationBaseLayer> VApplicationBaseLayers { get; set; }
        public DbSet<Building> Buildings { get; set; }
        public DbSet<SplitterOlt> SplitterOlts { get; set; }
        public DbSet<Olt> Olts { get; set; }
        public DbSet<AppUserOperationLog> AppUserOperationLogs { get; set; }
        public DbSet<AppOperationLanguage> AppOperationLanguages { get; set; }
        public DbSet<VUser> VUsers { get; set; }
        public DbSet<LdapUser> LdapUsers { get; set; }        

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserGroup>().HasMany(a => a.GroupFunctions).WithOne().HasForeignKey(b => b.FuncId);
            builder.Entity<User>().HasMany(a => a.UserFunctions).WithOne().HasForeignKey(b => b.FuncId);
            builder.Entity<UserFunctions>().HasMany(a => a.GroupFunctions).WithOne().HasForeignKey(b => b.FuncId);
            
            base.OnModelCreating(builder);
        }

        public DataTable ExecuteDatatable(string sql)
        {
            using (var cmd = Database.GetDbConnection().CreateCommand())
            {
                try
                {
                    var table = new DataTable();
                    if (cmd.Connection.State != System.Data.ConnectionState.Open)
                    {
                        cmd.Connection.Open();
                    }
                    cmd.CommandText = sql;
                    table.Load(cmd.ExecuteReader());
                    return table;

                }
                catch (Exception e)
                {
                    return new DataTable();
                }
                finally
                {
                    cmd.Connection.Close();
                }
            }
        }
    }
}
