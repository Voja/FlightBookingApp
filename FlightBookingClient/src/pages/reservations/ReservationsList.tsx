import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import useAuth from "@/hooks/useAuth";
import { Reservation } from "@/lib/types";
import { toast } from "sonner";
import { TOKEN_KEY } from "@/lib/constants";
import { getReservationsForUser } from "@/lib/queries";

const ReservationsList: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        console.log("Attempting to connect to SignalR...");

        const hubConnection = new HubConnectionBuilder()
          .withUrl(`https://localhost:5001/liveUpdateHub`, {
            accessTokenFactory: () => localStorage.getItem(TOKEN_KEY) ?? "",
          })
          .withAutomaticReconnect()
          .build();

        hubConnection.on(
          "ReservationAdded",
          (updatedReservation: Reservation) => {
            console.log("Received updated reservation:", updatedReservation);

            setReservations((prevReservations) => {
              // Check if the reservation already exists
              const reservationExists = prevReservations.some(
                (reservation) => reservation.id === updatedReservation.id
              );

              if (reservationExists) {
                console.warn(
                  "Duplicate reservation received:",
                  updatedReservation
                );
                return prevReservations; // Return the previous state without changes
              }

              return [...prevReservations, updatedReservation];
            });

            toast.success("Reservation updated");
          }
        );

        hubConnection.on("ReservationApproved", (updatedReservation) => {
          console.log("Received updated reservation:", updatedReservation);

          setReservations((prevReservations) => {
            const updatedReservations = prevReservations.map((reservation) =>
              reservation.id === updatedReservation.id
                ? { ...reservation, ...updatedReservation }
                : reservation
            );

            console.log("Updated reservations:", updatedReservations);
            return updatedReservations;
          });
        });

        hubConnection.on("ReservationRejected", (updatedReservation) => {
          console.log("Received rejected reservation:", updatedReservation);

          setReservations((prevReservations) => {
            const updatedReservations = prevReservations.map((reservation) =>
              reservation.id === updatedReservation.id
                ? { ...reservation, ...updatedReservation }
                : reservation
            );

            console.log("Updated reservations:", updatedReservations);
            return updatedReservations;
          });
        });

        hubConnection.onclose((error) => {
          console.error("SignalR connection closed:", error);
        });

        hubConnection.onreconnecting((error) => {
          console.warn("SignalR connection is reconnecting:", error);
        });

        hubConnection.onreconnected(() => {
          console.log("SignalR connection reconnected");
        });

        await hubConnection.start();
        console.log("SignalR connected successfully");
        setConnection(hubConnection);
      } catch (err) {
        console.error("Failed to connect to SignalR:", err);
        setError(true);
        setLoading(false);
      }
    };

    connect();

    return () => {
      connection?.stop();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await getReservationsForUser();
        console.log(result);
        setReservations(result);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("Reservations ", reservations);
  }, [reservations]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (reservations.length === 0) return <div>No reservations found.</div>;

  return (
    <div>
      <h1 className="text-2xl">Reservations for user {user?.Email}</h1>
      <div className="overflow-x-auto pt-5">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">Departure City</th>
              <th className="border border-gray-200 p-2">Destination City</th>
              <th className="border border-gray-200 p-2">
                Departure Date Time
              </th>
              <th className="border border-gray-200 p-2">
                Destination Date Time
              </th>
              <th className="border border-gray-200 p-2">Full Name</th>
              <th className="border border-gray-200 p-2">Number of Seats</th>
              <th className="border border-gray-200 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="even:bg-gray-50">
                <td className="border border-gray-200 p-2">
                  {reservation.departureCity}
                </td>
                <td className="border border-gray-200 p-2">
                  {reservation.destinationCity}
                </td>
                <td className="border border-gray-200 p-2">
                  {reservation.departureDateTime}
                </td>
                <td className="border border-gray-200 p-2">
                  {reservation.destinationDateTime}
                </td>
                <td className="border border-gray-200 p-2">
                  {reservation.fullName}
                </td>
                <td className="border border-gray-200 p-2">
                  {reservation.numberOfSeats}
                </td>
                <td className="border border-gray-200 p-2">
                  {reservation.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsList;
