import React, { useState } from 'react';
import { Clock, User, Calendar, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const ClassScheduleSection: React.FC = () => {
  const { classes, openBooking, openTrainersTab } = useStudio();
  const [activeDay, setActiveDay] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'>('MON');

  const days: { key: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'; label: string; full: string }[] = [
    { key: 'MON', label: 'MON', full: 'Monday' },
    { key: 'TUE', label: 'TUE', full: 'Tuesday' },
    { key: 'WED', label: 'WED', full: 'Wednesday' },
    { key: 'THU', label: 'THU', full: 'Thursday' },
    { key: 'FRI', label: 'FRI', full: 'Friday' },
    { key: 'SAT', label: 'SAT', full: 'Saturday' },
    { key: 'SUN', label: 'SUN', full: 'Sunday' },
  ];

  const currentClasses = classes.filter((c) => c.dayOfWeek === activeDay);

  return (
    <section id="schedule" className="py-24 bg-zinc-900/60 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700/60 text-xs font-bold uppercase tracking-widest mb-3">
            Flexible Weekly Routine
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            Studio Class Schedule
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Guided morning and evening workout sessions across strength training, weight loss &amp; abs, Zumba, and daily routine coaching.
          </p>

          {/* Prominent Disclaimer Box as requested by user */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-left flex items-start gap-3.5 shadow-xl">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              <span className="font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                Important Schedule &amp; Timing Disclaimer:
              </span>
              The studio class schedule is flexible and not strictly fixed — <strong>timings may change according to trainers&apos; availability</strong>. Furthermore, <strong>there are no limited seats</strong>; all members are welcome to join any session with open floor access!
            </div>
          </div>
        </div>

        {/* Day Selection Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {days.map((day) => {
            const isActive = activeDay === day.key;
            return (
              <button
                key={day.key}
                onClick={() => setActiveDay(day.key)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-display text-base sm:text-lg uppercase tracking-wider font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>

        {/* Schedule List or Empty State */}
        {activeDay === 'SUN' || currentClasses.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 px-6 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white mb-2">
              {activeDay === 'SUN' ? 'Sunday is Studio Rest Day' : 'Flexible Floor Training'}
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              {activeDay === 'SUN'
                ? 'Our physical gym floor is closed on Sundays for deep sanitation and recovery. Early morning slots resume Monday at 5:30 AM!'
                : 'General gym floor training is open for all members. Timings vary according to trainer availability.'}
            </p>
            <button
              onClick={() => openBooking()}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold shadow-md cursor-pointer"
            >
              <span>{activeDay === 'SUN' ? 'Book for Monday' : 'Enquire About Timings'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentClasses.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between transition-all hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Open Access • No Seat Limit</span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-2xl uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors mb-4">
                    {item.name}
                  </h3>

                  <div className="space-y-2 mb-5 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-zinc-200 font-medium">{item.time} (Flexible)</span>
                      <span className="text-zinc-500">&bull;</span>
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-500" />
                      <span>
                        Coach: <strong className="text-zinc-200 font-semibold">{item.trainerName}</strong>
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 italic mb-5 bg-zinc-900/60 px-3 py-2 rounded-lg border border-zinc-800/80">
                    *Timing may adjust based on trainer availability. Walk-ins welcome.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openBooking(undefined, undefined)}
                    className="flex-1 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold flex items-center justify-center gap-2 bg-zinc-900 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all cursor-pointer"
                  >
                    <span>Join Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={openTrainersTab}
                    className="px-3.5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    title="View Trainers"
                  >
                    Trainers
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
