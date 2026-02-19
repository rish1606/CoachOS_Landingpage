import { Suspense, lazy } from 'react';
import { SEO } from './components/SEO';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UsesSection from './components/UsesSection';
import PricingBuilderSection from './components/PricingBuilderSection';
import ModulesSection from './components/ModulesSection'; // Sticky/Scroll Layout

// Lazy load heavy 3D/interactive components
const GymManagementSection = lazy(() => import('./components/GymManagementSection')); // Module 1
const MobileAppSection = lazy(() => import('./components/MobileAppSection'));         // Module 2
const CoachPanelSection = lazy(() => import('./components/CoachPanelSection'));       // Module 3
const AICoachSection = lazy(() => import('./components/AICoachSection'));             // Module 4

const AboutSection = lazy(() => import('./components/AboutSection'));
const EndBrandSection = lazy(() => import('./components/EndBrandSection'));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#07080C] text-white/20">
    Loading...
  </div>
);

function App() {
  return (
    <div className="min-h-screen relative bg-[#07080C]">
      <SEO />
      <Navbar />
      <main>
        <Hero />
        <UsesSection />

        {/* New Modules Section (Sticky/Scroll) */}
        <ModulesSection />

        <Suspense fallback={<LoadingFallback />}>
          <GymManagementSection />
          <MobileAppSection />
          <CoachPanelSection />
          <AICoachSection />
        </Suspense>



        <PricingBuilderSection />

        <Suspense fallback={<LoadingFallback />}>
          <AboutSection />
          <EndBrandSection />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
