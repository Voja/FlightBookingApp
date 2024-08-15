using System.ComponentModel.DataAnnotations;

namespace FlightBooking.Domain.Models
{
    public class User : Entity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }

        public Role Role { get; set;}
        public List<Reservation>? Reservations { get; set;}

    }
}
