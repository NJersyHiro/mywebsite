"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import NeuralNetwork from "./NeuralNetwork";

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth mouse parallax rotation using lerp
    const targetRotationX = pointer.y * 0.15;
    const targetRotationY = pointer.x * 0.15;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#00d4ff" intensity={1.5} />
      <pointLight position={[-5, -5, -3]} color="#7b2ff7" intensity={1.5} />
      <group ref={groupRef}>
        <NeuralNetwork nodeCount={60} spread={5} maxEdgeDistance={1.8} />
      </group>
    </>
  );
}
