import React from 'react';
import { Phone, MessageSquare, Calendar, MapPin } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const MobileBottomBar: React.FC = () => {
  const { openBooking, settings } = useStudio();

  return (
    <aside
      aria-label="Mobile quick actions"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 p-2 sm:hidden flex items-center gap-1.5"
    >
      <a
        href={`tel:${settings.phone}`}
        className="flex-1 flex flex-col items-center justify-center py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
      >
        <Phone className="w-4 h-4 text-amber-400 mb-0.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
      </a>

      <a
        href={settings.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
      >
        <MapPin className="w-4 h-4 text-emerald-400 mb-0.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Maps</span>
      </a>

      <a
        href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Bounce%20Fitness%20Studio,%20I%20would%20like%20to%20enquire%20about%20booking%20and%20memberships.`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        <MessageSquare className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
      </a>

      <button
        onClick={() => openBooking()}
        className="flex-[2] flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-500 text-zinc-950 font-display uppercase tracking-wider text-sm font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-transform"
      >
        <Calendar className="w-4 h-4" />
        <span>Book</span>
      </button>
    </aside>
  );
};
