import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingScreen = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Set initial state
    gsap.set(progressRef.current, { width: '0%' });
    gsap.set(counterRef.current, { textContent: '0%' });
    
    // Animate progress
    tl.to(progressRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut'
    });
    
    // Animate counter
    tl.to(counterRef.current, {
      textContent: '100%',
      duration: 2,
      ease: 'power2.inOut',
      modifiers: {
        textContent: (value) => {
          return Math.round(parseFloat(value)) + '%';
        }
      }
    }, 0);
    
    // Animate logo pulse
    gsap.to('.loader-logo', {
      scale: 1.1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, []);
  
  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
    >
      <div className="loader-logo text-4xl font-bold mb-12">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Portfolio</span>
      </div>
      
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
        ></div>
      </div>
      
      <div
        ref={counterRef}
        className="text-white/80 mt-4 font-mono"
      >
        0%
      </div>
    </div>
  );
};

export default LoadingScreen;