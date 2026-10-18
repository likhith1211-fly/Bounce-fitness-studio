import React from 'react';
import { Star, CheckCircle, ExternalLink, MessageSquare } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const ReviewsSection: React.FC = () => {
  const { testimonials, settings } = useStudio();

  return (
    <section id="reviews" className="py-24 bg-zinc-950 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
              Member Experiences
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none">
              What Our Members Say
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl">
              Authentic feedback from fitness enthusiasts training consistently at Bounce Fitness Studio Chikmagalur.
            </p>
          </div>

          {/* Rating Summary Pill */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs text-zinc-400 mt-1">Based on Google Reviews</div>
            </div>
            <div className="h-10 w-[1px] bg-zinc-800" />
            <div className="text-3xl font-display font-black text-white leading-none">
              {settings.rating}★
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between transition-all hover:bg-zinc-900"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  {item.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic mb-6">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80">
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {item.customerName}
                </h4>
                {item.badge && (
                  <p className="text-[11px] text-amber-400 font-medium mt-0.5">
                    {item.badge}
                  </p>
                )}
                <p className="text-[10px] text-zinc-500 mt-0.5">{item.date || 'Google Review'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Link to Google Business Profile */}
        <div className="text-center">
          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>See More Reviews on Google Maps</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>
    </section>
  );
};
