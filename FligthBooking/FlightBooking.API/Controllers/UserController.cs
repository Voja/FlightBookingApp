using Azure.Core;
using FlightBooking.API.DTO;
using FlightBooking.DataAccess;
using FlightBooking.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FlightBooking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FlightBookingContext _context;

        public UserController(FlightBookingContext context)
        {
            _context = context;
        }

        // POST api/<UserController>
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterUserIDto input)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == input.Email);

            if(user != null)
            {
                throw new ArgumentException("User with provided email already exist");
            }

            var cryptedPassword = BCrypt.Net.BCrypt.HashPassword(input.Password);

            _context.Users.Add(new User
            {
                FirstName = input.FirstName,
                LastName = input.LastName,
                Email = input.Email,
                Password = cryptedPassword,
                RoleId = input.RoleId
            });

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
