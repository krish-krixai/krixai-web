import React from "react";
import { AppContainer } from "@/components/layout/app-container";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { LiveRuntime } from "@/components/dashboard/live-runtime";
import { RecentThreats } from "@/components/dashboard/recent-threats";
import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { BottomCharts } from "@/components/dashboard/bottom-charts";
import { OperationalStatus } from "@/components/dashboard/operational-status";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const fullName = user?.user_metadata?.full_name?.split(" ")[0] || "User";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppContainer className="py-8 space-y-8">
      
      {/* Operational Status Header */}
      <OperationalStatus greeting={greeting} fullName={fullName} />

      {/* Top Metric Cards */}
      <MetricCards />

      {/* Main Content Area */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Center/Left Content */}
        <div className="flex-1 flex flex-col space-y-6 min-w-0">
          <LiveRuntime />
          <RecentThreats />
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Bottom Charts */}
      <BottomCharts />

    </AppContainer>
  );
}
