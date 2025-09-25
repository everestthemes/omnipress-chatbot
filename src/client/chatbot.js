import { createRoot } from "@wordpress/element";
import ChatPopup from "./ui/ChatPopup";

(function () {
  window.addEventListener("DOMContentLoaded", () => {
    const chatbotEl = document.getElementById("omnipress-ai-chatbot");
    if (!chatbotEl) {
      return;
    }
    const root = createRoot(chatbotEl);
    root.render(<ChatPopup />);
  });
})();
