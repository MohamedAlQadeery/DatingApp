using API.Data;
using API.Entities;
using API.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
      
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users =await _userRepository.GetUsers();
            return Ok(users);
        }

        [HttpGet("{username}")]
        
        public async Task<ActionResult<AppUser>> GetUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if(user == null)
            {
                return NotFound("User not found");
            }
            return Ok(user);
        }

    }
}
