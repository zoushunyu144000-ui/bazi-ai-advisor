import type { BaziChart, BaziRelation, EarthlyBranch, HeavenlyStem } from '../../types/domain';
import { PILLAR_NAMES } from './constants';

const STEM_COMBINATIONS: [HeavenlyStem,HeavenlyStem][]=[['jia','ji'],['yi','geng'],['bing','xin'],['ding','ren'],['wu','gui']];
const BRANCH_COMBINATIONS:[EarthlyBranch,EarthlyBranch][]=[['zi','chou'],['yin','hai'],['mao','xu'],['chen','you'],['si','shen'],['wu','wei']];
const BRANCH_CLASHES:[EarthlyBranch,EarthlyBranch][]=[['zi','wu'],['chou','wei'],['yin','shen'],['mao','you'],['chen','xu'],['si','hai']];
const BRANCH_HARMS:[EarthlyBranch,EarthlyBranch][]=[['zi','wei'],['chou','wu'],['yin','si'],['mao','chen'],['shen','hai'],['you','xu']];

function pairMatch<T extends string>(pairs:[T,T][],a:T,b:T):boolean { return pairs.some(([x,y])=>(a===x&&b===y)||(a===y&&b===x)); }

export function calculateRelations(chart:BaziChart):BaziRelation[] {
  const entries=PILLAR_NAMES.flatMap(name=>{const p=chart.pillars[name];return p?[{name,p}]:[];});
  const out:BaziRelation[]=[];
  for(let i=0;i<entries.length;i++) for(let j=i+1;j<entries.length;j++) {
    const a=entries[i],b=entries[j];
    if(pairMatch(STEM_COMBINATIONS,a.p.stem,b.p.stem)) out.push({kind:'stem_combination',leftPillar:a.name,rightPillar:b.name,left:a.p.stem,right:b.p.stem});
    if(pairMatch(BRANCH_COMBINATIONS,a.p.branch,b.p.branch)) out.push({kind:'branch_combination',leftPillar:a.name,rightPillar:b.name,left:a.p.branch,right:b.p.branch});
    if(pairMatch(BRANCH_CLASHES,a.p.branch,b.p.branch)) out.push({kind:'branch_clash',leftPillar:a.name,rightPillar:b.name,left:a.p.branch,right:b.p.branch});
    if(pairMatch(BRANCH_HARMS,a.p.branch,b.p.branch)) out.push({kind:'branch_harm',leftPillar:a.name,rightPillar:b.name,left:a.p.branch,right:b.p.branch});
  }
  return out;
}
