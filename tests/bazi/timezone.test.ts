import test from 'node:test';
import assert from 'node:assert/strict';
import type { BirthProfile } from '../../types/domain';
import { calculateBazi } from '../../modules/bazi';
import { localPartsToInstant, partsAtInstant, resolveBirthInstant } from '../../modules/bazi/timezone';

test('IANA timezone conversion is reversible for ordinary civil times',()=>{
  const local={year:2024,month:6,day:1,hour:12,minute:34,second:56};
  for(const zone of ['Asia/Shanghai','Asia/Kuala_Lumpur','America/New_York','Europe/London']) {
    const r=localPartsToInstant(local,zone);
    assert.deepEqual(partsAtInstant(r.instantMs,zone),local);
  }
});

test('DST gaps fail closed instead of silently shifting the birth time',()=>{
  assert.throws(()=>localPartsToInstant({year:2024,month:3,day:10,hour:2,minute:30,second:0},'America/New_York'),/does not exist/);
});

test('legacy DST overlaps use the explicit deterministic earlier-instant fallback',()=>{
  const r=localPartsToInstant({year:2024,month:11,day:3,hour:1,minute:30,second:0},'America/New_York');
  assert.equal(r.ambiguous,true);
  assert.equal(new Date(r.instantMs).toISOString(),'2024-11-03T05:30:00.000Z');
});

test('resolved New York DST overlap occurrences replay exactly without re-disambiguation',()=>{
  const base:BirthProfile={
    id:'00000000-0000-4000-8000-000000000901',
    label:'dst-overlap',
    calendar:'gregorian',
    birthDate:'2024-11-03',
    birthTime:'01:30:00',
    birthTimePrecision:'exact',
    timezone:'America/New_York',
    sexForTraditionalRules:'male',
    createdAt:'2026-08-18T00:00:00.000Z',
    updatedAt:'2026-08-18T00:00:00.000Z',
  };
  const utcMinus4:BirthProfile={...base,resolvedBirthInstant:'2024-11-03T05:30:00.000Z',utcOffsetMinutesAtBirth:-240};
  const utcMinus5:BirthProfile={...base,resolvedBirthInstant:'2024-11-03T06:30:00.000Z',utcOffsetMinutesAtBirth:-300};

  const first=resolveBirthInstant(utcMinus4);
  const second=resolveBirthInstant(utcMinus5);
  assert.equal(new Date(first.instantMs).toISOString(),'2024-11-03T05:30:00.000Z');
  assert.equal(new Date(second.instantMs).toISOString(),'2024-11-03T06:30:00.000Z');
  assert.ok(first.warnings.includes('resolved_birth_instant_replayed_from_birth_profile'));
  assert.ok(second.warnings.includes('resolved_birth_instant_replayed_from_birth_profile'));
  assert.ok(!first.warnings.includes('ambiguous_local_time_resolved_to_earlier_instant'));
  assert.ok(!second.warnings.includes('ambiguous_local_time_resolved_to_earlier_instant'));

  const firstResult=calculateBazi(utcMinus4);
  const secondResult=calculateBazi(utcMinus5);
  assert.notEqual(firstResult.chart.id,secondResult.chart.id);
  assert.notEqual(firstResult.luck.startAgeYears,secondResult.luck.startAgeYears);
});

test('China 1990 summer civil time resolves with historical PRC DST (UTC+9)',()=>{
  const r=localPartsToInstant({year:1990,month:6,day:1,hour:12,minute:0,second:0},'Asia/Shanghai');
  assert.equal(new Date(r.instantMs).toISOString(),'1990-06-01T03:00:00.000Z');
  assert.deepEqual(partsAtInstant(r.instantMs,'Asia/Shanghai'),{year:1990,month:6,day:1,hour:12,minute:0,second:0});
});
