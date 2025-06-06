import { ReactNode, useEffect, useRef } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import ThreeBackground from './ThreeBackground';
import { useThreeScene } from '../hooks/useThreeScene';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { containerElement } = useThreeScene();
  
  useEffect(() => {
    if (containerRef.current) {
      containerElement.current = containerRef.current;
    }
  }, [containerElement]);

  return (
    <div className="relative min-h-screen overflow-hidden" ref={containerRef}>
      <ThreeBackground />
      <div className="relative z-10">
        <Navigation />
        <div className="relative">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;