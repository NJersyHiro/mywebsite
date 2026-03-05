# HY Portfolio Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 3D neural-network-themed portfolio site for 山本浩裕 (HY), an AI × Full-Stack Engineer.

**Architecture:** Next.js 14 App Router with SSG. React Three Fiber for the 3D hero scene (neural network particles). MDX for project content. Tailwind CSS for styling. Deploy to Vercel.

**Tech Stack:** Next.js 14, TypeScript, React Three Fiber, Three.js, GSAP, Tailwind CSS, MDX, Vercel

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Step 1: Create Next.js app**

```bash
cd /home/th1kh/mywebsite
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults: No Turbopack for dev.

**Step 2: Verify it runs**

```bash
npm run dev &
sleep 3
ps aux | grep next
```

Open browser to `http://localhost:3000` — confirm default Next.js page renders.

**Step 3: Stop dev server and install 3D + animation dependencies**

```bash
npm install three @react-three/fiber @react-three/drei gsap @gsap/react
npm install -D @types/three
```

**Step 4: Install MDX support**

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter
npm install -D @types/mdx
```

**Step 5: Configure Tailwind with custom colors**

Edit `tailwind.config.ts` to add custom color palette:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        "card-bg": "#1a1a2e",
        "neon-blue": "#00d4ff",
        "neon-purple": "#7b2ff7",
        "text-main": "#f0f0f0",
        "text-sub": "#8892b0",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 6: Set up global styles in `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --background: #0a0a0f;
  --card-bg: #1a1a2e;
  --neon-blue: #00d4ff;
  --neon-purple: #7b2ff7;
  --text-main: #f0f0f0;
  --text-sub: #8892b0;
}

body {
  background-color: var(--background);
  color: var(--text-main);
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
}

::selection {
  background-color: rgba(123, 47, 247, 0.3);
  color: #f0f0f0;
}
```

**Step 7: Set up root layout in `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HY | AI × Full-Stack Engineer",
  description: "山本浩裕のポートフォリオサイト。AIを製品として組み込めるフルスタックエンジニア。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

**Step 8: Verify the app starts with custom styles**

```bash
npm run dev &
sleep 3
```

Open browser to `http://localhost:3000` — confirm dark background renders.

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with Tailwind, R3F, GSAP, MDX"
```

---

## Phase 2: 3D Hero Section

### Task 2: Create the Neural Network 3D scene

**Files:**
- Create: `src/components/three/NeuralNetwork.tsx`
- Create: `src/components/three/HeroScene.tsx`
- Create: `src/components/three/HeroCanvas.tsx`

**Step 1: Create `src/components/three/NeuralNetwork.tsx`**

This component renders the particle nodes and connecting edges:

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Node {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

function generateNodes(count: number, spread: number): Node[] {
  const nodes: Node[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002
      ),
    });
  }
  return nodes;
}

function getEdges(nodes: Node[], maxDistance: number): number[] {
  const indices: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < maxDistance) {
        indices.push(i, j);
      }
    }
  }
  return indices;
}

interface NeuralNetworkProps {
  nodeCount?: number;
  spread?: number;
  maxEdgeDistance?: number;
}

export default function NeuralNetwork({
  nodeCount = 60,
  spread = 8,
  maxEdgeDistance = 3,
}: NeuralNetworkProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<Node[]>(generateNodes(nodeCount, spread));

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    nodesRef.current.forEach((node, i) => {
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodeCount]);

  useFrame(() => {
    const nodes = nodesRef.current;
    const pointPositions = pointsRef.current?.geometry.attributes.position;
    if (!pointPositions) return;

    nodes.forEach((node, i) => {
      node.position.add(node.velocity);

      // Bounce within bounds
      ["x", "y", "z"].forEach((axis) => {
        const a = axis as "x" | "y" | "z";
        if (Math.abs(node.position[a]) > spread / 2) {
          node.velocity[a] *= -1;
        }
      });

      (pointPositions.array as Float32Array)[i * 3] = node.position.x;
      (pointPositions.array as Float32Array)[i * 3 + 1] = node.position.y;
      (pointPositions.array as Float32Array)[i * 3 + 2] = node.position.z;
    });
    pointPositions.needsUpdate = true;

    // Update edges
    if (linesRef.current) {
      const edges = getEdges(nodes, maxEdgeDistance);
      const linePositions = new Float32Array(edges.length * 3);
      edges.forEach((nodeIndex, i) => {
        linePositions[i * 3] = nodes[nodeIndex].position.x;
        linePositions[i * 3 + 1] = nodes[nodeIndex].position.y;
        linePositions[i * 3 + 2] = nodes[nodeIndex].position.z;
      });
      linesRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions, 3)
      );
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Nodes */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          size={0.08}
          color="#00d4ff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Edges */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#7b2ff7"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
```

