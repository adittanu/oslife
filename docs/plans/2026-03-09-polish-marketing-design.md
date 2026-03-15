# Polish & Marketing Design

Date: 2026-03-09

Three parallel workstreams to improve landing page, SEO, and PWA support.

## A. Landing Page Upgrade

New and updated sections in page order:

1. **Hero** (update) — add screenshot mockup of app below CTA, browser frame with Daily Spread preview
2. **Modes** — keep as is
3. **How It Works** (new) — 3 steps: Daftar → Pilih Mode → Mulai Produktif. Icon + short description per step.
4. **Features** — keep as is
5. **Screenshot Gallery** (new) — 3-4 screenshots of different modes in device/browser mockups
6. **Pricing** (update) — add detailed comparison table below existing cards (features per plan)
7. **FAQ** (new) — accordion with 6-8 common questions (gratis?, data aman?, bisa offline?, dll)
8. **Testimonials** (update) — expand from 2 to 4-6 testimonials in grid layout
9. **CTA Final** (new) — closing section before footer: "Siap mengorganisir hidupmu?" + register button

All new sections use Framer Motion `whileInView` animations consistent with existing style.

## B. SEO & Meta Tags

- Open Graph tags: title, description, image, url per page
- Twitter Card: summary_large_image
- Meta description per page via Inertia `<Head>`
- Structured data: JSON-LD SoftwareApplication schema
- Canonical URL
- Sitemap.xml generated from routes
- robots.txt

Implementation via Inertia Head component and Laravel routes for sitemap/robots.

## C. PWA + Offline Shell

- `manifest.json`: app name "Life OS", icons (192x192, 512x512), theme_color (#EC4899), display: standalone, background_color (#FFF8F0)
- Service Worker: cache app shell (HTML, CSS, JS, fonts, key assets)
- Offline fallback: custom offline page when no connection
- Install meta tags for iOS (apple-mobile-web-app) and Android
- Icons generated from existing logo

## Constraints

- No backend data persistence changes in this phase
- All landing page content is static (hardcoded in JSX)
- PWA does not include offline data sync
- Consistent with existing bullet journal aesthetic
