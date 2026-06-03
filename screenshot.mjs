import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

function nextNum() {
  const files = fs.readdirSync(screenshotDir);
  let max = 0;
  for (const f of files) {
    const m = f.match(/^screenshot-(\d+)/);
    if (m) max = Math.max(max, parseInt(m[1]));
  }
  return max + 1;
}

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3];
const num   = String(nextNum()).padStart(1, '0');
const name  = label ? `screenshot-${num}-${label}.png` : `screenshot-${num}.png`;
const out   = path.join(screenshotDir, name);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Force all lazy images to load and all scroll-triggered animations to fire
await page.evaluate(async () => {
  // Swap lazy images to eager so they all load
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.loading = 'eager';
    if (img.dataset.src) img.src = img.dataset.src;
  });
  // Scroll through the page to trigger IntersectionObservers
  const totalHeight = document.body.scrollHeight;
  const step = 600;
  for (let y = 0; y <= totalHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 80));
  }
  window.scrollTo(0, 0);
  // Ensure all fade-up elements are visible (in case observer missed any)
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.animationPlayState = 'running';
  });
  await new Promise(r => setTimeout(r, 800));
});

await page.screenshot({ path: out, fullPage: true });
await browser.close();

console.log(`Saved: temporary screenshots/${name}`);
