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
    public class FlightController : ControllerBase
    {
        private readonly FlightBookingContext _context;

        public FlightController(FlightBookingContext context)
        {
            _context = context;
        }

        // GET: api/<FlightController>
        [HttpGet]
        public async Task<IActionResult> GetAllFlights()
        {
            var flights = await _context.Flights.Include(r => r.Reservations)
                .Include(c => c.DepartureCity)
                .Include(x=> x.DestinationCity)
                .ToListAsync();

            List<FlightsODto> resultList = new List<FlightsODto>();

            foreach (var flight in flights)
            {
                var numberOfReservedSeats = flight.Reservations.Where(r => r.FlightId == flight.Id).Sum(r => r.NumberOfSeats);

                var result = new FlightsODto
                {
                    Id = flight.Id,
                    DepartureCityId = flight.DepartureCityId,
                    DestinationCityId = flight.DestinationCityId,
                    DepartureCity = flight.DepartureCity?.Name,
                    DestinationCity = flight.DestinationCity?.Name,
                    DepartureDateTime = flight.DepartureDateTime,
                    ArrivalDateTime = flight.ArrivalDateTime,
                    NumberOfSeats = flight.NumberOfSeats,
                    NumberOfStops = flight.NumberOfStops,
                    NumberOfAvailableSpots = flight.NumberOfSeats - numberOfReservedSeats,
                    Status = flight.Status
                };
                resultList.Add(result);
            }
            return Ok(resultList);
        }

        [HttpGet("flights")]
        public async Task<IActionResult> GetFlights([FromQuery] GetFlightsIDto input)
        {
            var departureFlights = await _context.Flights
                .Include(r => r.Reservations)
                .Include(c => c.DepartureCity)
                .Include(x => x.DestinationCity)
                .Where(x => x.DepartureCityId == input.DepartureCityId
                            && x.DestinationCityId == input.DestinationCityId
                            && (input.NoStops && x.NumberOfStops == 0 || !input.NoStops && x.NumberOfStops >= 0)
                            && x.Status == "Approved")
                .ToListAsync();

            var departureFlightsODto = departureFlights.Select(x => new FlightsODto
            {
                Id = x.Id,
                DepartureCityId = x.DepartureCityId,
                DestinationCityId = x.DestinationCityId,
                DepartureCity = x.DepartureCity?.Name,
                DestinationCity = x.DestinationCity?.Name,
                DepartureDateTime = x.DepartureDateTime,
                ArrivalDateTime = x.ArrivalDateTime,
                NumberOfSeats = x.NumberOfSeats,
                NumberOfStops = x.NumberOfStops,
                NumberOfAvailableSpots = x.NumberOfSeats - x.Reservations.Sum(r => r.NumberOfSeats),
                Status = x.Status
            }).Where(x => x.NumberOfAvailableSpots > 0).ToList();

            return Ok(departureFlightsODto);
        }


        // POST api/<FlightController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateFlightIDto input)
        {
            var flight = new Flight
            {
                DepartureCityId = input.DepartureCityId,
                DestinationCityId = input.DestinationCityId,
                DepartureDateTime = input.DepartureDateTime,
                ArrivalDateTime = input.ArrivalDateTime,
                NumberOfSeats = input.NumberOfSeats,
                NumberOfStops = input.NumberOfStops,
                Status = "Pending"
            };

            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT api/<FlightController>/5
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveFlight(int id)
        {
            var flight = await _context.Flights.FirstOrDefaultAsync(x => x.Id == id);

            if(flight == null)
            {
                throw new ArgumentException("That flight don't exist");
            }

            flight.Status = "Approved";

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("reject/{id}")]
        public async Task<IActionResult> RejectFlight(int id)
        {
            var flight = await _context.Flights.FirstOrDefaultAsync(x => x.Id == id);

            if (flight == null)
            {
                throw new ArgumentException("That flight don't exist");
            }

            flight.Status = "Rejected";

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
