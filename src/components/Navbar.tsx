import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Coach OS', href: '#coachos', isHighlighted: true },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-menu glass">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`navbar-link ${link.isHighlighted ? 'navbar-link-highlighted' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button 
          className="navbar-mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        {isMenuOpen && (
          <div className="navbar-mobile-menu glass">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`navbar-link ${link.isHighlighted ? 'navbar-link-highlighted' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
