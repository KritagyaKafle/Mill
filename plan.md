# Thank You Oil Mill Website Plan

## Summary

Build a polished, scroll-driven single-page brand website for **Thank You Oil
Mill** in `Mill/`. The site will use the existing logo, oil-mill animation
frames, product signboard image, and a warm South Asian premium-heritage visual
language. It will be bilingual: English-led with concise Nepali supporting copy.

The navigation will contain only `Home`, `Our Products`, and `Contact Us`, each
scrolling smoothly to its page section. No ecommerce, pricing, checkout, or
unsupported product claims will be included.

## Experience And Design

- Use a warm palette grounded in deep leaf green, mustard gold, paper ivory, and
  restrained earthy red accents; preserve the logo's visual identity.
- Use editorial, high-contrast display typography for headlines and a clean
  sans-serif for navigation and body text. Do not use generic marketing copy or
  decorative gradients.
- Create a glossy, translucent top navigation bar that has a subtle highlight at
  page load, then condenses into a smaller solid/blurred bar after scrolling.
  Include an active-section indicator and an accessible mobile menu.
- Make the `Home` section a full-viewport introduction with the supplied logo,
  concise brand copy, and a scroll cue.
- Follow with a pinned cinematic production chapter: render an optimized subset
  of `product_hero` frames on a canvas, tied smoothly to scroll position,
  showing the oil-making process without using a large GIF. Animate headline
  text in short, deliberate stages over the sequence.
- Build `Our Products` around a prominent mustard-oil spotlight only. Use the
  supplied mill/product imagery and label other categories as future additions
  rather than inventing details for masala or flour.
- Build `Contact Us` with the verified Kusunti 13, Lalitpur address,
  click-to-call links for `9845535198` and `9851349233`, and a location map
  based on the supplied address. Include the legal name `Thank You Company Pvt.
  Ltd.` in the footer.

## Implementation

- Use a lightweight Vite site with semantic HTML, modular CSS, and vanilla
  JavaScript. Use GSAP with ScrollTrigger for pinned, scrubbed, and reveal
  animations.
- Keep editable business copy, bilingual strings, contact data, and product
  metadata in one structured content module so future masala and flour details
  can be added without changing layout logic.
- Convert and resize the hero frame assets during implementation into optimized
  WebP image-sequence variants; preload the poster and nearby frames first, then
  load remaining frames progressively. Provide a static poster and simple reveal
  animation for reduced-motion users or devices that cannot support the canvas
  sequence.
- Implement smooth anchor scrolling with scroll offsets that account for the
  shrinking navigation height. Keep all interactions keyboard accessible and
  respect `prefers-reduced-motion`.
- Add technical SEO: unique title and meta description, canonical URL
  placeholder, Open Graph metadata, descriptive image alt text, local-business
  JSON-LD using only verified company/address/phone data, sitemap, robots rules,
  and semantic heading hierarchy.
- Do not claim purity, organic status, cold pressing, health benefits,
  certifications, production capacity, or founding history until verified
  content is supplied.

## Test Plan

- Verify navigation, active states, smooth scrolling, mobile menu, contact
  links, and map link across desktop and mobile viewports.
- Verify frame sequence remains smooth without blank canvas states during fast
  scrolling, and static/reduced-motion fallback works.
- Test text wrapping, contrast, focus states, touch interaction, image loading,
  and page performance on mobile.
- Validate page title, headings, metadata, structured data, canonical
  placeholder, sitemap, and accessibility with automated checks.

## Assumptions

- Public brand name: **Thank You Oil Mill**.
- Legal footer name: **Thank You Company Pvt. Ltd.**.
- Initial product focus: mustard oil only; additional product details will be
  supplied later.
- Initial map location: **Kusunti 13, Lalitpur**, to be visually verified before
  launch.
- The existing logo and supplied images are approved for website use.
