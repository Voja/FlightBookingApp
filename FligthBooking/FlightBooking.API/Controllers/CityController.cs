using FlightBooking.DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FlightBooking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly FlightBookingContext _context;

        public CityController(FlightBookingContext context)
        {
            _context = context;
        }

        // GET: api/<CityController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.Cities.ToListAsync());
        }
       
    }
}
