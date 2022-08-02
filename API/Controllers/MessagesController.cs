using API.Data.Repositories;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IMessagesRepository _messagesRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public MessagesController(IMessagesRepository messagesRepository , IUserRepository userRepository,IMapper mapper)
        {
            _messagesRepository = messagesRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage([FromBody] CreateMessageDto createMessageDto)
        {
            //check if reciver user is not the same as the sender
            var username = User.GetUsername();
           
            if(username.ToLower() == createMessageDto.ReceiverUsername.ToLower())
            {
                return BadRequest("You cant send message to yourself !");
            }

            //check if reciver user exist

            var reciverUser = await _userRepository.GetUserByUsernameAsync(createMessageDto.ReceiverUsername);
            if (reciverUser == null) return NotFound("User does not exist !");
            var senderUser = await _userRepository.GetUserByUsernameAsync(username);

            var message = new Message
            {
                Sender = senderUser,
                Receiver = reciverUser,
                Content = createMessageDto.Content,
                SenderUsername = senderUser.UserName,
                ReceiverUsername = reciverUser.UserName
                
            };

            _messagesRepository.AddMessage(message);

            if(await _messagesRepository.SaveAllAsnyc())
            {
                return Ok(_mapper.Map<MessageDto>(message));
            }
            return BadRequest("Something went wrong ");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages([FromQuery] MessagesParams messagesParams)
        {
            messagesParams.Username = User.GetUsername();
            var messages = await _messagesRepository.GetMessagesForUserAsync(messagesParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalPages, messages.TotalCount);
            return Ok(messages);
        }

        [HttpGet("Thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();
            var sender = await _userRepository.GetUserByUsernameAsync(username);
            if (sender == null) return NotFound("User not found");
            return Ok(await _messagesRepository.GetMessageThread(currentUsername, username));
        }

    }

    
}
