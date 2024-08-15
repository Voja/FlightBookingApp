using FlightBooking.Domain;

namespace FlightBooking.API.Core
{
    public class JwtUser : IApplicationUser
    {
        public string Identity { get; set; }

        public int Id {get; set; }

        public int RoleId { get; set; }

        public string Email { get; set; }
    }

    public class AnnonymousUser : IApplicationUser
    {
        public string Identity => "Annonymous";

        public int Id => 1;

        public int RoleId => 3;

        public string Email => "annymous@asp-api.com";
    }
}
