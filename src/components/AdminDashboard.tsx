import React, { useState } from 'react';
import {
  X,
  Calendar,
  Users,
  Dumbbell,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock3,
  Phone,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Star,
  Settings,
  Image as ImageIcon,
  DollarSign,
  Inbox,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Lock,
  Bell,
  CalendarOff,
  RefreshCw,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useAuth } from '../context/AuthContext';
import { Appointment, Service, Trainer, ClassSchedule, MembershipPlan, Testimonial, GalleryItem } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    closeAdmin,
    settings,
    updateSettings,
    appointments,
    updateAppointmentStatus,
    deleteAppointment,
    services,
    updateService,
    addService,
    deleteService,
    trainers,
    updateTrainer,
    addTrainer,
    deleteTrainer,
    classes,
    updateClass,
    addClass,
    deleteClass,
    membershipPlans,
    updatePlan,
    addPlan,
    deletePlan,
    testimonials,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial,
    gallery,
    updateGalleryItem,
    addGalleryItem,
    deleteGalleryItem,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    memberSubscriptions,
    registerMemberSignIn,
    updateMemberSubscription,
    renewMemberSubscription,
    markMemberExpired,
    deleteMemberSubscription,
    announcements,
    createAnnouncement,
    updateAnnouncement,
    toggleAnnouncementActive,
    deleteAnnouncement,
    saveAllAdminData,
  } = useStudio();

  const { currentUser, isAdmin, signInWithGoogle, logout, toggleDevAdminMode, devAdminMode, unlockWithPasskey, lockAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'members'
    | 'holidays'
    | 'appointments'
    | 'enquiries'
    | 'services'
    | 'trainers'
    | 'schedule'
    | 'plans'
    | 'testimonials'
    | 'gallery'
    | 'settings'
  >('overview');

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newBlockedDate, setNewBlockedDate] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState<string>('');
  const [adminPasskeyInput, setAdminPasskeyInput] = useState<string>('');
  const [showPasskey, setShowPasskey] = useState<boolean>(false);
  const [passkeyError, setPasskeyError] = useState<string>('');

  // Delete Confirmation Modal State (Asks Admin: Delete Yes or No / Keep & Save)
  const [pendingDelete, setPendingDelete] = useState<{
    category: string;
    itemName: string;
    onConfirmDelete: () => Promise<void> | void;
    onSaveInstead?: () => Promise<void> | void;
  } | null>(null);

  // Holiday Broadcast Form State
  const [annTitle, setAnnTitle] = useState<string>('Studio Holiday Notice — Closed Tomorrow');
  const [annMessage, setAnnMessage] = useState<string>(
    'Bounce Fitness Studio will remain closed tomorrow on account of a studio holiday. Regular morning (5:30 AM) and evening sessions will resume the following day!'
  );
  const [annDate, setAnnDate] = useState<string>(() => {
    const tmrw = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return tmrw.toISOString().split('T')[0];
  });
  const [annType, setAnnType] = useState<'holiday' | 'notice' | 'urgent'>('holiday');

  // Manual Member Walk-in Add State
  const [walkInName, setWalkInName] = useState<string>('');
  const [walkInPhone, setWalkInPhone] = useState<string>('');
  const [walkInPlanIdx, setWalkInPlanIdx] = useState<number>(0);

  if (!isAdminOpen) return null;

  // Admin Security Gate: Requires administrator passkey or authorized Google admin account
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
          <button
            onClick={closeAdmin}
            className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
            title="Close Admin Portal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-900 border border-amber-500/50 p-1 mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
              Studio Admin Portal
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
              Enter the client administrator passkey to access operational records, members &amp; booking management.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!adminPasskeyInput.trim()) {
                setPasskeyError('Please enter your administrator passkey.');
                return;
              }
              const success = unlockWithPasskey(adminPasskeyInput.trim());
              if (!success) {
                setPasskeyError('Incorrect administrator passkey. Access denied.');
              } else {
                setPasskeyError('');
                setAdminPasskeyInput('');
              }
            }}
            className="space-y-4"
          >
            {passkeyError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passkeyError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-300 tracking-wider mb-1.5">
                Admin Passkey
              </label>
              <div className="relative">
                <input
                  type={showPasskey ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator passkey..."
                  value={adminPasskeyInput}
                  onChange={(e) => {
                    setAdminPasskeyInput(e.target.value);
                    if (passkeyError) setPasskeyError('');
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  title={showPasskey ? 'Hide passkey' : 'Show passkey'}
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-base font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Unlock Admin Console
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-900 text-center space-y-3">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer"
            >
              <span>Sign In with Admin Google Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compute Dashboard Statistics (Section 9)
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysBookings = appointments.filter((a) => a.date === todayStr);
  const upcomingBookings = appointments.filter((a) => a.date >= todayStr && a.status !== 'cancelled' && a.status !== 'rejected');
  const pendingRequests = appointments.filter((a) => a.status === 'pending');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');
  const cancelledAppointments = appointments.filter((a) => a.status === 'cancelled' || a.status === 'rejected');
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const showSaved = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(''), 3500);
  };

  const requestDelete = (
    category: string,
    itemName: string,
    onConfirmDelete: () => Promise<void> | void,
    onSaveInstead?: () => Promise<void> | void
  ) => {
    setPendingDelete({
      category,
      itemName,
      onConfirmDelete,
      onSaveInstead,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
      {/* Top Bar */}
      <header className="bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/50 p-0.5 shrink-0">
            <img
              src="/bounce_icon_crest.png"
              alt="Bounce Fitness Studio Crest"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white leading-none">
                Bounce Studio Manager
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              8QCV+WH Chikkamagaluru, Karnataka &bull; Gundappa Gowda Arcade, Kalyan Nagar, Jyothi Nagar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {savedNotice && (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{savedNotice}</span>
            </span>
          )}

          <button
            onClick={async () => {
              await saveAllAdminData();
              showSaved('All Admin changes saved successfully!');
            }}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg shadow-md transition-colors cursor-pointer"
            title="Save all changes across Admin Console"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>

          <button
            onClick={toggleDevAdminMode}
            className={`hidden md:inline-block text-xs px-2.5 py-1.5 rounded border transition-colors cursor-pointer ${
              devAdminMode
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
            title="Toggle Dev Admin Override for instant testing"
          >
            Dev Admin: {devAdminMode ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={lockAdmin}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
            title="Lock Admin Console"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Lock</span>
          </button>

          {currentUser && (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-400 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}

          <button
            onClick={closeAdmin}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-full md:w-64 bg-zinc-950/80 border-r border-zinc-800/80 p-4 space-y-1 shrink-0 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Shield, badge: pendingRequests.length > 0 ? `${pendingRequests.length} Pending` : null },
            {
              id: 'members',
              label: 'Signed-In Members',
              icon: UserCheck,
              badge: `${memberSubscriptions.length}`,
            },
            {
              id: 'holidays',
              label: 'Holiday Broadcast',
              icon: Bell,
              badge: announcements.filter((a) => a.isActive).length > 0 ? 'Live' : null,
            },
            { id: 'appointments', label: 'Appointments', icon: Calendar, badge: `${appointments.length}` },
            { id: 'enquiries', label: 'Enquiries', icon: Inbox, badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} New` : null },
            { id: 'services', label: 'Programs & Services', icon: Dumbbell },
            { id: 'trainers', label: 'Trainers', icon: Users },
            { id: 'schedule', label: 'Class Schedule', icon: Clock },
            { id: 'plans', label: 'Membership Plans', icon: DollarSign },
            { id: 'testimonials', label: 'Reviews', icon: Star },
            { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
            { id: 'settings', label: 'Business Hours & Info', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? 'bg-zinc-950 text-amber-400' : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content Body */}
        <main className="flex-1 bg-zinc-900/40 p-6 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                  Dashboard Overview
                </h3>
                <p className="text-xs text-zinc-400">Live booking statistics and operational activity</p>
              </div>

              {/* Stats Cards (Section 9) */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Today&apos;s Bookings</span>
                  <p className="font-display font-black text-3xl text-amber-400 mt-1">{todaysBookings.length}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{todayStr}</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Upcoming</span>
                  <p className="font-display font-black text-3xl text-white mt-1">{upcomingBookings.length}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Active schedule</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Pending Requests</span>
                  <p className="font-display font-black text-3xl text-amber-400 mt-1">{pendingRequests.length}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Needs review</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Completed</span>
                  <p className="font-display font-black text-3xl text-emerald-400 mt-1">{completedAppointments.length}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Sessions logged</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-rose-400">Cancelled / Rejected</span>
                  <p className="font-display font-black text-3xl text-rose-400 mt-1">{cancelledAppointments.length}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Slots freed</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-sky-400">New Enquiries</span>
                  <p className="font-display font-black text-3xl text-sky-400 mt-1">{newEnquiriesCount}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">From contact form</p>
                </div>
              </div>

              {/* Pending Action Alerts */}
              {pendingRequests.length > 0 && (
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                        {pendingRequests.length} Pending Appointment Requests Need Action
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('appointments');
                        setStatusFilter('pending');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-400"
                    >
                      View Pending
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pendingRequests.slice(0, 3).map((a) => (
                      <div key={a.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{a.customerName}</span> &bull;{' '}
                          <span className="text-amber-400 font-semibold">{a.serviceName}</span> on {a.date} ({a.timeSlot})
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateAppointmentStatus(a.id, 'approved')}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(a.id, 'rejected')}
                            className="px-2.5 py-1 rounded bg-zinc-800 text-rose-400 font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Member Duration Finished Alerts & Quick Holiday Broadcast on Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Signed-In Members & Expiry Reminders Card */}
                <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-5 h-5 text-amber-400" />
                      <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                        Signed-In Members ({memberSubscriptions.length})
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('members')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 cursor-pointer"
                    >
                      Manage Members
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Tracks every member who signed in with their Name, Phone Number, Chosen Plan, and Duration. Alerts both the Member and Owner when the duration finishes.
                  </p>
                  {memberSubscriptions.length === 0 ? (
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
                      No members have signed in yet. Once a member signs in and selects a plan, their details appear here automatically.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {memberSubscriptions.slice(0, 3).map((m) => {
                        const diffMs = new Date(m.endDate).getTime() - Date.now();
                        const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                        const expired = m.status === 'expired' || diffMs <= 0;
                        return (
                          <div
                            key={m.id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                              expired ? 'bg-rose-500/10 border-rose-500/40' : 'bg-zinc-900 border-zinc-800'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-white">{m.name}</span> ({m.phone}) &bull;{' '}
                              <span className="text-amber-400 font-semibold">{m.planName}</span> ({m.durationLabel})
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                                expired ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {expired ? 'Duration Finished!' : `${daysLeft}d left`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Tomorrow Holiday Broadcast Card */}
                <div className="p-6 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-5 h-5 text-amber-400" />
                      <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                        Holiday &amp; Member Notification
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('holidays')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-zinc-950 cursor-pointer"
                    >
                      All Broadcasts ({announcements.filter((a) => a.isActive).length})
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400">
                    If there is a holiday tomorrow, post a notification in 1 click so every member receives an immediate alert when they open the website.
                  </p>
                  <button
                    onClick={async () => {
                      const tmrw = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                      await createAnnouncement({
                        title: 'Holiday Tomorrow — Studio Closed',
                        message: `Please note: Bounce Fitness Studio will remain closed tomorrow (${tmrw}) on account of a holiday. Regular workouts resume the next day at 5:30 AM!`,
                        holidayDate: tmrw,
                        type: 'holiday',
                        isActive: true,
                        createdBy: 'Gym Owner Alwyn (Admin)',
                      });
                      showSaved('Holiday notification broadcasted to all members!');
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-sm font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <CalendarOff className="w-4 h-4" />
                    <span>Broadcast &ldquo;Holiday Tomorrow&rdquo; To All Members</span>
                  </button>
                </div>
              </div>

              {/* Quick Business Overview */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white mb-3">
                  Current Studio Information &amp; Hours
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
                  <div>
                    <span className="text-zinc-500 block uppercase font-bold text-[10px]">Monday – Saturday</span>
                    <strong className="text-white">{settings.openingHoursMonSat}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase font-bold text-[10px]">Sunday</span>
                    <strong className="text-rose-400">{settings.openingHoursSun}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase font-bold text-[10px]">Phone &amp; WhatsApp</span>
                    <strong className="text-white">{settings.phone}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SIGNED-IN MEMBERS & PLAN DURATIONS */}
          {activeTab === 'members' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Signed-In Members &amp; Plan Durations
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Every member who signs in with their Name, Phone Number, and Plan is synced here automatically. Both Member &amp; Admin get notified once the duration finishes.
                  </p>
                </div>
              </div>

              {/* Add Walk-In Member Card */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!walkInName.trim() || !walkInPhone.trim()) return;
                  const planPresets = [
                    { planName: 'Daily Pass', durationLabel: '1 Day', durationDays: 1, priceDisplay: '₹300' },
                    { planName: '1 Month Membership', durationLabel: '1 Month (30 Days)', durationDays: 30, priceDisplay: '₹2,000' },
                    { planName: '3 Months Membership', durationLabel: '3 Months (90 Days)', durationDays: 90, priceDisplay: '₹5,000' },
                    { planName: '6 Months Membership', durationLabel: '6 Months (180 Days)', durationDays: 180, priceDisplay: '₹6,999' },
                    { planName: '1 Year Membership', durationLabel: '1 Year (365 Days)', durationDays: 365, priceDisplay: '₹12,999' },
                    { planName: 'Personal Training (1-on-1)', durationLabel: '1 Month (30 Days)', durationDays: 30, priceDisplay: '₹12,000 / Month' },
                  ];
                  const chosen = planPresets[walkInPlanIdx] || planPresets[0];
                  await registerMemberSignIn({
                    name: walkInName.trim(),
                    phone: walkInPhone.trim(),
                    planName: chosen.planName,
                    durationLabel: chosen.durationLabel,
                    durationDays: chosen.durationDays,
                    priceDisplay: chosen.priceDisplay,
                  });
                  setWalkInName('');
                  setWalkInPhone('');
                  showSaved('Member added & duration timer started!');
                }}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Member Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthik Shetty"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98450 12345"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Plan &amp; Duration</label>
                  <select
                    value={walkInPlanIdx}
                    onChange={(e) => setWalkInPlanIdx(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value={0}>Daily Pass (₹300 • 1 Day)</option>
                    <option value={1}>1 Month (₹2,000 • 30 Days)</option>
                    <option value={2}>3 Months (₹5,000 • 90 Days)</option>
                    <option value={3}>6 Months (₹6,999 • 180 Days)</option>
                    <option value={4}>1 Year (₹12,999 • 365 Days)</option>
                    <option value={5}>Personal Training (₹12,000/mo • 30 Days)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer h-[34px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Member</span>
                </button>
              </form>

              {/* Members Table / Cards */}
              {memberSubscriptions.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 text-sm">
                  No signed-in members recorded yet. When a member signs in on the website and selects a plan, their record will appear here immediately.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {memberSubscriptions.map((member) => {
                    const diffMs = new Date(member.endDate).getTime() - Date.now();
                    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                    const isExpired = member.status === 'expired' || diffMs <= 0;
                    const cleanPhone = member.phone.replace(/[^0-9]/g, '');

                    return (
                      <div
                        key={member.id}
                        className={`p-5 rounded-2xl bg-zinc-950 border space-y-4 ${
                          isExpired ? 'border-rose-500/60 ring-1 ring-rose-500/20' : 'border-zinc-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => updateMemberSubscription({ ...member, name: e.target.value })}
                                className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 font-display font-black text-lg uppercase text-white focus:border-amber-500"
                              />
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  isExpired
                                    ? 'bg-rose-500 text-white animate-pulse'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {isExpired ? 'Duration Finished — Reminder!' : `Active • ${daysLeft} Days Left`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <input
                                type="tel"
                                value={member.phone}
                                onChange={(e) => updateMemberSubscription({ ...member, phone: e.target.value })}
                                className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-200 focus:border-amber-500"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={async () => {
                                await updateMemberSubscription(member);
                                showSaved(`Saved member record for ${member.name}!`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                              title="Save Member Changes"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>

                            <button
                              onClick={() =>
                                requestDelete(
                                  'Member Record',
                                  `${member.name} (${member.planName})`,
                                  () => deleteMemberSubscription(member.id),
                                  () => updateMemberSubscription(member)
                                )
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                              title="Delete Member Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Chosen Plan</span>
                            <strong className="text-amber-400">{member.planName} ({member.priceDisplay})</strong>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Joined Duration</span>
                            <strong className="text-white">{member.durationLabel}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Start Date</span>
                            <span className="text-zinc-300 font-mono text-[11px]">
                              {new Date(member.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-zinc-500 block font-bold">End / Expiry Date</span>
                            <span className={`font-mono text-[11px] font-bold ${isExpired ? 'text-rose-400' : 'text-zinc-300'}`}>
                              {new Date(member.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(
                              `Hi ${member.name}, this is Gym Owner Alwyn from Bounce Fitness Studio, Chikmagalur. Your ${member.planName} (${member.durationLabel}) duration has finished. Let us know when you would like to renew your membership!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Reminder</span>
                          </a>

                          <button
                            onClick={() => {
                              renewMemberSubscription(member.id);
                              showSaved(`Renewed ${member.name}'s plan!`);
                            }}
                            className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Renew</span>
                          </button>

                          {!isExpired && (
                            <button
                              onClick={() => {
                                markMemberExpired(member.id);
                                showSaved(`Marked ${member.name}'s duration as finished (Reminder active)!`);
                              }}
                              className="py-2 px-3 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-rose-400 border border-zinc-800 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                              title="Trigger duration finished reminder for both member and admin"
                            >
                              Finish Duration
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: HOLIDAY & MEMBER BROADCASTS */}
          {activeTab === 'holidays' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                  Holiday &amp; Studio Notifications Broadcast
                </h3>
                <p className="text-xs text-zinc-400">
                  Post a holiday announcement or studio update from your Admin Account. Every member who opens the website will immediately receive a notification popup and top banner!
                </p>
              </div>

              {/* 1-Click Tomorrow Holiday Quick Action */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                    Instant 1-Click Preset
                  </span>
                  <h4 className="font-display font-black text-2xl uppercase text-white">
                    Is There A Studio Holiday Tomorrow?
                  </h4>
                  <p className="text-xs text-zinc-300">
                    Click once to broadcast a Holiday Tomorrow notice to all members and block tomorrow&apos;s date automatically.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const tmrw = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    await createAnnouncement({
                      title: 'Studio Holiday Tomorrow — Gym Closed',
                      message: `Important Notice: Bounce Fitness Studio will remain closed tomorrow (${tmrw}) for a holiday. Workouts resume the following day at 5:30 AM!`,
                      holidayDate: tmrw,
                      type: 'holiday',
                      isActive: true,
                      createdBy: 'Gym Owner Alwyn (Admin)',
                    });
                    showSaved('Tomorrow Holiday broadcasted to all members!');
                  }}
                  className="shrink-0 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-sm font-black shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <CalendarOff className="w-4 h-4" />
                  <span>Post &ldquo;Holiday Tomorrow&rdquo; Now</span>
                </button>
              </div>

              {/* Custom Holiday / Announcement Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!annTitle.trim() || !annMessage.trim()) return;
                  await createAnnouncement({
                    title: annTitle.trim(),
                    message: annMessage.trim(),
                    holidayDate: annDate || undefined,
                    type: annType,
                    isActive: true,
                    createdBy: 'Gym Owner Alwyn (Admin)',
                  });
                  showSaved('Notification saved & broadcasted to all members!');
                }}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4"
              >
                <h4 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                  Create Custom Holiday or Studio Notification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-400 block mb-1">Notification Title *</label>
                    <input
                      type="text"
                      required
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Holiday Date (Optional)</label>
                    <input
                      type="date"
                      value={annDate}
                      onChange={(e) => setAnnDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Broadcast Message for Members *</label>
                  <textarea
                    rows={3}
                    required
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-zinc-400">Type:</label>
                    <select
                      value={annType}
                      onChange={(e) => setAnnType(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      <option value="holiday">Holiday Closure</option>
                      <option value="notice">General Notice</option>
                      <option value="urgent">Urgent Alert</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display uppercase tracking-wider text-sm font-black shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Publish Notification</span>
                  </button>
                </div>
              </form>

              {/* Active & Past Announcements List */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-lg uppercase tracking-wider text-white">
                  Published Broadcasts ({announcements.length})
                </h4>
                {announcements.length === 0 ? (
                  <p className="text-xs text-zinc-500">No holiday notifications posted yet.</p>
                ) : (
                  announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        ann.isActive ? 'bg-zinc-950 border-amber-500/50' : 'bg-zinc-950/50 border-zinc-800 opacity-60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              ann.isActive ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {ann.isActive ? 'LIVE ON WEBSITE' : 'HIDDEN'}
                          </span>
                          <span className="font-bold text-white text-sm">{ann.title}</span>
                          {ann.holidayDate && (
                            <span className="text-xs font-mono text-amber-400">({ann.holidayDate})</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-300">{ann.message}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={async () => {
                            await updateAnnouncement(ann);
                            showSaved(`Saved broadcast "${ann.title}"!`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => toggleAnnouncementActive(ann.id, !ann.isActive)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-300 border border-zinc-800 cursor-pointer"
                        >
                          {ann.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() =>
                            requestDelete(
                              'Holiday Broadcast',
                              ann.title,
                              () => deleteAnnouncement(ann.id),
                              () => updateAnnouncement(ann)
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Delete Broadcast"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: APPOINTMENTS MANAGEMENT (Section 9) */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Appointments Management
                  </h3>
                  <p className="text-xs text-zinc-400">View, approve, reject, save, or delete member bookings</p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {['all', 'pending', 'approved', 'completed', 'cancelled', 'rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-800">
                  <Calendar className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-300">No appointments matching &ldquo;{statusFilter}&rdquo;</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      <tr>
                        <th className="p-4">ID &bull; Customer</th>
                        <th className="p-4">Program &bull; Trainer</th>
                        <th className="p-4">Date &bull; Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-amber-400 font-bold block">{apt.bookingId}</span>
                            <strong className="text-white block mt-0.5">{apt.customerName}</strong>
                            <div className="flex items-center gap-2 mt-1 text-zinc-400">
                              <a href={`tel:${apt.customerPhone}`} className="hover:text-amber-400 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{apt.customerPhone}</span>
                              </a>
                            </div>
                          </td>

                          <td className="p-4">
                            <strong className="text-white block">{apt.serviceName}</strong>
                            <span className="text-zinc-400 text-[11px]">
                              Trainer: {apt.preferredTrainerName || 'Any'}
                            </span>
                            {apt.fitnessGoal && (
                              <span className="block text-[10px] text-zinc-500 mt-0.5 truncate max-w-xs">
                                Goal: {apt.fitnessGoal}
                              </span>
                            )}
                          </td>

                          <td className="p-4">
                            <span className="font-semibold text-white block">{apt.date}</span>
                            <span className="text-amber-400 text-[11px] font-medium">{apt.timeSlot}</span>
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block ${
                                apt.status === 'approved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : apt.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : apt.status === 'completed'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>

                          <td className="p-4 text-right space-x-2">
                            {apt.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    updateAppointmentStatus(apt.id, 'approved');
                                    showSaved(`Approved booking ${apt.bookingId}!`);
                                  }}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                                  title="Approve Booking"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    updateAppointmentStatus(apt.id, 'rejected');
                                    showSaved(`Rejected booking ${apt.bookingId}`);
                                  }}
                                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-rose-950 text-rose-400 font-bold text-xs cursor-pointer"
                                  title="Reject Booking"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {apt.status === 'approved' && (
                              <button
                                onClick={() => {
                                  updateAppointmentStatus(apt.id, 'completed');
                                  showSaved(`Marked ${apt.bookingId} completed & saved!`);
                                }}
                                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                              >
                                Mark Completed
                              </button>
                            )}

                            <button
                              onClick={() => {
                                updateAppointmentStatus(apt.id, apt.status);
                                showSaved(`Saved appointment ${apt.bookingId}!`);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold cursor-pointer"
                              title="Save Appointment"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </button>

                            <a
                              href={`https://wa.me/${apt.customerPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                                apt.customerName
                              )},%20this%20is%20Bounce%20Fitness%20Studio%20regarding%20your%20appointment%20${apt.bookingId}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block p-1.5 rounded bg-zinc-800 hover:bg-emerald-950 text-emerald-400 border border-zinc-700"
                              title="Chat with Customer on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() =>
                                requestDelete(
                                  'Appointment',
                                  `${apt.bookingId} — ${apt.customerName} (${apt.serviceName})`,
                                  () => deleteAppointment(apt.id),
                                  () => updateAppointmentStatus(apt.id, apt.status)
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold cursor-pointer"
                              title="Delete Appointment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                  Customer Enquiries
                </h3>
                <p className="text-xs text-zinc-400">Leads and questions received via the homepage contact form</p>
              </div>

              {enquiries.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-800">
                  <Inbox className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-300">No enquiries submitted yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              enq.status === 'new'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {enq.status}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white mb-1">{enq.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-3">
                          <a href={`tel:${enq.phone}`} className="hover:text-amber-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{enq.phone}</span>
                          </a>
                          {enq.email && <span>{enq.email}</span>}
                        </div>

                        <p className="text-xs text-zinc-300 p-3 rounded-xl bg-zinc-900 border border-zinc-800 mb-4 leading-relaxed">
                          &ldquo;{enq.message}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                        <span className="text-[11px] font-semibold text-amber-400">
                          Interested in: {enq.interestedIn || 'General'}
                        </span>
                        <div className="flex items-center gap-2">
                          {enq.status !== 'resolved' ? (
                            <button
                              onClick={() => {
                                updateEnquiryStatus(enq.id, 'resolved');
                                showSaved(`Saved & marked enquiry from ${enq.name} resolved!`);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save &amp; Resolve</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                updateEnquiryStatus(enq.id, 'new');
                                showSaved(`Re-opened enquiry from ${enq.name}`);
                              }}
                              className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 text-xs cursor-pointer"
                            >
                              Re-open
                            </button>
                          )}
                          <a
                            href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                              enq.name
                            )},%20thank%20you%20for%20contacting%20Bounce%20Fitness%20Studio!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-zinc-800 text-emerald-400"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() =>
                              requestDelete(
                                'Customer Enquiry',
                                `${enq.name} (${enq.phone})`,
                                () => deleteEnquiry(enq.id),
                                () => updateEnquiryStatus(enq.id, enq.status)
                              )
                            }
                            className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROGRAMS & SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Services &amp; Programs
                  </h3>
                  <p className="text-xs text-zinc-400">Add, edit, save, or delete fitness training offerings</p>
                </div>
                <button
                  onClick={async () => {
                    await addService({
                      title: 'New Program',
                      description: 'Describe workout benefits and focus here.',
                      category: 'FITNESS',
                      durationMinutes: 60,
                      priceDisplay: 'Membership Based',
                      iconName: 'Dumbbell',
                      popular: false,
                      order: services.length + 1,
                      isActive: true,
                    });
                    showSaved('New Service added & saved!');
                  }}
                  className="flex items-center gap-1.5 bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((svc) => (
                  <div key={svc.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={svc.title}
                        onChange={(e) => updateService({ ...svc, title: e.target.value })}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-sm font-bold text-white uppercase focus:border-amber-500"
                      />
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={async () => {
                            await updateService(svc);
                            showSaved(`Saved service "${svc.title}"!`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                          title="Save Service"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() =>
                            requestDelete(
                              'Service / Program',
                              svc.title,
                              () => deleteService(svc.id),
                              () => updateService(svc)
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={svc.description}
                      onChange={(e) => updateService({ ...svc, description: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-300 focus:border-amber-500"
                    />

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-500 block uppercase">Category</label>
                        <input
                          type="text"
                          value={svc.category}
                          onChange={(e) => updateService({ ...svc, category: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 block uppercase">Minutes</label>
                        <input
                          type="number"
                          value={svc.durationMinutes}
                          onChange={(e) => updateService({ ...svc, durationMinutes: Number(e.target.value) })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 block uppercase">Price Label</label>
                        <input
                          type="text"
                          value={svc.priceDisplay}
                          onChange={(e) => updateService({ ...svc, priceDisplay: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TRAINERS */}
          {activeTab === 'trainers' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Trainers &amp; Coaches
                  </h3>
                  <p className="text-xs text-zinc-400">Update, save, or delete coach profiles, specializations, and working hours</p>
                </div>
                <button
                  onClick={async () => {
                    await addTrainer({
                      name: 'New Trainer',
                      role: 'Fitness Coach',
                      specialization: 'Strength & Conditioning',
                      experience: '3+ Years',
                      bio: 'Passionate fitness trainer helping members reach their goals.',
                      photoUrl: '/gym_images/inside_dumbbell_rack.jpg',
                      availableDays: 'Mon – Sat',
                      availableHours: '05:30 AM – 09:00 PM',
                      order: trainers.length + 1,
                      isActive: true,
                    });
                    showSaved('New Trainer added & saved!');
                  }}
                  className="flex items-center gap-1.5 bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trainer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainers.map((t) => (
                  <div key={t.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.photoUrl}
                        alt={t.name}
                        className="w-16 h-16 rounded-xl object-cover object-top border border-zinc-700 shrink-0 bg-zinc-900"
                      />
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => updateTrainer({ ...t, name: e.target.value })}
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-sm font-bold text-white uppercase focus:border-amber-500"
                          />
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={async () => {
                                await updateTrainer(t);
                                showSaved(`Saved trainer "${t.name}"!`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                              title="Save Trainer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() =>
                                requestDelete(
                                  'Trainer Profile',
                                  `${t.name} (${t.role})`,
                                  () => deleteTrainer(t.id),
                                  () => updateTrainer(t)
                                )
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                              title="Delete Trainer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0">
                            Upload Trainer Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
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
                                      await updateTrainer({ ...t, photoUrl: dataUrl });
                                      showSaved(`Updated photo for ${t.name}!`);
                                    }
                                  };
                                  img.src = ev.target?.result as string;
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            value={t.photoUrl}
                            onChange={(e) => updateTrainer({ ...t, photoUrl: e.target.value })}
                            placeholder="Photo URL or upload..."
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-500 block uppercase">Role</label>
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => updateTrainer({ ...t, role: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 block uppercase">Specialization</label>
                        <input
                          type="text"
                          value={t.specialization}
                          onChange={(e) => updateTrainer({ ...t, specialization: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-500 block uppercase">Bio</label>
                      <textarea
                        rows={2}
                        value={t.bio}
                        onChange={(e) => updateTrainer({ ...t, bio: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-500 block uppercase">Available Days</label>
                        <input
                          type="text"
                          value={t.availableDays}
                          onChange={(e) => updateTrainer({ ...t, availableDays: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 block uppercase">Hours</label>
                        <input
                          type="text"
                          value={t.availableHours}
                          onChange={(e) => updateTrainer({ ...t, availableHours: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Class Schedule
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Flexible timings subject to trainer availability &bull; No limited seats (Open floor access)
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await addClass({
                      name: 'Strength Class',
                      dayOfWeek: 'MON',
                      time: '06:00 AM',
                      duration: '50 min',
                      trainerName: 'Alwyn & Glenn Prabhu',
                      seatsTotal: 0,
                      seatsBooked: 0,
                      category: 'Strength',
                    });
                    showSaved('New Class Slot added & saved!');
                  }}
                  className="flex items-center gap-1.5 bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Class Slot</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={cls.dayOfWeek}
                          onChange={(e) => updateClass({ ...cls, dayOfWeek: e.target.value as any })}
                          className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-amber-400 font-bold uppercase text-[10px]"
                        >
                          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={cls.time}
                          onChange={(e) => updateClass({ ...cls, time: e.target.value })}
                          className="w-24 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-amber-400 font-bold text-[10px]"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={async () => {
                            await updateClass(cls);
                            showSaved(`Saved schedule slot "${cls.name}"!`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-[11px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                          title="Save Class Slot"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() =>
                            requestDelete(
                              'Class Schedule Slot',
                              `${cls.name} (${cls.dayOfWeek} • ${cls.time})`,
                              () => deleteClass(cls.id),
                              () => updateClass(cls)
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-[11px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                          title="Delete Class Slot"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={cls.name}
                      onChange={(e) => updateClass({ ...cls, name: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 font-bold text-white text-sm"
                    />

                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-[11px] shrink-0">Trainer:</span>
                      <input
                        type="text"
                        value={cls.trainerName}
                        onChange={(e) => updateClass({ ...cls, trainerName: e.target.value })}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MEMBERSHIP PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Membership Plans &amp; Pricing
                  </h3>
                  <p className="text-xs text-zinc-400">Configure, save, or delete daily, monthly, quarterly, and annual rates</p>
                </div>
                <button
                  onClick={async () => {
                    await addPlan({
                      title: 'NEW PLAN',
                      duration: '1 Month Access',
                      price: '₹2,000',
                      popular: false,
                      features: ['Full Gym Access', 'Trainer Guidance'],
                      terms: 'Price is negotiable when visited directly at the gym.',
                      order: membershipPlans.length + 1,
                      isActive: true,
                    });
                    showSaved('New Membership Plan added & saved!');
                  }}
                  className="flex items-center gap-1.5 bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Plan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {membershipPlans.map((plan) => (
                  <div key={plan.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={plan.title}
                        onChange={(e) => updatePlan({ ...plan, title: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-sm font-bold text-white uppercase w-1/2"
                      />
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => updatePlan({ ...plan, price: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-sm font-bold text-amber-400 text-right w-1/3"
                      />
                    </div>
                    <input
                      type="text"
                      value={plan.duration}
                      onChange={(e) => updatePlan({ ...plan, duration: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300 text-xs"
                      placeholder="Duration commitment"
                    />
                    <div>
                      <label className="text-[10px] text-zinc-500 block uppercase mb-1">Features (comma separated)</label>
                      <textarea
                        rows={3}
                        value={plan.features.join(', ')}
                        onChange={(e) =>
                          updatePlan({
                            ...plan,
                            features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                          })
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-300"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={async () => {
                          await updatePlan(plan);
                          showSaved(`Saved membership plan "${plan.title}"!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Plan</span>
                      </button>
                      <button
                        onClick={() =>
                          requestDelete(
                            'Membership Plan',
                            `${plan.title} (${plan.price})`,
                            () => deletePlan(plan.id),
                            () => updatePlan(plan)
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS & HOURS (Section 5 & 10) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Studio Settings &amp; Blocked Dates
                  </h3>
                  <p className="text-xs text-zinc-400">Configure studio operating hours, contact numbers, and holiday blocks</p>
                </div>
                <button
                  onClick={async () => {
                    await updateSettings(settings);
                    showSaved('Studio settings & business hours saved!');
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 uppercase block mb-1">
                      Mon – Sat Opening Hours
                    </label>
                    <input
                      type="text"
                      value={settings.openingHoursMonSat}
                      onChange={(e) => updateSettings({ openingHoursMonSat: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 uppercase block mb-1">
                      Sunday Hours (Default: Closed)
                    </label>
                    <input
                      type="text"
                      value={settings.openingHoursSun}
                      onChange={(e) => updateSettings({ openingHoursSun: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 uppercase block mb-1">
                      Business Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => updateSettings({ phone: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 uppercase block mb-1">
                      WhatsApp Business Number
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => updateSettings({ whatsapp: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase block mb-1">
                    Studio Address
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => updateSettings({ address: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                {/* Blocked Dates Section (Section 10) */}
                <div className="pt-4 border-t border-zinc-800">
                  <label className="text-xs font-semibold text-zinc-300 uppercase block mb-2">
                    Blocked Holiday Dates (Cannot be booked by customers)
                  </label>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="date"
                      value={newBlockedDate}
                      onChange={(e) => setNewBlockedDate(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        if (newBlockedDate && !settings.blockedDates.includes(newBlockedDate)) {
                          updateSettings({ blockedDates: [...settings.blockedDates, newBlockedDate] });
                          setNewBlockedDate('');
                          showSaved('Date blocked & saved to schedule');
                        }
                      }}
                      className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold uppercase text-xs rounded-lg hover:bg-amber-400 cursor-pointer"
                    >
                      Save &amp; Block Date
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {settings.blockedDates.map((date) => (
                      <span
                        key={date}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-zinc-900 text-zinc-300 border border-zinc-800"
                      >
                        <span>{date}</span>
                        <button
                          onClick={() =>
                            requestDelete(
                              'Blocked Holiday Date',
                              date,
                              () =>
                                updateSettings({
                                  blockedDates: settings.blockedDates.filter((d) => d !== date),
                                }),
                              () => updateSettings(settings)
                            )
                          }
                          className="text-zinc-500 hover:text-rose-400 cursor-pointer font-bold"
                          title="Delete Blocked Date"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Verified Reviews &amp; Social Proof
                  </h3>
                  <p className="text-xs text-zinc-400">Manage, save, or delete member testimonials displayed on the homepage</p>
                </div>
                <button
                  onClick={async () => {
                    await addTestimonial({
                      customerName: 'Member Name',
                      rating: 5,
                      review: 'Great gym atmosphere and supportive coaches.',
                      verified: true,
                      date: 'Recent Google Review',
                      badge: 'Gym Member',
                    });
                    showSaved('New Review added & saved!');
                  }}
                  className="flex items-center gap-1.5 bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={t.customerName}
                        onChange={(e) => updateTestimonial({ ...t, customerName: e.target.value })}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-sm font-bold text-white"
                      />
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={async () => {
                            await updateTestimonial(t);
                            showSaved(`Saved review from "${t.customerName}"!`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() =>
                            requestDelete(
                              'Member Review',
                              t.customerName,
                              () => deleteTestimonial(t.id),
                              () => updateTestimonial(t)
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={t.review}
                      onChange={(e) => updateTestimonial({ ...t, review: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-wider text-white">
                    Photo Gallery Manager
                  </h3>
                  <p className="text-xs text-zinc-400">Add, edit, save, or delete authentic photos of equipment, studio floor, and classes</p>
                </div>
                <button
                  onClick={async () => {
                    await addGalleryItem({
                      title: 'New Studio View',
                      category: 'STUDIO',
                      imageUrl: '/gym_images/inside_dumbbell_rack.jpg',
                      order: gallery.length + 1,
                    });
                    showSaved('New Photo added & saved!');
                  }}
                  className="flex items-center gap-1.5 bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <img src={g.imageUrl} alt={g.title} className="w-full h-36 object-cover" />
                      <div className="p-3 space-y-2">
                        <input
                          type="text"
                          value={g.title}
                          onChange={(e) => updateGalleryItem({ ...g, title: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs font-semibold text-white"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-amber-400 uppercase font-bold">{g.category}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={async () => {
                                await updateGalleryItem(g);
                                showSaved(`Saved photo "${g.title}"!`);
                              }}
                              className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() =>
                                requestDelete(
                                  'Gallery Photo',
                                  g.title,
                                  () => deleteGalleryItem(g.id),
                                  () => updateGalleryItem(g)
                                )
                              }
                              className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* UNIVERSAL ADMIN DELETE CONFIRMATION MODAL: "DELETE YES OR NO / SAVE" */}
      {pendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-zinc-950 border-2 border-rose-500/60 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 text-zinc-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider">
                    Admin Confirmation Required
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white mt-0.5">
                    Delete: Yes or No?
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setPendingDelete(null)}
                className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                {pendingDelete.category}
              </span>
              <p className="text-sm font-bold text-white break-words">
                &ldquo;{pendingDelete.itemName}&rdquo;
              </p>
              <p className="text-xs text-zinc-400 pt-1">
                Do you want to permanently delete this record, or keep and save it?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={async () => {
                  const item = pendingDelete;
                  setPendingDelete(null);
                  await item.onConfirmDelete();
                  showSaved(`Deleted "${item.itemName}" successfully!`);
                }}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display uppercase tracking-wider text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 cursor-pointer transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete It</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  const item = pendingDelete;
                  setPendingDelete(null);
                  if (item.onSaveInstead) {
                    await item.onSaveInstead();
                  } else {
                    await saveAllAdminData();
                  }
                  showSaved(`No — Kept & Saved "${item.itemName}"!`);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display uppercase tracking-wider text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>No, Keep &amp; Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
