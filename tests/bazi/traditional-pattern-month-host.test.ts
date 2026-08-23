import test from 'node:test';
import assert from 'node:assert/strict';
import type {
  BaziCalculationMetadata,
  BaziChart,
  BirthProfile,
  EarthlyBranch,
  HeavenlyStem,
  StemBranchRef,
  TraditionalBaseMonthHost,
  TraditionalPatternEvidence,
} from '../../types/domain';
import { ENGINE_VERSION, HIDDEN_STEMS, STEM_ELEMENT, STEM_POLARITY, STEMS } from '../../modules/bazi/constants';
import { pillarFromRef } from '../../modules/bazi/rules';
import {
  JIANLU_MONTH_BRANCH_BY_STEM,
  RULE_PROFILE_MISMATCH,
  TraditionalPatternRuleProfileMismatchError,
  YANGREN_BRANCH_BY_YANG_STEM,
  ZIPING_RULE_PROFILE_VERSION,
  evaluateBaseMonthHost,
} from '../../modules/bazi/traditional-pattern';

const AUDIT_STAMP = '2026-08-23T00:00:00.000Z';
let chartSeq = 0;

function zipingMetadata(): BaziCalculationMetadata {
  return {
    engine_version: ENGINE_VERSION,
    rule_profile_version: ZIPING_RULE_PROFILE_VERSION,
    sourceTimezone: 'UTC',
    calendarConversion: 'gregorian_to_solar_terms',
    birthTimeWasKnown: true,
    calculatedAt: AUDIT_STAMP,
    warnings: [],
  };
}

function legacyMetadata(): BaziCalculationMetadata {
  return { ...zipingMetadata(), rule_profile_version: 'civil-local-jieqi-v1' };
}

function birthProfile(): BirthProfile {
  return {
    id: '00000000-0000-4000-8000-000000000000',
    label: 'month-host-test',
    calendar: 'gregorian',
    birthDate: '2000-01-01',
    birthTime: '12:00:00',
    birthTimePrecision: 'exact',
    timezone: 'UTC',
    sexForTraditionalRules: 'male',
    createdAt: AUDIT_STAMP,
    updatedAt: AUDIT_STAMP,
  };
}

interface ChartSpec {
  dayMaster: HeavenlyStem;
  year: StemBranchRef;
  month: StemBranchRef;
  hour?: StemBranchRef | null;
}

function chartWith(spec: ChartSpec): BaziChart {
  chartSeq += 1;
  const dm = spec.dayMaster;
  return {
    id: `10000000-0000-4000-8000-${String(chartSeq).padStart(12, '0')}`,
    birthProfileId: birthProfile().id,
    pillars: {
      year: pillarFromRef(spec.year, dm),
      month: pillarFromRef(spec.month, dm),
      day: pillarFromRef({ stem: dm, branch: 'xu' }, dm),
      hour: spec.hour ? pillarFromRef(spec.hour, dm) : null,
    },
    dayMaster: { stem: dm, element: STEM_ELEMENT[dm], polarity: STEM_POLARITY[dm] },
    calculatedAt: AUDIT_STAMP,
  };
}

interface EvaluationInputParts {
  chart: BaziChart;
  calculationMetadata: BaziCalculationMetadata;
}

function evaluationInput({ chart, calculationMetadata }: EvaluationInputParts) {
  return {
    birthProfile: birthProfile(),
    chart,
    calculationMetadata,
    relations: [],
  };
}

function evaluateChartRaw(spec: ChartSpec) {
  return evaluateBaseMonthHost(evaluationInput({ chart: chartWith(spec), calculationMetadata: zipingMetadata() }));
}

function evaluateChart(spec: ChartSpec) {
  const result = evaluateChartRaw(spec);
  const host = result.host;
  assert.ok(host, 'fixture expected a resolved Base Month Host');
  return { ...result, host };
}

