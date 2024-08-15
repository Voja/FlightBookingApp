import React from "react";
import { cn } from "@/lib/utils";

import { Flight } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { approveFlight, cancelFlight, getAllFlights } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminFlights: React.FC<{ className?: string }> = ({ className }) => {
  const {
    data: flights,
    isLoading: flightsLoading,
    isError: flightsError,
    refetch,
  } = useQuery<Flight[]>({
    queryKey: [QUERY_KEYS.FLIGHTS],
    queryFn: getAllFlights,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelFlight,
    onSuccess: () => {
      refetch();
      toast.success("Flight canceled successfully", { position: "top-right" });
    },
    onError: () => {
      toast.error("Failed to cancel flight", { position: "top-right" });
    },
  });

  const approveMutation = useMutation({
    mutationFn: approveFlight,
    onSuccess: () => {
      refetch();
      toast.success("Flight approved successfully", { position: "top-right" });
    },
    onError: () => {
      toast.error("Failed to approve flight", { position: "top-right" });
    },
  });

  const handleCancelFlight = async (flight: Flight) => {
    if (flight.id) {
      cancelMutation.mutate(flight.id.toString());
    }
  };

  const handleApproveFlight = async (flight: Flight) => {
    if (flight.id) {
      approveMutation.mutate(flight.id.toString());
    }
  };

  if (flightsLoading) return <div>Loading...</div>;
  if (flightsError) return <div>Error fetching flights</div>;

  return (
    <div className={cn("p-4 bg-white rounded-lg", className)}>
      <h1>Admin flights</h1>
      <div className="overflow-x-auto text-sm w-[1000px]">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">DepartureCity</th>
              <th className="border px-4 py-2">Arrival</th>
              <th className="border px-4 py-2">Departure date time</th>
              <th className="border px-4 py-2">Arrival date</th>
              <th className="border px-4 py-2">Number of seats</th>
              <th className="border px-4 py-2">Available seats</th>
              <th className="border px-4 py-2">Number of stops</th>
              <th className="border px-4 py-2">Status</th>
              <th colSpan={2} className="border px-4 py-2">
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {flights?.map((flight) => (
              <tr key={flight.id} className="even:bg-gray-50">
                <td className="border border-gray-200 p-2">
                  {flight.departureCity}
                </td>
                <td className="border border-gray-200 p-2">
                  {flight.departureDateTime}
                </td>
                <td className="border border-gray-200 p-2">
                  {flight.destinationCity}
                </td>
                <td className="border border-gray-200 p-2">
                  {flight.arrivalDateTime}
                </td>
                <td className="border border-gray-200 p-2">
                  {flight.numberOfSeats}
                </td>
                <td className="border border-gray-200 p-2">
                  {flight.numberOfAvailableSpots}
                </td>
                <td className="border border-gray-200 p-2">
                  {flight.numberOfStops}
                </td>
                <td className="border border-gray-200 p-2">{flight.status}</td>
                <td className="border border-gray-200 p-2">
                  <Button onClick={() => handleApproveFlight(flight)}>
                    Approve flight
                  </Button>
                </td>
                <td className="border border-gray-200 p-2">
                  <Button onClick={() => handleCancelFlight(flight)}>
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { AdminFlights };
