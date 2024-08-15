using FlightBooking.API.Core;
using FlightBooking.API.Extensions;
using FlightBooking.API.Hub;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials(); // This is important for SignalR
        });
});

// Konfiguracija DIC
var settings = new AppSettings();
builder.Configuration.Bind(settings);
builder.Services.AddSingleton(settings);

builder.Services.AddApplicationUser();
builder.Services.AddTransient<ITokenStorage, InMemoryTokenStorage>();
builder.Services.AddJwt(settings);

builder.Services.AddFlightBookingDbContex();
builder.Services.AddHttpContextAccessor();

builder.Services.AddSingleton<LiveUpdateHub>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();
app.UseHttpsRedirection();

app.UseAuthentication();  // Ensure this is before UseAuthorization
app.UseAuthorization();

app.MapHub<LiveUpdateHub>("/liveUpdateHub");

app.MapControllers();

app.Run();
