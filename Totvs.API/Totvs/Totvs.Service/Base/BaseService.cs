using Totvs.Domain.Interfaces.Repository.Base;
using Totvs.Domain.Interfaces.Services.Base;

namespace Totvs.Service.Base;

public class BaseService<T> : IServiceBase<T> where T : class
{
    private readonly IBaseRepository<T> _repository;

    public BaseService(IBaseRepository<T> repository)
    {
        _repository = repository;
    }

    public async Task<T?> GetByIdAsync(int id)
        => await _repository.GetByIdAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync()
        => await _repository.GetAllAsync();

    public async Task<T> CreateAsync(T entity)
        => await _repository.AddAsync(entity);

    public async Task<T?> UpdateAsync(int id, T entity)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return null;

        await _repository.UpdateAsync(existing, entity);
        return existing;
    }


    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return false;

        await _repository.DeleteAsync(existing);
        return true;
    }
}