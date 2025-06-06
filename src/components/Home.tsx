import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import HeroBackground from './HeroBackground';

const Home = () => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (!headerRef.current) return;
    
    const letters = headerRef.current.textContent?.split('') || [];
    headerRef.current.innerHTML = '';
    
    letters.forEach((letter, i) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px) rotateY(90deg)';
      headerRef.current?.appendChild(span);
      
      gsap.to(span, {
        opacity: 1,
        y: 0,
        rotateY: 0,
        duration: 0.8,
        delay: i * 0.05,
        ease: 'power3.out'
      });
    });
  }, []);
  
  const handleScrollDown = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero-specific 3D Background */}
      <HeroBackground />
      
      {/* Content */}
      <div className="hero-content text-center text-white z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 
          ref={headerRef} 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight"
        >
          Creative Portfolio
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-12 lg:mb-16 opacity-90 max-w-4xl mx-auto leading-relaxed">
          Creating immersive digital experiences with cutting-edge web technologies
        </p>
        <div className="hero-cta mb-16 sm:mb-20 lg:mb-24">
          <button 
            className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl"
            data-cursor="button"
          >
            Explore My Work
          </button>
        </div>
        <div 
          className="animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity" 
          onClick={handleScrollDown} 
          data-cursor="button"
        >
          <ChevronDown size={28} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 mx-auto text-white" />
        </div>
      </div>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10 pointer-events-none"></div>
    </section>
  );
};

export default Home;