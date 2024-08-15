using FlightBooking.DataAccess;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FlightBooking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly FlightBookingContext Context;

        public RoleController(FlightBookingContext context)
        {
            Context = context;
        }
        // GET: api/<RoleController>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(Context.Roles.ToList());
        }
    }
}
