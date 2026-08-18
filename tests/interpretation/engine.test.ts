import assert from "node:assert/strict";
import test from "node:test";

const enginePath = "../../modules/interpretation/engine.ts";
const archetypesPath = "../../modules/interpretation/archetypes.ts";
const fixturesPath = "./fixtures.ts";
const engine = await import(enginePath);
const archetypes = await import(archetypesPath);
const fixtures = await import(fixturesPath);

const TEN_GODS = ["bi_jian", "jie_cai", "shi_shen", "shang_guan", "pian_cai", "zheng_cai", "qi_sha", "zheng_guan", "pian_yin", "zheng_yin"] as const;

test("interpretation consumes canonical BaziDerivedFeatures without mutating or replacing them", () => {
  const before = structuredClone(fixtures.canonicalDerived);
  const result = engine.interpretBaziChart(fixtures.canonicalChart, fixtures.canonicalDerived);
  assert.deepEqual(fixtures.canonicalDerived, before);
  assert.equal(result.profile.chartId, fixtures.canonicalDerived.chartId);
  assert.equal(result.profile.dimensions.length, 15);
  assert.equal(result.mapping_version, "personality-map/0.2.0");
});

test("04 no longer exposes duplicate traditional-fact derivation helpers", () => {
  assert.equal("deriveBaziFeatures" in engine, false);
  assert.equal("deriveTenGod" in engine, false);
});

test("changing chart hidden facts does not create a second element/Ten-God model", () => {
  const chartVariant = structuredClone(fixtures.canonicalChart);
  chartVariant.pillars.year.hiddenStems = [{ stem: "geng", weight: 1, tenGod: "qi_sha" }];
  chartVariant.pillars.month.branchElement = "fire";
  const baseline = engine.interpretBaziChart(fixtures.canonicalChart, fixtures.canonicalDerived);
  const variant = engine.interpretBaziChart(chartVariant, fixtures.canonicalDerived);
  assert.deepEqual(variant, baseline);
});

test("same chart plus canonical derived features produces byte-stable interpretation", () => {
  const first = engine.interpretBaziChart(fixtures.canonicalChart, fixtures.canonicalDerived);
  const second = engine.interpretBaziChart(fixtures.canonicalChart, fixtures.canonicalDerived);
  assert.deepEqual(first, second);
});

test("interpretation-only signals derive balance/concentration/visible yang but preserve canonical strength", () => {
  const signals = engine.deriveInterpretationSignals(fixtures.canonicalChart, fixtures.canonicalDerived);
  assert.equal(signals.dayMasterStrength, fixtures.canonicalDerived.dayMasterStrength);
  assert.equal(signals.tenGodConcentration, 18);
  assert.equal(signals.visibleYangRatio, 50);
  assert.ok(signals.elementBalance > 0 && signals.elementBalance <= 1);

  const changed = fixtures.withElementDistribution([100, 0, 0, 0, 0]);
  const changedSignals = engine.deriveInterpretationSignals(fixtures.canonicalChart, changed);
  assert.equal(changedSignals.elementBalance, 0);
  assert.equal(changedSignals.dayMasterStrength, changed.dayMasterStrength);
});

test("chart/derived mismatch fails instead of silently creating a second fact set", () => {
  assert.throws(() => engine.interpretBaziChart(fixtures.unknownHourChart, fixtures.canonicalDerived), /input mismatch/i);
});

test("unknown hour is represented as an interpretation signal and source confidence remains canonical", () => {
  const result = engine.interpretBaziChart(fixtures.unknownHourChart, fixtures.unknownHourDerived);
  assert.equal(result.signals.hourKnown, false);
  assert.equal(result.signals.sourceConfidence, fixtures.unknownHourDerived.confidence);
});

test("all ten Ten-God structures, including 比肩 and 劫财, can become dominant archetype seeds", () => {
  for (const tenGod of TEN_GODS) {
    const derived = fixtures.dominantTenGodFixture(tenGod);
    const interpreted = engine.interpretBaziChart(fixtures.canonicalChart, derived);
    const archetype = archetypes.selectArchetypeCandidate(fixtures.canonicalChart, derived, interpreted.signals, interpreted.dimensionDetails);
    assert.equal(archetype.dominant_pattern.ten_god, tenGod, `expected ${tenGod} to be dominant`);
    assert.equal(archetype.archetype_seed.dominant_ten_god, tenGod);
    assert.match(archetype.archetype_code, /^DM_WOOD_/);
  }
});

test("archetype is multi-factor: code includes day master while ranking records traditional and personality evidence", () => {
  const interpreted = engine.interpretBaziChart(fixtures.canonicalChart, fixtures.canonicalDerived);
  const archetype = archetypes.selectArchetypeCandidate(fixtures.canonicalChart, fixtures.canonicalDerived, interpreted.signals, interpreted.dimensionDetails);
  assert.equal(archetype.archetype_seed.day_master_element, "wood");
  assert.ok(archetype.dominant_pattern.canonical_ten_god_score >= 0);
  assert.ok(archetype.dominant_pattern.dimension_fit >= 0 && archetype.dominant_pattern.dimension_fit <= 100);
  assert.ok(archetype.dominant_pattern.strength_fit >= 0 && archetype.dominant_pattern.strength_fit <= 100);
  assert.equal(archetype.personality_dimensions.length, 15);
  assert.ok(archetype.positive_mode.length >= 3);
  assert.ok(archetype.stress_mode.length >= 3);
});
