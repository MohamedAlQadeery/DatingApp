using API.Extensions;
using API.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivityAction : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var repo = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();

            var user = await repo.GetUserByIdAsync(resultContext.HttpContext.User.GetUserId());

            user.LastActive = DateTime.Now;

            await repo.SaveAllAsync();
        }
    }
}
