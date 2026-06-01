import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

page.on('console', msg => {
  if (['error','warning'].includes(msg.type())) console.log(`[${msg.type()}] ${msg.text()}`);
});

console.log('Loading...');
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);

const idle = await page.evaluate(async () => {
  window.scrollTo(0, window.innerHeight * 2.5);
  await new Promise(r => setTimeout(r, 1500));
  const times = [];
  let last = performance.now();
  await new Promise(res => {
    let n = 0;
    const f = t => { times.push(t-last); last=t; if(++n<60) requestAnimationFrame(f); else res(undefined); };
    requestAnimationFrame(f);
  });
  const avg = (times.reduce((a,b)=>a+b,0)/times.length).toFixed(1);
  const max = Math.max(...times).toFixed(1);
  return { avg, max, slow: times.filter(t=>t>33).length, count: times.length };
});
console.log('IDLE at globe section:', idle);

const scrolling = await page.evaluate(async () => {
  let y = window.innerHeight * 2.5;
  const id = setInterval(() => { y+=25; window.scrollTo(0,y); }, 16);
  const times = [];
  let last = performance.now();
  await new Promise(res => {
    let n = 0;
    const f = t => { times.push(t-last); last=t; if(++n<120) requestAnimationFrame(f); else { clearInterval(id); res(undefined); } };
    requestAnimationFrame(f);
  });
  const avg = (times.reduce((a,b)=>a+b,0)/times.length).toFixed(1);
  const max = Math.max(...times).toFixed(1);
  return { avg, max, slow: times.filter(t=>t>33).length, count: times.length };
});
console.log('SCROLLING through globe:', scrolling);

await browser.close();
