import React, { useState } from 'react';
import { Compass, Users, CalendarSync, Sparkles, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const WhyBounceSection: React.FC = () => {
  const { openBooking, openTrainersTab, trainers } = useStudio();
  const activeTrainers = trainers.filter((t) => t.isActive).sort((a, b) => a.order - b.order);
  const [selectedTrainerIdx, setSelectedTrainerIdx] = useState<number>(0);

  const currentTrainer = activeTrainers[selectedTrainerIdx] || activeTrainers[0];

  const reasons = [
    {
      icon: Compass,
      title: 'EXPERT GUIDANCE',
      desc: 'Get support from experienced fitness professionals led by Gym Owner Alwyn, Head Coach Glenn Prabhu, and Weight Loss & Abs Specialist Firoz.',
      isTrainersTabSlot: false,
    },
    {
      icon: Users,
      title: 'SEE OUR TRAINERS TAB',
      desc: 'Dedicated tab to inspect our coaching team in the place of personal trainer attention — Alwyn (Real Owner), Glenn Prabhu, Firoz, and our Floor Trainer.',
      isTrainersTabSlot: true,
    },
    {
      icon: CalendarSync,
      title: 'CONSISTENCY',
      desc: 'Create an early morning (5:30 AM) or evening routine that fits your lifestyle and keeps you moving forward week after week.',
      isTrainersTabSlot: false,
    },
    {
      icon: Sparkles,
      title: 'MOTIVATING ENVIRONMENT',
      desc: 'Train in an environment designed to keep you engaged, surrounded by like-minded fitness enthusiasts in Kalyan Nagar, Jyothi Nagar, Chikkamagaluru.',
      isTrainersTabSlot: false,
    },
  ];

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden border-t border-zinc-800">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-radial-at-c from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-4">
              Local Commitment
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-6">
              Why Train At Bounce?
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed mb-8">
              We believe real physical transformation does not come from gimmicks. It comes from disciplined training, knowledgeable coaches, and a clean, energizing training ground right in Kalyan Nagar, Jyothi Nagar, Chikkamagaluru.
            </p>

            <div className="space-y-6">
              {reasons.map((r) => {
                const Icon = r.icon;
                if (r.isTrainersTabSlot) {
                  return (
                    <div
                      key={r.title}
                      className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-zinc-900 to-zinc-900 border-2 border-amber-500/50 shadow-xl space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 font-bold">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                              Interactive Coaching Roster
                            </span>
                            <h4 className="font-display font-black text-2xl uppercase tracking-wider text-white leading-none">
                              {r.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={openTrainersTab}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-xs font-black transition-all cursor-pointer shadow-md"
                        >
                          <span>Open Full Trainers Tab</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Mini Trainer Selector Tabs */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activeTrainers.map((t, idx) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTrainerIdx(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              selectedTrainerIdx === idx
                                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                                : 'bg-zinc-950 text-zinc-300 hover:text-white border border-zinc-800'
                            }`}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>

                      {/* Selected Trainer Quick Preview */}
                      {currentTrainer && (
                        <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-black text-lg uppercase text-white">
                                {currentTrainer.name}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">
                                {currentTrainer.role}
                              </span>
                            </div>
                            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                              <span>{currentTrainer.specialization}</span>
                            </p>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {currentTrainer.bio}
                            </p>
                          </div>
                          <button
                            onClick={() => openBooking('personal-training', currentTrainer.id)}
                            className="shrink-0 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/40 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Train With {currentTrainer.name.split(' ')[0]}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={r.title} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white mb-1">
                        {r.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual Display */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
              <img
                src="https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RPt-imGkcBTIicj6SmOvrMimZpnh37w83DR9ckbLZqLZgBkJw6bQR7hbSBiscZrRMX0os04FFNWECsgzAhfuKJmqzmJ8XudWnHDLY-I1BBlzS-mGBc00A0ktNCjd6m1xmUep3yPQ=w1200-h900-k-no"
                alt="Bounce Fitness Studio Chikmagalur Google Maps Verified Equipment and Training Floor"
                className="w-full h-[520px] object-cover object-center filter contrast-[1.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 bg-zinc-950/85 backdrop-blur-md p-6 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Community First
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl text-white uppercase">
                  Ready to experience the difference?
                </h3>
                <p className="text-xs text-zinc-400 mt-1 mb-4">
                  Book a trial session and meet our trainers at Gundappa Gowda Arcade, Kalyan Nagar in Jyothi Nagar, Chikkamagaluru.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => openBooking()}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Book Your Trial Today
                  </button>
                  <button
                    onClick={openTrainersTab}
                    className="px-4 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/40 font-display uppercase tracking-wider text-base font-bold cursor-pointer"
                  >
                    Trainers Tab
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
