import React, { useState } from 'react';
import { Award, Clock, Calendar, ArrowRight, ShieldCheck, Sparkles, Users, CheckCircle2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const TrainersSection: React.FC = () => {
  const { trainers, openBooking, openTrainersTab } = useStudio();
  const [selectedTrainerFilter, setSelectedTrainerFilter] = useState<string>('all');

  const activeTrainers = trainers
    .filter((t) => t.isActive)
    .sort((a, b) => a.order - b.order);

  const displayedTrainers =
    selectedTrainerFilter === 'all'
      ? activeTrainers
      : activeTrainers.filter((t) => t.id === selectedTrainerFilter);

  return (
    <section id="trainers" className="py-24 bg-zinc-950 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Expert Coaching Team</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            Meet Your Trainers
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Led by gym owner <strong className="text-white">Alwyn</strong>, head coach &amp; nutritionist <strong className="text-white">Glenn Prabhu</strong>, weight loss &amp; abs expert <strong className="text-white">Firoz</strong>, and our dedicated <strong className="text-white">Floor Trainer</strong> for daily workout suggestions.
          </p>

          <div className="mt-5">
            <button
              onClick={openTrainersTab}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/40 font-display uppercase tracking-wider text-sm font-bold transition-all cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Dedicated Trainers Tab View</span>
            </button>
          </div>
        </div>

        {/* Interactive Trainer Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedTrainerFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedTrainerFilter === 'all'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All Trainers ({activeTrainers.length})
          </button>
          {activeTrainers.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrainerFilter(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedTrainerFilter === t.id
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Trainers Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            displayedTrainers.length >= 4 ? 'lg:grid-cols-4' : displayedTrainers.length === 1 ? 'lg:grid-cols-1 max-w-2xl mx-auto' : 'lg:grid-cols-3'
          } gap-6`}
        >
          {displayedTrainers.map((trainer) => {
            const isOwner = trainer.name.toLowerCase().includes('alwyn');
            return (
              <div
                key={trainer.id}
                className={`bg-zinc-900/60 rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl flex flex-col justify-between group ${
                  isOwner
                    ? 'border-amber-500/60 ring-1 ring-amber-500/20'
                    : 'border-zinc-800 hover:border-amber-500/40'
                }`}
              >
                {/* Photo & Role */}
                <div>
                  <div className="relative h-72 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={trainer.photoUrl}
                      alt={trainer.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.08]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/gym_images/inside_strength_area_2.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                    {isOwner && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                        Gym Owner
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-zinc-950 shadow-md">
                        {trainer.role}
                      </span>
                      <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white mt-1.5 leading-tight">
                        {trainer.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Specialization & Experience */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{trainer.specialization}</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
                        <Award className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{trainer.experience}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed mb-5">
                      {trainer.bio}
                    </p>

                    {/* Availability */}
                    <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          Days: <strong className="text-zinc-200">{trainer.availableDays}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">
                          Hours: <strong className="text-zinc-200">{trainer.availableHours}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => openBooking('personal-training', trainer.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold bg-zinc-900 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all cursor-pointer"
                  >
                    <span>Train With {trainer.name.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
