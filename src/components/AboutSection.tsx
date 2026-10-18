import React from 'react';
import { Target, Users, Sparkles, Award, Shield, ArrowRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const AboutSection: React.FC = () => {
  const { openBooking, openTrainersTab, trainers } = useStudio();
  const activeTrainers = trainers.filter((t) => t.isActive).sort((a, b) => a.order - b.order);

  const values = [
    {
      icon: Target,
      title: 'Structured Fitness',
      description: 'Clear routines and progressive workout plans that remove guesswork so you make real progress each week.',
      isTrainersTab: false,
    },
    {
      icon: Users,
      title: 'See Our Trainers (Separate Tab)',
      description: 'Train with Gym Owner Alwyn, Head Coach & Nutritionist Glenn Prabhu, Weight Loss & Abs Expert Firoz, and our Floor Trainer for daily workout suggestions.',
      isTrainersTab: true,
    },
    {
      icon: Award,
      title: 'Experienced Guidance',
      description: 'Dedicated fitness professionals with years of hands-on coaching across strength, cardio, and rehab.',
      isTrainersTab: false,
    },
    {
      icon: Sparkles,
      title: 'Motivating Environment',
      description: 'A focused, energetic community of local members who inspire each other to stay consistent.',
      isTrainersTab: false,
    },
    {
      icon: Shield,
      title: 'Clean Training Space',
      description: 'Hygienic equipment, organized dumbbell racks, clean changing spaces, and well-ventilated training floors.',
      isTrainersTab: false,
    },
    {
      icon: Award,
      title: 'All Experience Levels',
      description: 'Whether it is your very first time stepping into a gym or you are an advanced lifter, you belong here.',
      isTrainersTab: false,
    },
  ];

  return (
    <section id="about" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Authentic Photography Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
              <img
                src="/bounce_reception_hd.jpg"
                alt="Bounce Fitness Studio Chikmagalur Google Maps Verified Photo"
                className="w-full h-[480px] object-cover object-center filter contrast-[1.08] hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/grass-cs/AABkmLeX51g7wrsXAbJXIZddBR1T5bimpAEacj0Zi3xA8I5ASq1jqUZefyS-O7n8788IAJC7ZjD5YumhY5KeBE_O3U2NcWQm6iptEKb7w9Ka2Umf226RmoLN8-P8l3JXIto7mReNnN2x-w=w1200-h800-k-no';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 rounded bg-amber-500 text-zinc-950 text-xs font-bold uppercase tracking-wider">
                  8QCV+WH Chikkamagaluru, Karnataka
                </span>
                <p className="text-white font-display text-2xl uppercase font-bold mt-2">
                  Opp. Chikmagalur Coffee Works &bull; Kalyan Nagar
                </p>
                <p className="text-zinc-300 text-xs mt-1">
                  Gundappa Gowda Arcade, Jyothi Nagar &bull; 4.6★ Rated
                </p>
              </div>
            </div>

            {/* Accent badge card */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 z-20 bg-zinc-900 border border-zinc-700/80 p-5 rounded-xl shadow-2xl max-w-[210px] backdrop-blur-sm">
              <p className="font-display font-black text-4xl text-amber-400 leading-none">
                4.6★
              </p>
              <p className="text-xs font-semibold text-white mt-1">Trusted By Chikmagalur</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Top rated local fitness community</p>
            </div>
          </div>

          {/* Right Column: Narrative Content & Pillars */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-4">
              Our Philosophy
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-6">
              More Than A Gym.
            </h2>

            <p className="text-lg text-zinc-300 leading-relaxed font-normal mb-8">
              <strong className="text-white font-semibold">Bounce Fitness Studio</strong> is a fitness-focused training space in Chikmagalur led by real gym owner <strong className="text-amber-400">Alwyn</strong>, head coach &amp; nutritionist <strong className="text-amber-400">Glenn Prabhu</strong>, weight loss &amp; abs expert <strong className="text-amber-400">Firoz</strong>, and our dedicated <strong className="text-amber-400">Floor Trainer</strong>.
            </p>

            {/* Grid of Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {values.map((v) => {
                const Icon = v.icon;
                if (v.isTrainersTab) {
                  return (
                    <div
                      key={v.title}
                      onClick={openTrainersTab}
                      className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/50 hover:border-amber-400 transition-all cursor-pointer group shadow-lg shadow-amber-500/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-black text-amber-400 tracking-wide uppercase group-hover:text-white transition-colors">
                            {v.title}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-zinc-950 text-[10px] font-black uppercase">
                          Open Tab
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed mb-3">{v.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {activeTrainers.map((t) => (
                          <span
                            key={t.id}
                            className="px-2 py-0.5 rounded bg-zinc-950/90 border border-amber-500/30 text-[10px] font-bold text-amber-300"
                          >
                            {t.name.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={v.title} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-amber-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-wide uppercase">{v.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-11">{v.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Action CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => openBooking()}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3.5 rounded-lg font-display uppercase tracking-wider text-lg font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <span>Meet Bounce &bull; Book Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={openTrainersTab}
                className="flex items-center gap-2 px-6 py-3.5 rounded-lg font-display uppercase tracking-wider text-lg font-bold text-amber-400 hover:text-zinc-950 bg-amber-500/15 hover:bg-amber-500 border border-amber-500/40 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>See Trainers Tab</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
