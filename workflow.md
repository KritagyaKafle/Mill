# Thank You Oil Mill — Build Workflow

## Decisions Locked

| Decision             | Choice                                                       |
| -------------------- | ------------------------------------------------------------ |
| Framework            | **Astro** with React islands (interactive components only)   |
| Styling              | **Tailwind CSS v4** (CSS-first config)                       |
| Scroll / Canvas Anim | **GSAP + ScrollTrigger** (scroll-scrubbed canvas sequence)   |
| Micro-interactions   | Hand-crafted React components (ReactBits-inspired patterns)  |
| Frame Strategy       | ~80 key frames → WebP, canvas scrub, progressive load        |
| Fonts                | Google Fonts: Playfair Display (headlines) + Inter (body/nav) |
| Bilingual            | English-led, Nepali supporting copy in content module        |
| Check-ins            | Critical decisions only                                      |

---

## Phase 0 — Project Bootstrap

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 0.1  | Init Astro project in `Mill/` with React + Tailwind v4 integrations | `npm run dev` serves blank page  |
| 0.2  | Configure Tailwind v4 with custom design tokens (colors, fonts, spacing) | Tokens render correctly         |
| 0.3  | Set up project directory structure (see below)                 | Files exist, imports resolve         |
| 0.4  | Install GSAP + ScrollTrigger (self-hosted, not CDN)            | Import works in a test component     |
| 0.5  | Move existing assets (`logo.jpeg`, `products.jpg`, `product_hero/`) into `public/` | Assets serve via dev server |

### Target Directory Structure

```
Mill/
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── logo.webp            (converted from jpeg)
│   │   ├── products.webp        (converted from jpeg)
│   │   └── hero-frames/         (optimized WebP subset)
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Nav.astro             (static nav shell)
│   │   ├── NavIsland.tsx         (React: mobile menu, scroll spy)
│   │   ├── HeroCanvas.tsx        (React: GSAP scroll-scrubbed canvas)
│   │   ├── MagneticButton.tsx    (React: magnetic hover effect)
│   │   ├── TextReveal.tsx        (React: text reveal animation)
│   │   └── ParallaxSection.tsx   (React: smooth parallax depth)
│   ├── content/
│   │   └── siteContent.ts        (all bilingual copy, contact data, product info)
│   ├── layouts/
│   │   └── BaseLayout.astro      (HTML head, meta, JSON-LD, font loads)
│   ├── pages/
│   │   └── index.astro           (single page: Home → Hero → Products → Contact)
│   └── styles/
│       └── global.css            (Tailwind imports + custom utilities)
├── astro.config.mjs
├── tailwind.config.ts            (v4: may use CSS config instead)
├── package.json
├── tsconfig.json
├── CLAUDE.md
├── plan.md
├── workflow.md
└── skills.md
```

---

## Phase 1 — Design System & Layout Shell

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 1.1  | Define color palette in Tailwind config                        | Preview swatches in browser          |
| 1.2  | Set up typography scale (Playfair Display + Inter)             | Headings + body render correctly     |
| 1.3  | Build `BaseLayout.astro` with SEO meta, fonts, JSON-LD        | View source shows correct meta tags  |
| 1.4  | Create page skeleton in `index.astro` with all section anchors | Sections visible, IDs correct        |

### Color Palette (derived from logo)

```
--leaf-green:     #2D5016    (deep logo green — primary)
--leaf-green-50:  #f0f5ec    (lightest tint)
--leaf-green-100: #d4e4c8
--leaf-green-800: #1a3a08
--leaf-green-900: #0d2104
--mustard-gold:   #C8A23C    (seed/oil accent)
--mustard-gold-light: #E8D48A
--paper-ivory:    #F5F0E8    (warm background)
--earth-red:      #8B3A2F    (restrained accent)
--oil-amber:      #D4960A    (oil pour accent)
--charcoal:       #1C1C1C    (text)
--warm-white:     #FDFBF7    (lightest background)
```

---

## Phase 2 — Navigation

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 2.1  | Build glossy top nav bar with logo + 3 links (Home, Products, Contact) | Renders on page, links work     |
| 2.2  | Implement scroll-aware shrink: full → compact on scroll        | Observe transition on scroll         |
| 2.3  | Add active-section indicator via Intersection Observer         | Correct link highlights on scroll    |
| 2.4  | Build accessible mobile hamburger menu                         | Opens/closes, keyboard navigable     |
| 2.5  | Smooth anchor scroll with offset for nav height                | Click link → smooth scroll to section |

---

