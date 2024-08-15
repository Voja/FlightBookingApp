namespace FlightBooking.Domain
{
    public interface IApplicationUser
    {
        public string Identity { get; }
        public int Id { get; }
        public int RoleId { get; }
        public string Email { get; }
    }
}
