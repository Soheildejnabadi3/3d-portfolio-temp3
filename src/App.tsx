import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import AudioController from './components/AudioController';
import { useGSAP } from './hooks/useGSAP';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { initializeAnimations } = useGSAP();

  useEffect(() => {
    // Simulate assets loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Initialize animations after loading
      setTimeout(() => {
        initializeAnimations();
      }, 100);
    }, 2500);

    return () => clearTimeout(timer);
  }, [initializeAnimations]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <CustomCursor />
      <AudioController />
      <Layout>
        <Home />
        <About />
        <Projects />
        <Contact />
      </Layout>
    </>
  );
}

export default App;