**Step 2: Create `src/components/three/HeroScene.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";
import NeuralNetwork from "./NeuralNetwork";

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      // Parallax: camera follows mouse slightly
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.05,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <NeuralNetwork />
      {/* Ambient glow */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#7b2ff7" />
    </group>
  );
}
```

**Step 3: Create `src/components/three/HeroCanvas.tsx`**

```tsx
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
```

**Step 4: Update `src/app/page.tsx` to use the hero**

```tsx
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative">
      {/* 3D Hero */}
      <section className="relative h-screen flex items-center justify-center">
        <HeroCanvas />
        <div className="relative z-10 text-center">
          <h1 className="text-7xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              HY
            </span>
          </h1>
          <p className="text-xl text-text-sub">
            山本浩裕 | AI × Full-Stack Engineer
          </p>
        </div>
      </section>
    </main>
  );
}
```

**Step 5: Verify in browser**

```bash
npm run dev &
sleep 3
```

Open `http://localhost:3000` — confirm 3D neural network particles render with dark background, "HY" text centered, mouse parallax works.

**Step 6: Commit**

```bash
git add src/components/three/ src/app/page.tsx
git commit -m "feat: add 3D neural network hero section with R3F"
```

---

## Phase 3: Navigation & Layout

### Task 3: Create navigation header and footer

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`

**Step 1: Create `src/components/layout/Header.tsx`**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-neon-blue">
          HY
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-text-sub hover:text-neon-blue transition-colors duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-sub"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニューを開く"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-white/5">
          <ul className="flex flex-col items-center py-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-sub hover:text-neon-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
```

**Step 2: Create `src/components/layout/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-sub text-sm">
          &copy; {new Date().getFullYear()} HY - 山本浩裕
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-sub hover:text-neon-blue transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
```

**Step 3: Add Header and Footer to layout**

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "HY | AI × Full-Stack Engineer",
  description: "山本浩裕のポートフォリオサイト。AIを製品として組み込めるフルスタックエンジニア。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

**Step 4: Verify in browser**

Open `http://localhost:3000` — confirm header with nav links, footer renders. Mobile hamburger works.

**Step 5: Commit**

```bash
git add src/components/layout/ src/app/layout.tsx
git commit -m "feat: add header navigation and footer"
```

---

## Phase 4: Project Content & MDX

### Task 4: Set up MDX content system and project data

**Files:**
- Create: `src/lib/projects.ts`
- Create: `content/projects/skosh.mdx`
- Create: `content/projects/ai-video-analysis.mdx`
- Create: `content/projects/ai-agent.mdx`
- Create: `content/projects/gen-ai-platform.mdx`
- Create: `content/projects/salesforce-compass.mdx`
- Create: `content/projects/invoice-automation.mdx`

**Step 1: Create `src/lib/projects.ts`**

This utility reads MDX frontmatter and provides typed project data:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Project {
  slug: string;
  title: string;
  description: string;
  role: string;
  period: string;
  tags: string[];
  thumbnail: string;
  order: number;
  content: string;
}

const projectsDir = path.join(process.cwd(), "content/projects");

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));

  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(projectsDir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      role: data.role ?? "",
      period: data.period ?? "",
      tags: data.tags ?? [],
      thumbnail: data.thumbnail ?? "/images/projects/default.png",
      order: data.order ?? 99,
      content,
    };
  });

  return projects.sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find((p) => p.slug === slug);
}
```

**Step 2: Create MDX content files**

Create `content/projects/` directory and write 6 MDX files. Example for `content/projects/skosh.mdx`:

```mdx
---
title: "ECサイト SKOSH"
description: "シーシャカフェ向けECサイトを設計から総合テストまで1人で担当。Next.js 14、PostgreSQL、Prismaを使い、Square APIでの決済機能や年齢確認フローを実装。"
role: "フルスタックエンジニア（1人開発）"
period: "2025年4月〜7月（4ヶ月）"
tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Square API", "GitHub Actions"]
thumbnail: "/images/projects/skosh.png"
order: 1
---

