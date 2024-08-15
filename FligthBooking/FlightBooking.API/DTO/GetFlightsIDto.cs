namespace FlightBooking.API.DTO
{
    public class GetFlightsIDto
    {
        public int DepartureCityId { get; set; }
        public int DestinationCityId { get; set; }
        public Boolean NoStops { get; set; } = false;
    }
}
