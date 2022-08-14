using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces.Services;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
   
    public class AccountController : BaseApiController
    {
        private readonly DataContext _ctx;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(DataContext ctx,ITokenService tokenService,IMapper mapper)
        {
            _ctx = ctx;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await IsUserExist(registerDto.Username))
            {
                return BadRequest("User is already exist !");
            }
            var user = _mapper.Map<AppUser>(registerDto);



            user.UserName = registerDto.Username.ToLower();
           


            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs= user.KnownAs,
                Gender = user.Gender
            };
                
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _ctx.Users.Include(p=>p.Photos).SingleOrDefaultAsync(user => user.UserName == loginDto.Username.ToLower());
            if (user == null) return Unauthorized("Username dont exist ");

         
            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender

            };


        }

        /**
         * Checks if username already exist 
         */

        private async Task<bool> IsUserExist(string username)
        {
            return await _ctx.Users.AnyAsync(user => user.UserName == username.ToLower());
            
        }

    }
}
