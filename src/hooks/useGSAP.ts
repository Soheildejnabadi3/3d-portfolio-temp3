import { useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

export const useGSAP = () => {
  const initializeAnimations = useCallback(() => {
    // Init ScrollTrigger
    ScrollTrigger.matchMedia({
      // All devices
      "all": () => {
        // Header animation on page load
        gsap.from('.hero-content h1', {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
        
        gsap.from('.hero-content p', {
          y: 50,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out'
        });
        
        gsap.from('.hero-cta', {
          y: 30,
          opacity: 0,
          duration: 1,
          delay: 0.6,
          ease: 'power3.out'
        });
        
        // About section animations
        ScrollTrigger.create({
          trigger: '#about',
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo('.about-header', 
              { y: 100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
            
            gsap.fromTo('.about-content', 
              { y: 100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
            );
            
            gsap.fromTo('.about-skills .skill-item', 
              { y: 40, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 0.5, 
                stagger: 0.1,
                ease: 'back.out(1.7)'
              }
            );
          },
          once: false
        });
        
        // Projects section animations
        ScrollTrigger.create({
          trigger: '#projects',
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo('.projects-header', 
              { y: 100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
            
            gsap.fromTo('.project-card', 
              { y: 100, opacity: 0, scale: 0.9 },
              { 
                y: 0, 
                opacity: 1, 
                scale: 1,
                duration: 0.8, 
                stagger: 0.15, 
                ease: 'power3.out'
              }
            );
          },
          once: false
        });
        
        // Contact section animations
        ScrollTrigger.create({
          trigger: '#contact',
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo('.contact-header', 
              { y: 100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
            
            gsap.fromTo('.contact-content', 
              { y: 100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
            );
            
            gsap.fromTo('.contact-form', 
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power3.out' }
            );
          },
          once: false
        });
        
        // Text animation for skills
        const typingAnimation = gsap.timeline({
          scrollTrigger: {
            trigger: '.typing-text',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
          }
        });
        
        typingAnimation.to('.typing-text', {
          duration: 3,
          text: {
            value: "Web Developer. Designer. 3D Artist. Creative Coder.",
            delimiter: ""
          },
          ease: "none"
        });
        
        // Parallax effects
        gsap.utils.toArray('.parallax-section').forEach((section: any) => {
          const depth = section.dataset.depth || 0.2;
          
          gsap.to(section, {
            y: () => (ScrollTrigger.maxScroll(window) * depth),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true
            }
          });
        });
      },
      
      // Desktop only
      "(min-width: 1024px)": () => {
        // Desktop specific animations
        gsap.utils.toArray('.project-card').forEach((card: any) => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -10,
              scale: 1.03,
              boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
              duration: 0.3,
              ease: 'power2.out'
            });
          });
          
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        });
      }
    });
    
    // Cleanup ScrollTriggers on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return { initializeAnimations };
};