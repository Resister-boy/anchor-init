import DashboardFeature from "@/components/dashboard/dashboard-feature";
import ChatProvider from "@/context/chat/ChatProvider";

export default function Page() {
  return (
    <ChatProvider>
      <DashboardFeature />
    </ChatProvider>
  );
}
