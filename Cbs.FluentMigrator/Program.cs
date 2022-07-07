using Cbs.FluentMigrator.Migrations;
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Cbs.FluentMigrator
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Migration Started!");

            var services = new ServiceCollection()
                .AddFluentMigratorCore()
                .ConfigureRunner(
                builder => builder
                .AddPostgres()
                .WithGlobalConnectionString("Server=localhost;Port=5432;Database=dbcbsproject;User Id=postgres;Password=12345;")
                .WithMigrationsIn(typeof(InitialMigration).Assembly))
                .BuildServiceProvider();

            try
            {
                var runner = services.GetRequiredService<IMigrationRunner>();
                runner.MigrateUp();
                //runner.MigrateDown(1);
                Console.WriteLine("Migration has successfully executed.");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            Console.ReadLine();

        }
    }
}
