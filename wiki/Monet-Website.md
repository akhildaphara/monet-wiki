The [[Monet-Website]] is the public-facing landing page for the [[Monet-App-Overview]] application. Built with Next.js 16 and React 19, it showcases the app's core features and serves as the entry point for new users to join the waitlist.

## Tech Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, Framer Motion (animations), Lucide React (icons)
- **Dev Server**: Runs on port 3001 (`next dev -p 3001`)

## Design
- Dark-mode-first design with an accent green (`accent-green`) color scheme.
- Uses `Inter` font family.
- Smooth Framer Motion entrance animations (fade-in, slide-up, slide-in).
- Glassmorphic glow effects behind app screenshots.

## Page Structure
The landing page (`app/page.tsx`) is a single-page layout with these sections:

1. **Navigation**: Logo (Sparkles icon) + "Get Early Access" button.
2. **Hero Section**: Headline ("The mathematically perfect way to play the points game."), tagline, and CTA buttons ("Download for iOS", "View Supported Cards").
3. **App Preview**: Two real app screenshots (`ss_search_home.png`, `ss_profile.png`) with green glow backdrop.
4. **Merchant Intelligence Feature**: Split layout with copy on the left (search, ranked recommendations, live context awareness) and a search result screenshot on the right (`ss_search_result.png`).
5. **How Monet Works**: Three-step vertical timeline (Connect accounts → Configure wallet → Spend optimally).
6. **CTA Section**: Waitlist signup card with green glow effect.
7. **Footer**: Copyright, social links, legal links.

## Running Locally
```bash
cd raw/website
npm run dev   # → http://localhost:3001
```

## Repository
- Hosted in the `raw/website` git submodule.
- Current HEAD: `0b872db` (refactored from orange to green accent theme).
