# HY Portfolio

Portfolio website for 山本浩裕 (HY) - AI x Full-Stack Engineer.

Built with Next.js 16, Tailwind CSS v4, React Three Fiber, Three.js, and GSAP.

## Features

- **3D Neural Network Hero Section**: Interactive 3D particle network rendered with React Three Fiber. 60 glowing nodes connected by dynamic edges, with smooth mouse parallax effect. Uses additive blending for neon glow aesthetics.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4 (CSS-based config)
- React Three Fiber / Three.js
- GSAP
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
  app/
    page.tsx          # Home page
    layout.tsx        # Root layout
    globals.css       # Tailwind v4 theme config
  components/
    three/
      NeuralNetwork.tsx  # 3D particle network with nodes and edges
      HeroScene.tsx      # Scene with lights and mouse parallax
      HeroCanvas.tsx     # R3F Canvas wrapper
      HeroSection.tsx    # Client component with dynamic import (ssr: false)
```
