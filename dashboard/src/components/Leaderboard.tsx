import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, RefreshCw } from "lucide-react";
import { TaskId } from "../types";
import { fetchLeaderboard } from "../api";
import LeaderboardTable from "./LeaderboardTable";
import { clsx } from "clsx";

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TaskId>("bug_detection");

  const { data: entries, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["leaderboard", activeTab],
    queryFn: () => fetchLeaderboard(activeTab),
  });

  const tabs: { id: TaskId; label: string }[] = [
    { id: "bug_detection", label: "Bug Detection" },
    { id: "security_audit", label: "Security Audit" },
    { id: "architectural_review", label: "Arch. Review" },
  ];

  return (
    <div
      className="glass-panel overflow-hidden flex flex-col h-[600px] rounded-3xl"
    >
      {/* Header */}
      <div
        className="px-7 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight" style={{ color: "var(--color-heading)" }}>
            Leaderboard
          </h2>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="p-2.5 hover:bg-white/5 rounded-xl transition-colors disabled:opacity-40"
          style={{ color: "var(--color-muted)" }}
        >
          <RefreshCw className={clsx("w-4 h-4", (isLoading || isRefetching) && "animate-spin")} />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-7" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "py-3.5 text-sm font-semibold transition-all relative whitespace-nowrap",
                activeTab === tab.id
                  ? "text-white drop-shadow-md"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full gap-3" style={{ color: "var(--color-muted)" }}>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading entries...</span>
          </div>
        ) : entries && entries.length > 0 ? (
          <LeaderboardTable entries={entries} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="p-5 bg-white/5 rounded-2xl shadow-inner border border-white/5">
              <Trophy className="w-10 h-10 text-zinc-700" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--color-muted)" }}>
              No rankings yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
