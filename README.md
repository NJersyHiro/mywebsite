# HY Portfolio

Portfolio website for 山本浩裕 (HY) - AI x Full-Stack Engineer.

Built with Next.js 16, Tailwind CSS v4, React Three Fiber, Three.js, and GSAP.

## Features

- **3D Neural Network Hero Section**: Interactive 3D particle network rendered with React Three Fiber. 60 glowing nodes connected by dynamic edges, with smooth mouse parallax effect. Uses additive blending for neon glow aesthetics.
- **MDX Content System**: File-based project content using gray-matter frontmatter parsing and remark for Markdown-to-HTML conversion. 6 work project entries and 10 personal project entries with structured metadata.
- **Projects List Page**: Responsive card grid (1/2/3 columns) with hover animations, gradient thumbnails, and tech tags. Cards link to individual project detail pages.
- **Personal Projects Page**: 10 personal GitHub projects with GitHub badges, source code links, and blue-accent tech tags. Separate card design with purple gradient hover effects.
- **Project Detail Pages**: Static generation via `generateStaticParams`. MDX content rendered with `@tailwindcss/typography` prose styling. Back navigation, metadata tags, period/role display. Personal projects include GitHub repository links.
- **Homepage Sections**: Scroll indicator with animated mouse icon and bounce arrow below the hero. Projects preview section showing the first 3 projects in a responsive grid with a link to the full projects page.
- **About Page**: Bio, certifications, and skills visualization. Animated skill bars with IntersectionObserver-triggered progress animation, gradient fills, and duration labels in Japanese. Certification badges with hover effects. Skills organized by category in a responsive 2-column grid.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4 (CSS-based config)
- React Three Fiber / Three.js
- GSAP
- gray-matter / remark (MDX content)
- @tailwindcss/typography
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
content/
  projects/              # MDX work project files with frontmatter
  personal-projects/     # MDX personal project files with GitHub links
src/
  app/
    page.tsx             # Home page
    layout.tsx           # Root layout
    globals.css          # Tailwind v4 theme config
    about/
      page.tsx           # About page with bio, certs, skills
    projects/
      page.tsx           # Work projects list page
      [slug]/
        page.tsx         # Work project detail page (SSG)
    personal-projects/
      page.tsx           # Personal projects list page
      [slug]/
        page.tsx         # Personal project detail page (SSG)
  components/
    about/
      SkillBar.tsx       # Animated skill progress bar with IntersectionObserver
      CertBadge.tsx      # Certification badge with hover effect
    home/
      ScrollIndicator.tsx          # Animated scroll-down indicator
      ProjectsPreview.tsx          # Work projects preview section (first 3)
      PersonalProjectsPreview.tsx  # Personal projects preview section (first 3)
    layout/
      Header.tsx         # Navigation header
      Footer.tsx         # Site footer
    projects/
      ProjectCard.tsx          # Work project card component
      PersonalProjectCard.tsx  # Personal project card with GitHub badge
    three/
      NeuralNetwork.tsx  # 3D particle network with nodes and edges
      HeroScene.tsx      # Scene with lights and mouse parallax
      HeroCanvas.tsx     # R3F Canvas wrapper
      HeroSection.tsx    # Client component with dynamic import (ssr: false)
  lib/
    projects.ts            # Work project MDX parsing utilities
    personal-projects.ts   # Personal project MDX parsing utilities
```
