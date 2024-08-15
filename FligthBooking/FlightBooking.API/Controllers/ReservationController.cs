using FlightBooking.API.DTO;
using FlightBooking.API.Hub;
using FlightBooking.DataAccess;
using FlightBooking.Domain;
using FlightBooking.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FlightBooking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly FlightBookingContext _context;
        private readonly IApplicationUser _user;
        private readonly IHubContext<LiveUpdateHub, ILiveUpdateHub> _hubContext;

        public ReservationController(FlightBookingContext context, IApplicationUser user, IHubContext<LiveUpdateHub, ILiveUpdateHub> hubContext)
        {
            _context = context;
            _user = user;
            _hubContext = hubContext;
        }

        // GET: api/<ReservationController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var reservartions = await _context.Reservations
                .Include(x => x.Flight)
                .Include(x => x.Flight).ThenInclude(c => c.DepartureCity)
                .Include(x => x.Flight).ThenInclude(c => c.DestinationCity)
                .Include(x => x.User)
                .Where(x => x.UserId == _user.Id)
                .ToListAsync();

            return Ok(reservartions.Select(x => new ReservationODto
            {
                Id = x.Id,
                DepartureCity = x.Flight.DepartureCity.Name,
                DestinationCity = x.Flight.DestinationCity.Name,
                FullName = x.User.FirstName + ' ' + x.User.LastName,
                NumberOfSeats = x.NumberOfSeats,
                Status = x.Status,
                DepartureDateTime = x.Flight.DepartureDateTime,
                DestinationDateTime = x.Flight.ArrivalDateTime
            }));
        }

        // GET: api/<ReservationsController>
        [HttpGet("all")]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservartions = await _context.Reservations
                .Include(x => x.Flight)
                .Include(x => x.Flight).ThenInclude(c => c.DepartureCity)
                .Include(x => x.Flight).ThenInclude(c => c.DestinationCity)
                .Include(x => x.User)
                .ToListAsync();

            return Ok(reservartions.Select(x => new ReservationODto
            {
                Id = x.Id,
                DepartureCity = x.Flight.DepartureCity.Name,
                DestinationCity = x.Flight.DestinationCity.Name,
                FullName = x.User.FirstName + ' ' + x.User.LastName,
                NumberOfSeats = x.NumberOfSeats,
                Status = x.Status,
                DepartureDateTime = x.Flight.DepartureDateTime,
                DestinationDateTime = x.Flight.ArrivalDateTime
            }));
        }

        // POST api/<ReservationsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ReservationIDto dto)
        {
            var flight = await _context.Flights.Include(r => r.Reservations)
              .Include(c => c.DepartureCity)
              .Include(x => x.DestinationCity)
              .Where(x => x.Id == dto.FlightId)
              .FirstOrDefaultAsync();

            if(flight.DepartureDateTime.Date <= DateTime.Now.AddDays(3).Date)
            {
                throw new ArgumentException("You can't reserve flight three days before!");
            }

            var reservation = new Reservation
            {
                UserId = _user.Id,
                FlightId = dto.FlightId,
                NumberOfSeats = dto.NumberOfSeats,
                Status = "Pending"
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            var savedReservation = await _context.Reservations
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.Id == reservation.Id);

            if (savedReservation == null || savedReservation.User == null)
            {
                return BadRequest("Reservation or User not found after saving.");
            }

            var result = new ReservationODto
            {
                Id = savedReservation.Id,
                DepartureCity = flight.DepartureCity.Name,
                DestinationCity = flight.DestinationCity.Name,
                FullName = savedReservation.User.FirstName + ' ' + savedReservation.User.LastName,
                NumberOfSeats = savedReservation.NumberOfSeats,
                Status = savedReservation.Status,
                DepartureDateTime = flight.DepartureDateTime,
                DestinationDateTime = flight.ArrivalDateTime
            };

            await _hubContext.Clients.All.ReservationAdded(result);

            return Ok(result);
        }

        // PUT api/<FlightController>/5
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveReservation(int id)
        {
            var reservation = await _context.Reservations.FirstOrDefaultAsync(x => x.Id == id);

            if (reservation == null)
            {
                throw new ArgumentException("That flight don't exist");
            }

            reservation.Status = "Approved";

            await _context.SaveChangesAsync();

            var result = new ApprovedReservationODto { Id = reservation.Id, Status = reservation.Status };

            await _hubContext.Clients.All.ReservationApproved(result);

            return Ok(result);
        }

        // PUT api/<FlightController>/5
        [HttpPut("reject/{id}")]
        public async Task<IActionResult> RejectReservation(int id)
        {
            var reservation = await _context.Reservations.FirstOrDefaultAsync(x => x.Id == id);

            if (reservation == null)
            {
                throw new ArgumentException("That flight don't exist");
            }

            reservation.Status = "Rejected";

            await _context.SaveChangesAsync();

            var result = new RejectedReservationODto { Id = reservation.Id, Status = reservation.Status };

            await _hubContext.Clients.All.ReservationRejected(result);

            return Ok(result);
        }
    }
}
