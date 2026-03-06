"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas"),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <HeroCanvas />
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Hiromichi Yamamoto
          </span>
        </h1>
        <p className="text-xl text-text-sub">
          AI × Full-Stack Engineer
        </p>
      </div>
    </section>
  );
}
