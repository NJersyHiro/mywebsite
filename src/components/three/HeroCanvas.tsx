"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroScene from "./HeroScene";

export default function HeroCanvas() {
  return (
    <div className="h-screen w-full absolute top-0 left-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
