namespace FlightBooking.API.DTO
{
    public class FlightsODto
    {

        public int Id { get; set; }
        public string? DepartureCity { get; set; }
        public string? DestinationCity { get; set; }
        public int DepartureCityId { get; set; }
        public int DestinationCityId { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public int NumberOfSeats { get; set; }
        public int NumberOfStops { get; set; }
        public int NumberOfAvailableSpots { get; set; }
        public string Status { get; set; }

    }

    public class GetFlightsODto
    {
        public List<FlightsODto>? DepartureFlights { get; set; }
        public List<FlightsODto>? ReturnFlights { get; set; }
    }
}
