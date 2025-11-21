using Totvs.Domain.Entities;
using Totvs.Domain.Interfaces.Repository.Base;
using Totvs.Domain.Interfaces.Services;
using Totvs.Service.Base;

namespace Totvs.Service.Services;

public class ProductService : BaseService<Product>, IProductService
{
    public ProductService(IBaseRepository<Product> repository)
        : base(repository)
    {
    }
}