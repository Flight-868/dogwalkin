# Deploying to GoDaddy

The site is a static build with no server-side code, so deploying is a file
copy plus one Apache config file. The only thing to get right is the **layout**
— `src/` and `public/` both flatten into `public_html/`, they do not keep their
folder names.

---

## Upload map

| From the repo | Goes to | Notes |
|---------------|---------|-------|
| `src/*.html` | `public_html/` | The four pages, at the root — not in a subfolder |
| `src/style.css` | `public_html/style.css` | |
| `src/components/` | `public_html/components/` | Keeps its folder name |
| `brand_assets/` | `public_html/brand_assets/` | Whole folder, keeps its name |
| `public/*` | `public_html/` | Contents move up: `.htaccess`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `site.webmanifest`, `icons/` |

Resulting structure:

```
public_html/
├── .htaccess
├── index.html  services.html  about.html  contact.html
├── style.css
├── components/    nav.html  footer.html  load.js
├── brand_assets/  *.svg  og-image.jpg  colors.css  photos/
├── icons/
├── favicon.ico  robots.txt  sitemap.xml  site.webmanifest
```

**Do not upload:** `CLAUDE.md`, `docs/`, `node_modules/`, `serve.mjs`,
`screenshot.mjs`, `temporary screenshots/`, `.git/`, `package*.json`.

`.htaccess` starts with a dot, so GoDaddy's File Manager and most FTP clients
hide it by default. Turn on "show hidden files" before concluding it failed to
upload.

---

## Why `.htaccess` is required, not optional

Every canonical tag, `og:url`, and sitemap entry uses the form
`https://dogwalkin.com/about` — https, no www, no `.html`, no trailing slash.
Nothing on disk is named `about`, so without the rewrite rules **every page
except the homepage returns 404.** The nav would appear to be entirely broken.

`public/.htaccess` handles four things:

1. **Clean URLs** — `/about` internally serves `about.html`
2. **Canonical host** — one 301 to `https://dogwalkin.com` from http and www
3. **Duplicate-content cleanup** — `/about.html` and `/about/` both 301 to `/about`
4. **Caching** — photos cache for a year, HTML not at all

> ⚠️ The host rule forces https. If SSL is not yet active on the domain,
> comment that block out first or the site becomes unreachable.

---

## Post-deploy verification

Do these in order. Each one catches a different failure.

**1. Every page loads at its clean URL.** Visit `/`, `/services`, `/about`,
`/contact`. A 404 on anything but `/` means `.htaccess` did not upload or
`mod_rewrite` is off.

**2. CSS and the nav/footer appear.** The nav and footer are injected by
JavaScript that fetches `/components/nav.html` and `/components/footer.html`.
If pages render as unstyled text, or load with no nav bar, the `components/`
folder or `style.css` landed in the wrong place. Check the browser console for
404s.

**3. Photos load.** Any missing image means `brand_assets/` is not at the root.

**4. Redirects return 301, not 200.** Check each spelling collapses correctly:

```
http://dogwalkin.com/about    → 301 → https://dogwalkin.com/about
https://www.dogwalkin.com/about → 301 → https://dogwalkin.com/about
https://dogwalkin.com/about.html → 301 → https://dogwalkin.com/about
https://dogwalkin.com/about/   → 301 → https://dogwalkin.com/about
```

A 200 instead of a 301 means Google will index two URLs for one page, which is
the specific SEO problem this rebuild exists to fix.

**5. The old domain still redirects.** `coopertowndogwalking.com` → 301 →
`dogwalkin.com`. This was verified 2026-08-23 and is independent of this
upload, but confirm it survived.

**6. Submit the contact form once.** This is the real test — it is the booking
path, and it exercises the page, its JavaScript, and the outbound request
together. See `contact-form-setup.md`.

**7. Resubmit the sitemap** in Google Search Console:
`https://dogwalkin.com/sitemap.xml`

---

## Local preview

`serve.mjs` resolves paths through the same precedence as the deployed root
(`src/` → `public/` → project root), so what works on `localhost:3000` works in
`public_html/`:

```
node serve.mjs
```

One deliberate difference: the dev server does not perform the 301 redirects.
`/about.html` serves the page locally but redirects in production. Redirect
behaviour can only be verified after upload, in step 4 above.
