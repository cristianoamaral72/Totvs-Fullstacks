namespace Totvs.Domain.Interfaces.Services.Base;

public interface IServiceBase<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();

    Task<T> CreateAsync(T entity);
    Task<T?> UpdateAsync(int id, T entity);
    Task<bool> DeleteAsync(int id);
}