/** First stem that is not hidden in the branch (keeps synthetic fixtures free of stray exposure). */
function neutralStem(branch: EarthlyBranch, avoid: HeavenlyStem[]): HeavenlyStem {
  const stem = STEMS.find((candidate) => !HIDDEN_STEMS[branch].includes(candidate) && !avoid.includes(candidate));
  if (!stem) throw new Error(`No neutral stem available for branch ${branch}`);
  return stem;
}

function selfRootedSpec(dayMaster: HeavenlyStem, branch: EarthlyBranch): ChartSpec {
  const monthStem = neutralStem(branch, [dayMaster]);
  const outerStem = neutralStem(branch, [dayMaster, monthStem]);
  return {
    dayMaster,
    year: { stem: outerStem, branch: 'zi' },
    month: { stem: monthStem, branch },
    hour: { stem: outerStem, branch: 'chou' },
  };
}

function assertNoNumericFields(value: unknown, path: string): void {
  if (typeof value === 'number') throw new Error(`Unexpected numeric field at ${path}`);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoNumericFields(entry, `${path}[${index}]`));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) assertNoNumericFields(entry, `${path}.${key}`);
  }
}

test('main qi exposed becomes base host ahead of middle and residual', () => {
  const { host } = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'geng', branch: 'wu' },
    month: { stem: 'jia', branch: 'shen' }, // shen hidden [geng, ren, wu]
    hour: { stem: 'ji', branch: 'si' },
  });
  assert.equal(host.monthBranch, 'shen');
  assert.equal(host.selectedLayer, 'main');
  assert.equal(host.selectedStem, 'geng');
  assert.equal(host.selectedTenGod, 'qi_sha');
  assert.equal(host.hostKind, 'regular_ten_god');
  assert.equal(host.patternCandidate, 'qi_sha');
  assert.equal(host.exposureState, 'exposed');
  assert.deepEqual(host.exposurePillars, ['year']);
  assert.deepEqual(host.competingExposedPatterns, []);
});

test('unexposed main falls back to the exposed middle qi', () => {
  const { host } = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'ji', branch: 'chou' },
    month: { stem: 'geng', branch: 'chen' }, // chen hidden [wu, yi, gui]
    hour: { stem: 'yi', branch: 'hai' },
  });
  assert.equal(host.selectedLayer, 'middle');
  assert.equal(host.selectedStem, 'yi');
  assert.equal(host.selectedTenGod, 'jie_cai');
  assert.equal(host.hostKind, 'yue_jie'); // peer host outside Lu(yin)/Yangren(mao)
  assert.equal(host.patternCandidate, 'yue_jie');
  assert.equal(host.exposureState, 'exposed');
  assert.deepEqual(host.exposurePillars, ['hour']);
});

test('non-Lu BiJian selected from month hidden qi fails closed instead of inventing Yuejie', () => {
  const result = evaluateChartRaw({
    dayMaster: 'jia',
    year: { stem: 'ding', branch: 'zi' },
    month: { stem: 'xin', branch: 'hai' }, // hai hidden [ren, jia]; middle jia = bi_jian
    hour: { stem: 'jia', branch: 'chou' }, // exposes middle BiJian only
  });

  assert.equal(result.host, null);
  assert.equal(result.ambiguities.length, 1);
  assert.equal(result.ambiguities[0].code, 'insufficient_evidence');
  assert.equal(result.ambiguities[0].severity, 'blocking');
  assert.ok(result.ambiguities[0].affectedFields.includes('base_month_host'));
  assert.equal(result.evidence.some((item) => item.target.pattern === 'yue_jie'), false);
});

test('competing peer exposure stays context-only and does not manufacture Yuejie', () => {
  const { host, evidence } = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'wu', branch: 'zi' }, // chen main wu = pian_cai exposed
    month: { stem: 'geng', branch: 'chen' }, // chen hidden [wu, yi, gui]
    hour: { stem: 'yi', branch: 'hai' }, // middle yi = jie_cai also exposed
  });

  assert.equal(host.patternCandidate, 'pian_cai');
  assert.deepEqual(host.competingExposedPatterns, []);
  assert.equal(evidence.some((item) => item.target.pattern === 'yue_jie'), false);
  assert.ok(
    evidence.some(
      (item) =>
        item.ruleId === 'ZP-HOST-050' &&
        item.descriptionCode === 'ZP_HOST_COMPETING_EXPOSED_PEER_CONTEXT' &&
        item.source.stem === 'yi',
    ),
  );
});

