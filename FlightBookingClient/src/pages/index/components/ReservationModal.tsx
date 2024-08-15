import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { makeReservation } from "@/lib/queries";
import { Flight, ReservationType } from "@/lib/types";
import React from "react";
import { toast } from "sonner";

const ReservationModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flight: Flight;
  refetchFlights: () => void;
}> = ({ open, onOpenChange, flight, refetchFlights }) => {
  const [flightId, setFlightId] = React.useState(flight.id);
  const [numberOfSeats, setNumberOfSeats] = React.useState(1);

  const handleMakeReservation = async () => {
    const reservationInfo: ReservationType = {
      flightId: Number(flightId),
      numberOfSeats: numberOfSeats,
    };

    const currentDate = new Date();
    const departureDate = new Date(flight.departureDateTime ?? "");
    const timeDifference = departureDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysDifference < 3) {
      toast.error("Cannot book a flight within 3 days of departure");
      return;
    }

    if (reservationInfo.numberOfSeats < 1) {
      toast.error("Number of seats must be greater than 0");
      return;
    }

    if (
      flight.numberOfAvailableSpots !== undefined &&
      reservationInfo.numberOfSeats > flight.numberOfAvailableSpots
    ) {
      toast.error("Not enough available spots");
      return;
    }

    try {
      const result = await makeReservation(reservationInfo);
      console.log(result);

      toast.success("Reservation made successfully!");
      onOpenChange(false);
      refetchFlights();
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        toast.error("Cannot book a flight within 3 days of departure");
      } else {
        toast.error("An error occurred while making the reservation");
      }
    }
  };

  const handleChangeNumberOfSeats = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfSeats(Number(e.target.value));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New reservation</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Label>Choose how many seats do you want</Label>
        <Input
          value={numberOfSeats}
          onChange={handleChangeNumberOfSeats}
          type="number"
          min={1}
          max={flight.numberOfAvailableSpots}
        />
        <div className="flex justify-center">
          <Button className="w-1/3" onClick={handleMakeReservation}>
            Make reservation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
