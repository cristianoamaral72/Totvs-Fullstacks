using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Totvs.Data.DbContext;
using Totvs.Data.Repository;
using Totvs.Data.Repository.Base;
using Totvs.Domain.Interfaces.Repository;
using Totvs.Domain.Interfaces.Repository.Base;
using Totvs.Domain.Interfaces.Services;
using Totvs.Service.Services;

namespace Totvs.Service.Extensions;

public static class ServiceCollenctionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseInMemoryDatabase("TotvsDb"));

        // Base genérico
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

        // Repository
        services.AddScoped<IProductRepository, ProductRepository>();

        // Services
        services.AddScoped<IProductService, ProductService>();

        return services;
    }
}