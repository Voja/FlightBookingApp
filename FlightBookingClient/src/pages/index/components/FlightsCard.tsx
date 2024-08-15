import React from "react";
import { Flight } from "@/lib/types";
import { Button } from "@/components/ui/button";
import ReservationModal from "./ReservationModal";

export const formatDateTime = (dateString: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

function FlightsCard({
  flight,
  refetchFlights,
}: {
  flight: Flight;
  refetchFlights: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (open: boolean) => {
    setOpen(open);
  };

  return (
    <div className="border rounded-lg p-6 shadow-md bg-white w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-2">
        {flight.departureCity} - {flight.destinationCity}
      </h2>
      <p className="text-gray-600 mb-1">
        Departure: {flight.departureCity} -{" "}
        {flight.departureDateTime && formatDateTime(flight.departureDateTime)}
      </p>
      <p className="text-gray-600 mb-1">
        Arivial: {flight.destinationCity} -{" "}
        {flight.arrivalDateTime && formatDateTime(flight.arrivalDateTime)}
      </p>
      {flight.numberOfStops == 0 ? (
        <p className="text-gray-600 mb-1">Direct Flight</p>
      ) : (
        <p className="text-gray-600 mb-1">Stops: {flight.numberOfStops}</p>
      )}

      <p className="text-gray-600 mb-1">
        Number of available seats: {flight.numberOfAvailableSpots}
      </p>
      <Button onClick={() => handleOpen(true)} className="mt-4 px-4 py-2">
        Book Now
      </Button>
      <ReservationModal
        open={open}
        onOpenChange={handleOpen}
        flight={flight}
        refetchFlights={refetchFlights}
      />
    </div>
  );
}

export default FlightsCard;
