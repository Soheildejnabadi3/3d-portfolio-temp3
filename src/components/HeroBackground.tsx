import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

const HeroBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const frameIdRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const timeRef = useRef<number>(0);
  const heroElementsRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2, // strength
      0.6, // radius
      0.3  // threshold
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Create hero-specific 3D elements
    createHeroElements();

    // Animation loop
    const animate = () => {
      timeRef.current += 0.01;

      // Update camera based on mouse
      if (cameraRef.current) {
        cameraRef.current.position.x += (mouseRef.current.x * 3 - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y += (mouseRef.current.y * 3 - cameraRef.current.position.y) * 0.02;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Animate hero elements
      heroElementsRef.current.forEach((group, index) => {
        group.rotation.x = timeRef.current * (0.2 + index * 0.1);
        group.rotation.y = timeRef.current * (0.3 + index * 0.05);
        group.rotation.z = timeRef.current * (0.1 + index * 0.02);

        // Floating motion
        group.position.y = Math.sin(timeRef.current + index) * 2;
        group.position.x = Math.cos(timeRef.current * 0.5 + index) * 1;
      });

      composerRef.current?.render();
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !composerRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      // Dispose of geometries and materials
      heroElementsRef.current.forEach(group => {
        group.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      });
    };
  }, []);

  const createHeroElements = () => {
    if (!sceneRef.current) return;

    heroElementsRef.current = [];

    // Create central crystal formation
    const centralGroup = new THREE.Group();
    
    // Main crystal
    const crystalGeometry = new THREE.ConeGeometry(2, 6, 8);
    const crystalMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    centralGroup.add(crystal);

    // Surrounding smaller crystals
    for (let i = 0; i < 6; i++) {
      const smallCrystal = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 2, 6),
        new THREE.MeshBasicMaterial({
          color: 0x3b82f6,
          wireframe: true,
          transparent: true,
          opacity: 0.4
        })
      );
      
      const angle = (i / 6) * Math.PI * 2;
      smallCrystal.position.set(
        Math.cos(angle) * 4,
        Math.sin(angle) * 2,
        Math.sin(angle) * 2
      );
      smallCrystal.rotation.z = angle;
      centralGroup.add(smallCrystal);
    }

    centralGroup.position.set(0, 0, -5);
    sceneRef.current.add(centralGroup);
    heroElementsRef.current.push(centralGroup);

    // Create floating geometric shapes
    const shapes = [
      { geometry: new THREE.DodecahedronGeometry(1.5), position: [-8, 3, -3] },
      { geometry: new THREE.IcosahedronGeometry(1.2), position: [8, -2, -4] },
      { geometry: new THREE.TetrahedronGeometry(1), position: [-6, -4, -2] },
      { geometry: new THREE.OctahedronGeometry(1.3), position: [6, 4, -3] }
    ];

    shapes.forEach((shape, index) => {
      const group = new THREE.Group();
      
      const mesh = new THREE.Mesh(
        shape.geometry,
        new THREE.MeshBasicMaterial({
          color: index % 2 === 0 ? 0x9f7aea : 0x60a5fa,
          wireframe: true,
          transparent: true,
          opacity: 0.3
        })
      );
      
      group.add(mesh);
      group.position.set(...shape.position);
      sceneRef.current?.add(group);
      heroElementsRef.current.push(group);
    });

    // Create particle rings
    for (let ring = 0; ring < 3; ring++) {
      const ringGroup = new THREE.Group();
      const radius = 10 + ring * 3;
      const particleCount = 20 + ring * 10;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          new THREE.MeshBasicMaterial({
            color: ring % 2 === 0 ? 0x8b5cf6 : 0x3b82f6,
            transparent: true,
            opacity: 0.8
          })
        );

        particle.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.3,
          Math.sin(angle * 2) * 2
        );

        ringGroup.add(particle);
      }

      ringGroup.position.z = -8 - ring * 2;
      sceneRef.current?.add(ringGroup);
      heroElementsRef.current.push(ringGroup);
    }

    // Create energy beams
    for (let i = 0; i < 4; i++) {
      const beamGroup = new THREE.Group();
      
      const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.2
      });
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.rotation.z = (i / 4) * Math.PI * 2;
      beam.position.set(
        Math.cos(i) * 12,
        Math.sin(i) * 8,
        -10
      );
      
      beamGroup.add(beam);
      sceneRef.current?.add(beamGroup);
      heroElementsRef.current.push(beamGroup);
    }
  };

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default HeroBackground;