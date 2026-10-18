import React, { useState, useEffect } from 'react';
import { Bell, CalendarOff, AlertTriangle, X, CheckCircle2, RefreshCw, ShieldAlert } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useAuth } from '../context/AuthContext';

export const MemberNotificationsBanner: React.FC<{ onOpenMemberModal?: () => void }> = ({
  onOpenMemberModal,
}) => {
  const { announcements, memberSubscriptions, openAdmin } = useStudio();
  const { phoneUser, isAdmin } = useAuth();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [popupAnnouncementId, setPopupAnnouncementId] = useState<string | null>(null);

  const activeAnnouncements = announcements.filter(
    (a) => a.isActive && !dismissedIds.includes(a.id)
  );

  // Trigger a prominent popup notification when a member opens the website and there is an active Holiday/Announcement
  useEffect(() => {
    if (activeAnnouncements.length > 0) {
      const latest = activeAnnouncements[0];
      const seenKey = `bounce_seen_ann_${latest.id}`;
      const alreadySeen = sessionStorage.getItem(seenKey);
      if (!alreadySeen) {
        setPopupAnnouncementId(latest.id);
      }
    }
  }, [activeAnnouncements]);

  const handleAcknowledgePopup = (id: string) => {
    try {
      sessionStorage.setItem(`bounce_seen_ann_${id}`, 'true');
    } catch {
      // ignore
    }
    setPopupAnnouncementId(null);
  };

  // Check if current signed-in member's plan duration is finished or expiring
  const memberExpiryInfo = (() => {
    if (!phoneUser || !phoneUser.endDate) return null;
    const diffMs = new Date(phoneUser.endDate).getTime() - Date.now();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isExpired = diffMs <= 0;
    const isExpiringToday = !isExpired && daysLeft <= 1;
    return {
      isExpired,
      isExpiringToday,
      daysLeft: Math.max(0, daysLeft),
    };
  })();

  // Check how many members have finished their duration (for Admin reminder)
  const expiredMembers = memberSubscriptions.filter(
    (m) => m.status === 'expired' || new Date(m.endDate).getTime() <= Date.now()
  );

  const popupAnnouncement = announcements.find((a) => a.id === popupAnnouncementId && a.isActive);

  return (
    <>
      {/* Top Notification Bars for Holidays, Member Duration Finished, and Admin Reminders */}
      <div className="space-y-1">
        {/* 1. Active Holiday / Studio Broadcast Banner for Everyone */}
        {activeAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 px-4 py-2 text-xs font-bold shadow-md"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950 text-amber-400 text-[10px] font-black uppercase tracking-wider shrink-0">
                  <CalendarOff className="w-3 h-3" />
                  {ann.type === 'holiday' ? 'Studio Holiday Notice' : 'Studio Broadcast'}
                </span>
                <span className="font-display uppercase tracking-wider text-sm font-black">
                  {ann.title}:
                </span>
                <span className="font-medium text-zinc-900">{ann.message}</span>
                {ann.holidayDate && (
                  <span className="px-2 py-0.5 rounded bg-zinc-950/15 text-zinc-950 font-mono text-[11px] font-extrabold">
                    Date: {ann.holidayDate}
                  </span>
                )}
              </div>
              <button
                onClick={() => setDismissedIds((prev) => [...prev, ann.id])}
                className="p-1 rounded hover:bg-zinc-950/10 text-zinc-950 shrink-0 cursor-pointer"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* 2. Member Duration Finished / Renewal Reminder Banner */}
        {phoneUser && memberExpiryInfo && (memberExpiryInfo.isExpired || memberExpiryInfo.isExpiringToday) && (
          <div className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold shadow-md">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 animate-bounce" />
                <span>
                  {memberExpiryInfo.isExpired ? (
                    <>
                      <strong>Membership Duration Finished Reminder:</strong> Hi <strong>{phoneUser.name}</strong>, your{' '}
                      <strong>{phoneUser.planName} ({phoneUser.durationLabel})</strong> has finished! Both you and Gym Owner Alwyn have been notified.
                    </>
                  ) : (
                    <>
                      <strong>Plan Finishing Soon:</strong> Hi <strong>{phoneUser.name}</strong>, your{' '}
                      <strong>{phoneUser.planName}</strong> finishes within 24 hours!
                    </>
                  )}
                </span>
              </div>
              {onOpenMemberModal && (
                <button
                  onClick={onOpenMemberModal}
                  className="px-3 py-1 rounded-lg bg-white text-rose-700 font-display uppercase tracking-wider text-xs font-black hover:bg-amber-300 hover:text-zinc-950 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Renew Plan Now</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. Admin Reminder Banner when any Member's Plan Duration Finishes */}
        {isAdmin && expiredMembers.length > 0 && (
          <div className="bg-amber-950/95 border-b border-amber-500/40 text-amber-200 px-4 py-1.5 text-xs">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Admin Owner Reminder:</strong>{' '}
                  <strong>{expiredMembers.length}</strong> member{expiredMembers.length > 1 ? 's have' : ' has'} completed their membership duration ({expiredMembers.map((m) => m.name).join(', ')}).
                </span>
              </div>
              <button
                onClick={openAdmin}
                className="px-2.5 py-0.5 rounded bg-amber-500 text-zinc-950 font-bold uppercase text-[10px] hover:bg-amber-400 cursor-pointer"
              >
                View Members in Admin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Automatic Holiday / Announcement Modal Notification when Members Open the Website */}
      {popupAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-zinc-950 border-2 border-amber-500 rounded-3xl p-6 sm:p-7 shadow-2xl text-zinc-100 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                    Official Studio Notification
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white mt-1 leading-tight">
                    {popupAnnouncement.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => handleAcknowledgePopup(popupAnnouncement.id)}
                className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
              <p className="text-sm text-zinc-200 leading-relaxed">
                {popupAnnouncement.message}
              </p>
              {popupAnnouncement.holidayDate && (
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Holiday / Notice Date:</span>
                  <span className="font-mono font-bold text-amber-400">{popupAnnouncement.holidayDate}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Posted by: {popupAnnouncement.createdBy || 'Gym Owner Alwyn (Admin)'}</span>
                <span>{new Date(popupAnnouncement.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => handleAcknowledgePopup(popupAnnouncement.id)}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Got It &bull; Continue to Website</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
