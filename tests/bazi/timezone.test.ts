import test from 'node:test';
import assert from 'node:assert/strict';
import { localPartsToInstant, partsAtInstant } from '../../modules/bazi/timezone';

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

test('DST overlaps use an explicit deterministic earlier-instant rule',()=>{
  const r=localPartsToInstant({year:2024,month:11,day:3,hour:1,minute:30,second:0},'America/New_York');
  assert.equal(r.ambiguous,true);
  assert.equal(new Date(r.instantMs).toISOString(),'2024-11-03T05:30:00.000Z');
});
