﻿using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repositories;
using API.Interfaces.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository,IMapper mapper,IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }


        /**
         * Repo gets users and maps it to member dto
         */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = user.UserName;

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = user.Gender == "male" ? "female" : "male";
            }


            var members =await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(members.CurrentPage,members.PageSize,members.TotalPages,members.TotalCount);
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
           

            var username = User.GetUsername();
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


        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            //store photo in db
            user.Photos.Add(photo);
            if(await _userRepository.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));

            }
            return BadRequest("Something went wrong in uploading photo !");

        }


       


        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo.IsMain) return BadRequest("Photo is alredy main !");

            //set current main photo to false
            user.Photos.FirstOrDefault(p => p.IsMain).IsMain=false;
            //update new photo to main = true
            photo.IsMain = true;

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Something went wrong in setting main photo !");
            
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("You cant delete main photo!");
            if(photo.PublicId != null)
            {
                var res = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (res.Error != null) return BadRequest(res.Error.Message);
            }

            user.Photos.Remove(photo);
            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Something went wrong ");
        }
    }
}
