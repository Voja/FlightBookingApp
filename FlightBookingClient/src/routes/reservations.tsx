import { PageSection } from "@/pages/PageSection";
import ReservationsList from "@/pages/reservations/ReservationsList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reservations")({
  component: () => (
    <PageSection>
      <ReservationsList />
    </PageSection>
  ),
});
