The [[Monet-Website]] is the public-facing landing page for the [[Monet-App-Overview]] application. Built with Next.js 16 and React 19, it showcases the app's core features and serves as the entry point for new users to join the waitlist.

## Tech Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, Framer Motion (animations), Lucide React (icons)
- **Dev Server**: Runs on port 3001 (`next dev -p 3001`)

## Design
- Dark-mode-first design with an accent green (`accent-green`) color scheme.
- Uses **Inter** font family for its neutral, modern feel and broad compatibility.
- Smooth Framer Motion entrance animations (fade-in, slide-up, slide-in).
- Glassmorphic glow effects behind app screenshots.

## Page Structure
The landing page (`app/page.tsx`) is a single-page layout with these sections:

1. **Navigation**: Modernized logo (Sparkles icon) + persistent theme toggle + "Get Early Access" button.
2. **Hero Section**: Headline, subheadline, and CTA buttons ("Download for iOS"). Features **3D transform animations** and refined glassmorphism on the main app screenshot.
3. **App Preview**: Interactive theme-aware screenshots with toggleable light/dark modes.
4. **Merchant Intelligence**: Interactive merchant search UI with loading states and ranked card recommendations.
5. **How Monet Works**: Three-step vertical timeline with updated feature icons.
6. **CTA Section**: Waitlist signup card integrated with **Formspree** for submission handling.

## Universal Links
The website hosts the `/.well-known/apple-app-site-association` file, enabling **Universal Links** support.

## Running Locally
```bash
cd raw/website
npm run dev   # → http://localhost:3001
```

## Repository & Deployment
- Hosted in the `raw/website` directory.
- Deployed via **Firebase Hosting**. The build process generates a static export (`next build` outputs to `/out`) which is deployed to Firebase.
- Current HEAD: `d2c7985` (Standardized component naming and design system mappings).
