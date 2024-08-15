import { createLazyFileRoute } from "@tanstack/react-router";
import Homepage from "@/pages/index/Homepage";
import { PageSection } from "@/pages/PageSection";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <PageSection>
      <Homepage />
    </PageSection>
  ),
});
