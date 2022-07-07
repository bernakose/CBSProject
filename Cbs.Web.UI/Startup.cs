using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Cbs.Web.UI.Dependency;
using Cbs.Web.UI.Helpers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Cbs.Web.UI
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; set; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            AppHelper.WebApiUrl = Configuration.GetValue<string>("AppSettings:WebApiUrl");
            AppHelper.AppUrl = Configuration.GetValue<string>("AppSettings:AppUrl");
            AppHelper.ApplicationName = Configuration.GetValue<string>("AppSettings:ApplicationName");
            AppHelper.SelectedLanguageKey = Configuration.GetValue<string>("AppSettings:SelectedLanguageKey");
            AppHelper.OdataUrl = Configuration.GetValue<string>("AppSettings:OdataUrl");
            AppHelper.Version = typeof(Startup).Assembly.GetName().Version.ToString();

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.Strict;
            });
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
            {
                options.LoginPath = new PathString("/Login/Index/");
                options.AccessDeniedPath = new PathString("/Login/Index/");
                options.Cookie.Name = "Web.Cookie";
                options.ExpireTimeSpan = TimeSpan.FromDays(365);

                options.Events = new CookieAuthenticationEvents()
                {
                    OnRedirectToLogin = redirectContext =>
                    {
                        var uri = redirectContext.RedirectUri;

                        UriHelper.FromAbsolute(uri, out var scheme, out var host, out var path, out var query, out var fragment);
                        uri = UriHelper.BuildAbsolute(scheme, host, path);
                        redirectContext.Response.Redirect(uri);
                        return Task.CompletedTask;
                    }
                };
            });
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            DependencyModule.RegisterServices(services, Configuration);

            IMvcBuilder builder = services.AddRazorPages();

#if DEBUG
            if (Env.IsDevelopment())
            {
                //builder.AddRazorRuntimeCompilation();
            }
#endif
            services.AddMvc(options =>
            {
                options.EnableEndpointRouting = false;
            });
            services.AddDistributedMemoryCache();
            services.AddMvc().AddCookieTempDataProvider();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            //loggerFactory.AddProvider(new FileLogProvider());


            #region Static File

            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(
                            Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot/assets")),
                RequestPath = new PathString("")
            });
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(
                            Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot/bower_components")),
                RequestPath = new PathString("")
            });

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(
                            Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot/Custom")),
                RequestPath = new PathString("")
            });

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(
                           Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot/CustomPageContent")),
                RequestPath = new PathString("/CustomPageContent")
            });
            #endregion

            #region ExceptionPage Redirect

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/CustomError/NotAuthorizePage");
            }

            app.UseStatusCodePagesWithRedirects("~/CustomError/NotAuthorizePage");
            #endregion


            app.UseCookiePolicy();
            app.UseAuthentication();
            //app.UseAuthorization();

            //app.UseSession();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });
            });


        }
    }
}
