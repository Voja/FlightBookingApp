using FlightBooking.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace FlightBooking.DataAccess.Configuration
{
    public abstract class BaseEnityConfiguration<T> : IEntityTypeConfiguration<T>
       where T : Entity
    {
        public void Configure(EntityTypeBuilder<T> builder)
        {
            ConfigureYourEnity(builder);
        }

        public abstract void ConfigureYourEnity(EntityTypeBuilder<T> builder);
    }
}
