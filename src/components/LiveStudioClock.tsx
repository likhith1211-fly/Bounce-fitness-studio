import React from 'react';
import { Clock, Calendar, Sparkles, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useGymStatus } from '../hooks/useGymStatus';
import { useStudio } from '../context/StudioContext';

export const LiveStudioClock: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isOpen, statusLabel, statusSubtext, istTimeFormatted, istDateFormatted } = useGymStatus();
  const { settings } = useStudio();

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs shadow-sm">
        <span className="relative flex h-2 w-2">
          {isOpen ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </>
          )}
        </span>
        <span className={`font-black font-display tracking-wider text-xs ${isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
          {statusLabel}
        </span>
        <span className="text-zinc-500">•</span>
        <span className="text-zinc-300 font-mono text-[11px]">{istTimeFormatted}</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border-b border-zinc-800/80 text-xs py-1.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Live Open/Close Status with glowing beacon & current time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-800">
            <span className="relative flex h-2.5 w-2.5">
              {isOpen ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </>
              )}
            </span>
            <span className={`font-black uppercase tracking-wider text-[11px] ${isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-white font-bold">{istTimeFormatted}</span>
            <span className="text-zinc-500 text-[10px] hidden sm:inline">IST (Live)</span>
          </div>

          <span className="text-zinc-600 hidden md:inline">•</span>

          <div className="hidden md:flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>{istDateFormatted}</span>
          </div>

          <span className="text-zinc-600 hidden lg:inline">•</span>

          <span className="text-[11px] text-zinc-300 hidden lg:inline">
            {statusSubtext}
          </span>
        </div>

        {/* Right: Studio Location & Quick Phone */}
        <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
          <div className="hidden sm:flex items-center gap-1 text-zinc-300">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Kalyan Nagar, Jyothi Nagar</span>
          </div>

          <span className="text-zinc-600 hidden sm:inline">•</span>

          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
          >
            <Phone className="w-3 h-3" />
            <span>{settings.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
