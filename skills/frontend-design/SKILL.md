---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Apache 2.0
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, vaporwave/retrowave, y2k/early web, 8-bit/16-bit retro, bauhaus, memphis design, constructivism, dark academia, glassmorphism, claymorphism, skeuomorphic, paper/collage, grunge/weathered, neon/cyberpunk, Japanese wabi-sabi, Swiss/international style, Scandinavian hygge, tropical/biophilic, isometric/3D, kinetic type, liquid/fluid morphing, photorealistic renders, hand-drawn/illustrative, deconstructivist, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

**Avoid card-based UIs**: Do not default to card components, card grids, or card-heavy layouts. Instead, explore alternatives: full-bleed sections, editorial flow, list views with generous spacing, asymmetric compositions, timeline flows, magazine-style layouts, or data-dense tables. Cards should only appear when the content genuinely requires bounded, elevated containers — and even then, challenge whether a border, subtle background shift, or typographic hierarchy could achieve the same goal more elegantly.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

## Accessibility & Inclusion

- Ensure **WCAG 2.1 AA compliance** minimum: sufficient color contrast (4.5:1 for body text), keyboard navigability, visible focus states
- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<button>`) — never rely solely on `<div>` soup
- Support `prefers-reduced-motion`: wrap animations in `@media (prefers-reduced-motion: no-preference)` or provide static fallbacks
- Test with keyboard-only navigation; every interactive element must be focusable and operable
- Use ARIA labels only when semantic HTML is insufficient

## Interaction States

Design the full lifecycle of interactions, not just the default state:
- **Loading**: skeleton screens, progressive loading, or elegant spinners that match the aesthetic
- **Empty**: zero-data states that are helpful and on-brand, never blank screens
- **Error**: clear, human-friendly error messages with recovery paths; inline validation for forms
- **Success**: confirmation feedback (toast, checkmark animation, or subtle state change)
- **Hover/Focus/Active**: choreographed state transitions with consistent timing; never remove focus outlines without replacement
- **Disabled**: clearly distinguish disabled from enabled states without relying solely on opacity

## Performance & Quality

- Prioritize **CSS-only animations** where possible; use `transform` and `opacity` for GPU-composited motion
- Apply `will-change` sparingly and remove after animation completes
- Optimize images: responsive `srcset`, modern formats (WebP/AVIF), lazy loading below the fold
- Keep JavaScript bundles minimal; no animation libraries unless necessary for complex orchestration
- Aim for fast First Contentful Paint and low Cumulative Layout Shift

## Responsive Behavior

- Design **mobile-first** by default unless the context demands desktop-first
- Use fluid typography (`clamp()`) and fluid spacing rather than fixed breakpoints alone
- Ensure touch targets are at least 44×44px
- Test extreme viewports: 320px wide and ultrawide displays
- Navigation must adapt gracefully: hamburger menus on mobile, horizontal nav when space permits

## Content Realism

- **Never use "lorem ipsum" placeholder text**. Write plausible, context-appropriate copy that matches the tone and purpose
- Design for content extremes: very long names, short descriptions, missing images, overflowing text
- Microcopy matters: button labels, helper text, empty states, and error messages should sound human and on-brand
- Use realistic data in demos: real names, plausible amounts, authentic imagery

## Technical Architecture

- Establish a **design token system**: CSS custom properties for colors, spacing scale, type scale, border radius, shadows
- Use consistent spacing scale (e.g., 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96)
- Prefer composition over monolithic components; build from small, reusable primitives
- Keep specificity low; avoid deep nesting in CSS
- Organize styles cohesively: either CSS-in-JS, utility-first, or BEM — but be consistent

## Polish Details

- Customize the **selection color** to match the brand
- Style scrollbars if they need to blend with dark themes
- Add a custom cursor if it enhances the experience (optional, never default)
- Include print styles when the content might be printed (hide nav, ensure contrast)
- Design 404 and edge-case pages with the same care as main flows
- Add subtle ambient effects that reward attention: grain overlays, moving gradients, or cursor-reactive elements

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
