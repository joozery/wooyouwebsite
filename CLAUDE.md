# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # type-check without building
```

No test suite exists yet.

## Architecture

### Two separate apps in one repo

| App | Route prefix | Layout file |
|-----|-------------|-------------|
| Public website | `/` | `app/(website)/layout.tsx` |
| Admin panel (ERP) | `/admin` | `app/admin/(panel)/layout.tsx` |

The route group `(website)` wraps every public page with `Navbar`, `Footer`, `FloatingContact`, and `CookieBanner`. Admin routes are independently protected.

### Public website homepage composition

`app/(website)/page.tsx` composes the homepage by stacking section components in order — `HeroSection → ServiceSection → TechStackSection → ERPServiceSection → RecentWorkSection → CustomerSection → BlogSection → CTASection`. All section components live in `components/website/`.

### Client vs Server Components

All page files and most section components are **Server Components** by default. Add `"use client"` only when you need browser APIs, state, or event handlers. Event handlers (`onClick`, `onMouseEnter`, etc.) **cannot** appear in Server Components — use Tailwind hover classes instead.

### Design tokens (Tailwind v4 `@theme`)

All brand colours are defined in `app/globals.css` inside `@theme {}` and are available as Tailwind utilities:

| Token | Value | Usage |
|-------|-------|-------|
| `bg-canvas` | `#0a0a14` | Page backgrounds |
| `bg-surface-soft` | `#10101e` | Section backgrounds |
| `bg-surface-card` | `#15152a` | Cards |
| `bg-surface-strong` | `#1c1c34` | Elevated cards |
| `text-ink` | `#f4f4ff` | Primary text |
| `text-body-soft` | `#a3a3bd` | Body/secondary text |
| `text-muted-soft` | `#6e6e8a` | Muted/caption text |
| `border-hairline` | `oklch(1 0 0 / 9%)` | Subtle borders |
| `brand-blue` | `#2563eb` | Primary CTA |
| `brand-purple` | `#8b5cf6` | Accent |
| `brand-cyan` | `#22d3ee` | Highlight |
| `brand-indigo` | `#4f46e5` | Gradient partner |

Custom keyframes defined in `globals.css`: `marquee`, `float`, `ping-ring`, `ping-ring-slow`, `cookieEnter`, `shimmer`.

### Static data files

| File | Purpose |
|------|---------|
| `lib/techStack.ts` | Tech categories and items rendered in `TechStackSection` |
| `lib/blogData.ts` | Blog/article data |
| `lib/api.ts` | Axios instance pointing at `NEXT_PUBLIC_API_URL` |

Tech icons are SVGs under `public/tech/` — add new ones with `npx @thesvg/cli add <slug> --dir ./public/tech`.

### Special pages

- `app/(website)/privacy-policy/page.tsx` — dark navy theme (standalone `bg-black`/dark gradient), does **not** inherit `bg-canvas` from parent layout. Uses inline `style` for colours rather than Tailwind tokens.
- `app/(website)/article/[slug]/page.tsx` — dynamic route for blog posts.
- `app/(website)/service/[serviceType]/page.tsx` — dynamic route for the 6 service types.

### Cookie consent

`components/website/CookieBanner.tsx` is a `"use client"` component. Persists user choice in `localStorage` under key `wc_cookie_consent` (`"accepted"` | `"declined"`). To reset during dev: `localStorage.removeItem('wc_cookie_consent')`.

### FloatingContact

`components/website/FloatingContact.tsx` — fixed bottom-right, `z-50`. `CookieBanner` sits at `z-[60]` to appear above it.

### Admin panel

Lives under `app/admin/`. Auth state is stored in `localStorage` (`adminUser`). API calls use the shared `lib/api.ts` axios instance. The panel is not yet migrated — `PAGES_DOCUMENTATION.md` documents the full intended route structure.

### Image hosting

`next.config.ts` allows remote images from `res.cloudinary.com`, `images.unsplash.com`, and `wooyoucreative.com`. Local assets: `public/logo/`, `public/tech/`, `public/floting/`.
