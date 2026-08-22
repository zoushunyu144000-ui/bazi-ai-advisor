// Inspect each page DOM to confirm key UI elements render correctly.
import { chromium } from "playwright";

const BASE = process.env.UI_PILOT_BASE ?? "http://localhost:3010";

async function seedScript() {
  return `try { sessionStorage.setItem('bazi:public-result:v1', JSON.stringify({
    schemaVersion: "public-result/1.0.0",
    createdAt: "${new Date().toISOString()}",
    profile: {
      id: "pilot-fixture-1",
      label: "Pilot Fixture",
      birthDate: "1995-06-12",
      birthTime: "08:35",
      birthTimePrecision: "exact",
      city: "上海",
      country: "中国",
      countryCode: "CN",
      locationId: "cn-shanghai",
      timezone: "Asia/Shanghai",
      sexForTraditionalRules: "female"
    },
    characterGender: "female",
    calculation: {
      chartId: "pilot-fixture-chart",
      engine_version: "bazi-engine-v1.0.0",
      derivedFeatures: {
        chartId: "pilot-fixture-chart",
        engine_version: "bazi-engine-v1.0.0",
        rule_profile_version: "civil-local-jieqi-v1",
        dayMasterStrength: "strong",
        tenGodDistribution: [],
        elementDistribution: [],
        derivedAt: "${new Date().toISOString()}",
        confidence: 0.84
      },
      chart: {
        id: "pilot-fixture-chart",
        engine_version: "bazi-engine-v1.0.0",
        rule_profile_version: "civil-local-jieqi-v1",
        derivedAt: "${new Date().toISOString()}",
        confidence: 0.84,
        dayMaster: { stem: "ji", element: "earth", polarity: "yin" },
        pillars: {
          year: { stem: "yi", branch: "hai" },
          month: { stem: "wu", branch: "wu" },
          day: { stem: "ji", branch: "wei" },
          hour: { stem: "bing", branch: "yin" }
        },
        hiddenStems: { year: [], month: [], day: [], hour: [] },
        stemRelations: [],
        branchRelations: [],
        elements: { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 },
        tenGods: { bi_jian: 0, jie_cai: 0, shi_shen: 0, shang_guan: 0, pian_cai: 0, zheng_cai: 0, qi_sha: 0, zheng_guan: 0, pian_yin: 0, zheng_yin: 0 },
        warnings: []
      }
    },
    interpretation: {
      mapping_version: "personality-map/0.2.0",
      signals: {
        dayMasterElement: "earth",
        dayMasterStrength: "strong",
        elementBalance: 0.7,
        tenGodConcentration: 0.65,
        visibleYangRatio: 50,
        hourKnown: true,
        sourceConfidence: 0.84
      },
      profile: { id: "pilot-profile-1", chartId: "pilot-fixture-chart", mapping_version: "personality-map/0.2.0", summary: "fixture", dimensions: [], strengths: [], growthEdges: [], behaviorSuggestions: [], generatedAt: "${new Date().toISOString()}" },
      dimensionDetails: [
        { key: "autonomy", label: "自主性", score: 78, confidence: 0.8, contributors: [], positiveExpression: "a", stressExpression: "b", explanationCodes: [] },
        { key: "structure_need", label: "结构需求", score: 24, confidence: 0.8, contributors: [], positiveExpression: "a", stressExpression: "b", explanationCodes: [] },
        { key: "expression_drive", label: "表达驱动力", score: 84, confidence: 0.8, contributors: [], positiveExpression: "a", stressExpression: "b", explanationCodes: [] },
        { key: "risk_tolerance", label: "风险容忍", score: 18, confidence: 0.8, contributors: [], positiveExpression: "a", stressExpression: "b", explanationCodes: [] }
      ]
    },
    archetype: {
      archetype_seed: { dominant_ten_god: "shang_guan", secondary_ten_god: "pian_cai" },
      dominant_pattern: { ten_god: "shang_guan", canonical_ten_god_score: 0.72, candidate_score: 0.69 },
      secondary_pattern: { ten_god: "pian_cai", canonical_ten_god_score: 0.41, candidate_score: 0.45 },
      family_scores: {},
      confidence: 0.82
    },
    normalization: { locationProvider: "manual-v1-birthplace", timezoneResolver: "iana-hint", warnings: [] }
  })); } catch (e) {}`;
}

async function run() {
  const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript({ content: await seedScript() });

  const page = await ctx.newPage();
  const report = {};

  async function inspect(label, url, expect) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
    const data = await page.evaluate(() => {
      const result = {};
      result.title = document.title;
      result.h1 = Array.from(document.querySelectorAll("h1")).map((n) => n.innerText.replace(/\s+/g, " ").trim().slice(0, 80));
      result.cta = Array.from(document.querySelectorAll("a, button")).filter((el) => /测测我是什么|下一步|生成|保存|再测/.test(el.innerText || "")).map((el) => (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 40));
      result.tag = document.querySelector("main")?.innerText.split("\n").filter(Boolean).slice(0, 30) ?? [];
      result.scroll = { x: document.documentElement.scrollWidth, w: document.documentElement.clientWidth };
      const fixedEls = Array.from(document.querySelectorAll("*")).filter((el) => {
        const cs = window.getComputedStyle(el);
        return cs.position === "fixed" || cs.position === "sticky";
      });
      result.stickyCount = fixedEls.length;
      result.touchTargets = Array.from(document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"], label')).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height < 44;
      }).length;
      return result;
    });
    report[label] = data;
    console.log(`\n[${label}] ${url}`);
    console.log("  title:", data.title);
    console.log("  h1:", data.h1.join(" | "));
    console.log("  cta:", data.cta.join(" | "));
    console.log("  scroll:", data.scroll);
    console.log("  stickyCount:", data.stickyCount);
    console.log("  smallTouchTargets:", data.touchTargets);
  }

  await inspect("home", `${BASE}/`, (r) => r.h1.length > 0 && r.cta.some((t) => /测测我是什么/.test(t)));
  await inspect("birth", `${BASE}/birth`, (r) => r.cta.some((t) => /下一步|认真算/.test(t)));
  await inspect("result", `${BASE}/result`, (r) => r.cta.some((t) => /生成|保存|复制|人格卡/.test(t)));

  await browser.close();
  console.log("\nAll inspects done.");
}

run().catch((err) => { console.error(err); process.exit(1); });