import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline();
    
    if (isMenuOpen) {
      // Animate menu open
      timeline
        .to('.nav-menu', { 
          x: '0%', 
          duration: 0.5, 
          ease: 'power3.out' 
        })
        .to(navItemsRef.current, { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.4, 
          ease: 'power3.out' 
        }, '-=0.2');
    } else {
      // Animate menu close
      timeline
        .to(navItemsRef.current, { 
          opacity: 0, 
          y: 20, 
          stagger: 0.05, 
          duration: 0.2, 
          ease: 'power3.in' 
        })
        .to('.nav-menu', { 
          x: '100%', 
          duration: 0.4, 
          ease: 'power3.in' 
        }, '-=0.1');
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={navRef} 
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="text-white font-bold text-2xl cursor-pointer" data-cursor="logo">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Portfolio</span>
        </div>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <a 
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-white hover:text-purple-400 transition-colors duration-300 text-lg font-medium"
                data-cursor="link"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          data-cursor="button"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile Navigation */}
        <div className="nav-menu fixed top-0 right-0 h-full w-full md:w-80 bg-black/95 transform translate-x-full transition-transform z-50 md:z-auto">
          <div className="flex justify-end p-6">
            <button
              onClick={toggleMenu}
              className="text-white p-2"
              aria-label="Close menu"
              data-cursor="button"
            >
              <X size={24} />
            </button>
          </div>
          
          <ul className="flex flex-col items-center justify-center h-full pb-20">
            {navItems.map((item, index) => (
              <li
                key={item.label}
                ref={(el) => {
                  if (el) navItemsRef.current[index] = el;
                }}
                className="my-4 opacity-0 transform translate-y-8"
              >
                <a 
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-white hover:text-purple-400 transition-colors duration-300 text-2xl font-bold"
                  data-cursor="link"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;