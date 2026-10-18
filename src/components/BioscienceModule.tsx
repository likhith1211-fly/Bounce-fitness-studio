import React, { useState } from 'react';
import { Dna, Activity, Zap, ShieldCheck, BookOpen, Layers, Flame, ArrowRight } from 'lucide-react';

interface MovementBio {
  name: string;
  category: string;
  primeMover: string;
  synergists: string[];
  antagonists: string[];
  emgActivation: { muscle: string; percentage: number; color: string }[];
  pathway: string;
  energySystem: 'Phosphagen (ATP-CP)' | 'Fast Glycolytic' | 'Aerobic Oxidative';
  scientificNote: string;
}

export const BioscienceModule: React.FC = () => {
  const [selectedMovement, setSelectedMovement] = useState<string>('Squat');

  const movements: Record<string, MovementBio> = {
    Squat: {
      name: 'Back Squat (Kinetic Chain)',
      category: 'Compound Knee & Hip Extension',
      primeMover: 'Quadriceps Femoris (Rectus Femoris, Vastus Lateralis/Medialis)',
      synergists: ['Gluteus Maximus', 'Adductor Magnus', 'Soleus', 'Gastrocnemius'],
      antagonists: ['Hamstrings (Biceps Femoris)', 'Tibialis Anterior'],
      emgActivation: [
        { muscle: 'Quadriceps Femoris', percentage: 92, color: '#f59e0b' },
        { muscle: 'Gluteus Maximus', percentage: 84, color: '#fbbf24' },
        { muscle: 'Erector Spinae', percentage: 76, color: '#38bdf8' },
        { muscle: 'Core (Rectus Abdominis)', percentage: 68, color: '#10b981' },
      ],
      pathway: 'Mechanosensitive focal adhesions (costameres) transduce sarcolemmal strain, activating p70S6K and downstream mTORC1 cascade.',
      energySystem: 'Phosphagen (ATP-CP)',
      scientificNote: 'Knee flexion depth past 90° increases gluteus maximus recruitment by 38% compared to shallow squats (Schoenfeld, J. Strength Cond. Res).',
    },
    Deadlift: {
      name: 'Conventional Deadlift (Posterior Chain)',
      category: 'Hip Hinge & Axial Load',
      primeMover: 'Gluteus Maximus & Hamstring Complex (Semitendinosus, Semimembranosus)',
      synergists: ['Erector Spinae', 'Latissimus Dorsi', 'Trapezius', 'Quadriceps'],
      antagonists: ['Rectus Abdominis', 'Iliopsoas'],
      emgActivation: [
        { muscle: 'Gluteus Maximus', percentage: 95, color: '#f59e0b' },
        { muscle: 'Erector Spinae', percentage: 88, color: '#fbbf24' },
        { muscle: 'Hamstring Complex', percentage: 82, color: '#38bdf8' },
        { muscle: 'Forearm Grip Flexors', percentage: 79, color: '#10b981' },
      ],
      pathway: 'High shear and axial compressive loading triggers calcium release from sarcoplasmic reticulum, stimulating satellite cell proliferation.',
      energySystem: 'Phosphagen (ATP-CP)',
      scientificNote: 'Latching latissimus dorsi prior to lift reduces lumbar spinal shear by over 30% by tensioning thoracolumbar fascia (McGill et al., Biomechanics of Spine).',
    },
    KettlebellSwing: {
      name: 'Hardstyle Kettlebell Swing',
      category: 'Ballistic Hip Snap & Power',
      primeMover: 'Gluteus Maximus (Rapid Concentric Pulse)',
      synergists: ['Hamstrings', 'Latissimus Dorsi', 'Rectus Abdominis', 'Quadratus Lumborum'],
      antagonists: ['Hip Flexors (Psoas Major)'],
      emgActivation: [
        { muscle: 'Gluteus Maximus (Peak Snap)', percentage: 98, color: '#f59e0b' },
        { muscle: 'Erector Spinae', percentage: 72, color: '#fbbf24' },
        { muscle: 'Core Anti-Extension', percentage: 86, color: '#38bdf8' },
        { muscle: 'Cardiorespiratory (VO2 Peak)', percentage: 81, color: '#10b981' },
      ],
      pathway: 'Ballistic stretch-shortening cycle (SSC) stores elastic potential energy in myofascial tendons while driving mitochondrial biogenesis via PGC-1α.',
      energySystem: 'Fast Glycolytic',
      scientificNote: 'Generates up to 3.2G of hip velocity without high lumbar spine compression, making it optimal for joint-sparing conditioning.',
    },
    ZumbaCardio: {
      name: 'Zumba High-Cadence Movement',
      category: 'Multi-Planar Aerobic Conditioning',
      primeMover: 'Cardiac Myocytes, Quadriceps & Calf Muscle Pumps',
      synergists: ['Hip Abductors (Gluteus Medius)', 'Core Obliques', 'Deltoids'],
      antagonists: ['Passive elastic recoil structures'],
      emgActivation: [
        { muscle: 'Cardiovascular (Cardiac Output)', percentage: 88, color: '#f59e0b' },
        { muscle: 'Gluteus Medius (Lateral Agility)', percentage: 74, color: '#fbbf24' },
        { muscle: 'Calf & Soleus (Cadence)', percentage: 80, color: '#38bdf8' },
        { muscle: 'Obliques & Transverse Abdominis', percentage: 71, color: '#10b981' },
      ],
      pathway: 'Continuous substrate utilization of glycogen and beta-oxidation of fatty acids in mitochondria, enhancing capillary density and VO2 max.',
      energySystem: 'Aerobic Oxidative',
      scientificNote: 'High dance cadences recruit slow-twitch Type I muscle fibers and induce neurotrophic factors (BDNF), boosting mood and cognitive stamina.',
    },
  };

  const current = movements[selectedMovement];

  return (
    <section id="bioscience" className="py-24 bg-zinc-950 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Dna className="w-3.5 h-3.5 text-amber-400" />
            <span>Exercise Physiology &amp; Kinesiology</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            The Science Of Human Movement
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            At Bounce Fitness Studio, workouts are grounded in evidence-based exercise physiology, biomechanical muscle activation, and cellular bioenergetics.
          </p>
        </div>

        {/* Movement Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {[
            { id: 'Squat', label: 'Barbell Squat' },
            { id: 'Deadlift', label: 'Posterior Deadlift' },
            { id: 'KettlebellSwing', label: 'CrossFit Kettlebell' },
            { id: 'ZumbaCardio', label: 'Zumba Rhythm Bioenergetics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMovement(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-display uppercase tracking-wider text-sm font-bold transition-all cursor-pointer ${
                selectedMovement === tab.id
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Analysis Interactive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: EMG & Muscle Activation */}
          <div className="lg:col-span-6 p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                  {current.category}
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{current.energySystem}</span>
                </span>
              </div>
              <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                {current.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                <strong>Prime Mover:</strong> {current.primeMover}
              </p>
            </div>

            {/* EMG Motor Unit Activation Bars */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Peak Motor Unit Electromyography (EMG % MVC):
              </h4>
              {current.emgActivation.map((item) => (
                <div key={item.muscle} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-200">{item.muscle}</span>
                    <span className="text-amber-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Synergist & Antagonist Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Stabilizing Synergists
                </span>
                <p className="text-zinc-300 font-medium leading-tight">
                  {current.synergists.join(', ')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Antagonistic Co-contraction
                </span>
                <p className="text-zinc-300 font-medium leading-tight">
                  {current.antagonists.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Cellular Signaling & Scientific Literature */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-7 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-6">
              <div className="flex items-center gap-2 text-amber-400">
                <Zap className="w-4 h-4" />
                <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                  Mechanotransduction &amp; Cellular Signaling
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-2">
                <p className="font-semibold text-white">Hypertrophic Cascade Trigger:</p>
                <p>{current.pathway}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[11px]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Clinical Exercise Research Grounding</span>
                </div>
                <p className="italic text-zinc-300">&ldquo;{current.scientificNote}&rdquo;</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Coach Supervised Execution:</strong>
                  <p className="mt-0.5 text-zinc-300">
                    Understanding muscle science prevents common overuse injuries. Our trainers at Bounce Fitness Studio apply these kinesiology principles on every set you perform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
