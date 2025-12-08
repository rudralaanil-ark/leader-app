// app/(admin)/(tabs)/Polls.tsx
import ManagePolls from "@/app/(shared)/polls/ManagePolls";
import PollList from "@/app/(shared)/polls/PollList";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

export default function AdminPollsTab() {
  const { user } = useAuth();

  if (user?.role === "admin" || user?.role === "monitor") {
    return <ManagePolls />;
  }

  return <PollList />;
}
