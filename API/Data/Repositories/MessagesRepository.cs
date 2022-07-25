using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces.Repositories;
using AutoMapper;

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

           return  await _context.Messages.FindAsync(id);
            
        }

        public Task<PagedList<MessageDto>> GetMessagesForUserAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int recieverId)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SaveAllAsnyc()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
