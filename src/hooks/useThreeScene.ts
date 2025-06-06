import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  originalPosition: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
  mesh: THREE.Mesh;
}

const useThreeScene = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const containerElement = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const audioDataRef = useRef<number[]>(new Array(128).fill(0));
  const frameIdRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const timeRef = useRef<number>(0);
  const shapesRef = useRef<THREE.Mesh[]>([]);

  const updateMousePosition = useCallback((x: number, y: number) => {
    mouseRef.current = { x, y };
  }, []);

  const updateAudioData = useCallback((data: number[]) => {
    audioDataRef.current = data;
  }, []);

  const createParticles = useCallback(() => {
    if (!sceneRef.current) return;

    const count = 2000;
    particlesRef.current = [];

    // Create a plane of particles
    for (let i = 0; i < count; i++) {
      // Create grid-like distribution
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;

      const geometry = new THREE.CircleGeometry(0.03, 6);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.6, 0.2, 0.8),
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      sceneRef.current.add(mesh);

      const particle: Particle = {
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        acceleration: new THREE.Vector3(),
        originalPosition: new THREE.Vector3(x, y, z),
        life: Math.random() * Math.PI * 2,
        maxLife: Math.PI * 2,
        size: 0.03,
        color: new THREE.Color(0.6, 0.2, 0.8),
        mesh
      };

      particlesRef.current.push(particle);
    }
  }, []);

  const createShapeGeometry = useCallback(() => {
    if (!sceneRef.current) return;

    // Clear existing shapes
    shapesRef.current.forEach(shape => {
      sceneRef.current?.remove(shape);
      shape.geometry.dispose();
      (shape.material as THREE.Material).dispose();
    });
    shapesRef.current = [];

    // Create main torus
    const torusGeometry = new THREE.TorusGeometry(8, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0x6b46c1,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    sceneRef.current.add(torus);
    shapesRef.current.push(torus);

    // Create floating polyhedrons
    const shapes = [
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.TetrahedronGeometry(1, 0)
    ];

    shapes.forEach((geometry, i) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0x9f7aea,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        Math.cos(i * Math.PI * 2 / 3) * 6,
        Math.sin(i * Math.PI * 2 / 3) * 6,
        0
      );
      sceneRef.current?.add(mesh);
      shapesRef.current.push(mesh);

      // Animate each shape
      gsap.to(mesh.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 20 + i * 5,
        repeat: -1,
        ease: 'none'
      });
    });
  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) {
      return;
    }

    const delta = clockRef.current.getDelta();
    timeRef.current += delta;

    // Smooth camera movement
    targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.05;
    targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.05;

    if (cameraRef.current) {
      cameraRef.current.position.x += (targetRef.current.x * 5 - cameraRef.current.position.x) * 0.02;
      cameraRef.current.position.y += (targetRef.current.y * 5 - cameraRef.current.position.y) * 0.02;
      cameraRef.current.lookAt(0, 0, 0);
    }

    // Rotate main torus
    if (shapesRef.current[0]) {
      shapesRef.current[0].rotation.x = timeRef.current * 0.2;
      shapesRef.current[0].rotation.y = timeRef.current * 0.3;
    }

    // Update particles
    particlesRef.current.forEach((particle, i) => {
      // Wave motion
      particle.life += delta;
      if (particle.life > particle.maxLife) {
        particle.life = 0;
      }

      const wave = Math.sin(particle.life + particle.position.x * 0.2) * 0.2;
      const wave2 = Math.cos(particle.life + particle.position.y * 0.2) * 0.2;

      // Calculate new position
      const newPos = new THREE.Vector3().copy(particle.originalPosition);
      newPos.z += wave + wave2;

      // Add mouse influence
      newPos.x += targetRef.current.x * 2 * (particle.position.z + 10) / 10;
      newPos.y += targetRef.current.y * 2 * (particle.position.z + 10) / 10;

      // Audio reactivity
      if (i % 20 === 0 && audioDataRef.current.length > 0) {
        const audioIndex = Math.floor(i % audioDataRef.current.length);
        const audioValue = audioDataRef.current[audioIndex] / 255;
        newPos.z += audioValue * 2;
      }

      // Smooth transition to new position
      particle.position.lerp(newPos, 0.1);
      particle.mesh.position.copy(particle.position);

      // Rotate particle
      particle.mesh.rotation.z = timeRef.current * 0.2 + particle.position.x * 0.1;

      // Update opacity based on position
      const material = particle.mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(particle.life) * 0.2;
    });

    composerRef.current.render();
    frameIdRef.current = requestAnimationFrame(animate);
  }, []);

  const initScene = useCallback((container: HTMLDivElement) => {
    if (isInitialized) return;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.7,
      0.4,
      0.4
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;
    
    createParticles();
    createShapeGeometry();
    
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !composerRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    frameIdRef.current = requestAnimationFrame(animate);
    setIsInitialized(true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      particlesRef.current.forEach(particle => {
        particle.mesh.geometry.dispose();
        if (particle.mesh.material instanceof THREE.Material) {
          particle.mesh.material.dispose();
        }
      });
      
      shapesRef.current.forEach(shape => {
        shape.geometry.dispose();
        if (shape.material instanceof THREE.Material) {
          shape.material.dispose();
        }
      });
    };
  }, [animate, createParticles, createShapeGeometry, isInitialized]);

  return {
    initScene,
    updateMousePosition,
    updateAudioData,
    containerElement,
  };
};

export { useThreeScene };