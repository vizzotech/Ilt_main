import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary_screenshots');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960 });

  await page.goto('http://localhost:3000/professional.html', { waitUntil: 'networkidle0' });

  const sizing = await page.evaluate(() => {
    const el = document.getElementById('sizing');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { top: rect.top, height: rect.height };
  });

  if (!sizing) {
    console.log('Not found');
    await browser.close();
    return;
  }

  await page.evaluate(() => document.getElementById('sizing').scrollIntoView({ block: 'center' }));
  await new Promise(r => setTimeout(r, 500));

  const filename = path.join(screenshotDir, 'sizing-zoom.png');
  await page.screenshot({
    path: filename,
    clip: { x: 40, y: Math.max(0, sizing.top - 40), width: 1200, height: sizing.height + 80 }
  });

  console.log('Screenshot:', filename);
  await browser.close();
})();
