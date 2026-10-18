import React from 'react';
import { Star, ArrowRight, ChevronDown, CheckCircle2, ShieldCheck, MapPin, Users } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { LiveStudioClock } from './LiveStudioClock';

export const Hero: React.FC = () => {
  const { openBooking, openTrainersTab, settings } = useStudio();

  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 sm:pt-36 pb-16 overflow-hidden bg-zinc-950">
      {/* Background Image with Dark Vignette and Athletic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bounce_reception_hd.jpg"
          alt="Bounce Fitness Studio Chikmagalur Google Maps Verified Photo"
          className="w-full h-full object-cover object-center filter brightness-[0.28] contrast-[1.2] scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/grass-cs/AABkmLeX51g7wrsXAbJXIZddBR1T5bimpAEacj0Zi3xA8I5ASq1jqUZefyS-O7n8788IAJC7ZjD5YumhY5KeBE_O3U2NcWQm6iptEKb7w9Ka2Umf226RmoLN8-P8l3JXIto7mReNnN2x-w=w1600-h1066-k-no';
          }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-zinc-950/40" />
        <div className="absolute inset-0 bg-radial-at-c from-amber-500/10 via-transparent to-black/85 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Real-time Status Badge & Location Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
          <LiveStudioClock compact />

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/60 shadow-lg shadow-black/40 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
              8QCV+WH • Kalyan Nagar, Jyothi Nagar
            </span>
          </div>
        </div>

        {/* Authentic Studio Signboard Badge from Google Maps */}
        <div className="mb-5 inline-block rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950/90 backdrop-blur-md p-2.5 hover:border-amber-500/50 transition-all">
          <img
            src="/bounce_official_logo.png"
            alt="Bounce Fitness Studio Official Logo"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain rounded-xl"
          />
        </div>

        {/* Main Brand Title */}
        <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white uppercase leading-[0.9] mb-4">
          BOUNCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">FITNESS</span> STUDIO
        </h1>

        {/* Tagline */}
        <p className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-amber-400/90 font-bold mb-6">
          &ldquo;Train Strong. Move Better. Become Better.&rdquo;
        </p>

        {/* Supporting description */}
        <p className="max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed font-normal mb-8">
          Build strength, improve your fitness and stay consistent with expert guidance in a motivating fitness environment.
        </p>

        {/* Quick Transparent Pricing Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs text-zinc-300">
          <span className="px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-amber-400 font-bold">
            Day Pass: ₹300
          </span>
          <span className="px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800">
            1 Month: ₹2,000
          </span>
          <span className="px-3 py-1 rounded-full bg-zinc-900/90 border border-amber-500/40 text-white font-bold">
            3 Months: ₹5,000
          </span>
          <span className="px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800">
            1 Year: ₹12,999
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
            PT: ₹12,000/mo (Negotiable)
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
          <button
            onClick={() => openBooking()}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-4 rounded-xl font-display uppercase tracking-wider text-xl font-bold transition-all duration-200 transform hover:-translate-y-0.5 shadow-xl shadow-amber-500/25 cursor-pointer"
          >
            <span>Book a Session</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              const el = document.querySelector('#explore');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white px-7 py-4 rounded-xl font-display uppercase tracking-wider text-xl font-bold border border-zinc-700/80 transition-all duration-200 cursor-pointer"
          >
            <span>Explore 3D Show &amp; Gym</span>
          </button>

          <a
            href={`tel:${settings.phone}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-950/90 hover:bg-zinc-900 text-zinc-300 hover:text-white px-6 py-4 rounded-xl font-display uppercase tracking-wider text-base font-bold border border-zinc-800 transition-colors"
          >
            <span>Call: {settings.phone}</span>
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-zinc-800/80 max-w-2xl w-full">
          <div className="flex items-center justify-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-white">4.6★</span>
            <span className="text-xs text-zinc-400">Trusted Local Gym</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-zinc-300">Clean &amp; Structured Space</span>
          </div>

          <button
            onClick={openTrainersTab}
            className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/40 transition-all cursor-pointer group shadow-sm"
            title="Open Dedicated Trainers Tab"
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">See Our Trainers Tab &rarr;</span>
          </button>
        </div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-500 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
        aria-label="Scroll to content"
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
      </button>
    </section>
  );
};
