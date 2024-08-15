import React from "react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddNewUser } from "./components/AddNewUser";
import { AdminFlights } from "./components/AdminFlights";

const AdminPage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("w-full flex justify-center items-center", className)}>
      <Tabs defaultValue="dodavanje" className="max-w-4xl w-full">
        <TabsList>
          <TabsTrigger value="dodavanje">Add new user</TabsTrigger>
          <TabsTrigger value="potvrda">Flights overview</TabsTrigger>
        </TabsList>
        <TabsContent value="dodavanje">
          <AddNewUser />
        </TabsContent>
        <TabsContent value="potvrda">
          <AdminFlights />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { AdminPage };