## プロジェクト概要

シーシャ（水たばこ）カフェのオンライン販売を実現するECサイトの新規構築プロジェクトです。

## 担当範囲

設計からリリースまで全工程を1人で担当しました。

- DB設計（PostgreSQL + Prisma）
- フロントエンド・バックエンド実装（Next.js 14 App Router）
- Square APIを使った決済連携
- たばこ製品販売に必要な法令対応（年齢確認フロー）
- CI/CD構築（GitHub Actions）

## 技術的なポイント

- SSRとSSGを適切に使い分け、商品ページの高速表示を実現
- Square APIのWebhookで注文ステータスをリアルタイム同期
- 年齢確認フローを法令に準拠した形で実装
```

Create similar MDX files for the other 5 projects (ai-video-analysis, ai-agent, gen-ai-platform, salesforce-compass, invoice-automation) using content from the resume.

**Step 3: Verify MDX parsing works**

Create a quick test in the terminal:

```bash
node -e "
const fs = require('fs');
const matter = require('gray-matter');
const raw = fs.readFileSync('content/projects/skosh.mdx', 'utf-8');
const { data } = matter(raw);
console.log(JSON.stringify(data, null, 2));
"
```

Expected: JSON output with title, description, tags, etc.

**Step 4: Commit**

```bash
git add src/lib/projects.ts content/projects/
git commit -m "feat: add MDX content system and 6 project entries"
```

---

## Phase 5: Projects Page

### Task 5: Build the projects list page and project card

**Files:**
- Create: `src/components/projects/ProjectCard.tsx`
- Create: `src/app/projects/page.tsx`

**Step 1: Create `src/components/projects/ProjectCard.tsx`**

```tsx
import Link from "next/link";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <article className="group relative bg-card-bg rounded-xl overflow-hidden border border-white/5 hover:border-neon-blue/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]">
        {/* Thumbnail placeholder */}
        <div className="h-48 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 flex items-center justify-center">
          <span className="text-4xl text-text-sub/30 font-mono">
            {project.title.charAt(0)}
          </span>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-text-main mb-2 group-hover:text-neon-blue transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-text-sub mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
```

**Step 2: Create `src/app/projects/page.tsx`**

```tsx
import { getAllProjects } from "@/lib/projects";
import ProjectCard from "@/components/projects/ProjectCard";

export const metadata = {
  title: "Projects | HY",
  description: "山本浩裕の開発実績一覧",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Projects
          </span>
        </h1>
        <p className="text-text-sub mb-12">開発実績</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

**Step 3: Verify in browser**

Open `http://localhost:3000/projects` — confirm 6 project cards render in grid, hover effects work.

**Step 4: Commit**

```bash
git add src/components/projects/ src/app/projects/
git commit -m "feat: add projects list page with card grid"
```

---

### Task 6: Build the project detail page

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`

**Step 1: Create `src/app/projects/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import Link from "next/link";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} | HY`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/projects"
          className="text-text-sub hover:text-neon-blue transition-colors mb-8 inline-block"
        >
          ← Projects
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-text-sub">
          <span>{project.period}</span>
          <span>|</span>
          <span>{project.role}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Render MDX content as HTML */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-text-main prose-p:text-text-sub prose-a:text-neon-blue prose-strong:text-text-main">
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </article>
      </div>
    </main>
  );
}
```

Note: This renders raw markdown. We will need to add a markdown-to-HTML converter. Install `remark` + `remark-html`:

```bash
npm install remark remark-html
```

Update `src/lib/projects.ts` to convert markdown to HTML:

```typescript
import { remark } from "remark";
import html from "remark-html";

// Add this function:
export async function getProjectBySlugWithHtml(slug: string): Promise<(Project & { html: string }) | undefined> {
  const project = getProjectBySlug(slug);
  if (!project) return undefined;

  const processed = await remark().use(html).process(project.content);
  return { ...project, html: processed.toString() };
}
```

Then update the detail page to use `getProjectBySlugWithHtml` and render `project.html` with `dangerouslySetInnerHTML`.

