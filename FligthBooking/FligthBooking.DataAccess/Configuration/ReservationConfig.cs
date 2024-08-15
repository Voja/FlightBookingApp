using FlightBooking.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FlightBooking.DataAccess.Configuration
{
    public class ReservationConfig : BaseEnityConfiguration<Reservation>
    {
        public override void ConfigureYourEnity(EntityTypeBuilder<Reservation> builder)
        {
            builder.ToTable("Reservations");
        }
    }
}
