import assert from "node:assert/strict";
import test from "node:test";

const enginePath = "../../modules/interpretation/engine.ts";
const fixturesPath = "./fixtures.ts";
const engine = await import(enginePath);
const fixtures = await import(fixturesPath);

const sourceMetadata = {
  engine_version: "bazi-engine/test-fixture",
  rule_profile_version: "bazi-rules/test-fixture",
};

test("same chart produces byte-for-byte deterministic interpretation data", () => {
  const first = engine.interpretBaziChart(fixtures.knownHourChart, { sourceMetadata });
  const second = engine.interpretBaziChart(fixtures.knownHourChart, { sourceMetadata });
  assert.deepEqual(first, second);
  assert.equal(first.profile.generatedAt, fixtures.knownHourChart.calculatedAt);
  assert.equal(first.derivedFeatures.derivedAt, fixtures.knownHourChart.calculatedAt);
});

test("v1 exposes the 15 agreed behavior dimensions with bounded scores", () => {
  const result = engine.interpretBaziChart(fixtures.knownHourChart, { sourceMetadata });
  const expectedKeys = [
    "autonomy",
    "structure_need",
    "expression_drive",
    "risk_tolerance",
    "emotional_sensitivity",
    "social_adaptation",
    "competition_drive",
    "novelty_seeking",
    "decision_speed",
    "control_need",
    "planning_orientation",
    "conflict_style",
    "external_validation_need",
    "energy_variability",
    "learning_orientation",
  ];

  assert.equal(result.mapping_version, "personality-map/0.1.0");
  assert.equal(result.profile.mapping_version, result.mapping_version);
  assert.deepEqual(result.dimensionDetails.map((dimension: { key: string }) => dimension.key), expectedKeys);
  assert.equal(result.profile.dimensions.length, expectedKeys.length);

  for (const dimension of result.dimensionDetails) {
    assert.ok(dimension.score >= 0 && dimension.score <= 100);
    assert.ok(dimension.confidence >= 0 && dimension.confidence <= 1);
    assert.ok(dimension.contributors.length >= 4);
    assert.ok(dimension.positiveExpression.length > 0);
    assert.ok(dimension.stressExpression.length > 0);
    assert.ok(dimension.explanationCodes.length > 0);
    assert.ok(dimension.explanationCodes[0].startsWith(`dimension.${dimension.key}.band.`));
    const publicDimension = result.profile.dimensions.find((item: { key: string }) => item.key === dimension.key);
    assert.deepEqual(publicDimension?.evidenceKeys, dimension.explanationCodes);
  }
});

test("derived element and ten-god distributions are normalized and traceable", () => {
  const features = engine.deriveBaziFeatures(fixtures.knownHourChart, { sourceMetadata });
  const elementTotal = features.elementDistribution.reduce((sum: number, item: { score: number }) => sum + item.score, 0);
  const tenGodTotal = features.tenGodDistribution.reduce((sum: number, item: { score: number }) => sum + item.score, 0);

  assert.ok(Math.abs(elementTotal - 100) < 0.02);
  assert.ok(Math.abs(tenGodTotal - 100) < 0.02);
  assert.equal(features.engine_version, sourceMetadata.engine_version);
  assert.equal(features.rule_profile_version, "interpretation-rules/0.1.0");
  assert.equal(features.mapping_version, "personality-map/0.1.0");
  assert.ok(features.structuralTags.includes(`source_rule_profile:${sourceMetadata.rule_profile_version}`));
});

test("unknown birth hour lowers data confidence without breaking determinism", () => {
  const known = engine.interpretBaziChart(fixtures.knownHourChart, { sourceMetadata });
  const unknown = engine.interpretBaziChart(fixtures.unknownHourChart, { sourceMetadata });
  const averageConfidence = (result: typeof known) =>
    result.dimensionDetails.reduce((sum: number, item: { confidence: number }) => sum + item.confidence, 0) /
    result.dimensionDetails.length;

  assert.ok(unknown.derivedFeatures.confidence < known.derivedFeatures.confidence);
  assert.ok(averageConfidence(unknown) < averageConfidence(known));
  assert.ok(unknown.derivedFeatures.structuralTags.includes("hour:unknown"));
  assert.deepEqual(
    engine.interpretBaziChart(fixtures.unknownHourChart, { sourceMetadata }),
    engine.interpretBaziChart(fixtures.unknownHourChart, { sourceMetadata }),
  );
});

test("a concentrated authority chart is still scored through multiple contributors", () => {
  const result = engine.interpretBaziChart(fixtures.authorityHeavyChart, { sourceMetadata });
  const structure = result.dimensionDetails.find((item: { key: string }) => item.key === "structure_need");
  const autonomy = result.dimensionDetails.find((item: { key: string }) => item.key === "autonomy");

  assert.ok(structure);
  assert.ok(autonomy);
  assert.ok(structure.contributors.some((item: { direction: string }) => item.direction === "increase"));
  assert.ok(autonomy.contributors.some((item: { direction: string }) => item.direction === "decrease"));
  assert.ok(new Set(structure.contributors.map((item: { factor: string }) => item.factor)).size >= 4);
  assert.ok(structure.score <= 100 && autonomy.score >= 0);
});

test("ten-god derivation follows element relation plus polarity instead of a single label shortcut", () => {
  assert.equal(engine.deriveTenGod("jia", "jia"), "bi_jian");
  assert.equal(engine.deriveTenGod("jia", "yi"), "jie_cai");
  assert.equal(engine.deriveTenGod("jia", "bing"), "shi_shen");
  assert.equal(engine.deriveTenGod("jia", "ding"), "shang_guan");
  assert.equal(engine.deriveTenGod("jia", "wu"), "pian_cai");
  assert.equal(engine.deriveTenGod("jia", "ji"), "zheng_cai");
  assert.equal(engine.deriveTenGod("jia", "geng"), "qi_sha");
  assert.equal(engine.deriveTenGod("jia", "xin"), "zheng_guan");
  assert.equal(engine.deriveTenGod("jia", "ren"), "pian_yin");
  assert.equal(engine.deriveTenGod("jia", "gui"), "zheng_yin");
});