test('residual qi is selected when main and middle stay unexposed', () => {
  const { host } = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'xin', branch: 'si' },
    month: { stem: 'ji', branch: 'si' }, // si hidden [bing, wu, geng]
    hour: { stem: 'geng', branch: 'wu' },
  });
  assert.equal(host.selectedLayer, 'residual');
  assert.equal(host.selectedStem, 'geng');
  assert.equal(host.selectedTenGod, 'qi_sha');
  assert.equal(host.hostKind, 'regular_ten_god');
  assert.equal(host.patternCandidate, 'qi_sha');
  assert.equal(host.exposureState, 'exposed');
  assert.deepEqual(host.exposurePillars, ['hour']);
});

test('no visible exposure falls back to the unexposed main qi as host basis', () => {
  const { host, evidence } = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'bing', branch: 'yin' },
    month: { stem: 'gui', branch: 'you' }, // you hidden [xin]
    hour: { stem: 'wu', branch: 'chen' },
  });
  assert.equal(host.selectedLayer, 'main');
  assert.equal(host.selectedStem, 'xin');
  assert.equal(host.selectedTenGod, 'zheng_guan');
  assert.equal(host.hostKind, 'regular_ten_god');
  assert.equal(host.patternCandidate, 'zheng_guan');
  assert.equal(host.exposureState, 'unexposed_main_fallback');
  assert.deepEqual(host.exposurePillars, []);
  assert.ok(evidence.some((item) => item.ruleId === 'ZP-HOST-030'));
});

test('multiple exposed layers keep hierarchy winner and preserve the competitor', () => {
  const { host, evidence } = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'geng', branch: 'wu' },
    month: { stem: 'jia', branch: 'shen' },
    hour: { stem: 'ren', branch: 'yin' },
  });
  assert.equal(host.selectedLayer, 'main'); // main beats middle although both are exposed
  assert.equal(host.selectedStem, 'geng');
  assert.deepEqual(host.exposurePillars, ['year']);
  assert.deepEqual(host.competingExposedPatterns, ['pian_yin']); // exposed ren stays a valid alternative
  assert.ok(
    evidence.some(
      (item) => item.ruleId === 'ZP-HOST-050' && item.effect === 'context' && item.source.stem === 'ren',
    ),
  );
});

test('day stem is never an exposure position', () => {
  const { host } = evaluateChart({
    dayMaster: 'ding',
    year: { stem: 'geng', branch: 'zi' },
    month: { stem: 'bing', branch: 'wu' }, // wu hidden [ding, ji]; day stem ding == main qi
    hour: { stem: 'xin', branch: 'chou' },
  });
  // Only the excluded day stem matches main qi ding, so exposure must stay empty.
  assert.equal(host.selectedLayer, 'main');
  assert.equal(host.selectedStem, 'ding');
  assert.equal(host.exposureState, 'unexposed_main_fallback');
  assert.deepEqual(host.exposurePillars, []);
  assert.equal(host.hostKind, 'jian_lu'); // 丁禄在午 still holds at branch level
});

test('all ten Jianlu mappings are exact day-master/month-branch pairs', () => {
  const pairs: [HeavenlyStem, EarthlyBranch][] = [
    ['jia', 'yin'],
    ['yi', 'mao'],
    ['bing', 'si'],
    ['ding', 'wu'],
    ['wu', 'si'],
    ['ji', 'wu'],
    ['geng', 'shen'],
    ['xin', 'you'],
    ['ren', 'hai'],
    ['gui', 'zi'],
  ];
  for (const [dayMaster, luBranch] of pairs) {
    assert.equal(JIANLU_MONTH_BRANCH_BY_STEM[dayMaster], luBranch);
    const { host } = evaluateChart(selfRootedSpec(dayMaster, luBranch));
    assert.equal(host.monthBranch, luBranch);
    assert.equal(host.hostKind, 'jian_lu', `${dayMaster}-${luBranch} must be jian_lu`);
    assert.equal(host.patternCandidate, 'jian_lu');
  }
});

