using System.Linq.Expressions;

namespace Totvs.Domain.Interfaces.Repository.Base;

public interface IBaseRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();

    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate);

    Task<T> AddAsync(T entity);
    Task UpdateAsync(T existingEntity, T newValues);
    Task DeleteAsync(T entity);

    Task<bool> ExistsAsync(int id);
}