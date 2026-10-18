import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StudioProvider } from './context/StudioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickInfoBar } from './components/QuickInfoBar';
import { AboutSection } from './components/AboutSection';
import { ProgramsSection } from './components/ProgramsSection';
import { FitnessGoalsSection } from './components/FitnessGoalsSection';
import { WhyBounceSection } from './components/WhyBounceSection';
import { Studio3DViewer } from './components/Studio3DViewer';
import { BioscienceModule } from './components/BioscienceModule';
import { ClassScheduleSection } from './components/ClassScheduleSection';
import { TrainersSection } from './components/TrainersSection';
import { MembershipPricingSection } from './components/MembershipPricingSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { AiStudioSuite } from './components/AiStudioSuite';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { TrainersTabModal } from './components/TrainersTabModal';
import { MobileBottomBar } from './components/MobileBottomBar';

export default function App() {
  return (
    <AuthProvider>
      <StudioProvider>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-950">
          {/* Main Navigation */}
          <Navbar />

          {/* Hero Section with High Impact Cinematic Brand & Verified Google Maps Photo */}
          <main className="flex-1">
            <Hero />
            <QuickInfoBar />
            <AboutSection />
            <ProgramsSection />
            <TrainersSection />
            <ClassScheduleSection />
            <FitnessGoalsSection />
            <WhyBounceSection />
            <Studio3DViewer />
            <BioscienceModule />
            <MembershipPricingSection />
            <GallerySection />
            <ReviewsSection />
            <LocationSection />
            <AiStudioSuite />
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer />

          {/* Modals & Overlays */}
          <BookingModal />
          <TrainersTabModal />
          <AdminDashboard />

          {/* Mobile Bottom Fixed Action Bar */}
          <MobileBottomBar />
        </div>
      </StudioProvider>
    </AuthProvider>
  );
}
