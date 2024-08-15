import React from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QUERY_KEYS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { City } from "@/lib/types";
import { addFlightWrapper, getCities } from "@/lib/queries";

const AddFlightModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addMutation: any; // Update this to use the appropriate type if needed
}> = ({ open, onOpenChange, addMutation }) => {
  const {
    data: cities,
    isLoading: citiesLoading,
    isError: citiesError,
  } = useQuery<City[]>({
    queryKey: [QUERY_KEYS.CITIES],
    queryFn: getCities,
  });

  const [departureDate, setDepartureDate] = React.useState<string>("");
  const [arrivalDate, setArrivalDate] = React.useState<string>("");
  const [departureCity, setDepartureCity] = React.useState<string>("");
  const [destinationCity, setDestinationCity] = React.useState<string>("");
  const [numberOfSeats, setNumberOfSeats] = React.useState<number>(1);
  const [numberOfStops, setNumberOfStops] = React.useState<number>(0);

  const resetForm = () => {
    setDepartureDate("");
    setArrivalDate("");
    setDepartureCity("");
    setDestinationCity("");
    setNumberOfSeats(1);
    setNumberOfStops(0);
  };

  const handleAddFlight = () => {
    if (departureCity === "" || destinationCity === "") {
      toast.error("Departure and destination city are required");
      return;
    }
    if (departureDate === "" || arrivalDate === "") {
      toast.error("Departure and arrival date are required");
      return;
    }
    if (numberOfSeats <= 0) {
      toast.error("Number of seats must be greater than 0");
      return;
    }
    if (numberOfStops < 0) {
      toast.error("Number of stops must be greater than or equal to 0");
      return;
    }

    addMutation.mutate(
      {
        departureCityId: departureCity,
        destinationCityId: destinationCity,
        departureDateTime: departureDate,
        arrivalDateTime: arrivalDate,
        numberOfSeats,
        numberOfStops,
      },
      {
        onSuccess: () => {
          // Reset the form values after a successful mutation
          resetForm();
          toast.success("Flight added successfully!");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error("An error occurred while adding the flight");
        },
      }
    );
  };

  const handleDepartureCityChange = (value: string) => {
    setDepartureCity(value);
  };

  const handleDestinationCityChange = (value: string) => {
    setDestinationCity(value);
  };

  const handleDepartureDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepartureDate(e.target.value);
  };

  const handleArrivalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrivalDate(e.target.value);
  };

  const handleNumberOfSeatsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfSeats(Number(e.target.value));
  };

  const handleNumberOfStopsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfStops(Number(e.target.value));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>Add Flight</DialogTitle>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <div className="flex flex-col align-middle gap-5">
            <div>
              <Label>Departure City</Label>
              <Select onValueChange={handleDepartureCityChange}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select departure city" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Destination City</Label>
              <Select onValueChange={handleDestinationCityChange}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select destination city" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Departure Date</Label>
              <Input
                type="date"
                value={departureDate}
                onChange={handleDepartureDateChange}
              />
            </div>
            <div>
              <Label>Arrival Date</Label>
              <Input
                type="date"
                value={arrivalDate}
                onChange={handleArrivalDateChange}
              />
            </div>
            <div>
              <Label>Number of Stops</Label>
              <Input
                type="number"
                value={numberOfStops}
                onChange={handleNumberOfStopsChange}
              />
            </div>
            <div>
              <Label>Number of Seats</Label>
              <Input
                type="number"
                value={numberOfSeats}
                onChange={handleNumberOfSeatsChange}
              />
            </div>
            <div>
              <Button onClick={handleAddFlight}>Add Flight</Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { AddFlightModal };
