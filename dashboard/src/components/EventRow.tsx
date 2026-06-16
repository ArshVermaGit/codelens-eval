import React from "react";
import { WsEvent } from "../types";
import { clsx } from "clsx";

interface EventRowProps {
  event: WsEvent;
}

const EventRow: React.FC<EventRowProps> = ({ event }) => {
  const time = new Date(event.timestamp).toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className="glass-panel hover-lift rounded-2xl p-4 transition-all duration-200 animate-fade-slide-in"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] tabular-nums font-bold uppercase tracking-wider"
          style={{ color: "var(--color-muted)" }}
        >
          {time}
        </span>
        <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md shadow-sm">
          {event.episode_id.slice(0, 8)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-semibold capitalize truncate max-w-[140px]"
          style={{ color: "var(--color-heading)" }}
        >
          {event.type}
        </span>
        <span
          className={clsx(
            "text-xs font-bold font-mono px-2.5 py-1 rounded-full shadow-sm",
            event.reward > 0
              ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              : event.reward < 0
                ? "text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                : "text-zinc-400 bg-white/5 border border-white/10"
          )}
        >
          {event.reward > 0 ? "+" : ""}
          {event.reward.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default EventRow;
