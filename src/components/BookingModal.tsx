import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Target,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  Send,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudio } from '../context/StudioContext';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';

export const BookingModal: React.FC = () => {
  const {
    isBookingOpen,
    closeBooking,
    services,
    trainers,
    settings,
    createAppointment,
    isSlotAvailable,
    selectedServiceForBooking,
    selectedTrainerForBooking,
  } = useStudio();
  const { currentUser } = useAuth();

  // Booking Flow Steps: 1 to 5, and 6 is confirmation
  const [step, setStep] = useState<number>(1);

  // Form State
  const [serviceId, setServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [fitnessGoal, setFitnessGoal] = useState<string>('Build Strength & Consistency');
  const [trainerId, setTrainerId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Initialize or prefill
  useEffect(() => {
    if (isBookingOpen) {
      setStep(1);
      setErrorMsg('');
      setConfirmedBooking(null);

      // Preselect service if passed
      if (selectedServiceForBooking) {
        setServiceId(selectedServiceForBooking);
      } else if (services.length > 0) {
        setServiceId(services[0].id);
      }

      // Preselect trainer if passed
      if (selectedTrainerForBooking) {
        setTrainerId(selectedTrainerForBooking);
      } else {
        setTrainerId('');
      }

      // Prefill user details if authenticated
      if (currentUser) {
        if (currentUser.displayName) setCustomerName(currentUser.displayName);
        if (currentUser.email) setCustomerEmail(currentUser.email);
      }

      // Default date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // If tomorrow is Sunday, skip to Monday
      if (tomorrow.getDay() === 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
      }
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
      setSelectedSlot('06:00 AM – 07:00 AM');
    }
  }, [isBookingOpen, selectedServiceForBooking, selectedTrainerForBooking, currentUser, services]);

  if (!isBookingOpen) return null;

  // Standard Available Slots based on published 5:30 AM – 9:00 PM hours
  const allSlots = [
    '05:30 AM – 06:30 AM',
    '06:30 AM – 07:30 AM',
    '07:30 AM – 08:30 AM',
    '08:30 AM – 09:30 AM',
    '09:30 AM – 10:30 AM',
    '10:30 AM – 11:30 AM',
    '04:30 PM – 05:30 PM',
    '05:30 PM – 06:30 PM',
    '06:30 PM – 07:30 PM',
    '07:30 PM – 08:30 PM',
    '08:30 PM – 09:30 PM',
  ];

  // Helper date validations
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 45); // up to 45 days in advance
    return d.toISOString().split('T')[0];
  };

  const isDateSelectable = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (d.getDay() === 0) return false; // Sunday closed
    if (settings.blockedDates.includes(dateStr)) return false; // Blocked holiday
    return true;
  };

  // Selected entities
  const selectedServiceObj = services.find((s) => s.id === serviceId);
  const selectedTrainerObj = trainers.find((t) => t.id === trainerId);

  // Submit Handler
  const handleSubmitBooking = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter your full name and mobile number.');
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setErrorMsg('Please choose a valid date and time slot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await createAppointment({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        serviceId,
        serviceName: selectedServiceObj?.title || 'Gym Session',
        date: selectedDate,
        timeSlot: selectedSlot,
        fitnessGoal,
        preferredTrainerId: trainerId || undefined,
        preferredTrainerName: selectedTrainerObj?.name || undefined,
        message: notes.trim() || undefined,
        userId: currentUser?.uid || undefined,
      });

      setConfirmedBooking(created);
      setStep(6); // Success confirmation step

      // Fire confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#10b981'],
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    if (!confirmedBooking) return '#';
    const title = encodeURIComponent(`Bounce Fitness Studio: ${confirmedBooking.serviceName}`);
    const details = encodeURIComponent(
      `Appointment ID: ${confirmedBooking.bookingId}\nTrainer: ${
        confirmedBooking.preferredTrainerName || 'Floor Coach'
      }\nLocation: Gundappa Gowda Arcade, Kalyan Nagar, Jyothi Nagar, Chikkamagaluru, Karnataka`
    );
    const location = encodeURIComponent('Bounce Fitness Studio, Kalyan Nagar, Jyothi Nagar, Chikkamagaluru, Karnataka');

    // approximate start/end time
    const [startHourStr] = confirmedBooking.timeSlot.split(' – ');
    const dStr = confirmedBooking.date.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dStr}T060000Z/${dStr}T070000Z`;
  };

  // WhatsApp Pre-filled Confirmation Link
  const getWhatsAppConfirmUrl = () => {
    if (!confirmedBooking) return '#';
    const text = encodeURIComponent(
      `Hello Bounce Fitness Studio! I just submitted appointment request ${confirmedBooking.bookingId} for ${confirmedBooking.serviceName} on ${confirmedBooking.date} (${confirmedBooking.timeSlot}). Name: ${confirmedBooking.customerName}. Please confirm my slot!`
    );
    const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/50 p-0.5 shrink-0">
              <img
                src="/bounce_icon_crest.png"
                alt="Bounce Crest"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white leading-none">
                Book An Appointment
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">Bounce Fitness Studio &bull; 8QCV+WH Chikkamagaluru, Karnataka</p>
            </div>
          </div>
          <button
            onClick={closeBooking}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Section 28) */}
        {step <= 5 && (
          <div className="px-6 pt-4 pb-2 bg-zinc-900/30 border-b border-zinc-800/60">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className={step >= 1 ? 'text-amber-400' : 'text-zinc-600'}>1. Service</span>
              <span className={step >= 2 ? 'text-amber-400' : 'text-zinc-600'}>2. Date</span>
              <span className={step >= 3 ? 'text-amber-400' : 'text-zinc-600'}>3. Time</span>
              <span className={step >= 4 ? 'text-amber-400' : 'text-zinc-600'}>4. Details</span>
              <span className={step >= 5 ? 'text-amber-400' : 'text-zinc-600'}>5. Confirm</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: CHOOSE SERVICE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                  Step 1: Choose Your Fitness Program
                </h3>
                <p className="text-xs text-zinc-400">Select the program or session you would like to book</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services
                  .filter((s) => s.isActive)
                  .map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        serviceId === s.id
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-zinc-900 px-2 py-0.5 rounded">
                          {s.category}
                        </span>
                        {serviceId === s.id && <CheckCircle className="w-4 h-4 text-amber-400" />}
                      </div>
                      <h4 className="font-display font-bold text-lg uppercase text-white mb-1">
                        {s.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{s.description}</p>
                      <div className="text-[11px] font-semibold text-zinc-300 flex items-center justify-between pt-2 border-t border-zinc-800/80">
                        <span>{s.durationMinutes} Minutes</span>
                        <span className="text-amber-400">{s.priceDisplay}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE DATE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                  Step 2: Choose Appointment Date
                </h3>
                <p className="text-xs text-zinc-400">
                  Monday–Saturday available (5:30 AM – 9:00 PM). Sundays closed for deep clean.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (!isDateSelectable(e.target.value)) {
                      setErrorMsg('Please note: Studio is closed on Sundays and scheduled holidays.');
                    } else {
                      setErrorMsg('');
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />

                <div className="mt-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-400 space-y-1">
                  <p className="font-semibold text-zinc-200">Studio Operating Rules:</p>
                  <p>&bull; Monday to Saturday: Open 5:30 AM to 9:00 PM</p>
                  <p>&bull; Sunday: Closed for member recovery</p>
                  <p>&bull; Early morning workout slots are very popular—book in advance.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE TIME SLOT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                  Step 3: Choose Time Slot
                </h3>
                <p className="text-xs text-zinc-400">
                  Preferred time window for {selectedDate}. Note: Timings may change according to trainers&apos; availability, and there are no limited seats.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allSlots.map((slot) => {
                  const available = isSlotAvailable(selectedDate, slot);
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={!available}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        !available
                          ? 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                        <span className="text-xs font-bold">{slot}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-zinc-500">
                        {available ? (isSelected ? 'Selected' : 'Available') : 'Booked'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                  Step 4: Your Contact &amp; Fitness Details
                </h3>
                <p className="text-xs text-zinc-400">Our studio team will use this to reach you with your confirmation</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Harish Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1">
                      Fitness Goal
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                      <select
                        value={fitnessGoal}
                        onChange={(e) => setFitnessGoal(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option>Build Strength &amp; Muscle</option>
                        <option>Weight Loss &amp; Fat Reduction</option>
                        <option>Cardio &amp; Stamina (Zumba/CrossFit)</option>
                        <option>General Healthy Movement</option>
                        <option>Rehab &amp; Posture Alignment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1">
                      Preferred Trainer (Optional)
                    </label>
                    <select
                      value={trainerId}
                      onChange={(e) => setTrainerId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Any Available Coach</option>
                      {trainers
                        .filter((t) => t.isActive)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.role})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1">
                    Special Requests or Message
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. I will be bringing gym shoes, looking for locker facilities..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: BOOKING SUMMARY REVIEW */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">
                  Step 5: Review Booking Summary
                </h3>
                <p className="text-xs text-zinc-400">
                  Review the details before submitting your appointment request.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-800/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Service</span>
                    <p className="font-display font-black text-xl text-amber-400 uppercase mt-0.5">
                      {selectedServiceObj?.title || 'Gym Training'}
                    </p>
                    <p className="text-xs text-zinc-400">{selectedServiceObj?.durationMinutes} min</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Fee / Package</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {selectedServiceObj?.priceDisplay || 'Membership Based'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-800/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Date</span>
                    <p className="font-semibold text-white mt-0.5">{selectedDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Time Slot</span>
                    <p className="font-semibold text-amber-400 mt-0.5">{selectedSlot}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Customer</span>
                    <p className="font-semibold text-white mt-0.5">{customerName}</p>
                    <p className="text-zinc-400">{customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Coach / Goal</span>
                    <p className="font-semibold text-zinc-300 mt-0.5">
                      {selectedTrainerObj ? selectedTrainerObj.name : 'Any Coach Assigned'}
                    </p>
                    <p className="text-zinc-400 truncate">{fitnessGoal}</p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Your appointment request will be sent directly to the Bounce studio front desk. You will receive final WhatsApp/Phone confirmation from our team.
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION SUCCESS (Section 28) */}
          {step === 6 && confirmedBooking && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 animate-in zoom-in-75 duration-300">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-zinc-900 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                  Request Received
                </span>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-3">
                  Booking Request Received
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Our front desk team at Gundappa Gowda Arcade has received your appointment request.
                </p>
              </div>

              {/* Booking ID badge */}
              <div className="inline-block p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center max-w-sm w-full">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Booking Reference</span>
                <p className="font-mono font-black text-2xl text-amber-400 tracking-wider mt-1">
                  {confirmedBooking.bookingId}
                </p>
                <div className="mt-3 pt-3 border-t border-zinc-800 text-xs text-zinc-300 space-y-1 text-left">
                  <p><strong>Service:</strong> {confirmedBooking.serviceName}</p>
                  <p><strong>Date &amp; Time:</strong> {confirmedBooking.date} &bull; {confirmedBooking.timeSlot}</p>
                  <p><strong>Customer:</strong> {confirmedBooking.customerName} ({confirmedBooking.customerPhone})</p>
                </div>
              </div>

              {/* Action Buttons as specified in Section 28 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider border border-zinc-700 transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 text-amber-400" />
                  <span>Add To Google Calendar</span>
                </a>

                <a
                  href={getWhatsAppConfirmUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/25"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Via WhatsApp</span>
                </a>

                <button
                  onClick={closeBooking}
                  className="w-full sm:w-auto px-5 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Back To Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Next / Back / Submit) */}
        {step <= 5 && (
          <div className="p-6 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setStep(step - 1);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && !isDateSelectable(selectedDate)) {
                    setErrorMsg('Please select an open operating date (Monday–Saturday).');
                    return;
                  }
                  if (step === 3 && !selectedSlot) {
                    setErrorMsg('Please choose an available time slot.');
                    return;
                  }
                  if (step === 4 && (!customerName.trim() || !customerPhone.trim())) {
                    setErrorMsg('Full Name and Phone Number are required.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(step + 1);
                }}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-2.5 rounded-lg font-display uppercase tracking-wider text-base font-bold shadow-md cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitBooking}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-8 py-3 rounded-lg font-display uppercase tracking-wider text-base font-bold shadow-xl shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <span>Submit Booking Request</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
