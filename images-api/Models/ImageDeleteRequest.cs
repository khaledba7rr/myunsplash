using System.ComponentModel.DataAnnotations;

namespace images_api.Models
{
    public class ImageDeleteRequest
    {
        [Required]
        public string? UserId { get; set; }
        [Required]
        public string? ImageGuid { get; set; }
    }
}
