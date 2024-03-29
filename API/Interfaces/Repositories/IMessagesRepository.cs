﻿using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces.Repositories
{
    public interface IMessagesRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<bool> SaveAllAsnyc();
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recieverUsername);

        Task<Message> GetMessageAsync(int id);
        Task<PagedList<MessageDto>> GetMessagesForUserAsync(MessagesParams messagesParams);
    }
}
