using System.ComponentModel.DataAnnotations;

namespace images_api.Models
{
    public class ImageUploadRequest
    {
        [Required]
        public string? Uid { get; set; }

        [Required]
        public string? Label { get; set; }
 
        [Required]
        public string? ImageUrl { get; set; }
    }
}
