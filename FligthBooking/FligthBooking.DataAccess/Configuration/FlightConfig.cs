using FlightBooking.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace FlightBooking.DataAccess.Configuration
{
    public class FlightConfig : BaseEnityConfiguration<Flight>
    {
        public override void ConfigureYourEnity(EntityTypeBuilder<Flight> builder)
        {
            builder.ToTable("Flights");
        }
    }
}
