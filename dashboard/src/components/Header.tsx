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
          <img src={logo} className="h-[38px] w-auto invert opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" alt="CodeLens." />
          <div className="h-5 w-px bg-white/10 hidden sm:block mx-2" />
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] hidden sm:block pt-1 opacity-40 group-hover:opacity-60 transition-opacity" style={{ color: "var(--color-heading)" }}>
            Evaluation
          </p>
        </div>
      </div>

      <div className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all glass-panel border",
        isConnected
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          : "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
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
