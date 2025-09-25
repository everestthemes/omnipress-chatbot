import { TooltipProvider } from "@radix-ui/react-tooltip";
import { createRoot } from "@wordpress/element";
import { DashboardPage } from "./pages/dashboard/page";

window.addEventListener("DOMContentLoaded", () => {
  const adminSettingContainer = document.getElementById(
    "omnipress-chatbot-settings"
  );
  if (!adminSettingContainer) {
    return;
  }

  const root = createRoot(adminSettingContainer);
  root.render(
    <TooltipProvider>
      <DashboardPage />
    </TooltipProvider>
  );
});
