using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public Task<bool> AddLike(int sourceUserId, int likeUserId)
        {
            var userLike = new UserLike { SourceUserId = sourceUserId, LikedUserId = likeUserId };
            _context.UserLike.Add(userLike);
            return SaveAllAsync();
        }

        public async Task<UserLike> GetUserLikeAsync(int sourceUserId, int likedUserId)
        {
            return await _context.UserLike.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikesAsync(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.UserLike.AsQueryable();

            if(likesParams.Type == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesParams.UserId);

                users = likes.Select(like => like.LikedUser); //liked users by auth user
            }else if(likesParams.Type == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser); // users who liked auth user
            }
            else
            {
                return null;
            }

            var likedUsers = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                KnownAs = user.KnownAs,
                Id = user.Id
            });



            return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikesAsync(int userId)
        {
           return await _context.Users.Include(u => u.LikedUsers).FirstOrDefaultAsync();

        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
