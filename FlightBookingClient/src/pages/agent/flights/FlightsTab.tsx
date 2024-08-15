import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FlightAgentList } from "./FlightsAgentList";
import { AddFlightModal } from "./AddFlightModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addFlightWrapper, getAllFlights } from "@/lib/queries";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";

const FlightsTab: React.FC<{ className?: string }> = ({ className }) => {
  const [open, setOpen] = React.useState(false);

  const { refetch } = useQuery({
    queryKey: [QUERY_KEYS.FLIGHTS],
    queryFn: getAllFlights,
  });

  const addMutation = useMutation({
    mutationFn: addFlightWrapper,
    onSuccess: () => {
      refetch();
      toast.success("Flight added successfully");
    },
    onError: () => {
      toast.error("Failed to add flight");
    },
  });

  const handleOpen = (open: boolean) => {
    setOpen(open);
  };

  return (
    <div className={cn("flex flex-col gap-4 mb-10", className)}>
      <div className="flex justify-between gap-4">
        <h1 className="text-3xl">Flights</h1>
        <Button
          onClick={() => {
            handleOpen(true);
          }}
          className="flex gap-2"
        >
          Add Flight
          <Plus />
        </Button>
      </div>
      <FlightAgentList />
      <AddFlightModal
        open={open}
        onOpenChange={handleOpen}
        addMutation={addMutation}
      />
    </div>
  );
};

export { FlightsTab };
