import { useEffect, useRef, useState } from 'react';
import { useThreeScene } from '../hooks/useThreeScene';
import { Music, VolumeX } from 'lucide-react';

const AudioController = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const { updateAudioData } = useThreeScene();

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/ambient.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    // Set up audio context for analysis
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
    
    // Connect audio to analyzer
    const source = audioContextRef.current.createMediaElementSource(audioRef.current);
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);
    
    // Update audio data
    const updateData = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      updateAudioData(Array.from(dataArrayRef.current));
      
      requestAnimationFrame(updateData);
    };
    
    updateData();
    
    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [updateAudioData]);
  
  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Resume AudioContext if it was suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-black/80 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-3">
        <button 
          onClick={toggleAudio}
          className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-white hover:bg-purple-600/30 transition-colors"
          data-cursor="button"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? <VolumeX size={18} /> : <Music size={18} />}
        </button>
        
        {isPlaying && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 accent-purple-500"
            aria-label="Volume control"
          />
        )}
      </div>
    </div>
  );
};

export default AudioController;