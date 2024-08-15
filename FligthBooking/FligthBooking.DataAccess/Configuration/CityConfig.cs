using FlightBooking.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace FlightBooking.DataAccess.Configuration
{
    public class CityConfig : BaseEnityConfiguration<City>
    {
        public override void ConfigureYourEnity(EntityTypeBuilder<City> builder)
        {
            builder.ToTable("Cities");
        }
    }
}