## Phase 3 — Home / Hero Section

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 3.1  | Full-viewport hero with logo, brand tagline (EN + NP)          | Fills viewport, text readable        |
| 3.2  | Add scroll cue animation (bouncing chevron)                    | Animates, disappears on scroll       |
| 3.3  | Implement text reveal animation on headline                    | Text animates in on page load        |
| 3.4  | Add subtle parallax / blur-to-focus on background              | Smooth depth effect                  |

---

## Phase 4 — Cinematic Scroll Sequence (Hero Canvas)

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 4.1  | Run frame optimization script: select ~80 key frames, convert to WebP, resize to 1280×720 | Output in `public/images/hero-frames/` |
| 4.2  | Build `HeroCanvas.tsx`: preload poster frame, progressive load remaining | First frame visible immediately |
| 4.3  | Wire GSAP ScrollTrigger to canvas: pin section, scrub through frames | Smooth frame progression on scroll |
| 4.4  | Add headline text overlays that animate at keyframe stages     | Text appears/changes at right moments |
| 4.5  | Implement `prefers-reduced-motion` fallback (static poster + fade reveals) | Enable in OS settings → verify |
| 4.6  | Performance test: no blank frames during fast scroll            | Rapid scroll test passes            |

### Frame Sequence Story Stages

| Frames (approx) | Content                          | Text Overlay                    |
| ---------------- | -------------------------------- | ------------------------------- |
| 1–70             | Mustard plant, seeds falling     | "From Seed..."                  |
| 70–140           | Seeds enter mill, oil pressing   | "...To Press"                   |
| 140–230          | Oil flowing, machine processing  | "Pure Mustard Oil"              |
| 230–297          | Oil pouring into bottle, product | "Thank You Oil Mill"            |

---

## Phase 5 — Products Section

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 5.1  | Mustard oil spotlight card with glow/spotlight effect           | Card renders with hover effect       |
| 5.2  | Product image with blur-to-focus reveal on scroll               | Image sharpens as user scrolls to it |
| 5.3  | "Coming Soon" placeholders for masala and flour categories      | Labeled as future, no false claims   |
| 5.4  | Scroll-triggered fade-in/slide-in for cards                    | Cards animate in from below          |

---

## Phase 6 — Contact Section & Footer

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 6.1  | Contact card with address, click-to-call phone links           | `tel:` links work on mobile          |
| 6.2  | Embedded map or map link for Kusunti 13, Lalitpur              | Map displays/links correctly         |
| 6.3  | Magnetic button effect on CTA buttons                          | Cursor-following magnet effect       |
| 6.4  | Footer with legal name, copyright, social placeholders         | Correct text, proper hierarchy       |

---

## Phase 7 — Polish & Animation Tuning

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 7.1  | Add animated counter/ticker for any stats (if data available)  | Numbers tick up on scroll            |
| 7.2  | Fine-tune all animation timings and easing curves              | Feels smooth, not jarring            |
| 7.3  | Mobile responsive pass: test all breakpoints                   | No overflow, touch-friendly          |
| 7.4  | Dark mode consideration (if applicable to brand)               | Optional — verify with user          |
| 7.5  | Focus states, keyboard navigation for all interactive elements | Tab through entire page              |

---

## Phase 8 — SEO & Performance

| Step | Task                                                           | Verify                              |
| ---- | -------------------------------------------------------------- | ----------------------------------- |
| 8.1  | Unique title, meta description, canonical URL placeholder      | View source → correct tags           |
| 8.2  | Open Graph metadata for social sharing                         | Facebook debugger / preview          |
| 8.3  | Local-business JSON-LD with verified data only                 | Structured data testing tool         |
| 8.4  | `robots.txt` and `sitemap.xml`                                 | Files serve correctly                |
| 8.5  | Image alt text audit: all images have descriptive alts         | Accessibility scan passes            |
| 8.6  | Lighthouse audit: Performance ≥ 90, SEO ≥ 95, A11y ≥ 90       | Run Lighthouse in Chrome             |
| 8.7  | Build production bundle, verify static output                  | `npm run build` succeeds             |

---

## Phase 9 — Final Review

| Step | Task                                                          | Verify                               |
| ---- | ------------------------------------------------------------- | ------------------------------------ |
| 9.1  | Full page walkthrough: desktop + mobile                       | All sections, animations, links work |
| 9.2  | Cross-browser spot check (Chrome, Firefox, Safari)            | No visual breakage                   |
| 9.3  | Content accuracy review with user                             | No unverified claims                 |
| 9.4  | Create walkthrough artifact documenting what was built         | Artifact complete                    |
