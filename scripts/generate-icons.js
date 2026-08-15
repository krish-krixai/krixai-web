const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // The SVG content
  const svgContent = `
    <svg width="180" height="180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="cut-route1-logo">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <line x1="10" y1="-2" x2="10" y2="26" stroke="black" stroke-width="2.5" />
        </mask>
      </defs>
      <style>
        .stroke-main { stroke: #FFFFFF; }
      </style>
      <rect width="24" height="24" fill="black" />
      <g mask="url(#cut-route1-logo)" class="stroke-main" stroke-width="4.2" stroke-linecap="butt">
        <line x1="5" y1="2" x2="5" y2="22" />
        <line x1="5" y1="12" x2="19" y2="2" />
        <line x1="5" y1="12" x2="19" y2="22" />
      </g>
      <line x1="10" y1="2" x2="10" y2="22" stroke="#3B82F6" stroke-width="1.5" />
    </svg>
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background: transparent;">
        <div id="icon" style="width: 180px; height: 180px;">
          ${svgContent}
        </div>
      </body>
    </html>
  `;
  
  await page.setContent(html);
  
  const element = await page.$('#icon');
  
  // Save as apple-icon.png (180x180)
  const appleIconPath = path.join(__dirname, '../src/app/apple-icon.png');
  await element.screenshot({ path: appleIconPath, omitBackground: true });
  console.log('Saved apple-icon.png');
  
  // Resize svg for 48x48 icon.png
  await page.evaluate(() => {
    const svg = document.querySelector('svg');
    svg.setAttribute('width', '48');
    svg.setAttribute('height', '48');
    document.getElementById('icon').style.width = '48px';
    document.getElementById('icon').style.height = '48px';
  });
  
  const iconPath = path.join(__dirname, '../src/app/icon.png');
  await element.screenshot({ path: iconPath, omitBackground: true });
  console.log('Saved icon.png');
  
  await browser.close();
})();
