using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
  
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository,IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        /**
         * Repo gets users and maps it to member dto
         */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var members =await _userRepository.GetMembersAsync();
            return Ok(members);
        }

        [HttpGet("{username}")]  
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var member = await _userRepository.GetMemeberAsync(username);

            if(member == null)
            {
                return NotFound("Member not found");
            }

            return Ok(member);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProfile(UpdateMemberDto updateMemberDto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);

            _mapper.Map(updateMemberDto, user);

            //
            _userRepository.Update(user);
            if(await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Could not update !");
        }

    }
}
