import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, iconBg }) => {
  return (
    <div
      className="glass-panel hover-lift rounded-3xl p-7 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-5">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--color-muted)" }}
        >
          {label}
        </p>
        <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${iconBg}`}>
          {icon}
        </div>
      </div>
      <h3
        className="text-4xl font-extrabold tracking-tight tabular-nums"
        style={{ color: "var(--color-heading)", textShadow: "0 0 20px rgba(255,255,255,0.1)" }}
      >
        {value}
      </h3>
    </div>
  );
};

export default StatCard;
