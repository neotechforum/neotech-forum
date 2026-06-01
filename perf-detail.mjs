import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const logs = [];
page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(10000);

// Screenshot at top
await page.screenshot({ path: '/tmp/globe-top.png', fullPage: false });

// Scroll to likely globe section and screenshot
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/globe-mid.png', fullPage: false });

const info = await page.evaluate(() => {
  return {
    scrollY: window.scrollY,
    innerH: window.innerHeight,
    canvases: [...document.querySelectorAll('canvas')].map(c => ({
      w: c.width, h: c.height,
      parent: c.parentElement?.tagName,
      style: c.style.cssText.substring(0, 60),
    })),
    // Active RAFs: check if there are ongoing animations
    bodyChildren: document.body.children.length,
    sections: [...document.querySelectorAll('section')].map(s => ({
      id: s.id,
      height: s.offsetHeight,
      top: s.getBoundingClientRect().top.toFixed(0),
    })),
  };
});

console.log('Page info:', JSON.stringify(info, null, 2));
console.log('Console logs:', logs.slice(-10).join('\n'));
await browser.close();
