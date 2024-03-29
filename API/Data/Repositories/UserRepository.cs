﻿using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;



namespace API.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
         
            var qurey = _context.Users.AsQueryable();
            qurey = qurey.Where(u => u.UserName != userParams.CurrentUsername);
            qurey = qurey.Where(u => u.Gender == userParams.Gender);

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge - 1);

            qurey = qurey.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            //order by

            qurey =  userParams.OrderBy switch
            {
                "created" => qurey.OrderByDescending(u => u.CreatedAt),
                _=>qurey.OrderByDescending(u=>u.LastActive)
            };
            return await PagedList<MemberDto>.CreateAsync(
                qurey.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking()
                , userParams.PageNumber,userParams.PageSize);
        }

        public async Task<MemberDto> GetMemeberAsync(string username)
        {
            return await _context.Users
                .Where(user => user.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();

        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id); 
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.Include(p=>p.Photos).SingleOrDefaultAsync(user => user.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsers()
        {
            return await _context.Users.Include(p=>p.Photos).ToListAsync();
        }


        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        //make user flagged as being updated 
        //we guranty no exception 
        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}
