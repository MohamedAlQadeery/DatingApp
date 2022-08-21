using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUser(UserManager<AppUser> userManager,RoleManager<AppRole> roleManager)
        {
            //Only seed when db is empty
            if (await userManager.Users.AnyAsync()) return;

            var usersData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(usersData);
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name="Admin"},
                new AppRole{Name="Member"},
                new AppRole{Name="Moderator"},
            };

            foreach(var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();

                await userManager.CreateAsync(user, "123123123");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin"
                
            };

            await userManager.CreateAsync(admin,"123123123");
            await userManager.AddToRolesAsync(admin, new[] { "Admin","Moderator"});


        }
    }
}
