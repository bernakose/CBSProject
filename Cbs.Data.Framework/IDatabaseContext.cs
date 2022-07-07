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
    public interface IDatabaseContext
    {
        DbSet<User> Users { get; set; }
        DbSet<UserFunctions> UserFunctions { get; set; }
        DbSet<UserGroup> UserGroups { get; set; }
        DbSet<GroupFunctions> GroupFunctions { get; set; }
        DbSet<AppUserLoginLogout> AppUserLoginLogouts { get; set; }
        int SaveChanges();
        DbSet<WebMenu> WebMenus { get; set; }
        DbSet<VLayerLanguage> VLayerLanguages { get; set; }
        DbSet<UserLayer> UserLayers { get; set; }
        DbSet<UserSetting> UserSettings { get; set; }
        DbSet<Settings> Settings { get; set; }
        DataTable ExecuteDatatable(string sql);
        DbSet<VApplicationBaseLayer> VApplicationBaseLayers { get; set; }
        DbSet<Building> Buildings { get; set; }
        DbSet<SplitterOlt> SplitterOlts { get; set; }
        DbSet<Olt> Olts { get; set; }
        DbSet<AppUserOperationLog> AppUserOperationLogs { get; set; }
        DbSet<AppOperationLanguage> AppOperationLanguages { get; set; }
        DbSet<VUser> VUsers { get; set; }
        DbSet<LdapUser> LdapUsers { get; set; }

    }
}
