using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly DataContext _ctx;

        public UsersController(DataContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet]
      
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _ctx.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        
        public async Task<ActionResult<AppUser>> GetUserById(int id)
        {
            return await _ctx.Users.FindAsync(id);
        }

    }
}
