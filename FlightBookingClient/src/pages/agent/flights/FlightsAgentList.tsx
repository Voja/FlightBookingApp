import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/constants";
import {
  addFlight,
  addFlightWrapper,
  deleteReservation,
  getAllFlights,
  getAllReservations,
  getFlights,
} from "@/lib/queries";
import { Flight, Reservation } from "@/lib/types";
// import { deleteCourse, getCourses } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { queryClient } from "@/routes/__root";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

// import { EditCourseModal } from "./EditCourseModal";
// import { CourseType } from "@/lib/types";

const FlightAgentList: React.FC<{ className?: string }> = ({ className }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.FLIGHTS],
    queryFn: getAllFlights,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Departure City</th>
              <th className="border px-4 py-2">Destination City</th>
              <th className="border px-4 py-2">Departure Date Time</th>
              <th className="border px-4 py-2">Destination Date Time</th>
              <th className="border px-4 py-2">Number of Seats</th>
              <th className="border px-4 py-2">Number of Available Seats</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((flight: Flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FlightCard = ({ flight }: { flight: Flight }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (open: boolean) => {
    setOpen(open);
  };
  const availableSpots = Number(flight.numberOfAvailableSpots);

  return (
    <>
      {/* color is red if the flight.numberOfAvailableSpots is less than 5 */}

      <tr
        className={`${availableSpots < 5 ? "bg-red-100" : "odd:bg-gray-100"} `}
      >
        <td className="border border-gray-200 p-2">{flight.departureCity}</td>
        <td className="border border-gray-200 p-2">{flight.destinationCity}</td>
        <td className="border border-gray-200 p-2">
          {flight.departureDateTime}
        </td>
        <td className="border border-gray-200 p-2">{flight.arrivalDateTime}</td>
        <td className="border border-gray-200 p-2">{flight.numberOfSeats}</td>
        <td className="border border-gray-200 p-2">
          {flight.numberOfAvailableSpots}
        </td>
        <td className="border border-gray-200 p-2">{flight.status}</td>
      </tr>

      {/* <EditCourseModal course={course} open={open} onOpenChange={handleOpen} /> */}
    </>
  );
};
export { FlightAgentList };
