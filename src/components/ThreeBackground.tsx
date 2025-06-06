import { useEffect, useRef } from 'react';
import { useThreeScene } from '../hooks/useThreeScene';

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { initScene, updateMousePosition } = useThreeScene();

  useEffect(() => {
    if (mountRef.current) {
      initScene(mountRef.current);
    }

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      updateMousePosition(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [initScene, updateMousePosition]);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 h-dvh w-auto z-0"
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;