test('a visible bi_jian elsewhere never creates Jianlu', () => {
  const { host } = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'jia', branch: 'zi' }, // bi_jian visible on a non-Lu month
    month: { stem: 'xin', branch: 'wei' }, // wei hidden [ji, ding, yi]
    hour: { stem: 'wu', branch: 'chen' },
  });
  assert.notEqual(host.monthBranch, JIANLU_MONTH_BRANCH_BY_STEM.jia);
  assert.notEqual(host.hostKind, 'jian_lu');
  assert.equal(host.hostKind, 'regular_ten_god');
  assert.equal(host.patternCandidate, 'zheng_cai'); // none exposed -> main ji
});

test('Yuejie requires the month-command JieCai/Lu-Jie host itself; generic JieCai elsewhere is insufficient', () => {
  const positive = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'ji', branch: 'chou' },
    month: { stem: 'geng', branch: 'chen' }, // middle qi yi = jie_cai exposed -> month-command peer host
    hour: { stem: 'yi', branch: 'hai' },
  });
  assert.equal(positive.host.hostKind, 'yue_jie');
  assert.equal(positive.host.patternCandidate, 'yue_jie');

  const genericVisible = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'bing', branch: 'yin' },
    month: { stem: 'gui', branch: 'you' }, // month command is xin zheng_guan
    hour: { stem: 'yi', branch: 'mao' }, // generic jie_cai visible outside month command
  });
  assert.notEqual(genericVisible.host.hostKind, 'yue_jie');
  assert.equal(genericVisible.host.hostKind, 'regular_ten_god');
  assert.equal(genericVisible.host.patternCandidate, 'zheng_guan');

  const genericHidden = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'bing', branch: 'yin' },
    month: { stem: 'gui', branch: 'wei' }, // residual yi = jie_cai hidden but unselected
    hour: { stem: 'wu', branch: 'chen' },
  });
  assert.notEqual(genericHidden.host.hostKind, 'yue_jie');
  assert.equal(genericHidden.host.patternCandidate, 'zheng_cai');
});

test('all five Yangren mappings apply to yang day masters only', () => {
  const pairs: [HeavenlyStem, EarthlyBranch][] = [
    ['jia', 'mao'],
    ['bing', 'wu'],
    ['wu', 'wu'],
    ['geng', 'you'],
    ['ren', 'zi'],
  ];
  for (const [dayMaster, bladeBranch] of pairs) {
    assert.equal(YANGREN_BRANCH_BY_YANG_STEM[dayMaster], bladeBranch);
    const { host } = evaluateChart(selfRootedSpec(dayMaster, bladeBranch));
    assert.equal(host.monthBranch, bladeBranch);
    assert.equal(host.hostKind, 'yang_ren', `${dayMaster}-${bladeBranch} must be yang_ren`);
    assert.equal(host.patternCandidate, 'yang_ren');
  }
});

test('five yin day masters never auto-Yangren', () => {
  const cases: [HeavenlyStem, EarthlyBranch][] = [
    ['yi', 'yin'], // main jia = jie_cai
    ['ding', 'si'], // main bing = jie_cai
    ['ji', 'chen'], // main wu = jie_cai
    ['xin', 'shen'], // main geng = jie_cai
    ['gui', 'hai'], // main ren = jie_cai
  ];
  for (const [dayMaster, branch] of cases) {
    assert.equal(YANGREN_BRANCH_BY_YANG_STEM[dayMaster], undefined);
    const { host } = evaluateChart(selfRootedSpec(dayMaster, branch));
    assert.notEqual(host.hostKind, 'yang_ren', `${dayMaster}-${branch} must not auto-Yangren`);
    assert.notEqual(host.patternCandidate, 'yang_ren');
    assert.equal(host.hostKind, 'yue_jie'); // peer month-command host stays Yuejie
  }
});

