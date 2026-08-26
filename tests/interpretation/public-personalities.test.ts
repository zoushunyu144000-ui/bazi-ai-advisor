import assert from "node:assert/strict";
import test from "node:test";

const registryPath = "../../lib/public-personalities.ts";
const registry = await import(registryPath);

const EXPECTED = {
  bi_jian: "犟种",
  jie_cai: "撒币",
  shi_shen: "享乐主义",
  shang_guan: "天生反骨",
  zheng_cai: "抠抠搜搜",
  pian_cai: "搞钱圣体",
  zheng_guan: "老干部",
  qi_sha: "狠人",
  zheng_yin: "活菩萨",
  pian_yin: "道长",
} as const;

const EXPECTED_CANONICAL_GENDERS = {
  bi_jian: "female",
  jie_cai: "male",
  shi_shen: "male",
  shang_guan: "female",
  zheng_cai: "female",
  pian_cai: "male",
  zheng_guan: "female",
  qi_sha: "male",
  zheng_yin: "male",
  pian_yin: "female",
} as const;

const REQUIRED_COPY = [
  "display_name", "traditional_label", "anchor_quote", "one_line_roast", "short_description",
  "friend_view", "positive_mode", "flip_mode", "work_mode", "learning_mode", "relationship_mode",
  "conflict_mode", "stress_mode", "recovery_mode", "decision_mode", "money_mode", "growth_advice",
  "secondary_personality_copy", "share_card_copy", "paid_report_teaser",
] as const;

test("public registry exposes exactly the ten locked public identities", () => {
  registry.assertPublicPersonalityCoverage();
  assert.deepEqual(registry.PUBLIC_PERSONALITY_ORDER, Object.keys(EXPECTED));
  assert.equal(Object.keys(registry.PUBLIC_PERSONALITIES).length, 10);
  for (const [key, name] of Object.entries(EXPECTED)) assert.equal(registry.PUBLIC_PERSONALITIES[key].display_name, name);
});

test("every public personality ships complete public copy and six tags", () => {
  for (const key of registry.PUBLIC_PERSONALITY_ORDER) {
    const item = registry.PUBLIC_PERSONALITIES[key];
    assert.equal(item.tags.length, 6, `${key} must have exactly six tags`);
    for (const field of REQUIRED_COPY) assert.ok(item[field]?.trim().length > 0, `${key}.${field} is required`);
  }
});

test("bi_jian and jie_cai remain honest presentation proxy mappings", () => {
  assert.match(registry.PUBLIC_PERSONALITIES.bi_jian.traditional_label, /V1 展示代理/);
  assert.match(registry.PUBLIC_PERSONALITIES.jie_cai.traditional_label, /V1 展示代理/);
  assert.match(registry.PUBLIC_PERSONALITIES.bi_jian.traditional_label, /建禄/);
  assert.match(registry.PUBLIC_PERSONALITIES.jie_cai.traditional_label, /月劫/);
});

test("V2 character contract exposes ten fixed canonical IPs", () => {
  const paths = registry.PUBLIC_PERSONALITY_ORDER.map((key: keyof typeof EXPECTED) => {
    const item = registry.PUBLIC_PERSONALITIES[key];
    assert.equal(item.canonicalGender, EXPECTED_CANONICAL_GENDERS[key], `${key} canonical gender drifted`);
    assert.match(item.accent, /^#[0-9A-F]{6}$/i, `${key}.accent must be a hex color`);
    assert.ok(item.bodyVector.trim().length > 0, `${key}.bodyVector is required`);
    assert.ok(item.heroProp.trim().length > 0, `${key}.heroProp is required`);
    assert.equal(item.assetPath, `/characters/v2/${key}.png`);
    assert.equal(registry.characterAssetPath(key), item.assetPath);
    return item.assetPath;
  });

  assert.equal(paths.length, 10);
  assert.equal(new Set(paths).size, 10);
  assert.ok(paths.every((path: string) => /^\/characters\/v2\/[a-z_]+\.png$/.test(path)));
});
