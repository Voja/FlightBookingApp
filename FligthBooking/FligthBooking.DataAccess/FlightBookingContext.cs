using FlightBooking.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace FlightBooking.DataAccess
{
    public class FlightBookingContext : DbContext
    {
        public FlightBookingContext(DbContextOptions options = null) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<City> Cities { get; set; }
    }
}
