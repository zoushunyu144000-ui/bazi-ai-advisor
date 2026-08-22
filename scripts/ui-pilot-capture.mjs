// Mobile UI Pilot screenshot capture.
// Generates full-page screenshots for /, /birth, /result at 390x844 and 430x932.
// Requires: dev server running at http://localhost:3010, and Playwright with
// Chromium available in PLAYWRIGHT_BROWSERS_PATH.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = process.env.UI_PILOT_BASE ?? "http://localhost:3010";
const OUT = resolve(process.cwd(), "docs/ui-pilot");

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
];

const PAGES = [
  { name: "home", path: "/" },
  { name: "birth", path: "/birth" },
  { name: "result", path: "/result" },
];

async function seedResultBundle() {
  const sessionStorage = `JSON.stringify({
    "schemaVersion": "public-result/1.0.0",
    "createdAt": "${new Date().toISOString()}",
    "profile": {
      "id": "pilot-fixture-1",
      "label": "Pilot Fixture",
      "birthDate": "1995-06-12",
      "birthTime": "08:35",
      "birthTimePrecision": "exact",
      "city": "上海",
      "country": "中国",
      "countryCode": "CN",
      "locationId": "cn-shanghai",
      "timezone": "Asia/Shanghai",
      "sexForTraditionalRules": "female"
    },
    "characterGender": "female",
    "calculation": {
      "chartId": "pilot-fixture-chart",
      "engine_version": "bazi-engine-v1.0.0",
      "derivedFeatures": {
        "chartId": "pilot-fixture-chart",
        "engine_version": "bazi-engine-v1.0.0",
        "rule_profile_version": "civil-local-jieqi-v1",
        "dayMasterStrength": "strong",
        "tenGodDistribution": [],
        "elementDistribution": [],
        "derivedAt": "${new Date().toISOString()}",
        "confidence": 0.84
      },
      "chart": {
        "id": "pilot-fixture-chart",
        "engine_version": "bazi-engine-v1.0.0",
        "rule_profile_version": "civil-local-jieqi-v1",
        "derivedAt": "${new Date().toISOString()}",
        "confidence": 0.84,
        "dayMaster": { "stem": "ji", "element": "earth", "polarity": "yin" },
        "pillars": {
          "year": { "stem": "yi", "branch": "hai" },
          "month": { "stem": "wu", "branch": "wu" },
          "day": { "stem": "ji", "branch": "wei" },
          "hour": { "stem": "bing", "branch": "yin" }
        },
        "hiddenStems": { "year": [], "month": [], "day": [], "hour": [] },
        "stemRelations": [],
        "branchRelations": [],
        "elements": { "wood": 0, "fire": 0, "earth": 0, "metal": 0, "water": 0 },
        "tenGods": { "bi_jian": 0, "jie_cai": 0, "shi_shen": 0, "shang_guan": 0, "pian_cai": 0, "zheng_cai": 0, "qi_sha": 0, "zheng_guan": 0, "pian_yin": 0, "zheng_yin": 0 },
        "warnings": []
      }
    },
    "interpretation": {
      "mapping_version": "personality-map/0.2.0",
      "signals": {
        "dayMasterElement": "earth",
        "dayMasterStrength": "strong",
        "elementBalance": 0.7,
        "tenGodConcentration": 0.65,
        "visibleYangRatio": 50,
        "hourKnown": true,
        "sourceConfidence": 0.84
      },
      "profile": {
        "id": "pilot-profile-1",
        "chartId": "pilot-fixture-chart",
        "mapping_version": "personality-map/0.2.0",
        "summary": "Pilot fixture · 伤官型人格",
        "dimensions": [],
        "strengths": [],
        "growthEdges": [],
        "behaviorSuggestions": [],
        "generatedAt": "${new Date().toISOString()}"
      },
      "dimensionDetails": Array.from({ length: 15 }, (_, idx) => {
        const keys = ["autonomy","structure_need","expression_drive","risk_tolerance","emotional_sensitivity","social_adaptation","competition_drive","novelty_seeking","decision_speed","control_need","planning_orientation","conflict_style","external_validation_need","energy_variability","learning_orientation"];
        const labels = ["自主性","结构需求","表达驱动力","风险容忍","情绪敏感度","社会适应","竞争驱动力","新奇探索","决策速度","控制需求","规划倾向","冲突直接度","外部认可需求","能量波动性","学习取向"];
        const key = keys[idx];
        const score = idx % 2 === 0 ? 78 : 24;
        return {
          key, label: labels[idx], score, confidence: 0.8,
          contributors: [], positiveExpression: "正面的描述", stressExpression: "压力下的描述",
          explanationCodes: []
        };
      })
    },
    "archetype": {
      "archetype_seed": { "dominant_ten_god": "shang_guan", "secondary_ten_god": "pian_cai" },
      "dominant_pattern": { "ten_god": "shang_guan", "canonical_ten_god_score": 0.72, "candidate_score": 0.69 },
      "secondary_pattern": { "ten_god": "pian_cai", "canonical_ten_god_score": 0.41, "candidate_score": 0.45 },
      "family_scores": {},
      "confidence": 0.82
    },
    "normalization": {
      "locationProvider": "manual-v1-birthplace",
      "timezoneResolver": "iana-hint",
      "warnings": []
    }
  })`;

  return `try { sessionStorage.setItem('bazi:public-result:v1', ${sessionStorage}); } catch (e) {}`;
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const consoleErrors = [];
  const pageErrors = [];

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });

    for (const page of PAGES) {
      const tab = await context.newPage();
      tab.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push({ page: page.name, viewport: viewport.name, text: msg.text() });
      });
      tab.on("pageerror", (err) => pageErrors.push({ page: page.name, viewport: viewport.name, text: err.message }));

      if (page.name === "result") {
        await tab.addInitScript({ content: await seedResultBundle() });
      }

      const url = `${BASE}${page.path}`;
      try {
        await tab.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        // wait for fonts / network idle so reveal animations settle
        try {
          await tab.evaluate(() => document.fonts && document.fonts.ready);
        } catch {}
        await tab.waitForTimeout(1100);
        const fullPagePath = resolve(OUT, `${page.name}-${viewport.name}-full.png`);
        await tab.screenshot({ path: fullPagePath, fullPage: true });
        const viewportPath = resolve(OUT, `${page.name}-${viewport.name}.png`);
        await tab.screenshot({ path: viewportPath, fullPage: false });

        // Overflow / layout sanity
        const overflow = await tab.evaluate(() => {
          const doc = document.documentElement;
          return {
            scrollWidth: doc.scrollWidth,
            clientWidth: doc.clientWidth,
            innerWidth: window.innerWidth,
            scrollHeight: doc.scrollHeight,
          };
        });
        console.log(`[ui-pilot] ${page.name} @ ${viewport.name}x${viewport.height}: ${url} -> ${viewportPath} (scroll=${overflow.scrollWidth} inner=${overflow.innerWidth})`);
      } catch (err) {
        console.error(`[ui-pilot] failed ${page.name} @ ${viewport.name}: ${err && err.message ? err.message : err}`);
      } finally {
        await tab.close();
      }
    }

    await context.close();
  }

  await browser.close();

  if (consoleErrors.length) {
    console.log(`[ui-pilot] console errors: ${JSON.stringify(consoleErrors, null, 2)}`);
  }
  if (pageErrors.length) {
    console.log(`[ui-pilot] page errors: ${JSON.stringify(pageErrors, null, 2)}`);
  }
  if (!consoleErrors.length && !pageErrors.length) {
    console.log("[ui-pilot] no console or page errors detected.");
  }
}

run().catch((err) => {
  console.error("[ui-pilot] fatal", err);
  process.exit(1);
});