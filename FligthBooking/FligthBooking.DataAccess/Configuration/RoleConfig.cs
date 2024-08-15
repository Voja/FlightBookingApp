using FlightBooking.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace FlightBooking.DataAccess.Configuration
{
    public class RoleConfig : BaseEnityConfiguration<Role>
    {
        public override void ConfigureYourEnity(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("Roles");
        }
    }
}
