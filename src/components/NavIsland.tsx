import React, { useState, useEffect } from 'react';

const NavIsland: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -79% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // 80px offset for the navbar
      const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header 
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 transition-all duration-500 rounded-full ${
        isScrolled 
          ? 'h-16 bg-[var(--color-paper-ivory)]/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50' 
          : 'h-20 bg-[var(--color-paper-ivory)]/20 backdrop-blur-md shadow-lg border border-white/30'
      }`}
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <a 
          href="#home" 
          onClick={(e) => handleSmoothScroll(e, 'home')}
          className="flex items-center gap-3 group"
        >
          <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'w-10 h-10' : 'w-0 h-0 opacity-0'}`}>
            <img src="/images/logo.webp" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className={`font-display font-bold text-[var(--color-leaf-green-900)] transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
            Thank You Oil Mill
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-medium">
          {navLinks.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={(e) => handleSmoothScroll(e, link.id)}
              className={`transition-colors relative py-2 ${
                activeSection === link.id 
                  ? 'text-[var(--color-mustard-gold)]' 
                  : 'text-[var(--color-charcoal)] hover:text-[var(--color-mustard-gold)]'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-mustard-gold)] rounded-full layout-indicator"></span>
              )}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-[var(--color-charcoal)] focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen 
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-[var(--color-paper-ivory)] border-b border-black/5 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col p-4 gap-4 font-medium text-center">
          {navLinks.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={(e) => handleSmoothScroll(e, link.id)}
              className={`py-2 ${
                activeSection === link.id 
                  ? 'text-[var(--color-mustard-gold)]' 
                  : 'text-[var(--color-charcoal)]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default NavIsland;
