using API.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivityAction))]
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
    }
}
