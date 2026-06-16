import React from "react";
import { WsEvent } from "../types";
import { clsx } from "clsx";
import { CheckCircle2, AlertCircle } from "lucide-react";

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
      className="p-4 rounded-2xl border transition-all animate-fade-slide-in hover-lift bg-white hover:bg-zinc-50 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] tabular-nums font-bold uppercase tracking-wider"
          style={{ color: "var(--color-muted)" }}
        >
          {time}
        </span>
        <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-700 border border-indigo-500/20 px-2 py-0.5 rounded-md">
          {event.episode_id.slice(0, 8)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-semibold capitalize truncate max-w-[140px] text-zinc-900"
        >
          {event.type}
        </span>
        <span
          className={clsx(
            "flex items-center gap-1.5 text-xs font-bold font-mono px-2.5 py-1 rounded-full",
            event.reward > 0
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
              : event.reward < 0
                ? "text-red-700 bg-red-50 border border-red-200"
                : "text-zinc-600 bg-zinc-100 border border-zinc-200"
          )}
        >
          {event.reward > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {event.reward > 0 ? "+" : ""}
          {event.reward.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default EventRow;
