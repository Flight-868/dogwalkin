# CLAUDE.md — Dog Walkin.com

---

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Read this entire file** before writing a single line of code.
- **Check `brand_assets/`** for the logo SVG, color guide, and any images before designing.

---

## Project Structure

```
dogwalkin/
│
├── CLAUDE.md                         ← you are here
│
├── brand_assets/
│   ├── dogwalkin_logo.svg            ← v2 line-art full lockup (980×580) — use as-is, never recreate
│   ├── dogwalkin_icon_only.svg       ← v2 icon only (380×380) — for favicon, nav, social avatar
│   ├── dogwalkin_brand_guidelines.pdf
│   ├── colors.css                    ← brand token variables
│   ├── README.md                     ← describes every asset and when to use it
│   └── photos/
│       ├── hero-001.jpg              ← best full-width hero candidate
│       ├── david-001.jpg             ← photo of David for About page
│       ├── dog-001.jpg
│       ├── dog-002.jpg               ← all dog photos follow dog-NNN.jpg
│       └── cat-001.jpg               ← all cat photos follow cat-NNN.jpg
│
├── src/
│   ├── index.html                    ← Home (/)
│   ├── services.html                 ← Services & Pricing (/services)
│   ├── about.html                    ← About (/about)
│   ├── contact.html                  ← Contact & Book (/contact)
│   ├── style.css                     ← shared styles and brand token variables
│   └── components/
│       ├── nav.html                  ← global nav bar partial
│       └── footer.html               ← global footer partial
│
├── docs/
│   ├── contact-form-setup.md         ← form setup + monitoring runbook for David
│   └── inquiry-log.gs                ← Apps Script: appends inquiries to a Google Sheet
│
├── public/                           ← mirrors the GoDaddy domain root
│   ├── .htaccess                     ← clean URLs, canonical host, caching
│   ├── sitemap.xml                   ← all four pages, canonical dogwalkin.com URLs
│   └── robots.txt                    ← Allow: / + sitemap reference
│
├── .gitignore                        ← includes .env, node_modules, screenshots
├── serve.mjs                         ← dev server, serves project root at localhost:3000
├── screenshot.mjs                    ← Puppeteer screenshot tool
│
└── temporary screenshots/            ← auto-saved screenshot output, never committed
```

### File location rules
- All pages go in `src/` — never in the project root
- All brand files (logo, photos, guidelines) go in `brand_assets/` — never inline or in `src/`
- Static files that are served as-is (`sitemap.xml`, `robots.txt`, `.htaccess`) go in `public/`
- Link to assets as if `src/` and `public/` were both already at the domain root: `/style.css`, `/components/load.js`, `/brand_assets/…` — never `/src/…`. `serve.mjs` resolves paths the same way, so a link that works locally works deployed.
- Stripe needs no keys — the site links to a hosted Payment Link URL (see Stripe Integration)
- Never commit `temporary screenshots/`

---

## Project: Dog Walkin.com

**Tagline:** Big City Paws, Small Town Care.  
**Phone:** 646-580-8877  
**Email:** coopertowndogwalking@gmail.com  
**Instagram:** https://www.instagram.com/coopertowndogwalking/  
**Location:** Stuyvesant Town-Peter Cooper Village, New York, NY 10009 (zip 10009)

### Brand statement (use verbatim on About page and sign-offs)
> "Born and raised in Stuyvesant Town, we're not just your dog walkers — we're your neighbors. To us, pets aren't clients; they're family. And we can't wait to make yours part of ours."

---

## Brand Tokens

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--teal` | `#00C4B4` | Primary — CTAs, nav, logo background, highlights |
| `--teal-dark` | `#00897B` | Hover states, links, eyebrow labels |
| `--teal-mist` | `#E0F7F5` | Section backgrounds, card fills |
| `--pup-gold` | `#D49A3C` | Warm accent, pulled from logo fur |
| `--ink` | `#1A1A1A` | Headings, body text |
| `--warm-gray` | `#5C5C5C` | Secondary body text |
| `--parchment` | `#F7F7F5` | Alternate section backgrounds |
| `--amber` | `#F2A623` | Star ratings and seasonal accents only |

### Typography
| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / H1 | Georgia | 700 | Hero headlines, page titles |
| Pull quotes | Georgia | 400 italic | Testimonials, brand statement |
| Lead copy | Arial | 300 | Page intros, hero subtitles |
| Body | Arial | 400 | Paragraphs, descriptions |
| Labels / nav | Arial | 500 uppercase | Navigation, section eyebrows, badges |

