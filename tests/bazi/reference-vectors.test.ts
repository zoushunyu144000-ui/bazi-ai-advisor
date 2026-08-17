import test from 'node:test';
import assert from 'node:assert/strict';
import type { BirthProfile, EarthlyBranch, HeavenlyStem } from '../../types/domain';
import { calculateBazi } from '../../modules/bazi';

type ExpectedPillars = [
  [HeavenlyStem, EarthlyBranch],
  [HeavenlyStem, EarthlyBranch],
  [HeavenlyStem, EarthlyBranch],
  [HeavenlyStem, EarthlyBranch],
];

function profile(date:string,time:string):BirthProfile {
  return {
    id:`reference-${date}-${time}`,
    label:'open-source-reference-vector',
    calendar:'gregorian',
    birthDate:date,
    birthTime:time,
    birthTimePrecision:'exact',
    timezone:'Asia/Shanghai',
    sexForTraditionalRules:'unspecified',
    createdAt:'2026-08-18T00:00:00.000Z',
    updatedAt:'2026-08-18T00:00:00.000Z',
  };
}

function refs(result:ReturnType<typeof calculateBazi>):ExpectedPillars {
  const p=result.chart.pillars;
  assert.ok(p.hour);
  return [
    [p.year.stem,p.year.branch],
    [p.month.stem,p.month.branch],
    [p.day.stem,p.day.branch],
    [p.hour.stem,p.hour.branch],
  ];
}

const consensus:Array<{name:string;date:string;time:string;expected:ExpectedPillars}> = [
  {
    name:'ordinary Shanghai vector: tyme4ts/stem-branch/manseryeok consensus',
    date:'2005-12-23',time:'08:37:00',
    expected:[['yi','you'],['wu','zi'],['xin','si'],['ren','chen']],
  },
  {
    name:'pre-Li-Chun vector: tyme4ts/stem-branch/manseryeok consensus',
    date:'1992-02-02',time:'12:00:00',
    expected:[['xin','wei'],['xin','chou'],['wu','shen'],['wu','wu']],
  },
  {
    name:'leap-day vector: tyme4ts/stem-branch/manseryeok consensus',
    date:'2000-02-29',time:'12:00:00',
    expected:[['geng','chen'],['wu','yin'],['ding','si'],['bing','wu']],
  },
];

for (const vector of consensus) {
  test(vector.name,()=>{
    assert.deepEqual(refs(calculateBazi(profile(vector.date,vector.time))),vector.expected);
  });
}

test('late-Zi vector is pinned to this rule profile, not cross-library majority vote',()=>{
  // External benchmark for 1988-02-15 23:30 Asia/Shanghai:
  // tyme4ts + manseryeok(jasi) => 戊辰 甲寅 辛丑 戊子
  // stem-branch + manseryeok(splitJasi) => 戊辰 甲寅 庚子 戊子
  // manseryeok(midnight) => 戊辰 甲寅 庚子 丙子
  // civil-local-jieqi-v1 intentionally follows the last semantics.
  assert.deepEqual(
    refs(calculateBazi(profile('1988-02-15','23:30:00'))),
    [['wu','chen'],['jia','yin'],['geng','zi'],['bing','zi']],
  );
});
