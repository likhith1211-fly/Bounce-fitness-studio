import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useGymStatus } from '../hooks/useGymStatus';

export const ContactSection: React.FC = () => {
  const { settings, createEnquiry } = useStudio();
  const { isOpen, statusLabel } = useGymStatus();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interestedIn, setInterestedIn] = useState('Gym Training');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please enter your name, mobile number, and message.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await createEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        interestedIn,
        message: message.trim(),
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Studio Information */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold uppercase tracking-widest mb-3">
                Get In Touch
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none mb-4">
                Contact Bounce Fitness
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Have questions about membership packages, trainer availability, or booking your first trial workout? Speak directly with our front desk team.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Call Desk</span>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition-colors">
                      {settings.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">WhatsApp Desk</span>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {settings.whatsapp}
                    </a>
                  </p>
                </div>
              </div>



              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Studio Hours</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${isOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-0.5">Mon–Sat: {settings.openingHoursMonSat}</p>
                  <p className="text-xs text-rose-400">Sunday: {settings.openingHoursSun}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Location Address</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{settings.address}</p>
                  <p className="text-xs text-zinc-400">{settings.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-xl">
              <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white mb-2">
                Send An Enquiry
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                Fill in your details and our team will get back to you via WhatsApp or phone call.
              </p>

              {submitted ? (
                <div className="p-8 rounded-xl bg-zinc-950 border border-emerald-500/30 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-black text-2xl uppercase tracking-wider text-white">
                    Enquiry Submitted Successfully
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Thank you! Our studio coordinator will review your message and contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Gowda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1.5">
                        Phone Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98450 12345"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1.5">
                      Interested In
                    </label>
                    <select
                      value={interestedIn}
                      onChange={(e) => setInterestedIn(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option>Daily Pass (₹300 - Only for that day)</option>
                      <option>1 Month Membership (₹2,000)</option>
                      <option>3 Months Transformation (₹5,000)</option>
                      <option>1 Year Membership (₹12,999)</option>
                      <option>Personal Training (₹12,000 / month)</option>
                      <option>Gym Training &bull; Strength</option>
                      <option>Zumba Classes</option>
                      <option>CrossFit &bull; Functional</option>
                      <option>Free Trial Session</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Ask about membership pricing, batch timings, or equipment details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3.5 rounded-lg font-display uppercase tracking-wider text-base font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <span>Sending Enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
