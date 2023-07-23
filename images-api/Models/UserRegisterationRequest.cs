using System.ComponentModel.DataAnnotations;

namespace images_api.Models
{
    public class UserRegisterationRequest
    {
        [Required]
        public string? FullName { get; set; }

        [EmailAddress]
        [Required]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }
        public bool ReturnSecureToken { get; set; } = true;
    }
}
