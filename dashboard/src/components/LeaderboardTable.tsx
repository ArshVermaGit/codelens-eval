import React from "react";
import { LeaderboardEntry } from "../types";
import ScoreBadge from "./ScoreBadge";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
          <th className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--color-muted)" }}>
            Rank
          </th>
          <th className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--color-muted)" }}>
            Agent
          </th>
          <th className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-center" style={{ color: "var(--color-muted)" }}>
            Score
          </th>
          <th className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-right" style={{ color: "var(--color-muted)" }}>
            Seed
          </th>
          <th className="px-7 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-right" style={{ color: "var(--color-muted)" }}>
            Submitted
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, idx) => (
          <tr
            key={idx}
            className="border-b transition-colors hover:bg-zinc-50/80 group"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <td className="px-7 py-5">
              {idx < 3 ? (
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 group-hover:scale-110 transition-transform">
                  {entry.rank}
                </div>
              ) : (
                <span className="text-sm font-semibold pl-2 text-zinc-900" style={{ color: "var(--color-muted)" }}>
                  {entry.rank}
                </span>
              )}
            </td>
            <td className="px-7 py-5">
              <span className="font-semibold group-hover:text-black transition-all text-zinc-900">
                {entry.agent_name}
              </span>
            </td>
            <td className="px-7 py-5 text-center">
              <ScoreBadge score={entry.score} />
            </td>
            <td className="px-7 py-5 text-right text-sm font-mono" style={{ color: "var(--color-muted)" }}>
              {entry.seed}
            </td>
            <td className="px-7 py-5 text-right text-xs" style={{ color: "var(--color-muted)" }}>
              {new Date(entry.submitted_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
