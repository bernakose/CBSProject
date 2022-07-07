using Cbs.Web.Api.Dependency;
using Cbs.Web.Api.Filters;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using VYS.CacheManager.Core;

namespace Cbs.Web.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public ICacheManager Cache { get; set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            DependencyModule.RegisterServices(services, Configuration);

            services.AddCors();

            services.AddMvc(options =>
            {
                options.EnableEndpointRouting = false;
                options.MaxIAsyncEnumerableBufferLimit = int.MaxValue;
            });

            //services.AddOData();

            services.AddControllers(opts => opts.EnableEndpointRouting = true)
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.IgnoreNullValues = true;
                })
                .AddOData(opt => opt.Select().Filter().Expand().Count().OrderBy().SetMaxTop(null)
                .AddRouteComponents("odata", GetEdmModel()))
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);


            services.AddMvcCore(options =>
            {
                foreach (var outputFormatter in options.OutputFormatters.OfType<ODataOutputFormatter>().Where(_ => _.SupportedMediaTypes.Count == 0))
                {
                    outputFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/prs.odatatestxx-odata"));
                }
                foreach (var inputFormatter in options.InputFormatters.OfType<ODataInputFormatter>().Where(_ => _.SupportedMediaTypes.Count == 0))
                {
                    inputFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/prs.odatatestxx-odata"));
                }
            }).AddApiExplorer();
            services.AddCors();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("CoreSwagger", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "Web Api Documention",
                    Version = "v1.0.0",
                    Description = "",
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact()
                    {
                        Name = "With this document, you can access data, data processing and more features in the system.",
                        Url = new Uri("https://www.tcddteknik.com.tr/"),
                        Email = ""
                    },
                    //TermsOfService = new Uri("https://www.tcddteknik.com.tr/"),

                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.XML";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

                //... and tell Swagger to use those XML comments.
                c.IncludeXmlComments(xmlPath);
                c.OperationFilter<AddRequiredHeaderParameter>();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, ICacheManager cache)
        {
            //loggerFactory.AddProvider(new FileLogProvider());
            Cache = cache;
            if (!Cache.IsSet("ProjectionProjJS"))
                Cache.Set("ProjectionProjJS", Configuration.GetValue<string>("AppSettings:ProjectionProjJS"), 0);
            app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            app.UseSwagger();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            //JobScheduler.Start();
        }

        public static IEdmModel GetEdmModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();

          
            return builder.GetEdmModel();
        }
    }
}
