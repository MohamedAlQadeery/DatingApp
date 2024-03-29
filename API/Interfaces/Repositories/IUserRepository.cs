﻿using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces.Repositories
{
    public interface IUserRepository
    {
        //Mark this entity thats its modifed
        void Update(AppUser user);
        // Returns true if database is updated with the changes
        Task<bool> SaveAllAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<IEnumerable<AppUser>> GetUsers();

        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemeberAsync(string username);
    }
}
