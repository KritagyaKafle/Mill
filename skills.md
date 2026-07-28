# Thank You Oil Mill — Skills & Dependencies

> This file tracks all technologies, libraries, and tools used in this project.
> Updated as new dependencies are added.

---

## Core Framework

| Skill / Tool        | Purpose                                      | Version   | Status      |
| -------------------- | -------------------------------------------- | --------- | ----------- |
| **Astro**            | Static site generator, islands architecture  | latest    | 🔲 To install |
| **React**            | Interactive component islands                | 19.x      | 🔲 To install |
| **TypeScript**       | Type safety for components and content       | 5.x       | 🔲 To install |

## Styling

| Skill / Tool        | Purpose                                      | Version   | Status      |
| -------------------- | -------------------------------------------- | --------- | ----------- |
| **Tailwind CSS**     | Utility-first CSS framework                  | v4        | 🔲 To install |
| **@tailwindcss/vite**| Tailwind v4 Vite plugin for Astro            | latest    | 🔲 To install |

## Animation

| Skill / Tool        | Purpose                                      | Version   | Status      |
| -------------------- | -------------------------------------------- | --------- | ----------- |
| **GSAP**             | Animation engine (scroll, timeline, tweens)  | 3.x       | 🔲 To install |
| **@gsap/react**      | React integration hooks for GSAP             | 2.x       | 🔲 To install |
| **ScrollTrigger**    | GSAP plugin: scroll-driven animations        | (bundled) | 🔲 To install |

## Fonts

| Skill / Tool        | Purpose                                      | Version   | Status      |
| -------------------- | -------------------------------------------- | --------- | ----------- |
| **Playfair Display** | Serif display font for headlines             | Google    | 🔲 To add    |
| **Inter**            | Sans-serif for body text and navigation      | Google    | 🔲 To add    |

## Image Optimization

| Skill / Tool        | Purpose                                      | Version   | Status      |
| -------------------- | -------------------------------------------- | --------- | ----------- |
| **sharp**            | Image conversion (JPEG → WebP), resizing     | latest    | 🔲 To install |
| **astro:assets**     | Built-in Astro image optimization            | (bundled) | 🔲 To use    |

## SEO

| Skill / Tool        | Purpose                                      | Version   | Status      |
| -------------------- | -------------------------------------------- | --------- | ----------- |
| **@astrojs/sitemap** | Auto-generated sitemap.xml                   | latest    | 🔲 To install |
| **JSON-LD**          | Structured data for local business           | manual    | 🔲 To write  |

## Dev Tools

| Skill / Tool        | Purpose                                      | Version   | Status      |
| -------------------- | -------------------------------------------- | --------- | ----------- |
| **Node.js**          | Runtime                                      | 18+       | ✅ Available |
| **npm**              | Package manager                              | 10+       | ✅ Available |
| **Vite**             | Bundler (used internally by Astro)           | (bundled) | 🔲 To install |

---

## Custom React Components (Hand-crafted, no external deps)

| Component           | Pattern Inspired By    | Purpose                                |
| -------------------- | ---------------------- | -------------------------------------- |
| `MagneticButton`     | ReactBits Magnetic     | Cursor-following magnetic hover effect |
| `TextReveal`         | ReactBits Split Text   | Word-by-word reveal animation          |
| `ParallaxSection`    | GSAP ScrollTrigger     | Subtle depth parallax between sections |
| `HeroCanvas`         | Apple-style scroll scrub | Canvas frame sequence on scroll      |
| `NavIsland`          | Custom                 | Mobile menu + scroll spy               |

---

## npm Install Command (will run at Phase 0)

```bash
# Core
npm create astro@latest ./ -- --template minimal --no-install --typescript strict

# Integrations
npx astro add react tailwind

# Animation
npm install gsap @gsap/react

# Image processing (dev dependency for build script)
npm install -D sharp

# SEO
npm install @astrojs/sitemap
```

---

## Key Architecture Decisions

1. **Astro Islands** — React components hydrate only where interactivity is needed.
   Static HTML ships for everything else. This gives us the best possible
   Lighthouse performance score while keeping React's animation ecosystem.

2. **GSAP over Framer Motion** — For scroll-scrubbed canvas sequences, GSAP
   ScrollTrigger is the industry standard. Framer Motion excels at layout
   animations but struggles with canvas-based frame sequences.

3. **Tailwind v4** — CSS-first configuration, no `tailwind.config.js` needed.
   Design tokens defined directly in CSS using `@theme`.

4. **Frame Downsampling** — 297 frames → ~80 key frames. At 1280×720 WebP
   quality 80, each frame is ~30-40KB = ~2.5-3MB total. Progressive loading
   ensures the first frame appears instantly.

5. **Content Module** — All bilingual text, phone numbers, address, and product
   data in a single `siteContent.ts` file. Future masala/flour additions require
   zero layout changes.
