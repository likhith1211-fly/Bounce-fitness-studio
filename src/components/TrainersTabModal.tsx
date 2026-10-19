import React, { useState } from 'react';
import { X, Users, Award, ShieldCheck, Calendar, Clock, MessageSquare, Dumbbell, Camera } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { Trainer } from '../types';

export const TrainersTabModal: React.FC = () => {
  const { isTrainersTabOpen, closeTrainersTab, trainers, updateTrainer, openBooking, settings } = useStudio();
  const [activeTrainerId, setActiveTrainerId] = useState<string>('all');
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  if (!isTrainersTabOpen) return null;

  const activeTrainers = trainers
    .filter((t) => t.isActive)
    .sort((a, b) => a.order - b.order);

  const visibleTrainers =
    activeTrainerId === 'all'
      ? activeTrainers
      : activeTrainers.filter((t) => t.id === activeTrainerId);

  const handlePhotoUpload = (trainer: Trainer, file?: File) => {
    if (!file) return;
    setUploadingId(trainer.id);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxW = 640;
        const maxH = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          await updateTrainer({ ...trainer, photoUrl: dataUrl });
        }
        setUploadingId(null);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white leading-none">
                  Bounce Fitness Trainers Tab
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-zinc-950">
                  {activeTrainers.length} Coaches
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Alwyn (Gym Owner) &bull; Glenn Prabhu (Head Coach) &bull; Firoz (Weight Loss &amp; Abs) &bull; Floor Trainer (Daily Workouts)
              </p>
            </div>
          </div>

          <button
            onClick={closeTrainersTab}
            className="p-2.5 rounded-xl bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 cursor-pointer"
            title="Close Trainers Tab"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-6 py-3.5 bg-zinc-950 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTrainerId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTrainerId === 'all'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All Trainers ({activeTrainers.length})
          </button>
          {activeTrainers.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTrainerId(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                activeTrainerId === t.id
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Trainers Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div
            className={`grid grid-cols-1 ${
              visibleTrainers.length === 1 ? 'lg:grid-cols-1 max-w-3xl mx-auto' : 'md:grid-cols-2'
            } gap-6`}
          >
            {visibleTrainers.map((trainer) => {
              const isOwner = trainer.name.toLowerCase().includes('alwyn');
              return (
                <div
                  key={trainer.id}
                  className={`rounded-2xl bg-zinc-900/70 border p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all ${
                    isOwner ? 'border-amber-500/60 ring-1 ring-amber-500/20' : 'border-zinc-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="relative w-full sm:w-44 h-56 sm:h-48 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                      <img
                        src={trainer.photoUrl}
                        alt={trainer.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/gym_images/inside_strength_area_2.jpg';
                        }}
                      />
                      <label
                        className="absolute bottom-2 left-2 right-2 py-1 px-2 rounded bg-zinc-950/85 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 border border-zinc-700 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        title={`Upload photo for ${trainer.name}`}
                      >
                        <Camera className="w-3 h-3" />
                        <span>{uploadingId === trainer.id ? 'Saving...' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(trainer, e.target.files?.[0])}
                        />
                      </label>
                      {isOwner && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider">
                          Real Owner
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2.5">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {trainer.role}
                        </span>
                        <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white mt-1">
                          {trainer.name}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{trainer.specialization}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-800 px-2.5 py-0.5 rounded">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>{trainer.experience}</span>
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {trainer.bio}
                      </p>

                      <div className="pt-1 flex flex-wrap gap-3 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <strong className="text-zinc-200">{trainer.availableDays}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <strong className="text-zinc-200">{trainer.availableHours}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        closeTrainersTab();
                        openBooking('personal-training', trainer.id);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Dumbbell className="w-4 h-4" />
                      <span>Book With {trainer.name.split(' ')[0]}</span>
                    </button>

                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello Bounce Fitness Studio! I would like to enquire about training with ${trainer.name} (${trainer.role}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 bg-zinc-900/90 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <span>
            Personal Training is <strong className="text-amber-400">₹12,000 / month</strong> (very negotiable when spoken directly at the studio).
          </span>
          <button
            onClick={closeTrainersTab}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wider text-xs cursor-pointer"
          >
            Close Tab
          </button>
        </div>
      </div>
    </div>
  );
};
