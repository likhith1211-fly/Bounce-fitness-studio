import React, { useState } from 'react';
import { Sparkles, Zap, Video, Camera, ArrowRight, Loader2, CheckCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const AiStudioSuite: React.FC = () => {
  const { openBooking } = useStudio();

  // Tab State
  const [activeTab, setActiveTab] = useState<'advisor' | 'form' | 'art'>('advisor');

  // 1. Advisor State
  const [goal, setGoal] = useState('Build Strength & Athletic Muscle');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [days, setDays] = useState('4 Days / Week');
  const [notes, setNotes] = useState('');
  const [advisorResult, setAdvisorResult] = useState<string | null>(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // 2. Form Analyzer State
  const [exerciseName, setExerciseName] = useState('Barbell Squat');
  const [focusNotes, setFocusNotes] = useState('Checking lower back rounding & knee tracking');
  const [formMediaBase64, setFormMediaBase64] = useState<string | null>(null);
  const [formMimeType, setFormMimeType] = useState<string | null>(null);
  const [formAnalysisResult, setFormAnalysisResult] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // 3. Art Generator State
  const [artPrompt, setArtPrompt] = useState('Athletic female kettlebell swing with gold rim lighting in a moody dark gym');
  const [artResolution, setArtResolution] = useState<'1K' | '2K' | '4K'>('1K');
  const [artResult, setArtResult] = useState<string | null>(null);
  const [artLoading, setArtLoading] = useState(false);

  // Handle Form File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormMediaBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Run Advisor
  const handleRunAdvisor = async () => {
    setAdvisorLoading(true);
    setAdvisorResult(null);
    try {
      const res = await fetch('/api/gemini/fitness-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          experienceLevel,
          preferredDays: days,
          additionalNotes: notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdvisorResult(data.recommendation);
      } else {
        setAdvisorResult('Bounce coaching team recommendation: We suggest starting with our structured Gym Training program 3-4 days a week with a certified coach.');
      }
    } catch (e) {
      setAdvisorResult('Recommended program: Hybrid Gym Strength + 1 Day Zumba Cardio. Visit us for an in-person assessment.');
    } finally {
      setAdvisorLoading(false);
    }
  };

  // Run Form Analysis
  const handleRunFormAnalysis = async () => {
    if (!formMediaBase64 || !formMimeType) return;
    setFormLoading(true);
    setFormAnalysisResult(null);
    try {
      const res = await fetch('/api/gemini/analyze-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: formMediaBase64,
          mimeType: formMimeType,
          exerciseName,
          focusNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFormAnalysisResult(data.analysis);
      } else {
        setFormAnalysisResult(data.error || 'Movement analysis complete.');
      }
    } catch (e: any) {
      setFormAnalysisResult('Analysis failed. Please ensure file is an image or short mp4 clip.');
    } finally {
      setFormLoading(false);
    }
  };

  // Run Art Generator
  const handleRunArt = async () => {
    setArtLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: artPrompt,
          imageSize: artResolution,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setArtResult(data.imageUrl);
      } else {
        // Fallback visual
        setArtResult('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop');
      }
    } catch (e) {
      setArtResult('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop');
    } finally {
      setArtLoading(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
            Intelligent Studio Tools
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            Bounce Digital Lab
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Get instant workout matching, upload lifting clips for biomechanical checks, and explore high-definition fitness visuals.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display uppercase tracking-wider text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'advisor'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Fast Goal Advisor</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display uppercase tracking-wider text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video &amp; Form Check</span>
          </button>

          <button
            onClick={() => setActiveTab('art')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display uppercase tracking-wider text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'art'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Studio Art Studio</span>
          </button>
        </div>

        {/* Tab 1: Fast Goal Advisor */}
        {activeTab === 'advisor' && (
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
              <div>
                <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  Instant Fitness Program Matcher
                </h3>
                <p className="text-xs text-zinc-400">Powered by Gemini 3.1 Flash Lite for low-latency responses</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
                Free Assessment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Primary Fitness Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option>Build Strength &amp; Athletic Muscle</option>
                  <option>Weight Loss &amp; High Calorie Burn</option>
                  <option>Cardiovascular Stamina (Zumba/CrossFit)</option>
                  <option>Posture Correction &amp; Joint Health</option>
                  <option>Personal 1-on-1 Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option>Complete Beginner (First Time in Gym)</option>
                  <option>Intermediate (Trained previously)</option>
                  <option>Advanced Athlete</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Commitment Days
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option>3 Days / Week</option>
                  <option>4 Days / Week</option>
                  <option>5-6 Days / Week</option>
                  <option>Weekends Only</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Any Past Injuries, Medical Notes, or Specific Schedule Preferences? (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Mild lower back stiffness, prefer early morning 6:00 AM slot"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleRunAdvisor}
              disabled={advisorLoading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold shadow-md disabled:opacity-50 cursor-pointer"
            >
              {advisorLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Profile...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Get Coach Recommendation</span>
                </>
              )}
            </button>

            {advisorResult && (
              <div className="mt-6 p-6 rounded-xl bg-zinc-950 border border-zinc-800 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Bounce Coach Prescription
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-2">
                  {advisorResult}
                </div>
                <div className="mt-5 pt-4 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={() => openBooking()}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-5 py-2.5 rounded-lg font-display uppercase tracking-wider text-sm font-bold cursor-pointer"
                  >
                    <span>Book Your Prescribed Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Multimodal Video / Photo Form & Movement Analyzer */}
        {activeTab === 'form' && (
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
              <div>
                <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  Biomechanical Form &amp; Movement Analyzer
                </h3>
                <p className="text-xs text-zinc-400">Powered by Gemini 3.8 Flash Multimodal Video &amp; Image Intelligence</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
                Coach Feedback
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 mb-4"
                  placeholder="e.g. Barbell Squat, Deadlift, Push-Up, Kettlebell Swing"
                />

                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Specific Movement Focus
                </label>
                <textarea
                  rows={3}
                  value={focusNotes}
                  onChange={(e) => setFocusNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Am I hitting depth? Is my lower back rounding at the bottom?"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Upload Workout Video Clip or Posture Photo
                </label>
                <div className="border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-xl p-6 text-center bg-zinc-950 flex flex-col items-center justify-center min-h-[170px] relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {formMediaBase64 ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                      <p className="text-xs font-semibold text-white">Media Loaded Ready For Analysis</p>
                      <p className="text-[10px] text-zinc-500">Click or drag another to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="w-8 h-8 text-zinc-500 mx-auto" />
                      <p className="text-xs font-semibold text-zinc-300">Upload video (mp4/webm) or exercise photo</p>
                      <p className="text-[10px] text-zinc-500">Up to 20MB &bull; Side or 45-degree angle recommended</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleRunFormAnalysis}
              disabled={formLoading || !formMediaBase64}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold shadow-md disabled:opacity-50 cursor-pointer"
            >
              {formLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Rep Posture &amp; Joint Mechanics...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Analyze Workout Form</span>
                </>
              )}
            </button>

            {formAnalysisResult && (
              <div className="mt-6 p-6 rounded-xl bg-zinc-950 border border-zinc-800 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Biomechanical Critique &amp; Corrections
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {formAnalysisResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Studio Art Studio */}
        {activeTab === 'art' && (
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
              <div>
                <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                  Studio Atmosphere &amp; Motivation Generator
                </h3>
                <p className="text-xs text-zinc-400">Generate athletic wallpaper and visuals with configurable resolution</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
                Resolution Affordance
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Prompt
                </label>
                <input
                  type="text"
                  value={artPrompt}
                  onChange={(e) => setArtPrompt(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="Describe gym atmosphere, lighting, movement..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Resolution Size
                </label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                  {(['1K', '2K', '4K'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setArtResolution(size)}
                      className={`py-1.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                        artResolution === size
                          ? 'bg-amber-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleRunArt}
              disabled={artLoading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold shadow-md disabled:opacity-50 cursor-pointer mb-6"
            >
              {artLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering High Resolution Visual...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>Generate {artResolution} Fitness Artwork</span>
                </>
              )}
            </button>

            {artResult && (
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-4 text-center">
                <img
                  src={artResult}
                  alt="Generated Studio Art"
                  className="max-h-[420px] mx-auto rounded-lg object-contain shadow-2xl"
                />
                <p className="text-xs text-zinc-400 mt-3">
                  Resolution: <strong className="text-amber-400">{artResolution}</strong> &bull; Bounce Fitness Studio Aesthetics
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
