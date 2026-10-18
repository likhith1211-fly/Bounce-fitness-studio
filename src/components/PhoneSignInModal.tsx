import React, { useState } from 'react';
import { User, Phone, X, CheckCircle2, ShieldCheck, Dumbbell, LogOut, Calendar, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudio } from '../context/StudioContext';

interface PhoneSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAN_OPTIONS = [
  {
    label: 'Daily Pass (₹300 - Only for that day)',
    planName: 'Daily Pass',
    durationLabel: '1 Day',
    durationDays: 1,
    priceDisplay: '₹300',
  },
  {
    label: '1 Month Membership (₹2,000 - 1 Month)',
    planName: '1 Month Membership',
    durationLabel: '1 Month (30 Days)',
    durationDays: 30,
    priceDisplay: '₹2,000',
  },
  {
    label: '3 Months Transformation (₹5,000 - 3 Months)',
    planName: '3 Months Membership',
    durationLabel: '3 Months (90 Days)',
    durationDays: 90,
    priceDisplay: '₹5,000',
  },
  {
    label: '1 Year Annual Membership (₹12,999 - 12 Months)',
    planName: '1 Year Membership',
    durationLabel: '1 Year (365 Days)',
    durationDays: 365,
    priceDisplay: '₹12,999',
  },
  {
    label: 'Personal Training (₹12,000 / Month - 1 Month)',
    planName: 'Personal Training (1-on-1)',
    durationLabel: '1 Month (30 Days)',
    durationDays: 30,
    priceDisplay: '₹12,000 / Month',
  },
  {
    label: 'Free Trial Session (Complimentary - 1 Day)',
    planName: 'Free Trial Session',
    durationLabel: '1 Day Trial',
    durationDays: 1,
    priceDisplay: 'Complimentary',
  },
];

