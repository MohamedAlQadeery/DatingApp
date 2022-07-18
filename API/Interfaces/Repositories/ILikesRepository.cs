using API.DTOs;
using API.Entities;

namespace API.Interfaces.Repositories
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLikeAsync(int sourceUserId, int likedUserId);
        Task<AppUser> GetUserWithLikesAsync(int userId);

        Task<IEnumerable<LikeDto>> GetUserLikesAsync(string type, int userId);
        Task<bool> SaveAllAsync();
        Task<bool> AddLike(int sourceUserId,int likeUserId); 
    }
}
