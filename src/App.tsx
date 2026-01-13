import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SignupForm from './components/SignupForm';
import SpectrumWaves from './components/SpectrumWaves';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Animated Spectrum Wave Background */}
      <SpectrumWaves />

      <Navbar />

      <main className="main-content">
        <Hero />
        <SignupForm />
      </main>
    </div>
  );
}

export default App;
