import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-4">
      <nav
        className={`
          relative flex items-center justify-between
          border rounded-full 
          backdrop-blur-xl
          transition-[width,max-width,padding,background,border,box-shadow] duration-500 ease-out
          ${isScrolled
            ? 'w-full max-w-[1200px] px-4 sm:px-6 py-2.5 sm:py-3 bg-[#07080C]/90 border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'w-full max-w-[700px] px-6 sm:px-8 py-3 sm:py-4 bg-white/[0.03] border-white/[0.08]'
          }
        `}
      >
        {/* LEFT: Nav Links */}
        <div className="hidden sm:flex items-center gap-6 min-w-[120px]">
          {['Features', 'Pricing', 'About'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CENTER: Brand Anchor */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <a href="#home" className="group flex items-center justify-center whitespace-nowrap">
            <span className="text-lg sm:text-xl font-bold tracking-wide text-white transition-all duration-300 [text-shadow:0_0_20px_rgba(160,200,255,0.25)] group-hover:[text-shadow:0_0_25px_rgba(160,200,255,0.5)]">
              Coach OS
            </span>
          </a>
        </div>

        {/* RIGHT: CTAs */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-[120px]">
          <a
            href="#contact"
            className="hidden md:block px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            Contact
          </a>

          <a
            href="#contact"
            className="hidden sm:block bg-white text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 hover:bg-white/90"
          >
            Get Started
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-white/80 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isMobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          absolute top-20 left-4 right-4 sm:hidden 
          bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl 
          flex flex-col items-center gap-5 shadow-2xl z-50
          transition-all duration-300 ease-out origin-top
          ${isMobileMenuOpen
            ? 'opacity-100 scale-100 pointer-events-auto p-6'
            : 'opacity-0 scale-95 pointer-events-none p-0 h-0 overflow-hidden'
          }
        `}
      >
        {isMobileMenuOpen && (
          <>
            {[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'About', href: '#about' }, { label: 'Contact', href: '#contact' }].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/80 hover:text-white text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="w-full bg-white text-black px-6 py-3 rounded-full text-base font-semibold text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
