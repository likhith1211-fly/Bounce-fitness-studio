import React from 'react';
import { Check, Star, ArrowRight, MessageSquare, PhoneCall, Sparkles, ShieldCheck, HeartHandshake, Users } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const MembershipPricingSection: React.FC = () => {
  const { membershipPlans, openBooking, openTrainersTab, settings } = useStudio();

  return (
    <section id="membership" className="py-24 bg-zinc-950 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Transparent Pricing</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            Membership &amp; Training Rates
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            From flexible daily passes to full annual lifestyle memberships and 1-on-1 personal coaching with Gym Owner Alwyn, Head Coach Glenn Prabhu, and Weight Loss &amp; Abs Specialist Firoz.
          </p>

          {/* Direct In-Person Negotiation Notice */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-300 font-semibold shadow-lg">
            <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
            <span>All fees are directly negotiable when spoken or visited in-person at the studio!</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {membershipPlans
            .filter((p) => p.isActive)
            .sort((a, b) => a.order - b.order)
            .map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-amber-950/20 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 scale-[1.02]'
                    : plan.id === 'personal-training'
                    ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/40'
                    : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-zinc-950" />
                    <span>Most Popular</span>
                  </div>
                )}

                {plan.id === 'personal-training' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-zinc-800 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>Alwyn &bull; Glenn &bull; Firoz</span>
                  </div>
                )}

                <div>
                  <h3 className="font-display font-black text-xl uppercase tracking-wider text-white mb-1">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">{plan.duration}</p>

                  <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 mb-5">
                    <div className="text-2xl font-black text-amber-400 font-display">
                      {plan.price}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      <HeartHandshake className="w-3 h-3" />
                      <span>Negotiable in person</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  {plan.terms && (
                    <p className="text-[10px] text-zinc-400 mb-3 italic leading-tight bg-zinc-950/50 p-2 rounded-lg border border-zinc-900">
                      *{plan.terms}
                    </p>
                  )}
                  {plan.id === 'personal-training' && (
                    <button
                      onClick={openTrainersTab}
                      className="w-full py-2.5 rounded-xl font-display uppercase tracking-wider text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>See Trainers Tab</span>
                    </button>
                  )}
                  <button
                    onClick={() => openBooking(plan.id === 'personal-training' ? 'personal-training' : 'gym-training')}
                    className={`w-full py-3 rounded-xl font-display uppercase tracking-wider text-sm font-bold transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20'
                        : 'bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-white'
                    }`}
                  >
                    Select &bull; Enquire
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* High Conversion Trial Section */}
        <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/30 border border-zinc-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Zero Obligation • Direct In-Person Chat
            </span>
            <h3 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-tight leading-none mt-2 mb-3">
              Ready to Walk In &amp; Train?
            </h3>
            <p className="text-zinc-300 text-base sm:text-lg mb-8 leading-relaxed">
              Drop by Bounce Fitness Studio at Gundappa Gowda Arcade, Opp. Chikmagalur Coffee Works, Kalyan Nagar, Jyothi Nagar. Test the machines, meet Gym Owner Alwyn, Head Coach Glenn Prabhu, and Firoz, and negotiate your membership in person.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => openBooking('trial-session')}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-4 rounded-xl font-display uppercase tracking-wider text-lg font-bold shadow-xl shadow-amber-500/20 cursor-pointer"
              >
                <span>Book a Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-4 rounded-xl font-display uppercase tracking-wider text-lg font-bold border border-zinc-700 transition-colors"
              >
                <PhoneCall className="w-5 h-5 text-amber-400" />
                <span>Call {settings.phone}</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Bounce%20Fitness%20Studio,%20I%20am%20interested%20in%20gym%20membership`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-semibold ml-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat On WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
