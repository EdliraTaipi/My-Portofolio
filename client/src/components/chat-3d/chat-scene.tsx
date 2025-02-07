import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Character } from './character';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function ChatScene({ isSpoken = false }) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <Environment preset="city" />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Character isSpoken={isSpoken} />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
      />

      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
