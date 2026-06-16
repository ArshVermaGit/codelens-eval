import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Zap, Activity } from "lucide-react";
import { fetchStats, fetchHealth } from "../api";
import StatCard from "./StatCard";

const StatsRow: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: 30_000,
  });

  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 10_000,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Total Episodes"
        value={stats?.total_episodes ?? 0}
        icon={<Trophy className="w-5 h-5 text-amber-400" />}
        iconBg="bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.2)] border border-amber-500/20"
      />
      <StatCard
        label="Avg. Score"
        value={stats?.avg_score?.toFixed(2) ?? "0.00"}
        icon={<Zap className="w-5 h-5 text-blue-400" />}
        iconBg="bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)] border border-blue-500/20"
      />
      <StatCard
        label="Active Episodes"
        value={health?.active_episodes ?? 0}
        icon={<Activity className="w-5 h-5 text-emerald-400" />}
        iconBg="bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/20"
      />
    </div>
  );
};

export default StatsRow;
