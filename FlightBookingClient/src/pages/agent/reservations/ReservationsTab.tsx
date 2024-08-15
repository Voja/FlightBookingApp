import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  getAllReservations,
  approveReservation,
  rejectReservation,
} from "@/lib/queries";
import { TOKEN_KEY } from "@/lib/constants";
import { toast } from "sonner";
import { Reservation } from "@/lib/types";

const ReservationsTab: React.FC<{ className?: string }> = ({ className }) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);

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
              const reservationExists = prevReservations.some(
                (reservation) => reservation.id === updatedReservation.id
              );

              if (reservationExists) {
                console.warn(
                  "Duplicate reservation received:",
                  updatedReservation
                );
                return prevReservations;
              }

              return [...prevReservations, updatedReservation];
            });

            toast.success("Reservation updated", { position: "top-right" });
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

        const initialReservations = await getAllReservations();
        setReservations(initialReservations);
      } catch (err) {
        console.error("Failed to connect to SignalR:", err);
      }
    };

    connect();

    return () => {
      connection?.stop();
    };
  }, []);

  const handleApprove = async (reservation: any) => {
    try {
      await approveReservation(reservation.id);
      toast.success("Reservation approved successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error approving reservation:", error);
      toast.error("Failed to approve reservation", { position: "top-right" });
    }
  };

  const handleReject = async (reservation: any) => {
    try {
      await rejectReservation(reservation.id);
      toast.success("Reservation rejected successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error rejecting reservation:", error);
      toast.error("Failed to reject reservation", { position: "top-right" });
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 mb-10", className)}>
      <div>
        <h1 className="text-3xl">Reservations</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Departure City</th>
                <th className="border px-4 py-2">Departure Date Time</th>
                <th className="border px-4 py-2">Destination City</th>
                <th className="border px-4 py-2">Full Name</th>
                <th className="border px-4 py-2">Number of Seats</th>
                <th className="border px-4 py-2">Status</th>
                <th colSpan={2} className="border px-4 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation: any) => (
                <tr key={reservation.id} className="even:bg-gray-50">
                  <td className="border border-gray-200 p-2">
                    {reservation.departureCity}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {reservation.departureDateTime}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {reservation.destinationCity}
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
                  <td className="border border-gray-200 p-2">
                    <Button onClick={() => handleApprove(reservation)}>
                      Approve
                    </Button>
                  </td>
                  <td className="border border-gray-200 p-2">
                    <Button onClick={() => handleReject(reservation)}>
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { ReservationsTab };
