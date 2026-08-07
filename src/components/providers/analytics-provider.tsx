"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useWorkspace } from "./workspace-provider";

export type DateRange = "Last 24 Hours" | "Last 7 Days" | "Last 30 Days";

export interface ScanEvent {
  id: string;
  workspace_id: string;
  source: string;
  provider: string;
  decision: "ALLOW" | "WARN" | "BLOCK";
  risk_score: number;
  risk_level: string;
  processing_time_ms: number;
  created_at: string;
  threat_detections: { category_id: string; display_label: string; severity: string }[];
}

export interface ProviderStat {
  provider: string;
  count: number;
  avgRisk: number;
  avgLatency: number;
}

export interface AttackCategoryStat {
  category: string;
  count: number;
}

interface AnalyticsContextType {
  dateRange: DateRange;
  setDateRange: (r: DateRange) => void;
  isLoading: boolean;
  
  // Canonical Metrics
  totalScans: number;
  threatsBlocked: number;
  warnings: number;
  allowed: number;
  avgRiskScore: number;
  avgLatency: number;
  blockRate: number;

  // Trend Metrics (Raw values from previous period)
  prevTotalScans: number;
  prevThreatsBlocked: number;
  prevAvgRiskScore: number;
  prevAvgLatency: number;
  prevBlockRate: number;

  // Aggregated Distributions
  providerDistribution: ProviderStat[];
  attackDistribution: AttackCategoryStat[];
  
  // Raw Events for Tables/Charts
  currentEvents: ScanEvent[];
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspace();
  const [dateRange, setDateRange] = useState<DateRange>("Last 7 Days");
  const [metricsData, setMetricsData] = useState<any>({
    totalScans: 0,
    threatsBlocked: 0,
    warnings: 0,
    allowed: 0,
    avgRiskScore: 0,
    avgLatency: 0,
    blockRate: 0,
    prevTotalScans: 0,
    prevThreatsBlocked: 0,
    prevAvgRiskScore: 0,
    prevAvgLatency: 0,
    prevBlockRate: 0,
    providerDistribution: [],
    attackDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!activeWorkspace) return;
    
    let isMounted = true;
    const fetchAnalytics = async () => {
      setIsLoading(true);
      
      const now = new Date();
      const currentStart = new Date();
      const prevStart = new Date();

      if (dateRange === "Last 24 Hours") {
        currentStart.setHours(now.getHours() - 24);
        prevStart.setHours(now.getHours() - 48);
      } else if (dateRange === "Last 7 Days") {
        currentStart.setDate(now.getDate() - 7);
        prevStart.setDate(now.getDate() - 14);
      } else {
        currentStart.setDate(now.getDate() - 30);
        prevStart.setDate(now.getDate() - 60);
      }

      // Use targeted aggregation queries via Supabase RPC to prevent memory exhaustion
      const { data: currentData, error: currentError } = await supabase.rpc("get_workspace_analytics", {
        p_workspace_id: activeWorkspace.id,
        p_start_date: currentStart.toISOString(),
        p_end_date: now.toISOString()
      });

      const { data: prevData, error: prevError } = await supabase.rpc("get_workspace_analytics", {
        p_workspace_id: activeWorkspace.id,
        p_start_date: prevStart.toISOString(),
        p_end_date: currentStart.toISOString()
      });

      if (currentError || prevError) {
        console.error("Failed to fetch analytics:", currentError || prevError);
        if (isMounted) setIsLoading(false);
        return;
      }

      if (isMounted && currentData && currentData.length > 0 && prevData && prevData.length > 0) {
        const current = currentData[0];
        const prev = prevData[0];

        // Format to numbers
        setMetricsData({
          totalScans: Number(current.total_scans),
          threatsBlocked: Number(current.threats_blocked),
          warnings: Number(current.warnings),
          allowed: Number(current.allowed_scans),
          avgRiskScore: Math.round(Number(current.avg_risk_score)),
          avgLatency: Math.round(Number(current.avg_latency)),
          blockRate: Number(current.total_scans) > 0 ? (Number(current.threats_blocked) / Number(current.total_scans)) * 100 : 0,

          prevTotalScans: Number(prev.total_scans),
          prevThreatsBlocked: Number(prev.threats_blocked),
          prevAvgRiskScore: Math.round(Number(prev.avg_risk_score)),
          prevAvgLatency: Math.round(Number(prev.avg_latency)),
          prevBlockRate: Number(prev.total_scans) > 0 ? (Number(prev.threats_blocked) / Number(prev.total_scans)) * 100 : 0,

          providerDistribution: current.provider_distribution || [],
          attackDistribution: current.attack_distribution || []
        });
        
        setIsLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isMounted = false; };
  }, [activeWorkspace, dateRange]);

  return (
    <AnalyticsContext.Provider value={{
      dateRange, setDateRange, isLoading, currentEvents: [], ...metricsData
    }}>
      {children}
    </AnalyticsContext.Provider>
  );


}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
