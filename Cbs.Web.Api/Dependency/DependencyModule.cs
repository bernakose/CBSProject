

using Cbs.Core.DatabaseProvider;
using Cbs.Core.Interfaces.UserInterfaces;
using Cbs.Core.Work;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VYS.CacheManager.Core;
using VYS.CacheManager.Redis;

namespace Cbs.Web.Api.Dependency
{
    public class DependencyModule
    {
        private static IServiceCollection services { get; set; }
        public static IConfiguration configuration { get; set; }

        public static void RegisterServices(IServiceCollection _services, IConfiguration _configuration)
        {
            services = _services;
            configuration = _configuration;

            services.AddTransient<IDatabaseProvider>(s => new DatabaseProviderBase(configuration.GetConnectionString("CbsDbContext")));
            services.AddSingleton<IUserService, UserServiceWork>();
            //services.AddSingleton<IMailService, MailServiceWork>();
            services.AddSingleton<ICacheManager>(new RedisCacheManager(configuration.GetValue<string>("AppSettings:RedisHost"), configuration.GetValue<int>("AppSettings:RedisPort"), configuration.GetValue<int>("AppSettings:RedisDefaultDb")));
        }
        public static T Resolve<T>()
        {
            return services.BuildServiceProvider().GetService<T>();
        }
    }
}
