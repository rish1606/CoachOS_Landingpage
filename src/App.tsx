import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UsesSection from './components/UsesSection';
import AboutSection from './components/AboutSection';
import OrbitCoreSection from './components/OrbitCoreSection';
import PricingSection from './components/PricingSection';
import SignupForm from './components/SignupForm';

function App() {
  return (
    <div className="min-h-screen relative bg-[#07080C]">
      <Navbar />
      <main>
        <Hero />
        <UsesSection />
        <OrbitCoreSection />
        <PricingSection />
        <AboutSection />
        <SignupForm />
      </main>
    </div>
  );
}

export default App;
