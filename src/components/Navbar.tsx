import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, User, Users, LogOut, ChevronRight, Phone, Calendar, MapPin, Compass, PhoneCall } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useAuth } from '../context/AuthContext';
import { LocationDistanceModal } from './LocationDistanceModal';
import { PhoneSignInModal } from './PhoneSignInModal';
import { LiveStudioClock } from './LiveStudioClock';
import { MemberNotificationsBanner } from './MemberNotificationsBanner';

export const Navbar: React.FC = () => {
  const { openBooking, openAdmin, openTrainersTab, settings } = useStudio();
  const { currentUser, phoneUser, isAdmin, logout, signOutPhone } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDistanceModalOpen, setIsDistanceModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: '3D Show', href: '#explore' },
    { name: 'Whole Gym', href: '#inside-gym' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Plans & Pricing', href: '#membership' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Location', href: '#location' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-xl'
            : 'bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-900 shadow-lg'
        }`}
      >
        <MemberNotificationsBanner onOpenMemberModal={() => setIsSignInModalOpen(true)} />
        <LiveStudioClock />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo with Authentic Studio Branding from Google Maps */}
            <a
              href="#"
              className="flex items-center gap-3 group cursor-pointer focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/50 shadow-lg shadow-amber-500/10 group-hover:border-amber-400 group-hover:scale-105 transition-all flex items-center justify-center p-0.5">
                <img
                  src="/bounce_icon_crest.png"
                  alt="Bounce Fitness Studio Official Logo Crest"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-2xl tracking-wider text-white leading-none group-hover:text-amber-400 transition-colors">
                    BOUNCE
                  </span>
                  <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Chikmagalur
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 leading-tight">
                  Fitness Studio
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-amber-400 transition-colors py-1 relative group cursor-pointer"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-200 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Dedicated Trainers Tab Button */}
              <button
                onClick={openTrainersTab}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/40 transition-all cursor-pointer shadow-sm"
                title="Open Dedicated Trainers Tab"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Trainers Tab</span>
              </button>

              {/* Distance & Maps Interactive Button */}
              <button
                onClick={() => setIsDistanceModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer shadow-sm"
                title="Calculate Distance and Open Google Maps Navigation"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Distance &amp; Maps</span>
                <span className="md:hidden">Maps</span>
              </button>

              {/* Call Studio Contact Number */}
              <a
                href={`tel:${settings.phone}`}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-colors"
                title="Direct Phone Call"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>{settings.phone}</span>
              </a>

              {/* Member Sign-In (Phone & Name only, No email!) */}
              {phoneUser ? (
                <button
                  onClick={() => setIsSignInModalOpen(true)}
                  className="flex items-center gap-1.5 bg-zinc-900 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white hover:border-emerald-400 transition-colors cursor-pointer"
                  title="View Member Pass & Plan Duration"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-emerald-400 max-w-[80px] truncate">{phoneUser.name}</span>
                  {phoneUser.durationLabel && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase">
                      {phoneUser.durationLabel.split(' ')[0]} {phoneUser.durationLabel.split(' ')[1] || ''}
                    </span>
                  )}
                </button>
              ) : currentUser ? (
                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg p-1 pr-2">
                  <span className="text-xs font-medium text-zinc-300 max-w-[80px] truncate">
                    {currentUser.displayName?.split(' ')[0] || 'User'}
                  </span>
                  <button onClick={logout} className="text-zinc-500 hover:text-rose-400 p-0.5" title="Sign Out">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSignInModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
                  title="Sign In with Phone Number and Name"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Dev Admin */}
              <button
                onClick={openAdmin}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
                title="Admin Dashboard"
              >
                <Shield className="w-4 h-4" />
              </button>

              {/* Primary BOOK NOW button */}
              <button
                onClick={() => openBooking()}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Now</span>
              </button>
            </div>

            {/* Mobile Actions Toggle */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setIsDistanceModalOpen(true)}
                className="p-2 rounded-lg bg-zinc-900 text-amber-400 border border-zinc-800"
                title="Distance & Maps"
              >
                <Compass className="w-5 h-5" />
              </button>
              <button
                onClick={() => openBooking()}
                className="bg-amber-500 text-zinc-950 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider"
              >
                Book
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-200 hover:text-white border border-zinc-800 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/50 p-0.5">
                <img src="/bounce_icon_crest.png" alt="Bounce Crest" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-wider text-white">BOUNCE</span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-400">Fitness Studio</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 py-4 overflow-y-auto">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="flex items-center justify-between text-left text-base font-display uppercase tracking-wider text-zinc-200 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 pt-3 border-t border-zinc-800">
            {/* Distance & Maps in Mobile Menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsDistanceModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-amber-400 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-amber-500/40"
            >
              <Compass className="w-4 h-4" />
              <span>Distance &amp; Turn-by-Turn Maps</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBooking();
              }}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSignInModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{phoneUser ? phoneUser.name : 'Sign In'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAdmin();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            </div>

            <a
              href={`tel:${settings.phone}`}
              className="flex items-center justify-center gap-2 text-xs text-zinc-300 pt-1 hover:text-white"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Studio: {settings.phone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Global Distance & Geolocation Modal */}
      <LocationDistanceModal
        isOpen={isDistanceModalOpen}
        onClose={() => setIsDistanceModalOpen(false)}
      />

      {/* Phone Number and Name Sign In Modal */}
      <PhoneSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
};
