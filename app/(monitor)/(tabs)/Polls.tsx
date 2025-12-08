// app/(monitor)/(tabs)/Polls.tsx
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ManagePolls from "@/app/(shared)/polls/ManagePolls";
import PollList from "@/app/(shared)/polls/PollList";

export default function MonitorPollsTab() {
  const { user } = useAuth();

  if (user?.role === "admin" || user?.role === "monitor") {
    return <ManagePolls />;
  }

  return <PollList />;
}
