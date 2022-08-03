using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories
{
    public class MessagesRepository : IMessagesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessagesRepository(DataContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Remove(message);
        }

        public async Task<Message> GetMessageAsync(int id)
        {

            return await _context.Messages
                .Include(m=>m.Sender)
                .Include(m=>m.Receiver)
                .SingleOrDefaultAsync(m => m.Id == id);
            
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUserAsync(MessagesParams messagesParams)
        {
            //latest messages
            var q = _context.Messages.OrderByDescending(m => m.DateSent).AsQueryable();

            q = messagesParams.Container switch
            {
                "Inbox" => q.Where(q=> q.ReceiverUsername == messagesParams.Username && q.ReceiverDeleted == false),
                "Outbox"=> q.Where(q=>q.SenderUsername == messagesParams.Username && q.SenderDeleted == false),
                _=>q.Where(q => q.ReceiverUsername == messagesParams.Username && q.ReceiverDeleted == false && q.DateRead == null)

            };

            var messages = q.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messagesParams.PageNumber, messagesParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recieverUsername)
        {
            var messages = await _context.Messages.
                Include(m => m.Sender).ThenInclude(u => u.Photos).
                Include(m => m.Receiver).ThenInclude(u => u.Photos).
                Where(
                m => m.Receiver.UserName == currentUsername && m.ReceiverDeleted == false
                        && m.Sender.UserName == recieverUsername
                        || m.Receiver.UserName == recieverUsername
                        && m.Sender.UserName == currentUsername && m.SenderDeleted == false)
                .OrderBy(m => m.DateSent)
                .ToListAsync();

            var unReadMessages = messages.Where(m => m.DateRead == null && m.Receiver.UserName == currentUsername).ToList();

            if (unReadMessages.Any())
            {
                foreach (var message in unReadMessages)
                {
                    if (message.DateRead == null)
                    {
                        message.DateRead = DateTime.Now;
                    }
                }
               await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsnyc()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
