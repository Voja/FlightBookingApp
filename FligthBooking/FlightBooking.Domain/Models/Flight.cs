using System.ComponentModel.DataAnnotations;

namespace FlightBooking.Domain.Models
{
    public class Flight : Entity
    {
        public int DepartureCityId { get; set; }
        public int DestinationCityId { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public int NumberOfSeats { get; set; }
        public int NumberOfStops { get; set; }
        public string Status { get; set; }

        public City DepartureCity { get; set; }
        public City DestinationCity { get; set; }
        public List<Reservation>? Reservations { get; set; }

    }
}
