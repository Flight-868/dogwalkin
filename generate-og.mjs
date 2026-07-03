import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logoSvg   = fs.readFileSync(path.join(__dirname, 'brand_assets/dogwalkin_icon_only_white.svg'), 'utf8');
const logoUri   = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg)}`;

const heroData  = fs.readFileSync(path.join(__dirname, 'brand_assets/photos/hero-001.jpg'));
const heroUri   = `data:image/jpeg;base64,${heroData.toString('base64')}`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
    background: #1A1A1A;
    position: relative;
  }

  .photo {
    position: absolute;
    inset: 0;
    background: url('${heroUri}') center 30% / cover no-repeat;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(105deg,
        rgba(0,196,180,0.88)   0%,
        rgba(0,137,123,0.82)  30%,
        rgba(26,26,26,0.93)   60%,
        rgba(26,26,26,0.98)  100%
      ),
      radial-gradient(ellipse at 15% 50%, rgba(255,255,255,0.07) 0%, transparent 55%);
  }

  .frame {
    position: relative;
    z-index: 2;
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 52px 64px;
  }

  /* ── Top: brand ── */
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .brand img {
    width: 44px;
    height: 44px;
  }
  .brand-name {
    font-family: Georgia, serif;
    font-weight: 700;
    font-size: 27px;
    color: #fff;
    letter-spacing: -0.01em;
  }

  /* ── Middle: headline ── */
  .middle {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 180px;
  }
  .eyebrow {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 18px;
  }
  .headline {
    font-family: Georgia, serif;
    font-weight: 700;
    font-size: 62px;
    line-height: 1.07;
    color: #fff;
    margin-bottom: 22px;
    text-shadow: 0 2px 16px rgba(0,0,0,0.3);
  }
  .tagline {
    font-family: Georgia, serif;
    font-style: italic;
    font-weight: 400;
    font-size: 22px;
    color: rgba(255,255,255,0.75);
    line-height: 1.5;
  }

  /* ── Bottom: meta + badge ── */
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .meta {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
  }
  .badge {
    background: #fff;
    color: #00897B;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 13px 28px;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  }
</style>
</head>
<body>
  <div class="photo"></div>
  <div class="overlay"></div>
  <div class="frame">

    <div class="brand">
      <img src="${logoUri}" alt="">
      <span class="brand-name">Dog Walkin.com</span>
    </div>

    <div class="middle">
      <p class="eyebrow">Stuyvesant Town &nbsp;·&nbsp; East Village &nbsp;·&nbsp; Gramercy</p>
      <p class="headline">Dog Walking<br>&amp; Pet Sitting<br>in NYC.</p>
      <p class="tagline">Big City Paws, Small Town Care.</p>
    </div>

    <div class="bottom">
      <p class="meta">Available 365 days &nbsp;·&nbsp; 646-580-8877</p>
      <div class="badge">Book a Free Paws &amp; Chat</div>
    </div>

  </div>
</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });

// Brief settle time for fonts + rendering
await new Promise(r => setTimeout(r, 600));

const out = path.join(__dirname, 'brand_assets/og-image.jpg');
await page.screenshot({
  path: out,
  type: 'jpeg',
  quality: 92,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

await browser.close();
console.log('Saved: brand_assets/og-image.jpg');