### Logo
- Primary lockup: `brand_assets/dogwalkin_logo.svg` — icon + "DOG WALKIN.COM" wordmark + tagline. 980×580 viewBox. Use for headers, About page, email signatures, print — anywhere with room for the full mark.
- Icon only: `brand_assets/dogwalkin_icon_only.svg` — single continuous line-art drawing of a dog and cat, filled `#1A1A1A` on transparent. Use for favicon, nav bar icon, social avatar.
- Reversed variant: same icon file with `fill="#FFFFFF"` for use on `--teal` or `--ink` backgrounds.
- Approved backgrounds: white, `--parchment`, `--teal-mist` (use black fill); `--teal`, `--ink` (use white fill). Never on non-brand color or busy photos.
- Clear space: minimum equal to the height of the letter "D" in the wordmark on all sides (or half the icon diameter for the icon-only variant, whichever is greater).
- Minimum size: full lockup no smaller than 140px / 1.25" wide; icon only no smaller than 32px / 0.35" wide.
- Never recolor beyond black/white, stretch, distort, add effects (shadows, glows, outlines), or recreate the mark — always use the provided SVG as-is.

---

## Site Architecture

```
Global nav bar  (sticky, all pages)
├── /                Home
├── /services        Services & Pricing
├── /about           About
└── /contact         Contact & Book

Global footer   (all pages)
└── Instagram ↗  https://www.instagram.com/coopertowndogwalking/  [external]
```

### Global nav bar
- Logo SVG + wordmark "Dog Walkin.com" (Georgia Bold)
- Links: Home · Services · About · Contact
- Primary CTA button: **Book Now** → `/contact`
- Sticky, white background, bottom border `#E0F7F5`
- Mobile: hamburger menu

### Global footer
- Logo + tagline
- Nav links repeated
- Phone, email (both clickable)
- Facebook icon link
- Instagram icon → https://www.instagram.com/coopertowndogwalking/
- Copyright: © 2025 Dog Walkin.com — All rights reserved

---

## Pages

### `/` — Home

**Goal:** Convert visitors into booked meet & greets  
**Primary CTA:** Book a free Paws & Chat

| # | Section | Key content |
|---|---------|-------------|
| 1 | **Hero** | Full-width photo, Georgia Bold headline, brand statement subhead, "Book Now" + "See Pricing" buttons |
| 2 | **Services overview** | 3 cards: Dog Walking · Cat Visits · Pet Sitting — each links to `/services` |
| 3 | **Why us** | 3 pillars: Available 365 days · Born & raised here · Genuine animal lovers |
| 4 | **Customer reviews** | 3 testimonial cards, star ratings in `#F2A623` |
| 5 | **Instagram feed** | Photo grid from @coopertowndogwalking, "Follow on Instagram ↗" link |
| 6 | **Booking CTA strip** | Full-width `#00C4B4` band — "Meet us first — it's free." + Book a Paws & Chat button |

---

### `/services` — Services & Pricing

**Goal:** Give complete pricing clarity, remove friction for new clients  
**Primary CTA:** Book a walk · Online bill pay

| # | Section | Key content |
|---|---------|-------------|
| 1 | **Page intro** | Available 7 days, 6:30am–8:30pm, same-day welcome; service area list; Pay Bill button |
| 2 | **Dog walking** | Full pricing table (see below) |
| 3 | **Cat visits** | Full pricing table (see below) |
| 4 | **Pet sitting** | "Contact for details" + CTA to `/contact` |
| 5 | **Foster dog walks** | "Contact for details" |
| 6 | **Bill pay** | Prominent Pay Now button |

#### Dog walking prices
| Service | Price |
|---------|-------|
| 15-min potty break | $15 |
| Small group 30-min walk | $20 |
| Solo 30-min walk | $25 |
| Small group 60-min walk | $35 |

