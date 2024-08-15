import { USER_KEY } from "@/lib/constants";
import { AgentPage } from "@/pages/agent/AgentPage";
import { PageSection } from "@/pages/PageSection";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/agent")({
  beforeLoad: async () => {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");

    if (user.Role !== "agent") {
      throw redirect({
        to: "/",
      });
    }
  },
  component: () => (
    <PageSection>
      <AgentPage />
    </PageSection>
  ),
});
