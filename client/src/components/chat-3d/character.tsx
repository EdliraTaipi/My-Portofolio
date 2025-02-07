import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export function Character({ isSpoken = false }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/robot.glb');
  const { actions, names } = useAnimations(animations, group);

  // Handle animation states
  useEffect(() => {
    if (isSpoken) {
      actions['talk']?.play();
    } else {
      actions['idle']?.play();
    }

    return () => {
      actions['talk']?.stop();
      actions['idle']?.stop();
    };
  }, [actions, isSpoken]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
    </group>
  );
}