test('legacy rule profile fails closed before any Month Host evaluation', () => {
  const chart = chartWith({
    dayMaster: 'jia',
    year: { stem: 'geng', branch: 'wu' },
    month: { stem: 'jia', branch: 'shen' },
  });
  assert.throws(
    () =>
      evaluateBaseMonthHost(
        evaluationInput({ chart, calculationMetadata: legacyMetadata() }),
      ),
    (error: unknown) => {
      assert.ok(error instanceof TraditionalPatternRuleProfileMismatchError);
      const mismatch = error as TraditionalPatternRuleProfileMismatchError;
      assert.equal(mismatch.code, RULE_PROFILE_MISMATCH);
      assert.equal(mismatch.actualRuleProfile, 'civil-local-jieqi-v1');
      assert.equal(mismatch.expectedRuleProfile, ZIPING_RULE_PROFILE_VERSION);
      return true;
    },
  );
});

test('missing hour pillar only narrows the exposure scan', () => {
  const { host } = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'geng', branch: 'wu' },
    month: { stem: 'jia', branch: 'shen' },
  });
  assert.equal(host.exposureState, 'exposed');
  assert.deepEqual(host.exposurePillars, ['year']);
  assert.equal(host.patternCandidate, 'qi_sha');
});

test('base Host slice returns evidence only and never a final primary pattern', () => {
  const result = evaluateChart({
    dayMaster: 'jia',
    year: { stem: 'geng', branch: 'wu' },
    month: { stem: 'jia', branch: 'shen' },
    hour: { stem: 'ren', branch: 'yin' },
  });
  assert.equal('primaryPattern' in result, false);
  assert.equal('patternStatus' in result, false);
  assert.deepEqual(new Set(result.host.evidenceKeys), new Set(result.evidence.map((item) => item.id)));
});

test('evidence has deterministic IDs, ZP-HOST ruleIds and no numeric weight/confidence', () => {
  const specs: ChartSpec[] = [
    {
      dayMaster: 'jia',
      year: { stem: 'geng', branch: 'wu' },
      month: { stem: 'jia', branch: 'shen' },
      hour: { stem: 'ren', branch: 'yin' },
    },
    {
      dayMaster: 'jia',
      year: { stem: 'bing', branch: 'yin' },
      month: { stem: 'gui', branch: 'you' },
      hour: { stem: 'wu', branch: 'chen' },
    },
    selfRootedSpec('jia', 'yin'),
    selfRootedSpec('jia', 'mao'),
    selfRootedSpec('ding', 'wu'),
    {
      dayMaster: 'jia',
      year: { stem: 'ji', branch: 'chou' },
      month: { stem: 'geng', branch: 'chen' },
      hour: { stem: 'yi', branch: 'hai' },
    },
  ];

  const allEvidence: TraditionalPatternEvidence[] = [];
  const allHosts: TraditionalBaseMonthHost[] = [];
  for (const spec of specs) {
    const { host, evidence } = evaluateChart(spec);
    allHosts.push(host);
    for (const item of evidence) {
      assert.ok(item.ruleId.startsWith('ZP-HOST-'), `ruleId ${item.ruleId} must live in ZP-HOST namespace`);
      assert.ok(item.descriptionCode.startsWith('ZP_HOST_'));
      assert.ok(item.id.length > 0);
      allEvidence.push(item);
    }
  }

  const ids = new Set(allEvidence.map((item) => item.id));
  assert.equal(ids.size, allEvidence.length); // deterministic IDs are unique across charts

  for (const item of [...allEvidence, ...allHosts]) assertNoNumericFields(item, 'evidence');
  const serialized = JSON.stringify(allEvidence);
  assert.equal(serialized.includes('"weight"'), false);
  assert.equal(serialized.includes('"confidence"'), false);

  // Same semantic input reproduces byte-stable evidence (deterministic IDs).
  const chart = chartWith(specs[0]);
  const input = evaluationInput({ chart, calculationMetadata: zipingMetadata() });
  assert.deepEqual(evaluateBaseMonthHost(input), evaluateBaseMonthHost(structuredClone(input)));
});
