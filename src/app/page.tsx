import DashboardFeature from "@/components/dashboard/dashboard-feature";
import ChatProvider from "@/context/chat/ChatProvider";
import SolFAIProvider from "@/context/solfai/SolFAIProvider";

export default function Page() {
  return (
    <SolFAIProvider>
      <ChatProvider>
        <DashboardFeature />
      </ChatProvider>
    </SolFAIProvider>
  );
}
