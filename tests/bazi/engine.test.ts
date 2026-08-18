import test from 'node:test';
import assert from 'node:assert/strict';
import type { BaziCalculationResult } from '../../types/domain';
import { calculateBazi, solarTermInstantMs } from '../../modules/bazi';
import { profileAtInstant } from './helpers';

function withoutIdentity(result:ReturnType<typeof calculateBazi>) {
  return JSON.parse(JSON.stringify(result));
}

test('calculateBazi conforms to the shared BaziCalculationResult contract',()=>{
  const result:BaziCalculationResult=calculateBazi(profileAtInstant(Date.parse('2005-12-23T08:37:00Z')));
  assert.ok(result.chart);
  assert.ok(result.calculationMetadata);
  assert.ok(result.derivedFeatures);
  assert.ok(Array.isArray(result.relations));
  assert.ok(result.luck);
});

test('Li Chun exact instant switches BaZi year and Yin month',()=>{
  const liChun=solarTermInstantMs(2024,3);
  const before=calculateBazi(profileAtInstant(liChun-1000));
  const at=calculateBazi(profileAtInstant(liChun));
  assert.deepEqual([before.chart.pillars.year.stem,before.chart.pillars.year.branch],['gui','mao']);
  assert.deepEqual([at.chart.pillars.year.stem,at.chart.pillars.year.branch],['jia','chen']);
  assert.equal(at.chart.pillars.month.branch,'yin');
});

test('Jie boundary changes month at the exact astronomical instant',()=>{
  const jingZhe=solarTermInstantMs(2024,5);
  const before=calculateBazi(profileAtInstant(jingZhe-1000));
  const at=calculateBazi(profileAtInstant(jingZhe));
  assert.notDeepEqual(before.chart.pillars.month,at.chart.pillars.month);
  assert.equal(before.chart.pillars.month.branch,'yin');
  assert.equal(at.chart.pillars.month.branch,'mao');
});

test('Jan 1 remains in previous BaZi year until Li Chun',()=>{
  const r=calculateBazi(profileAtInstant(Date.parse('2024-01-01T12:00:00Z')));
  assert.deepEqual([r.chart.pillars.year.stem,r.chart.pillars.year.branch],['gui','mao']);
});

test('late Zi hour stays on the same civil day; midnight advances day pillar',()=>{
  const a=calculateBazi(profileAtInstant(Date.parse('2024-06-01T22:59:00Z')));
  const b=calculateBazi(profileAtInstant(Date.parse('2024-06-01T23:00:00Z')));
  const c=calculateBazi(profileAtInstant(Date.parse('2024-06-02T00:00:00Z')));
  assert.deepEqual(b.chart.pillars.day,a.chart.pillars.day);
  assert.equal(b.chart.pillars.hour?.branch,'zi');
  assert.notDeepEqual(c.chart.pillars.day,b.chart.pillars.day);
});

test('leap day and unknown time are handled deterministically',()=>{
  const p=profileAtInstant(Date.parse('2024-02-29T12:00:00Z'));
  p.birthTime=null;p.birthTimePrecision='unknown';
  const r=calculateBazi(p);
  assert.equal(r.chart.pillars.hour,null);
  assert.equal(r.calculationMetadata.birthTimeWasKnown,false);
  assert.ok(r.calculationMetadata.warnings.some(w=>w.includes('unknown')));
});

test('same normalized input yields byte-identical output',()=>{
  const p=profileAtInstant(Date.parse('1998-12-22T05:44:00Z'),'Asia/Shanghai','male');
  assert.deepEqual(withoutIdentity(calculateBazi(p)),withoutIdentity(calculateBazi(structuredClone(p))));
});

test('same absolute instant across timezones shares solar-term year/month boundaries',()=>{
  const ms=Date.parse('2024-02-04T16:30:00Z');
  const sh=calculateBazi(profileAtInstant(ms,'Asia/Shanghai'));
  const ny=calculateBazi(profileAtInstant(ms,'America/New_York'));
  assert.deepEqual([sh.chart.pillars.year.stem,sh.chart.pillars.year.branch],[ny.chart.pillars.year.stem,ny.chart.pillars.year.branch]);
  assert.deepEqual([sh.chart.pillars.month.stem,sh.chart.pillars.month.branch],[ny.chart.pillars.month.stem,ny.chart.pillars.month.branch]);
});

test('basic luck cycles use explicit forward/reverse rule and 3-days-per-year profile',()=>{
  const ms=Date.parse('2024-06-01T12:00:00Z');
  const male=calculateBazi(profileAtInstant(ms,'UTC','male'));
  const female=calculateBazi(profileAtInstant(ms,'UTC','female'));
  assert.equal(male.luck.direction,'forward');
  assert.equal(female.luck.direction,'reverse');
  assert.equal(male.luck.cycles.length,8);
  assert.equal(female.luck.cycles.length,8);
});

test('derived distributions use the shared 0-100 percentage scale and carry versions',()=>{
  const r=calculateBazi(profileAtInstant(Date.parse('2000-02-29T12:00:00Z')));
  const elementTotal=r.derivedFeatures.elementDistribution.reduce((s,x)=>s+x.score,0);
  const tenGodTotal=r.derivedFeatures.tenGodDistribution.reduce((s,x)=>s+x.score,0);
  assert.ok(Math.abs(elementTotal-100)<0.00001);
  assert.ok(Math.abs(tenGodTotal-100)<0.00001);
  assert.ok(r.derivedFeatures.elementDistribution.every(x=>x.score>=0&&x.score<=100));
  assert.ok(r.derivedFeatures.tenGodDistribution.every(x=>x.score>=0&&x.score<=100));
  assert.equal(r.calculationMetadata.engine_version,r.derivedFeatures.engine_version);
  assert.equal(r.calculationMetadata.rule_profile_version,r.derivedFeatures.rule_profile_version);
  assert.ok(r.derivedFeatures.confidence>=0&&r.derivedFeatures.confidence<=1);
});
