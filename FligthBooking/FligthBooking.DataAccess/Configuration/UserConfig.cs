using FlightBooking.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FlightBooking.DataAccess.Configuration
{
    public class UserConfig : BaseEnityConfiguration<User>
    {
        public override void ConfigureYourEnity(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
        }
    }
}
