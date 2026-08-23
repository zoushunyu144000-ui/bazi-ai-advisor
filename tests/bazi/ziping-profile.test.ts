import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  PATTERN_SCHEMA_VERSION,
  RULE_PROFILE_MISMATCH,
  ZIPING_RULE_PROFILE_VERSION,
  TraditionalPatternRuleProfileMismatchError,
  assertZipingRuleProfile,
  calculateBazi,
  calculateBaziZipingV1,
  solarTermInstantMs,
} from '../../modules/bazi';
import { profileAtInstant } from './helpers';

test('frozen Traditional Pattern versions are explicit', () => {
  assert.equal(ZIPING_RULE_PROFILE_VERSION, 'ziping-v1.0.0');
  assert.equal(PATTERN_SCHEMA_VERSION, 'traditional-pattern-result/1.0.0');
});

test('legacy and ziping calculation paths preserve distinct profile identities', () => {
  const p = profileAtInstant(Date.parse('2005-12-23T08:37:00Z'));
  const legacy = calculateBazi(structuredClone(p));
  const ziping = calculateBaziZipingV1(structuredClone(p));

  assert.equal(legacy.calculationMetadata.rule_profile_version, 'civil-local-jieqi-v1');
  assert.equal(ziping.calculationMetadata.rule_profile_version, 'ziping-v1.0.0');
  assert.equal(legacy.derivedFeatures.rule_profile_version, 'civil-local-jieqi-v1');
  assert.equal(ziping.derivedFeatures.rule_profile_version, 'ziping-v1.0.0');
  assert.notEqual(legacy.chart.id, ziping.chart.id);

  assert.deepEqual(
    [legacy.chart.pillars.year.stem, legacy.chart.pillars.year.branch],
    [ziping.chart.pillars.year.stem, ziping.chart.pillars.year.branch],
  );
  assert.deepEqual(
    [legacy.chart.pillars.month.stem, legacy.chart.pillars.month.branch],
    [ziping.chart.pillars.month.stem, ziping.chart.pillars.month.branch],
  );
  assert.deepEqual(
    [legacy.chart.pillars.day.stem, legacy.chart.pillars.day.branch],
    [ziping.chart.pillars.day.stem, ziping.chart.pillars.day.branch],
  );
});

test('Traditional Pattern authority fails closed on legacy rule profile', () => {
  const legacy = calculateBazi(profileAtInstant(Date.parse('2005-12-23T08:37:00Z')));
  assert.throws(
    () => assertZipingRuleProfile(legacy.calculationMetadata),
    (error: unknown) => {
      assert.ok(error instanceof TraditionalPatternRuleProfileMismatchError);
      assert.equal(error.code, RULE_PROFILE_MISMATCH);
      assert.equal(error.actualRuleProfile, 'civil-local-jieqi-v1');
      assert.equal(error.expectedRuleProfile, 'ziping-v1.0.0');
      return true;
    },
  );

  const ziping = calculateBaziZipingV1(
    profileAtInstant(Date.parse('2005-12-23T08:37:00Z')),
  );
  assert.doesNotThrow(() => assertZipingRuleProfile(ziping.calculationMetadata));
});