export const PhoneSignInModal: React.FC<PhoneSignInModalProps> = ({ isOpen, onClose }) => {
  const { phoneUser, signInWithPhone, signOutPhone } = useAuth();
  const { registerMemberSignIn } = useStudio();
  const [name, setName] = useState(phoneUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(phoneUser?.phone || '');
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = (isUpdatingPlan && phoneUser ? phoneUser.name : name).trim();
    const finalPhone = (isUpdatingPlan && phoneUser ? phoneUser.phone : phoneNumber).trim();

    if (!finalName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanPhone = finalPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const chosen = PLAN_OPTIONS[selectedPlanIdx] || PLAN_OPTIONS[0];

    const sub = await registerMemberSignIn({
      name: finalName,
      phone: finalPhone,
      planName: chosen.planName,
      durationLabel: chosen.durationLabel,
      durationDays: chosen.durationDays,
      priceDisplay: chosen.priceDisplay,
    });

    signInWithPhone({
      id: sub.id,
      name: sub.name,
      phone: sub.phone,
      planName: sub.planName,
      durationLabel: sub.durationLabel,
      durationDays: sub.durationDays,
      priceDisplay: sub.priceDisplay,
      startDate: sub.startDate,
      endDate: sub.endDate,
      signedInAt: sub.createdAt,
    });

    setIsUpdatingPlan(false);
    setSuccessMsg(`Welcome, ${finalName}! Your ${chosen.planName} (${chosen.durationLabel}) has been synced with the Gym Owner Admin Account.`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  const handleSignOut = () => {
    signOutPhone();
    setName('');
    setPhoneNumber('');
    setIsUpdatingPlan(false);
    onClose();
  };

  // Calculate remaining days for signed-in member
  const getRemainingInfo = () => {
    if (!phoneUser || !phoneUser.endDate) return { daysLeft: 1, isExpired: false, isExpiringSoon: false };
    const diffMs = new Date(phoneUser.endDate).getTime() - Date.now();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isExpired = diffMs <= 0;
    const isExpiringSoon = !isExpired && daysLeft <= 3;
    return { daysLeft: Math.max(0, daysLeft), isExpired, isExpiringSoon };
  };

  const { daysLeft, isExpired, isExpiringSoon } = getRemainingInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Studio Crest */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-amber-500/50 p-1 flex items-center justify-center shrink-0">
            <img
              src="/bounce_icon_crest.png"
              alt="Bounce Crest"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Dumbbell className="w-3 h-3" />
              <span>Member &amp; Admin Synced Pass</span>
            </div>
            <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">
              {phoneUser && !isUpdatingPlan ? 'Member Pass & Plan' : 'Member Sign In'}
            </h3>
          </div>
        </div>

        {phoneUser && !isUpdatingPlan ? (
          <div className="space-y-5">
            {/* Expiration / Duration Finished Reminder Alert */}
            {isExpired && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/60 text-xs text-rose-200 space-y-2 animate-pulse">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider text-rose-400 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Plan Duration Finished — Reminder!</span>
                </div>
                <p className="leading-relaxed">
                  Your <strong>{phoneUser.planName} ({phoneUser.durationLabel})</strong> duration has finished! Both you and Gym Owner <strong>Alwyn</strong> have been notified. Please renew your plan below or at the studio desk.
                </p>
              </div>
            )}

            {isExpiringSoon && !isExpired && (
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/50 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Renewal Reminder:</strong> Your <strong>{phoneUser.planName}</strong> finishes in <strong>{daysLeft} {daysLeft === 1 ? 'day' : 'days'}</strong>.
                </span>
              </div>
            )}

            <div className={`p-5 rounded-2xl bg-zinc-900 border space-y-3 ${isExpired ? 'border-rose-500/50' : 'border-emerald-500/30'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-xl ${isExpired ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {phoneUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">
                    {phoneUser.name}
                  </h4>
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{phoneUser.phone}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Selected Plan:</span>
                  <span className="font-bold text-amber-400">{phoneUser.planName || 'Daily Pass'} ({phoneUser.priceDisplay || '₹300'})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Joined Duration:</span>
                  <span className="font-bold text-white">{phoneUser.durationLabel || '1 Day'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Start Date:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">
                    {new Date(phoneUser.startDate || phoneUser.signedInAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Valid Until:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">
                    {phoneUser.endDate
                      ? new Date(phoneUser.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Today'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                  <span className="text-zinc-400">Duration Status:</span>
                  {isExpired ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-black uppercase text-[10px]">
                      Duration Finished • Renew Now
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active ({daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Left)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
              ✅ Synced directly with Gym Owner <strong className="text-white">Alwyn&apos;s Admin Account</strong>. Both you and the admin receive automatic reminders when your plan duration finishes.
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setIsUpdatingPlan(true)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/40 font-display uppercase tracking-wider text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isExpired ? 'Renew / Choose New Plan' : 'Change or Renew Plan Duration'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-sm font-bold shadow-lg transition-all cursor-pointer"
                >
                  Continue Workout
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-rose-500/20 text-rose-400 border border-zinc-800 hover:border-rose-500/40 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-zinc-400">
              Enter your name, mobile number, and select your membership duration. Your enrollment is immediately synced with the Gym Owner Admin Account!
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {!isUpdatingPlan && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Gowda"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1.5">
                    Phone Number (Mobile / WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98450 12345"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1.5">
                Choose Plan &amp; Duration (Synced to Admin) *
              </label>
              <select
                value={selectedPlanIdx}
                onChange={(e) => setSelectedPlanIdx(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {PLAN_OPTIONS.map((opt, idx) => (
                  <option key={opt.planName} value={idx}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Duration Summary */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Duration: <strong>{PLAN_OPTIONS[selectedPlanIdx]?.durationLabel}</strong>
                </span>
              </div>
              <span className="font-bold text-white">
                {PLAN_OPTIONS[selectedPlanIdx]?.priceDisplay}
              </span>
            </div>

            <div className="pt-2 flex gap-2">
              {isUpdatingPlan && (
                <button
                  type="button"
                  onClick={() => setIsUpdatingPlan(false)}
                  className="px-4 py-3.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-base font-bold shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
              >
                {isUpdatingPlan ? 'Update Plan & Sync to Admin' : 'Sign In & Continue'}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Synced with Admin &bull; Automatic Expiry Reminder</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
