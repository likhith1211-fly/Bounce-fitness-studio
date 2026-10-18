import React from 'react';
import { Dumbbell, Flame, Activity, Users, ArrowRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const FitnessGoalsSection: React.FC = () => {
  const { openBooking, openTrainersTab } = useStudio();

  const goals = [
    {
      id: 'strength',
      title: 'BUILD STRENGTH',
      description: 'Improve strength, progressive overload, and physical performance under the bar with Gym Owner Alwyn & Glenn Prabhu.',
      icon: Dumbbell,
      badge: 'Resistance Focus',
      serviceId: 'gym-training',
      isTrainersTab: false,
    },
    {
      id: 'consistency',
      title: 'WEIGHT LOSS & ABS',
      description: 'Target rapid fat loss, core conditioning, and sculpted abs with Weight Loss & Abs Specialist Firoz.',
      icon: Flame,
      badge: 'Fat Burn & Core',
      serviceId: 'gym-training',
      isTrainersTab: false,
    },
    {
      id: 'conditioning',
      title: 'DAILY WORKOUT ROUTINE',
      description: 'Get daily workout suggestions, warm-up guidance, CrossFit, and Zumba stamina support on the gym floor.',
      icon: Activity,
      badge: 'Daily Floor Coach',
      serviceId: 'crossfit',
      isTrainersTab: false,
    },
    {
      id: 'guidance',
      title: 'SEE OUR TRAINERS TAB',
      description: 'Open our dedicated Trainers Tab to view Alwyn (Gym Owner), Glenn Prabhu, Firoz, and our Floor Trainer.',
      icon: Users,
      badge: 'Separate Trainers Tab',
      serviceId: 'personal-training',
      isTrainersTab: true,
    },
  ];

  return (
    <section className="py-20 bg-zinc-950 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
            Targeted Progress
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-tight leading-none mb-3">
            What&apos;s Your Goal?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Every fitness journey begins with clarity. Choose your path and our coaches will guide every rep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                onClick={() => (g.isTrainersTab ? openTrainersTab() : openBooking(g.serviceId))}
                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl ${
                  g.isTrainersTab
                    ? 'bg-amber-500/10 border-amber-500/60 hover:border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-900 hover:shadow-amber-500/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        g.isTrainersTab
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        g.isTrainersTab ? 'bg-amber-500 text-zinc-950' : 'text-zinc-500 bg-zinc-800'
                      }`}
                    >
                      {g.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors mb-2">
                    {g.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-6">
                    {g.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:text-amber-300">
                  <span>{g.isTrainersTab ? 'Open Trainers Tab' : 'Start this goal'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
