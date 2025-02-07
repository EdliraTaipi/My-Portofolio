import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Character } from './character';
import { Suspense } from 'react';

export function ChatScene({ isSpoken = false }) {
  return (
    <Canvas
      shadows={false}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: 'rgb(10, 10, 10)' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      <Suspense fallback={null}>
        <Character isSpoken={isSpoken} />
      </Suspense>
    </Canvas>
  );
}