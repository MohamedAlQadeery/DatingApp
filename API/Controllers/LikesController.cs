using API.DTOs;
using API.Extensions;
using API.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;

        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }


        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var sourceUser = await _userRepository.GetUserByIdAsync(sourceUserId);
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);


            if (likedUser == null) return NotFound("User not found");

            // check if user try to like himself
            if (sourceUser.UserName == username) return BadRequest("You Cant like your self");

            // check if user already liked
            var userLike = await _likesRepository.GetUserLikeAsync(sourceUser.Id, likedUser.Id);
            if (userLike != null) return BadRequest("You already liked this user !");

            if (await _likesRepository.AddLike(sourceUser.Id, likedUser.Id)) return Ok();

            return BadRequest("Somethign went wrong in liking user !");
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes(string type)
        {
            var userLikes = await _likesRepository.GetUserLikesAsync(type,User.GetUserId());
            if (userLikes == null) return BadRequest("You entered wrong type!");
            return Ok(userLikes);
        }
    }
}
