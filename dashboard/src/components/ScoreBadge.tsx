import React from "react";
import { clsx } from "clsx";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const colorClass =
    score >= 0.8
      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
      : score >= 0.5
        ? "text-amber-400 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
        : "text-red-400 bg-red-500/10 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]";

  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tabular-nums",
        colorClass
      )}
    >
      {score.toFixed(2)}
    </span>
  );
};

export default ScoreBadge;
