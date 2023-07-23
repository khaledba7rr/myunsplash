using images_api.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace images_api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class ImagesController : Controller
    {
        private IHttpClientFactory _httpClientFactory;
        private IConfiguration _configuration;

        private async Task<string> GetAccountDatabaseKey(string? uid) 
        {
            string baseRealtimeUrl = _configuration.GetRequiredSection("RealtimeDatabase").Value;

            using HttpClient httpClient = _httpClientFactory.CreateClient();

            var userProfile = await httpClient.GetAsync(baseRealtimeUrl + $"/users.json?orderBy=\"uid\"&equalTo=\"{uid}\"");
            Stream userProfileStream = userProfile.Content.ReadAsStream();
            StreamReader userProfileReader = new StreamReader(userProfileStream);

            string accountKey =  await userProfileReader.ReadToEndAsync();

            return accountKey;
        }

        public ImagesController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }
            
        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> UploadImage([FromBody] ImageUploadRequest imageUploadRequest)
        {

            //Getting the key for the account in the database :
            string baseRealtimeUrl = _configuration.GetRequiredSection("RealtimeDatabase").Value;

            using HttpClient httpClient = _httpClientFactory.CreateClient();

            try
            {

                string? userProfileResponse = await GetAccountDatabaseKey(imageUploadRequest.Uid);

                if (userProfileResponse.Contains("error"))
                {
                    return BadRequest(userProfileResponse);
                }

                var accountKey = JsonConvert.DeserializeObject<Dictionary<string, object>>(userProfileResponse)?.Keys.FirstOrDefault();

                //Post image Url if the account Key is not null : 
                if (accountKey is null)
                {
                    return BadRequest(userProfileResponse);
                }

                // post the image data to the user photos
                HttpRequestMessage uploadImageRequest = new HttpRequestMessage(HttpMethod.Post, new Uri(baseRealtimeUrl + $"/users/{accountKey}/images.json"));
                uploadImageRequest.Content = JsonContent.Create(new { label = imageUploadRequest.Label, imageUrl = imageUploadRequest.ImageUrl, imageGuid = Guid.NewGuid() });

                HttpResponseMessage uploadImageResponse = await httpClient.SendAsync(uploadImageRequest);

                Stream imageResponseStream = uploadImageResponse.Content.ReadAsStream();

                StreamReader imageResponseStreamReader = new StreamReader(imageResponseStream);

                string response = await imageResponseStreamReader.ReadToEndAsync();

                if (response.Contains("error"))
                {
                    return BadRequest(response);
                }

                return Ok(response);

            }
            catch (Exception exc)
            {

                throw new Exception(exc.Message);
            }
        }


        [HttpGet]
        [Route("get-images")]
        public async Task<IActionResult> GetImages([FromQuery] string uid) 
        {
            //Getting the key for the account in the database :
            string baseRealtimeUrl = _configuration.GetRequiredSection("RealtimeDatabase").Value;

            using HttpClient httpClient = _httpClientFactory.CreateClient();

            try
            {
                string userProfileResponse = await GetAccountDatabaseKey(uid);

                if (userProfileResponse.Contains("error"))
                    return BadRequest(userProfileResponse);

                var accountKey = JsonConvert.DeserializeObject<Dictionary<string, object>>(userProfileResponse)?.Keys.FirstOrDefault();

                if (accountKey is null)
                    return BadRequest("{\"error\" : error finding the required account}");

                //Get image Url if the account Key is not null : 
                HttpResponseMessage imagesResponse = await httpClient.GetAsync(baseRealtimeUrl + $"/users/{accountKey}/images.json");

                Stream imageResponseStream = imagesResponse.Content.ReadAsStream();

                StreamReader imagesStream = new StreamReader(imageResponseStream);

                string response = await imagesStream.ReadToEndAsync();

                if (response.Contains("error"))
                    return BadRequest(response);

                return Ok(response);

            }
            catch (Exception exc)
            {

                throw new Exception(exc.Message);
            }
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteImage([FromBody] ImageDeleteRequest imageDeleteRequest) 
        {
            //Getting the key for the account in the database :
            string baseRealtimeUrl = _configuration.GetRequiredSection("RealtimeDatabase").Value;

            using HttpClient httpClient = _httpClientFactory.CreateClient();

            try
            {
                string? userProfileResponse = await GetAccountDatabaseKey(imageDeleteRequest.UserId);

                if (userProfileResponse.Contains("error"))
                    return BadRequest(userProfileResponse);

                string? accountKey = JsonConvert.DeserializeObject<Dictionary<string, object>>(userProfileResponse)?.Keys.FirstOrDefault();

                if (accountKey is null)
                    return BadRequest("{\"error\" : error finding the required account}");

                //Delete image Url if the account Key is not null :

                //Find the image database Key :  
                var imageKeyResponse = await httpClient.GetAsync(baseRealtimeUrl + $"/users/{accountKey}/images.json?");

                Stream imageKeyStream = await imageKeyResponse.Content.ReadAsStreamAsync();

                StreamReader imageKeyStreamReader = new StreamReader(imageKeyStream);

                string imagesResponse = imageKeyStreamReader.ReadToEnd();

                if (imagesResponse.Contains("error"))
                    return BadRequest(imagesResponse);

                Dictionary<string, ImageDetails>? imageDictionary = JsonConvert.DeserializeObject<Dictionary<string, ImageDetails>>(imagesResponse);

                string? imageKey = imageDictionary?.Where(dictionary => dictionary.Value.ImageGuid == imageDeleteRequest.ImageGuid)?.FirstOrDefault().Key;

                if (imageKey is null)
                    return BadRequest("Error : Key is null");

                var deleteImageMessage = await httpClient.DeleteAsync(baseRealtimeUrl + $"/users/{accountKey}/images/{imageKey}.json");

                Stream deleteImageStream = await deleteImageMessage.Content.ReadAsStreamAsync();

                StreamReader deletImageReader = new StreamReader(deleteImageStream);

                string deleteImageResponse = deletImageReader.ReadToEnd();

                if (deleteImageResponse.Contains("error"))
                {
                    return BadRequest("error : Cannot delete the photo !");
                }

                return Ok(deleteImageResponse);

            }
            catch (Exception exc)
            {

                throw new Exception(exc.Message);
            }

        }
    }
}
