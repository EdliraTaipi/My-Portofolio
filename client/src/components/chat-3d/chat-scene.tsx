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
  const cubeRef = useRef<THREE.Mesh | null>(null);
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
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x111111);
    containerRef.current.appendChild(renderer.domElement);

    // Create cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    cubeRef.current = cube;

    // Animation
    let time = 0;
    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      if (cubeRef.current) {
        cubeRef.current.rotation.x = Math.sin(time) * 0.5;
        cubeRef.current.rotation.y += 0.01;

        if (isSpoken) {
          cubeRef.current.scale.x = 1.2;
          cubeRef.current.scale.y = 1.2;
          cubeRef.current.scale.z = 1.2;
        } else {
          cubeRef.current.scale.x = 1;
          cubeRef.current.scale.y = 1;
          cubeRef.current.scale.z = 1;
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

  // Handle isSpoken changes
  useEffect(() => {
    if (!cubeRef.current) return;

    const color = isSpoken ? 0xff3366 : 0x00ff88;
    (cubeRef.current.material as THREE.MeshBasicMaterial).color.setHex(color);
  }, [isSpoken]);

  return <div ref={containerRef} className="w-full h-full" />;
}