All walks available Sun–Sat 6:30am–8:30pm.  
Add-ons: +$9 extra dog · +$5 early AM (before 6:30am) or late PM (after 8:30pm) · +$10 holidays (July 4th, Thanksgiving, Christmas, New Year's Day)

#### Cat visit prices
| Service | Price |
|---------|-------|
| 30-min cat visit | $25 |
| 60-min cat visit | $35 |
| + Litter box change | +$20 (client provides litter + supplies) |
| + Holiday visit | +$10 |

Cat visits include: feeding, litter box cleaning, playtime, medicine, brushing, love.

---

### `/about` — About

**Goal:** Build trust through neighborhood authenticity and real personality  
**Primary CTA:** Contact us · Book a meet & greet

| # | Section | Key content |
|---|---------|-------------|
| 1 | **Hero** | Full-width photo, "Your neighborhood pet care team." headline, brand statement |
| 2 | **Our story** | Born & raised in StuyTown narrative, `#E0F7F5` background |
| 3 | **Meet David** | Lead walker bio, photo, canine expertise |
| 4 | **Community** | 365 days · same-day requests · neighborhood roots — 3 callout stats |
| 5 | **Our approach** | "We love what we do" — behavior knowledge, safety, genuine care |
| 6 | **Instagram gallery** | Real dog photo grid, "Follow me on Instagram ↗" |
| 7 | **Reviews** | Google reviews carousel, star ratings |

---

### `/contact` — Contact & Book

**Goal:** Make it as easy as possible to book or get in touch  
**Primary CTA:** Book a Paws & Chat (free, 30 min, no commitment)

| # | Section | Key content |
|---|---------|-------------|
| 1 | **Paws & Chat** | "Let's meet!" heading, 30-min free meet & greet, direct call/email card, dog photo. No calendar — booking runs through the contact form below. |
| 2 | **Contact form** | Name · Email* · Message · Send button (teal) · spam-filtering note. Posts to Web3Forms (relays to David's Gmail) and, in parallel, to an Apps Script that appends to a Google Sheet log. See `docs/contact-form-setup.md` |
| 3 | **Service area** | StuyTown · East Village · Gramercy · Murray Hill |
| 4 | **Map** | Google Maps embed, centered on 10009, "Get Directions" link |
| 5 | **Direct contact** | 646-580-8877 (tel: link) · coopertowndogwalking@gmail.com (mailto: link) |
| 6 | **Social** | Facebook + Instagram icon links |

---

## SEO Requirements

Implement all of the following on every page, no exceptions. The current site has significant SEO deficiencies — this rebuild must fix all of them.

### Domain redirect
- `coopertowndogwalking.com` must 301 redirect permanently to `dogwalkin.com`
- Add a `<link rel="canonical">` tag to every page pointing to its own `dogwalkin.com` URL

### H1 rules
- Every page has exactly one H1
- The H1 must include both a service keyword and a location keyword — never generic copy
- Never use "Our experienced dog walkers love taking care of your pets" or anything like it as an H1

### Page titles, meta descriptions, and H1s

| Page | `<title>` | `<meta name="description">` | H1 |
|------|-----------|-----------------------------|----|
| `/` | `Dog Walking & Pet Sitting \| Stuyvesant Town · East Village · Gramercy \| Dog Walkin.com` | `Professional dog walking and cat sitting in Stuyvesant Town, East Village, Gramercy, and Murray Hill. Available 365 days, same-day requests welcome. Call 646-580-8877.` | `Dog walking and pet sitting in your neighborhood.` |
| `/services` | `Dog Walking Prices & Cat Visit Rates \| Stuyvesant Town NYC \| Dog Walkin.com` | `Dog walks from $15, cat visits from $25. Group walks, solo walks, potty breaks, and pet sitting in Stuyvesant Town, East Village, and Gramercy. Available 7 days a week.` | `Services & pricing for Stuyvesant Town, East Village, and Gramercy.` |
| `/about` | `About Us \| Neighborhood Dog Walkers in Stuyvesant Town \| Dog Walkin.com` | `Born and raised in Stuyvesant Town. Led by David, our team offers dog walking and pet sitting 365 days a year with same-day requests. Your neighbors, not just your dog walkers.` | `Your neighborhood pet care team — born and raised here.` |
| `/contact` | `Book a Dog Walker \| Stuyvesant Town & East Village NYC \| Dog Walkin.com` | `Book a free Paws & Chat meet and greet with Dog Walkin.com. Serving Stuyvesant Town, East Village, Gramercy, and Murray Hill. Call 646-580-8877 or send a message.` | `Book a walk or send us a message.` |

### Open Graph & Twitter card tags (every page)
Every page must include the following in `<head>`. Swap in page-specific title and description from the table above:

```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Dog Walkin.com" />
<meta property="og:title" content="[page title]" />
<meta property="og:description" content="[page meta description]" />
<meta property="og:url" content="https://dogwalkin.com[/page-path]" />
<meta property="og:image" content="https://dogwalkin.com/brand_assets/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[page title]" />
<meta name="twitter:description" content="[page meta description]" />
<meta name="twitter:image" content="https://dogwalkin.com/brand_assets/og-image.jpg" />
```

### LocalBusiness schema (every page)
Inject this JSON-LD in a `<script type="application/ld+json">` tag in the `<head>` of every page:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Dog Walkin.com",
  "alternateName": "Coopertown Dog Walking",
  "description": "Professional dog walking and pet sitting in Stuyvesant Town, East Village, Gramercy, and Murray Hill. Available 365 days a year, same-day requests welcome.",
  "url": "https://dogwalkin.com",
  "telephone": "+16465808877",
  "email": "coopertowndogwalking@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10009",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.7282,
    "longitude": -73.9782
  },
  "areaServed": [
    { "@type": "Place", "name": "Stuyvesant Town" },
    { "@type": "Place", "name": "Peter Cooper Village" },
    { "@type": "Place", "name": "East Village" },
    { "@type": "Place", "name": "Gramercy" },
    { "@type": "Place", "name": "Murray Hill" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "06:30",
    "closes": "20:30"
  },
  "sameAs": [
    "https://www.instagram.com/coopertowndogwalking/",
    "https://www.facebook.com/112056688654872"
  ]
}
```

### Service schema (`/services` page only)
Add this as a second `<script type="application/ld+json">` block on the Services page:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Dog Walking and Pet Sitting",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Dog Walkin.com",
    "url": "https://dogwalkin.com"
  },
  "areaServed": [
    "Stuyvesant Town", "Peter Cooper Village", "East Village", "Gramercy", "Murray Hill"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Dog Walking & Cat Visit Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "15-minute potty break" }, "price": "15.00", "priceCurrency": "USD" },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Small group 30-minute walk" }, "price": "20.00", "priceCurrency": "USD" },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Solo 30-minute walk" }, "price": "25.00", "priceCurrency": "USD" },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Small group 60-minute walk" }, "price": "35.00", "priceCurrency": "USD" },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "30-minute cat visit" }, "price": "25.00", "priceCurrency": "USD" },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "60-minute cat visit" }, "price": "35.00", "priceCurrency": "USD" }
    ]
  }
}
```

### Sitemap & robots
- Generate a `sitemap.xml` listing all four pages with their canonical `dogwalkin.com` URLs
- Add a `robots.txt` at the root: `User-agent: * / Allow: /`
- Reference the sitemap in `robots.txt`: `Sitemap: https://dogwalkin.com/sitemap.xml`

---

## Stripe Integration

> ✅ **Live — done 2026-09-22.** The Services bill pay button links to `https://buy.stripe.com/eVq7sM6t07fMdAU6AsgYU00`. Nothing further is pending.
>
> **No Stripe API keys are involved.** A Payment Link is a plain URL on a Stripe-hosted page, so the site never loads Stripe.js and has nothing to authenticate. If you find yourself wanting a `pk_live_` or `sk_live_` key, the approach has drifted — re-read the decisions below.

### What is being replaced
The existing GoDaddy online bill pay page is being removed entirely. All payments will be handled through Stripe. Do not link to the old payment page anywhere on the new site.

### Decisions already made
- **Approach: Stripe Payment Links** — David creates payment links in the Stripe dashboard, the site links to them. Zero backend required, no server-side code, no webhooks needed.
- **Payment type: Open-ended** — clients owe variable amounts per month, not fixed service prices. David sends each client a custom Payment Link for their balance.
- **No webhooks** — Stripe handles confirmation emails automatically. No webhook signing secret needed.
- **No API keys, no `.env`** — decided 2026-09-21. A publishable key is only needed for Stripe.js, Elements, or embedded Checkout, none of which this site uses; a secret key has no place in a project with no backend. `.env.example` was deleted rather than left as an invitation to paste a live key next to a static site.
- **No client portal** — one-way payment is sufficient for this business.
- **Refund policy** — clients contact David directly. No automated refunds needed.

### Payment Link
- URL: `https://buy.stripe.com/eVq7sM6t07fMdAU6AsgYU00` — supplied by David 2026-09-22.
- The link should have **"let customers choose what they pay"** enabled, since balances vary month to month and one reusable link serves every client. Confirm with David if a payment ever arrives with the wrong amount.

### Where payment appears in the site
| Page | Placement | Current state |
|------|-----------|---------------|
| `/services` | "Pay Now" button in bill pay section (section 6) | Live — links to the Payment Link |
| `/` | Not shown — payment is post-service | — |
| `/contact` | Not shown — booking is free | — |

### Implementation
- The button is a plain `<a>` to the Payment Link, opening in a new tab — that is the whole integration
- No keys, no `.env`, no backend, no serverless functions, no webhook endpoint
- To change the link later, edit the one `href` in `src/services.html` (section 6)

---

## Technical Notes

- **Mobile-first** — most visitors are NYC dog owners checking on their phone mid-walk
- **Real photos only** — source from `brand_assets/` or the Instagram feed; no stock photography
- **Logo** — full lockup: `brand_assets/dogwalkin_logo.svg`; icon only: `brand_assets/dogwalkin_icon_only.svg`. Use black fill on light backgrounds, `fill="#FFFFFF"` on `--teal`/`--ink`. Never recreate, stretch, distort, or add effects.
- **Booking** — no calendar or scheduler. Decided 2026-09-01: the contact form (plus the direct call/email card) is the booking path, permanently. Do not add Cal.com, a W+M subdomain, or any other scheduling widget.
- **Accessibility** — all images need descriptive alt text; color contrast must meet WCAG AA
- **Instagram embed** — feed appears on Home (section 5) and About (section 6); a real embed requires an API token or a third-party service (Embedsocial, Behold, etc.); local photos from `brand_assets/photos/` are a stand-in only
- **OG image** — all pages reference `brand_assets/og-image.jpg` in OG/Twitter tags; this file does not exist yet — generate a 1200×630px branded image using the logo and brand colors and save it there
- **colors.css** — listed in `brand_assets/` but not yet generated; create it with all brand tokens as CSS custom properties
- **Deployment prep** — ✅ done 2026-09-21. All internal links are root-relative and assume the deployed layout, where `src/` and `public/` are both flattened into `public_html/`. `public/.htaccess` supplies the clean-URL rewrites the canonical tags and sitemap already assume. Upload map and verification steps: `docs/deploy-godaddy.md`
- **301 redirect** — ✅ done. `coopertowndogwalking.com` → `dogwalkin.com` returns a 301 (verified 2026-08-23). No further action.
- **Peter Cooper Village in schema** — intentionally kept in `areaServed` in the LocalBusiness JSON-LD (it is a real service area); removed from all visible brand copy per client request

## Pending — Waiting on Client

Nothing outstanding. Both items that were blocked on David are resolved:

| Item | Resolved | Where it lives |
|------|----------|----------------|
| Stripe Payment Link | 2026-09-22 — live link installed | `src/services.html` bill pay section |
| Apps Script log URL | 2026-09-22 — deployed from David's account and tested | `src/contact.html` — `CONFIG.logEndpoint`; deployment ID recorded in `docs/contact-form-setup.md` |

If a new item ever blocks on the client, add it back here — do not stub, guess, or skip; leave a placeholder and note it clearly in a code comment.

---

## Workflow Rules

### Reference images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

### Local server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

### Screenshot workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Before taking the first screenshot of a new session:** archive the previous generation by moving everything currently in `temporary screenshots/` (except the `previous/` folder itself) into `temporary screenshots/previous/`, replacing whatever was there. This keeps exactly one prior generation on hand for before/after comparison without letting the folder grow unbounded.
  - `mkdir -p "temporary screenshots/previous" && find "temporary screenshots" -maxdepth 1 -type f -exec rm -f "temporary screenshots/previous/{}" \; -exec mv {} "temporary screenshots/previous/" \;`
  - (Windows/PowerShell equivalent: `New-Item -ItemType Directory -Force "temporary screenshots\previous" | Out-Null; Remove-Item "temporary screenshots\previous\*" -File -ErrorAction SilentlyContinue; Get-ChildItem "temporary screenshots" -File | Move-Item -Destination "temporary screenshots\previous"`)
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten, within a session).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- `temporary screenshots/previous/` is included in the existing `.gitignore` entry for `temporary screenshots/` — no changes needed there.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

### Output defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

### Brand assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

---

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Use the brand tokens defined above.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Georgia for display, Arial for body — see typography table above.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

---

## Hard Rules

- Do not add sections, features, or content not in the reference or this file
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not use stock photography — real photos only
- Do not link to or reference the old GoDaddy bill pay page — it is being replaced by Stripe
- Do not add Stripe.js, Elements, Checkout, API keys, or a backend to the payment flow — the hosted Payment Link is the whole integration
- Do not skip or stub out SEO tags — every page must ship with correct title, meta description, canonical, OG tags, and schema before it is considered done
