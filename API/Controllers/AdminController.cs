using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
   
    public class AdminController : BaseApiController
    {
        [Authorize(Policy ="RequiredAdminRole")]
        [HttpGet("users-with-roles")]
        public ActionResult GetUsersWithRoles()
        {
            return Ok("Only Admin can see this");
        }


        [Authorize(Policy ="RequiredModAdminRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult ModeratePhotos()
        {

            return Ok("Only Moderator or admin can see this");
        }
    }
}
