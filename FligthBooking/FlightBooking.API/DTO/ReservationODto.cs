namespace FlightBooking.API.DTO
{
    public class ReservationODto
    {
        public int Id { get; set; }
        public string? DepartureCity { get; set; }
        public string? DestinationCity { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime DestinationDateTime { get; set; }
        public string FullName { get; set; }
        public int NumberOfSeats { get; set; }
        public string Status { get; set; }
    }
}
