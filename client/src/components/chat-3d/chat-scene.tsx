import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ChatSceneProps {
  isSpoken: boolean;
}

export function ChatScene({ isSpoken }: ChatSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shapeRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);

    // Create an icosahedron (20-sided shape)
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true,
      wireframeLinewidth: 2,
    });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    camera.position.z = 5;

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    shapeRef.current = shape;

    // Animation
    let time = 0;
    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      if (shapeRef.current) {
        // Smooth rotation
        shapeRef.current.rotation.x = Math.sin(time * 0.5) * 0.5;
        shapeRef.current.rotation.y += 0.005;

        // Pulse effect when spoken
        if (isSpoken) {
          shapeRef.current.scale.x = 1.1 + Math.sin(time * 8) * 0.1;
          shapeRef.current.scale.y = 1.1 + Math.sin(time * 8) * 0.1;
          shapeRef.current.scale.z = 1.1 + Math.sin(time * 8) * 0.1;
        } else {
          shapeRef.current.scale.x = 1 + Math.sin(time * 2) * 0.05;
          shapeRef.current.scale.y = 1 + Math.sin(time * 2) * 0.05;
          shapeRef.current.scale.z = 1 + Math.sin(time * 2) * 0.05;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Handle isSpoken changes with color transitions
  useEffect(() => {
    if (!shapeRef.current) return;

    const color = isSpoken ? 0x00ffff : 0x00ff88;
    (shapeRef.current.material as THREE.MeshBasicMaterial).color.setHex(color);
  }, [isSpoken]);

  return <div ref={containerRef} className="w-full h-full" />;
}