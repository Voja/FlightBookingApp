import React from "react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlightsTab } from "./flights/FlightsTab";
import { ReservationsTab } from "./reservations/ReservationsTab";

const AgentPage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("w-full flex justify-center items-center", className)}>
      <Tabs defaultValue="unos" className="max-w-4xl w-full">
        <TabsList>
          <TabsTrigger value="unos">Flight Entry and Overview</TabsTrigger>
          <TabsTrigger value="potvrda">Reservation Confirmation</TabsTrigger>
        </TabsList>
        <TabsContent value="unos">
          <FlightsTab />
        </TabsContent>
        <TabsContent value="potvrda">
          <ReservationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { AgentPage };
