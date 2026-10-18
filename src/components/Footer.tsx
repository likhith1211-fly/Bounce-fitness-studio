import React from 'react';
import { Phone, MapPin, MessageSquare, ArrowUp, Shield } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const Footer: React.FC = () => {
  const { settings, openBooking, openAdmin } = useStudio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800/80 pt-16 pb-24 sm:pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/50 p-0.5">
                <img
                  src="/bounce_icon_crest.png"
                  alt="Bounce Fitness Studio Crest Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="font-display font-black text-2xl uppercase tracking-wider text-white">
                Bounce Fitness Studio
              </span>
            </div>

            <p className="font-display text-lg uppercase tracking-wider text-amber-400/90 font-bold">
              &ldquo;Train Strong. Move Better. Become Better.&rdquo;
            </p>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              A premium local physical fitness centre in Chikmagalur designed to cultivate discipline, strength, and lifelong consistency with personal trainer guidance.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => openBooking()}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-sm font-bold shadow-md cursor-pointer"
              >
                Book Your Session
              </button>

              <button
                onClick={openAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs border border-zinc-800"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-base uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {['About', 'Programs', 'Trainers', 'Schedule', 'Plans', 'Gallery', 'Reviews', 'Location'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Programs */}
          <div>
            <h4 className="font-display font-bold text-base uppercase tracking-wider text-white mb-4">
              Programs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Gym Training &bull; Strength</li>
              <li>Personal 1-on-1 Training</li>
              <li>Zumba Fitness Dance</li>
              <li>CrossFit &bull; High Intensity</li>
              <li>Free Trial Session</li>
              <li>Movement &amp; Posture Assessment</li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div>
            <h4 className="font-display font-bold text-base uppercase tracking-wider text-white mb-4">
              Studio Location
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400"
                >
                  WhatsApp: {settings.whatsapp}
                </a>
              </div>
              <div className="pt-2 text-[11px] text-zinc-500">
                <p>Mon–Sat: {settings.openingHoursMonSat}</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; 2026 Bounce Fitness Studio. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-400">Privacy Policy</span>
            <span className="hover:text-zinc-400">Terms &amp; Conditions</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors ml-4"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