**Step 2: Install Tailwind Typography plugin**

```bash
npm install @tailwindcss/typography
```

Add to `tailwind.config.ts` plugins:

```typescript
plugins: [require("@tailwindcss/typography")],
```

**Step 3: Verify in browser**

Open `http://localhost:3000/projects/skosh` — confirm project detail renders with formatted content.

**Step 4: Commit**

```bash
git add src/app/projects/ src/lib/projects.ts
git commit -m "feat: add project detail page with MDX rendering"
```

---

## Phase 6: About Page

### Task 7: Build the About page with skills visualization

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/components/about/SkillBar.tsx`
- Create: `src/components/about/CertBadge.tsx`

**Step 1: Create `src/components/about/SkillBar.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  name: string;
  months: number;
  maxMonths?: number;
}

export default function SkillBar({ name, months, maxMonths = 32 }: SkillBarProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const percentage = Math.min((months / maxMonths) * 100, 100);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const label = years > 0
    ? `${years}年${remainingMonths > 0 ? `${remainingMonths}ヶ月` : ""}`
    : `${months}ヶ月`;

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-text-main">{name}</span>
        <span className="text-xs text-text-sub">{label}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-1000 ease-out"
          style={{ width: visible ? `${percentage}%` : "0%" }}
        />
      </div>
    </div>
  );
}
```

**Step 2: Create `src/components/about/CertBadge.tsx`**

```tsx
interface CertBadgeProps {
  name: string;
}

export default function CertBadge({ name }: CertBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-2 rounded-lg bg-card-bg border border-white/10 text-sm text-text-sub hover:border-neon-blue/30 hover:text-neon-blue transition-all duration-300">
      {name}
    </span>
  );
}
```

**Step 3: Create `src/app/about/page.tsx`**

```tsx
import SkillBar from "@/components/about/SkillBar";
import CertBadge from "@/components/about/CertBadge";

export const metadata = {
  title: "About | HY",
  description: "山本浩裕について - AIを製品として組み込めるフルスタックエンジニア",
};

const skills = {
  "言語": [
    { name: "Python", months: 16 },
    { name: "TypeScript / JavaScript", months: 14 },
    { name: "Apex / SOQL", months: 7 },
    { name: "C", months: 7 },
    { name: "Go", months: 5 },
  ],
  "フレームワーク": [
    { name: "React", months: 9 },
    { name: "NestJS", months: 5 },
    { name: "Electron", months: 5 },
    { name: "Next.js", months: 4 },
  ],
  "AI / LLM": [
    { name: "LLM API設計 (Gemini / OpenAI)", months: 11 },
    { name: "プロンプトエンジニアリング", months: 11 },
    { name: "AIエージェント設計", months: 5 },
  ],
  "DB": [
    { name: "PostgreSQL", months: 16 },
    { name: "MongoDB", months: 5 },
  ],
  "クラウド / インフラ": [
    { name: "Linux", months: 19 },
    { name: "Kubernetes / OpenShift", months: 15 },
    { name: "Docker", months: 5 },
    { name: "AWS", months: 5 },
    { name: "Azure", months: 5 },
  ],
  "DevOps": [
    { name: "Git", months: 32 },
    { name: "GitHub Actions", months: 16 },
  ],
};

