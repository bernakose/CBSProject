using Cbs.Data.Framework;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using System;
using System.Configuration;

namespace Cbs.Core.DatabaseProvider
{
  public class DatabaseProviderBase : IDatabaseProvider
    {
        public IDatabaseContext Context { get; set; }
        public DatabaseProviderBase(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            var selectedContext = configuration.GetValue<string>("Context");
            if (selectedContext == null) selectedContext = "CbsDbContext";
            if (selectedContext == "CbsDbContext")
            {
                Context = serviceProvider.GetService(typeof(CbsDbContext)) as IDatabaseContext;
            }
        }

        public DatabaseProviderBase(ConnectionStringSettingsCollection connectionStrings)
        {
            var builder = new Microsoft.EntityFrameworkCore.DbContextOptionsBuilder<CbsDbContext>();
            builder.UseNpgsql(connectionStrings["CbsDbContext"].ConnectionString);
            Context = new CbsDbContext(builder.Options);
        }
        public DatabaseProviderBase(string connectionString)
        {
            var builder = new Microsoft.EntityFrameworkCore.DbContextOptionsBuilder<CbsDbContext>();
            builder.UseNpgsql(connectionString);
            Context = new CbsDbContext(builder.Options);
        }
    }
}
