using System;

namespace images_api.Models
{
    [Serializable]
    public class UserData
    {
        string? Email { get; set; }
        string? Name { get; set; }
        string? uid { get; set; }
    }
}
