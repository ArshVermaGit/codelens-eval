import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Wifi, WifiOff } from "lucide-react";
import { fetchHealth } from "../api";
import { clsx } from "clsx";
import logo from "../logo.svg";

const Header: React.FC = () => {
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 10_000,
  });

  const isConnected = health?.status === "ok";

  return (
    <header className="flex items-center justify-between pb-2">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {/* Logo Replacement */}
          <img src={logo} className="h-[38px] w-auto drop-shadow-sm" alt="CodeLens." />
          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-2" />
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] hidden sm:block pt-1 opacity-40 group-hover:opacity-60 transition-opacity" style={{ color: "var(--color-heading)" }}>
            Evaluation
          </p>
        </div>
      </div>

      <div className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all glass-panel border",
        isConnected
          ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm"
          : "bg-red-50 text-red-600 border-red-200 shadow-sm"
      )}>
        {isConnected ? (
          <>
            <Wifi className="w-3.5 h-3.5" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline</span>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
