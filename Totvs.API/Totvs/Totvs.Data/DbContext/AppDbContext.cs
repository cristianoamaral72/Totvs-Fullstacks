using Microsoft.EntityFrameworkCore;
using Totvs.Domain.Entities;

namespace Totvs.Data.DbContext;

public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

}