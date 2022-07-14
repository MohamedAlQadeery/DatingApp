using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(10,MinimumLength =4)]
        public string Password { get; set; }

        [Required]
        public string KnownAs { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string City  { get; set; }
        public string Country { get; set; }
    }
}