const certifications = [
  "応用情報技術者",
  "AWS SAP",
  "LPIC Level 3",
  "Java Gold",
  "CCNA",
  "Salesforce Platform Admin",
  "Salesforce Agentforce Specialist",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            About
          </span>
        </h1>
        <p className="text-text-sub mb-12">自己紹介</p>

        {/* Bio */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-text-main mb-4">山本浩裕</h2>
          <p className="text-text-sub leading-relaxed mb-4">
            AIを製品として組み込めるフルスタックエンジニア。
            アメリカのニュージャージー州で経営学を学び、帰国後にIT業界へ。
            LLM API設計・エージェント設計・データ設計・SaaS化を軸に、
            AIを「研究」ではなく「製品」として届けることにこだわっています。
          </p>
          <p className="text-text-sub leading-relaxed">
            TypeScriptベースのフルスタック開発（React / Next.js / NestJS）と、
            Gemini API・OpenAI APIを活用したAIアプリケーション開発が得意分野です。
          </p>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-text-main mb-6">資格</h2>
          <div className="flex flex-wrap gap-3">
            {certifications.map((cert) => (
              <CertBadge key={cert} name={cert} />
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-2xl font-semibold text-text-main mb-8">スキル</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-medium text-neon-blue mb-4">{category}</h3>
                {items.map((skill) => (
                  <SkillBar key={skill.name} name={skill.name} months={skill.months} />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
```

**Step 4: Verify in browser**

Open `http://localhost:3000/about` — confirm bio, cert badges, and animated skill bars render. Scroll to trigger animations.

**Step 5: Commit**

```bash
git add src/app/about/ src/components/about/
git commit -m "feat: add about page with skills visualization and certifications"
```

---

## Phase 7: Homepage Sections & Scroll Animations

### Task 8: Add project preview and scroll animations to homepage

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/home/ProjectsPreview.tsx`
- Create: `src/components/home/ScrollIndicator.tsx`

**Step 1: Create `src/components/home/ScrollIndicator.tsx`**

```tsx
"use client";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
      <div className="w-6 h-10 border-2 border-text-sub/30 rounded-full flex items-start justify-center p-2">
        <div className="w-1 h-2 bg-neon-blue rounded-full animate-pulse" />
      </div>
    </div>
  );
}
```

**Step 2: Create `src/components/home/ProjectsPreview.tsx`**

```tsx
import { getAllProjects } from "@/lib/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import Link from "next/link";

export default function ProjectsPreview() {
  const projects = getAllProjects().slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold mb-2">
        <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Projects
        </span>
      </h2>
      <p className="text-text-sub mb-10">開発実績</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"
        >
          すべてのプロジェクトを見る →
        </Link>
      </div>
    </section>
  );
}
```

**Step 3: Update `src/app/page.tsx`**

```tsx
import dynamic from "next/dynamic";
import ScrollIndicator from "@/components/home/ScrollIndicator";
import ProjectsPreview from "@/components/home/ProjectsPreview";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative">
      {/* 3D Hero */}
      <section className="relative h-screen flex items-center justify-center">
        <HeroCanvas />
        <div className="relative z-10 text-center">
          <h1 className="text-7xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              HY
            </span>
          </h1>
          <p className="text-xl text-text-sub">
            山本浩裕 | AI × Full-Stack Engineer
          </p>
        </div>
        <ScrollIndicator />
      </section>

      {/* Projects Preview */}
      <ProjectsPreview />
    </main>
  );
}
```

**Step 4: Verify in browser**

Open `http://localhost:3000` — confirm hero section with scroll indicator, then projects preview below.

**Step 5: Commit**

```bash
git add src/app/page.tsx src/components/home/
git commit -m "feat: add homepage projects preview and scroll indicator"
```

---

## Phase 8: Build, Test & Deploy

### Task 9: Production build and Vercel deployment

**Step 1: Run production build**

```bash
npm run build
```

Expected: Build completes with no errors. All pages statically generated.

**Step 2: Test production build locally**

```bash
npm run start &
sleep 3
```

Open `http://localhost:3000` — verify all pages work in production mode.

**Step 3: Create `.gitignore` update**

Ensure `.gitignore` includes:
```
.firecrawl/
```

**Step 4: Create GitHub repository and push**

```bash
gh repo create mywebsite --public --source=. --push
```

**Step 5: Deploy to Vercel**

```bash
npx vercel --yes
```

Or connect the GitHub repository to Vercel dashboard for auto-deploy.

**Step 6: Verify deployment**

Open the Vercel URL — confirm all pages render correctly.

**Step 7: Verify CI/CD**

```bash
gh run list --limit 5
```

**Step 8: Update README.md**

Create `README.md` with project overview, tech stack, local development instructions.

**Step 9: Final commit**

```bash
git add -A
git commit -m "chore: production build, deployment config, and README"
git push
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | Task 1 | Project scaffolding (Next.js + Tailwind + R3F + MDX) |
| 2 | Task 2 | 3D Neural Network hero section |
| 3 | Task 3 | Navigation header + footer |
| 4 | Task 4 | MDX content system + 6 project entries |
| 5 | Tasks 5-6 | Projects list page + detail page |
| 6 | Task 7 | About page with skills + certifications |
| 7 | Task 8 | Homepage sections + scroll animations |
| 8 | Task 9 | Build, deploy to Vercel, README |
