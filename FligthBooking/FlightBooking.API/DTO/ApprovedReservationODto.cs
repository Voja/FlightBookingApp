namespace FlightBooking.API.DTO
{
    public class ApprovedReservationODto
    {
        public int Id { get; set; }
        public string Status { get; set; }
    }

    public class RejectedReservationODto : ApprovedReservationODto
    {
    }
}
