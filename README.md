# KCF Fellowship — Next.js 14 (App Router)

Production-ready, worship-inspired site built with Next.js 14 App Router, TypeScript, Tailwind, shadcn/ui, Framer Motion, Swiper, React Player, and Lightbox.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with custom teal/blue palette (064E40, 0DAD8D, 8DD8CC, 30BFBF, 0C98BA, 1164B4)
- shadcn/ui primitives (buttons, inputs, cards)
- Framer Motion animations
- Swiper sliders
- React Player for sermons
- React Awesome Lightbox for gallery
- Cloudflare R2 placeholders for future media storage

## Structure

- app/layout.tsx — global layout with Navbar & Footer
- app/page.tsx — landing page (hero slider, mission, events, sermons, gallery tease)
- app/about — story, mission/vision, timeline, stats
- app/contact — leader contacts, form, map
- app/gallery — masonry grid with filters + lightbox
- app/sermons — featured player + grid
- app/events — event grid + roadmap cards
- app/lib/data.ts — sample data (events, sermons, gallery, milestones)
- app/components — UI and feature components
- styles/theme.css — CSS variables + glass utility

## Setup

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Lint

```bash
npm run lint
```

4. Build

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and set:

- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`
- `R2_PUBLIC_BASE_URL` (or `NEXT_PUBLIC_R2_PUBLIC_BASE_URL`) — the public CDN/base URL used in the UI
- Optional: `R2_REGION` (placeholder like `auto` if SDK requires), `R2_SIGNED_URL_TTL_SECONDS`

## Notes

- All media links are placeholders; replace with Cloudflare R2 URLs when ready.
- Lightbox, Swiper, and ReactPlayer are client-side; ensure they remain in client components.
- Remote image domains are whitelisted in next.config.mjs (Unsplash/Pexels/etc.).
