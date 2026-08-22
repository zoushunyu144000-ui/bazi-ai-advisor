// List small touch targets on /birth to identify what to fix.
import { chromium } from "playwright";

const BASE = process.env.UI_PILOT_BASE ?? "http://localhost:3010";

async function run() {
  const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/birth`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  const small = await page.evaluate(() => {
    const seen = new Set();
    return Array.from(document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"], label'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.height < 44;
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        const text = (el.innerText || "").trim().slice(0, 40) || el.getAttribute("aria-label") || "(no text)";
        const key = `${el.tagName}|${text}|${Math.round(r.height)}`;
        if (seen.has(key)) return null;
        seen.add(key);
        return { tag: el.tagName, text, h: Math.round(r.height), w: Math.round(r.width) };
      })
      .filter(Boolean);
  });
  console.log(JSON.stringify(small, null, 2));
  await browser.close();
}

run().catch((err) => { console.error(err); process.exit(1); });