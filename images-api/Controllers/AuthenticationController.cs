using images_api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;

namespace images_api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class AuthenticationController : Controller
    {
        private IConfiguration _configuration;
        private IHttpClientFactory _httpClientFactory;
        public AuthenticationController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        [Route("registeration")]
        [HttpPost]
        public async Task<IActionResult> Registeration([FromBody] UserRegisterationRequest user)
        {
            using (HttpClient httpClient = _httpClientFactory.CreateClient()) {

               // Sign up new user :

               string registerationUrl = _configuration.GetRequiredSection("AuthUrl").Value;
               HttpRequestMessage registerationRequestMessage = new HttpRequestMessage(HttpMethod.Post ,new Uri(registerationUrl));
               registerationRequestMessage.Content = JsonContent.Create( new { email = user.Email, password = user.Password, returnSecureToken = user.ReturnSecureToken});

                try
                {
                   var registerationResponse = await httpClient.SendAsync(registerationRequestMessage);
                   Stream registerationStream = await registerationResponse.Content.ReadAsStreamAsync();
                   StreamReader registerationStreamReader = new StreamReader(registerationStream);

                    string registerationResponseBody = registerationStreamReader.ReadToEnd();

                    if (registerationResponseBody.Contains("error"))
                        return BadRequest(registerationResponseBody);


                    return Ok(registerationResponseBody);

                }
                catch (Exception exc)
                {

                    throw new Exception(exc.Message);
                }

            }   
        }

        [Route("registeration/save-user-data")]
        [HttpPost]
        public async Task<IActionResult> SaveUserData([FromBody] UserRegisterationRequest user,[FromQuery] string userUid) 
        {
            using HttpClient httpClient = _httpClientFactory.CreateClient();
            
                //post registered users data to database if there are no errors :

                string realtimeDatabaseUrl = _configuration.GetRequiredSection("RealtimeDatabase").Value;
                HttpRequestMessage realtimeRequestMessage = new HttpRequestMessage(HttpMethod.Post, new Uri(realtimeDatabaseUrl + "/users.json"));
                realtimeRequestMessage.Content = JsonContent.Create(new { email = user.Email, name = user.FullName, uid = userUid});

                try
                {

                    var databaseResponse = await httpClient.SendAsync(realtimeRequestMessage);
                    Stream databaseStream = await databaseResponse.Content.ReadAsStreamAsync();
                    StreamReader databaseStreamReader = new StreamReader(databaseStream);

                    string databaseResponseBody = databaseStreamReader.ReadToEnd();

                    if (databaseResponseBody.Contains("error"))
                        return BadRequest(databaseResponseBody);

                    return Ok(databaseResponseBody);

                }
                catch (Exception exc)
                {

                    throw new Exception(exc.Message);
                }
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login(UserLoginRequest user) 
        {
            using HttpClient httpClient = _httpClientFactory.CreateClient();

            string loginUrl = _configuration.GetRequiredSection("LoginUrl").Value;
            HttpRequestMessage loginRequestMessage = new HttpRequestMessage(HttpMethod.Post, new Uri(loginUrl));
            loginRequestMessage.Content = JsonContent.Create(new { email = user.Email, password = user.Password });

            try
            {
                HttpResponseMessage loginResponse = await httpClient.SendAsync(loginRequestMessage);
                Stream loginStream = await loginResponse.Content.ReadAsStreamAsync();
                StreamReader loginStreamReader = new StreamReader(loginStream);

                string loginResponseBody = loginStreamReader.ReadToEnd();

                if (loginResponseBody.Contains("error"))
                    return BadRequest(loginResponseBody);

                return Ok(loginResponseBody);
            }
            catch (Exception exc)
            {

                throw new Exception(exc.Message);
            }
        }
    }
}