test('ziping late-Zi split keeps Zi hour stem continuous across civil midnight', () => {
  const at = (iso: string) => calculateBaziZipingV1(profileAtInstant(Date.parse(iso), 'UTC'));
  const p2259 = at('2024-06-01T22:59:00Z');
  const p2300 = at('2024-06-01T23:00:00Z');
  const p2359 = at('2024-06-01T23:59:00Z');
  const p0000 = at('2024-06-02T00:00:00Z');
  const p0059 = at('2024-06-02T00:59:00Z');
  const p0100 = at('2024-06-02T01:00:00Z');

  assert.equal(p2259.chart.pillars.hour?.branch, 'hai');
  assert.equal(p2300.chart.pillars.hour?.branch, 'zi');
  assert.equal(p2359.chart.pillars.hour?.branch, 'zi');
  assert.equal(p0000.chart.pillars.hour?.branch, 'zi');
  assert.equal(p0059.chart.pillars.hour?.branch, 'zi');
  assert.equal(p0100.chart.pillars.hour?.branch, 'chou');

  assert.deepEqual(
    [p2300.chart.pillars.day.stem, p2300.chart.pillars.day.branch],
    [p2259.chart.pillars.day.stem, p2259.chart.pillars.day.branch],
  );
  assert.deepEqual(
    [p2359.chart.pillars.day.stem, p2359.chart.pillars.day.branch],
    [p2300.chart.pillars.day.stem, p2300.chart.pillars.day.branch],
  );
  assert.notDeepEqual(
    [p0000.chart.pillars.day.stem, p0000.chart.pillars.day.branch],
    [p2359.chart.pillars.day.stem, p2359.chart.pillars.day.branch],
  );

  assert.equal(p2300.chart.pillars.hour?.stem, p0000.chart.pillars.hour?.stem);
  assert.equal(p2359.chart.pillars.hour?.stem, p0059.chart.pillars.hour?.stem);

  assert.ok(p2300.calculationMetadata.warnings.includes('school_sensitivity_late_zi'));
  assert.ok(p0000.calculationMetadata.warnings.includes('school_sensitivity_late_zi'));
});

test('ziping late-Zi vector changes only the 23:xx hour stem from legacy profile', () => {
  const profile = profileAtInstant(
    Date.parse('1988-02-15T15:30:00Z'),
    'Asia/Shanghai',
    'male',
  );
  const legacy = calculateBazi(structuredClone(profile));
  const ziping = calculateBaziZipingV1(structuredClone(profile));

  const refs = (result: ReturnType<typeof calculateBazi>) => {
    const p = result.chart.pillars;
    assert.ok(p.hour);
    return [
      [p.year.stem, p.year.branch],
      [p.month.stem, p.month.branch],
      [p.day.stem, p.day.branch],
      [p.hour.stem, p.hour.branch],
    ];
  };

  assert.deepEqual(refs(legacy), [
    ['wu', 'chen'],
    ['jia', 'yin'],
    ['geng', 'zi'],
    ['bing', 'zi'],
  ]);
  assert.deepEqual(refs(ziping), [
    ['wu', 'chen'],
    ['jia', 'yin'],
    ['geng', 'zi'],
    ['wu', 'zi'],
  ]);
});

test('ziping path preserves exact LiChun and Jie boundaries', () => {
  const liChun = solarTermInstantMs(2024, 3);
  const beforeYear = calculateBaziZipingV1(profileAtInstant(liChun - 1000));
  const atYear = calculateBaziZipingV1(profileAtInstant(liChun));
  assert.deepEqual(
    [beforeYear.chart.pillars.year.stem, beforeYear.chart.pillars.year.branch],
    ['gui', 'mao'],
  );
  assert.deepEqual(
    [atYear.chart.pillars.year.stem, atYear.chart.pillars.year.branch],
    ['jia', 'chen'],
  );

  const jingZhe = solarTermInstantMs(2024, 5);
  const beforeMonth = calculateBaziZipingV1(profileAtInstant(jingZhe - 1000));
  const atMonth = calculateBaziZipingV1(profileAtInstant(jingZhe));
  assert.equal(beforeMonth.chart.pillars.month.branch, 'yin');
  assert.equal(atMonth.chart.pillars.month.branch, 'mao');
});

test('traditional-pattern module has no Interpretation dependency', () => {
  const root = join(process.cwd(), 'modules/bazi/traditional-pattern');
  for (const filename of readdirSync(root)) {
    if (!filename.endsWith('.ts')) continue;
    const source = readFileSync(join(root, filename), 'utf8');
    assert.equal(
      /modules\/interpretation|from\s+['"][^'"]*interpretation/.test(source),
      false,
      `${filename} must not import Interpretation`,
    );
  }
});
