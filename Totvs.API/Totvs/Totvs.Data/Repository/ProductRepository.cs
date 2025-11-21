using Totvs.Data.DbContext;
using Totvs.Data.Repository.Base;
using Totvs.Domain.Entities;
using Totvs.Domain.Interfaces.Repository;

namespace Totvs.Data.Repository;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context)
        : base(context)
    {
    }
}