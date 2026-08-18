import test from 'node:test';
import assert from 'node:assert/strict';
import type { BaziChart } from '../../types/domain';
import { calculateRelations } from '../../modules/bazi/relations';
import { pillarFromRef, tenGodFor } from '../../modules/bazi/rules';

const targets=['jia','yi','bing','ding','wu','ji','geng','xin','ren','gui'] as const;
const gods=['bi_jian','jie_cai','shi_shen','shang_guan','pian_cai','zheng_cai','qi_sha','zheng_guan','pian_yin','zheng_yin'] as const;

test('Ten Gods are deterministic from day-master element and polarity',()=>{
  assert.deepEqual(targets.map(t=>tenGodFor('jia',t)),gods);
});

test('hidden stems are ordered main/middle/residual with versioned baseline weights',()=>{
  const p=pillarFromRef({stem:'jia',branch:'yin'},'jia');
  assert.deepEqual(p.hiddenStems.map(h=>[h.stem,h.weight]),[['jia',0.6],['bing',0.3],['wu',0.1]]);
});

test('basic stem/branch relations are emitted without transformation claims',()=>{
  const dm='jia' as const;
  const chart:BaziChart={id:'x',birthProfileId:'b',calculatedAt:'2026-08-18T00:00:00.000Z',dayMaster:{stem:dm,element:'wood',polarity:'yang'},pillars:{
    year:pillarFromRef({stem:'jia',branch:'zi'},dm),
    month:pillarFromRef({stem:'ji',branch:'wu'},dm),
    day:pillarFromRef({stem:'bing',branch:'chen'},dm),hour:null,
  }};
  const kinds=calculateRelations(chart).map(r=>r.kind);
  assert.ok(kinds.includes('stem_combination'));
  assert.ok(kinds.includes('branch_clash'));
});
