namespace FlightBooking.API.DTO
{
    public class CreateFlightIDto
    {
        public int DepartureCityId { get; set; }
        public int DestinationCityId { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public int NumberOfSeats { get; set; }
        public int NumberOfStops { get; set; }
    }
}
