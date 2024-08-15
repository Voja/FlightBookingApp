using Microsoft.AspNetCore.SignalR;

namespace FlightBooking.API.SignalR
{
    public class UserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.GetHttpContext()?.Request.Query["access_token"].ToString();
        }
    }
}
