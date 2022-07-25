using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
                   src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Age,opt=>opt.MapFrom(src=>src.DateOfBirth.CalculateAge()));


            CreateMap<Photo, PhotoDto>();
            CreateMap<UpdateMemberDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();

            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.ReceiverPhotoUrl, option => option.MapFrom(src => src.Receiver.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.SenderPhotoUrl, option => option.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}
