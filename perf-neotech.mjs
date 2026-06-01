import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto('http://localhost:3333', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(10000);

// Inject timing into the page to measure JS work per frame
const result = await page.evaluate(async () => {
  // Scroll to globe section (section 3)
  const sections = document.querySelectorAll('section');
  if (sections[2]) sections[2].scrollIntoView();
  await new Promise(r => setTimeout(r, 2000));

  // Measure task durations using PerformanceObserver
  const longTasks = [];
  const obs = new PerformanceObserver(list => {
    list.getEntries().forEach(e => longTasks.push({ name: e.name, dur: e.duration.toFixed(1) }));
  });
  obs.observe({ entryTypes: ['longtask'] });

  // Scroll through globe for 3 seconds, measuring JS
  let y = window.scrollY;
  const scrollInterval = setInterval(() => { y += 30; window.scrollTo(0, y); }, 16);
  
  await new Promise(r => setTimeout(r, 3000));
  clearInterval(scrollInterval);
  
  obs.disconnect();
  
  // Also check what RAF tasks run
  const rafTimes = [];
  let last = performance.now();
  await new Promise(res => {
    let n = 0;
    const f = t => {
      rafTimes.push(+(t - last).toFixed(1));
      last = t;
      if (++n < 60) requestAnimationFrame(f);
      else res();
    };
    requestAnimationFrame(f);
  });

  return {
    longTasks: longTasks.slice(0, 20),
    longTaskCount: longTasks.length,
    raf_avg: (rafTimes.reduce((a,b)=>a+b,0)/rafTimes.length).toFixed(1),
    raf_max: Math.max(...rafTimes).toFixed(1),
    raf_slow: rafTimes.filter(t=>t>33).length + '/' + rafTimes.length,
  };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
