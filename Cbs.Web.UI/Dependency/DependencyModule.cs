using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VYS.CacheManager.Core;
using VYS.CacheManager.Redis;

namespace Cbs.Web.UI.Dependency
{
    public class DependencyModule
    {
        private static IServiceCollection services { get; set; }
        public static IConfiguration configuration { get; set; }

        public static void RegisterServices(IServiceCollection _services, IConfiguration _configuration)
        {
            services = _services;
            configuration = _configuration;

            services.AddSingleton<ICacheManager>(new RedisCacheManager(configuration.GetValue<string>("AppSettings:RedisHost"), configuration.GetValue<int>("AppSettings:RedisPort"), configuration.GetValue<int>("AppSettings:RedisDefaultDb")));
        }
        public static T Resolve<T>()
        {
            return services.BuildServiceProvider().GetService<T>();
        }
    }
}
