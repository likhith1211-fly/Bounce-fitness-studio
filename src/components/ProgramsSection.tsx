import React from 'react';
import { Dumbbell, UserCheck, Flame, Zap, Sparkles, HeartPulse, ArrowRight, Clock, Users } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Service } from '../types';

export const ProgramsSection: React.FC = () => {
  const { services, openBooking, openTrainersTab } = useStudio();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Dumbbell':
        return Dumbbell;
      case 'UserCheck':
        return UserCheck;
      case 'Flame':
        return Flame;
      case 'Zap':
        return Zap;
      case 'Sparkles':
        return Sparkles;
      case 'HeartPulse':
        return HeartPulse;
      default:
        return Dumbbell;
    }
  };

  const getCtaLabel = (service: Service) => {
    if (service.title.toLowerCase().includes('personal')) return 'Book Personal Training';
    if (service.title.toLowerCase().includes('zumba')) return 'Check Schedule & Book';
    if (service.title.toLowerCase().includes('crossfit')) return 'Enquire & Book';
    if (service.title.toLowerCase().includes('trial')) return 'Book Free Trial';
    return 'Book a Session';
  };

  return (
    <section id="programs" className="py-24 bg-zinc-900/60 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700/60 text-xs font-bold uppercase tracking-widest mb-4">
            Structured Training
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-4">
            Programs &amp; Services
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Purpose-driven programs tailored to build physical strength, stamina, and lifelong workout consistency with Alwyn, Glenn Prabhu, Firoz, and our Floor Trainer.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services
            .filter((s) => s.isActive)
            .sort((a, b) => a.order - b.order)
            .map((service) => {
              const Icon = getIcon(service.iconName);
              const isPersonalTraining = service.id === 'personal-training' || service.title.toLowerCase().includes('personal');
              return (
                <div
                  key={service.id}
                  className="group relative flex flex-col justify-between bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Image Header */}
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={
                        service.imageUrl ||
                        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
                      }
                      alt={service.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                    {/* Category pill */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-zinc-900/90 text-amber-400 border border-zinc-700/80 backdrop-blur-sm">
                        {service.category}
                      </span>
                      {service.popular && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-zinc-950 shadow-md">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Icon badge */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center text-amber-400 shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      {/* Meta info */}
                      <div className="flex items-center justify-between py-3 border-y border-zinc-800/80 text-xs text-zinc-400 mb-6">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{service.durationMinutes} min session</span>
                        </div>
                        <div className="font-semibold text-zinc-300">
                          {service.priceDisplay}
                        </div>
                      </div>

                      {/* Action CTA */}
                      <div className="space-y-2.5">
                        {isPersonalTraining && (
                          <button
                            onClick={openTrainersTab}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-display uppercase tracking-wider text-sm font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/40 transition-all cursor-pointer"
                          >
                            <Users className="w-4 h-4" />
                            <span>See Separate Trainers Tab (4 Coaches)</span>
                          </button>
                        )}
                        <button
                          onClick={() => openBooking(service.id)}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold bg-zinc-900 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all duration-200 shadow-md cursor-pointer"
                        >
                          <span>{getCtaLabel(service)}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};
