import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Box } from '@react-three/drei';
import * as THREE from 'three';

export function Character({ isSpoken = false }) {
  const group = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const fallbackMesh = useRef<THREE.Mesh>(null);

  // Load the model with error handling
  const { scene, animations } = useGLTF('/models/robot.glb', undefined, (error) => {
    console.error('Error loading model:', error);
    setModelLoaded(false);
  });

  useEffect(() => {
    if (scene) {
      setModelLoaded(true);
    }
  }, [scene]);

  useFrame((state) => {
    if (fallbackMesh.current) {
      fallbackMesh.current.rotation.y += 0.01;
    }
    if (group.current) {
      // Simple bobbing animation
      group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      if (isSpoken) {
        group.current.rotation.y += 0.1;
      }
    }
  });

  return (
    <group ref={group}>
      {!modelLoaded ? (
        // Fallback cube when model fails to load
        <Box
          ref={fallbackMesh}
          args={[1, 1, 1]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color={isSpoken ? "#4af" : "#2af"} />
        </Box>
      ) : (
        <primitive 
          object={scene} 
          scale={1.5} 
          position={[0, -1, 0]}
        />
      )}
    </group>
  );
}