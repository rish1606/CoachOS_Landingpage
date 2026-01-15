import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UsesSection from './components/UsesSection';
import FooterCTA from './components/FooterCTA';
import SignupForm from './components/SignupForm';

function App() {
  return (
    <div className="min-h-screen relative bg-[#07080C]">
      <Navbar />
      <main>
        <Hero />
        <UsesSection />
        <FooterCTA />
        <SignupForm />
      </main>
    </div>
  );
}

export default App;
