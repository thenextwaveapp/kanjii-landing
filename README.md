# Kanjii Landing

Marketing site for [kanjii.app](https://kanjii.app) — the Kanjii Japanese learning app.

Built with [Next.js](https://nextjs.org) (App Router) and deployed on [Vercel](https://vercel.com).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add custom domain `kanjii.app` and `www.kanjii.app` in Project Settings → Domains
4. Point DNS at Vercel (A record `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`)

## Project structure

```
app/
  layout.tsx    # SEO metadata, fonts
  page.tsx      # Landing page content
  globals.css   # All styles (migrated from prototype)
components/
  LandingEffects.tsx  # Canvas animation, phone demo, scroll reveal
prototype/
  kanjii-landing-good.html  # Original single-file prototype
```
