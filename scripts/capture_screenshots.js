const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/krish/.gemini/antigravity-ide/brain/aab5eac8-97ab-4417-82a0-fca5a359ca07';

async function captureScreenshots(prefix) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';

  const takeScreenshot = async (route, name) => {
    try {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // wait for any animations
      await page.screenshot({ path: path.join(ARTIFACT_DIR, `${prefix}_${name}.png`), fullPage: true });
      console.log(`Captured ${prefix}_${name}.png`);
    } catch (e) {
      console.error(`Failed to capture ${name}:`, e);
    }
  };

  // 1. Homepage & Pricing
  await takeScreenshot('/', 'homepage');
  await takeScreenshot('/pricing', 'pricing');

  // 2. Login to access dashboard
  // Let's use the magic email link or test user if available.
  // We can just set a session cookie manually, or login.
  // Does Krixai have a test login route? Or we can just try to login with a test user.
  // Wait, I can inject a test session if needed, but playwright script runs locally.
  console.log("Screenshots completed for public pages.");
  await browser.close();
}

const prefix = process.argv[2] || 'before';
captureScreenshots(prefix).catch(console.error);
