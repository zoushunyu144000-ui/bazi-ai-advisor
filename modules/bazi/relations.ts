import type { BaziChart, EarthlyBranch, HeavenlyStem } from '../../types/domain';
import { PILLAR_NAMES } from './constants';
import type { BaziRelation, BaziRelationKind } from './types';

const STEM_COMBINATIONS: [HeavenlyStem,HeavenlyStem][]=[['jia','ji'],['yi','geng'],['bing','xin'],['ding','ren'],['wu','gui']];
const BRANCH_COMBINATIONS:[EarthlyBranch,EarthlyBranch][]=[['zi','chou'],['yin','hai'],['mao','xu'],['chen','you'],['si','shen'],['wu','wei']];
const BRANCH_CLASHES:[EarthlyBranch,EarthlyBranch][]=[['zi','wu'],['chou','wei'],['yin','shen'],['mao','you'],['chen','xu'],['si','hai']];
const BRANCH_HARMS:[EarthlyBranch,EarthlyBranch][]=[['zi','wei'],['chou','wu'],['yin','si'],['mao','chen'],['shen','hai'],['you','xu']];

function pairMatch<T extends string>(pairs:[T,T][],a:T,b:T):boolean { return pairs.some(([x,y])=>(a===x&&b===y)||(a===y&&b===x)); }

export function calculateRelations(chart:BaziChart):BaziRelation[] {
  const entries=PILLAR_NAMES.flatMap(name=>{const p=chart.pillars[name];return p?[{name,p}]:[];});
  const out:BaziRelation[]=[];
  const add=(kind:BaziRelationKind,leftPillar:typeof PILLAR_NAMES[number],rightPillar:typeof PILLAR_NAMES[number],left:string,right:string)=>out.push({kind,leftPillar,rightPillar,left,right});
  for(let i=0;i<entries.length;i++) for(let j=i+1;j<entries.length;j++) {
    const a=entries[i],b=entries[j];
    if(pairMatch(STEM_COMBINATIONS,a.p.stem,b.p.stem)) add('stem_combination',a.name,b.name,a.p.stem,b.p.stem);
    if(pairMatch(BRANCH_COMBINATIONS,a.p.branch,b.p.branch)) add('branch_combination',a.name,b.name,a.p.branch,b.p.branch);
    if(pairMatch(BRANCH_CLASHES,a.p.branch,b.p.branch)) add('branch_clash',a.name,b.name,a.p.branch,b.p.branch);
    if(pairMatch(BRANCH_HARMS,a.p.branch,b.p.branch)) add('branch_harm',a.name,b.name,a.p.branch,b.p.branch);
  }
  return out;
}
