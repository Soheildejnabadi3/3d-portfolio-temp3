import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!cursorRef.current || !cursorDotRef.current) return;
    
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    const onMouseMove = (e: MouseEvent) => {
      // Update cursor position accounting for its size
      gsap.to(cursor, {
        x: e.clientX - cursor.offsetWidth / 2,
        y: e.clientY - cursor.offsetHeight / 2,
        duration: 0.5,
        ease: 'power3.out'
      });
      
      // Update dot position
      gsap.to(cursorDot, {
        x: e.clientX - cursorDot.offsetWidth / 2,
        y: e.clientY - cursorDot.offsetHeight / 2,
        duration: 0.1,
        ease: 'power3.out'
      });
    };
    
    const onMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.2,
        ease: 'power3.out'
      });
    };
    
    const onMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
        ease: 'power3.out'
      });
    };
    
    const onMouseEnterInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const type = target.dataset.cursor;
      
      if (type === 'link') {
        gsap.to(cursor, {
          scale: 1.5,
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          duration: 0.3
        });
      } else if (type === 'button') {
        gsap.to(cursor, {
          scale: 1.3,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          mixBlendMode: 'difference',
          duration: 0.3
        });
      } else if (type === 'logo') {
        gsap.to(cursor, {
          scale: 2,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          duration: 0.3
        });
      }
    };
    
    const onMouseLeaveInteractive = () => {
      gsap.to(cursor, {
        scale: 1,
        borderColor: 'white',
        backgroundColor: 'transparent',
        mixBlendMode: 'normal',
        duration: 0.3
      });
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    const interactiveElements = document.querySelectorAll('[data-cursor]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });
    
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);
  
  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed w-8 h-8 rounded-full border border-white pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{ left: 0, top: 0 }}
      />
      <div 
        ref={cursorDotRef} 
        className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-50 hidden md:block"
        style={{ left: 0, top: 0 }}
      />
    </>
  );
};

export default CustomCursor;