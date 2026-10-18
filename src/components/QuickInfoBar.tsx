import React from 'react';
import { Clock, MapPin, Activity, Flame, Edit2, PhoneCall } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useAuth } from '../context/AuthContext';

export const QuickInfoBar: React.FC = () => {
  const { settings, openAdmin } = useStudio();
  const { isAdmin } = useAuth();

  return (
    <div className="relative z-20 bg-zinc-900 border-y border-zinc-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
          {/* Opening Hours */}
          <div className="flex items-start gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
                  Opening Hours
                </span>
                {isAdmin && (
                  <button
                    onClick={openAdmin}
                    className="text-zinc-500 hover:text-amber-400 p-0.5"
                    title="Edit Hours"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">Mon – Sat: {settings.openingHoursMonSat}</p>
              <p className="text-xs text-zinc-400">Sunday: <span className="text-rose-400 font-medium">{settings.openingHoursSun}</span></p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
                Studio Location
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px]">
                8QCV+WH Chikkamagaluru
              </p>
              <p className="text-xs text-zinc-400 truncate max-w-[220px]">Opp. Coffee Works, Kalyan Nagar, Jyothi Nagar</p>
            </div>
          </div>

          {/* Contact Phone Number */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                Studio Contact Number
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition-colors">
                  {settings.phone}
                </a>
              </p>
              <p className="text-xs text-zinc-400">Call / WhatsApp Direct</p>
            </div>
          </div>

          {/* Fitness Options Offered */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
                Programs &amp; Rates
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Day ₹300
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-200">
                  1 Mo ₹2,000
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-amber-300 border border-amber-500/30">
                  3 Mo ₹5,000
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-200">
                  PT ₹12,000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
