# Design System

## Direction

La Maison Malgache uses a contemporary woven logic rather than literal folkloric motifs. The page behaves like interlaced bands: image fields, text rails, borders, and asymmetrical spans connect product, material, gesture, and place.

The visual world must feel premium, current, and culturally grounded without defaulting to beige craft styling.

## Palette

- Background: mineral cool grey `#f1f3f1`
- Surface: cool stone `#e6e9e7`
- Strong surface: `#d5d9d6`
- Ink: charcoal `#151918`
- Muted text: `#5c6562`
- Accent field: cobalt `#1f49b6`
- Cobalt text: mineral white `#f6f7f4`

Dark mode preserves the same cold material family and cobalt identity.

## Typography

- Display: existing brand asset `MB Picture House One`, self-hosted from `/public/assets/fonts`.
- Body: existing `Lato` regular/light.
- Display lines are large but capped at 6rem, compact and left aligned.
- Body copy stays around 65-75 characters per line with relaxed leading.

## Geometry

- Page-level modules use sharp edges and hairline dividers.
- No generic rounded-card system.
- Product imagery is large and rectangular, typically 4:5 or full-height editorial crops.
- The composition alternates wide image fields with narrower text rails to create the woven rhythm.

## Navigation

The desktop header stays on one line and keeps the brand at left, navigation centered, utilities at right. Mobile keeps a horizontal overflow rail instead of hiding the information architecture behind a decorative menu.

## Motion

Motion is restrained and purposeful. The hero image uses one authored clip reveal with `prefers-reduced-motion` support. Product cards only use a small image scale on hover. Do not repeat entrance animations across every section.

## Imagery

Migration starts with existing repository photography. Real product, artisan, material, and territory photography should replace placeholders as it becomes available. Do not fabricate documentary proof or product claims.

## Content Rules

- No unverified prices, stock, certifications, artisan names, specifications, or testimonials.
- Product storytelling should eventually connect object, material, technique, maker, and place.
- Avoid decorative section labels and section numbering.
- Avoid em-dashes in visible copy.

## Responsive Rules

- Below 768px, all asymmetric layouts collapse to a single column.
- Hero text and image become stacked.
- Navigation remains horizontally scrollable rather than wrapping.
- Interactive labels remain one line where possible.
