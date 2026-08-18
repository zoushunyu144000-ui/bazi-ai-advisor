import type { BaziPillar, EarthlyBranch, FiveElement, HeavenlyStem, StemBranchRef, TenGod, YinYang } from '../../types/domain';
import { BRANCHES, BRANCH_ELEMENT, CONTROLS, GENERATES, HIDDEN_STEMS, STEMS, STEM_ELEMENT, STEM_POLARITY } from './constants';

export function tenGodFor(dayMaster:HeavenlyStem,target:HeavenlyStem):TenGod {
  const dmElement=STEM_ELEMENT[dayMaster], targetElement=STEM_ELEMENT[target];
  const samePolarity=STEM_POLARITY[dayMaster]===STEM_POLARITY[target];
  if (dmElement===targetElement) return samePolarity?'bi_jian':'jie_cai';
  if (GENERATES[dmElement]===targetElement) return samePolarity?'shi_shen':'shang_guan';
  if (CONTROLS[dmElement]===targetElement) return samePolarity?'pian_cai':'zheng_cai';
  if (CONTROLS[targetElement]===dmElement) return samePolarity?'qi_sha':'zheng_guan';
  if (GENERATES[targetElement]===dmElement) return samePolarity?'pian_yin':'zheng_yin';
  throw new Error(`Unreachable five-element relation: ${dmElement}/${targetElement}`);
}

export function pillarFromRef(ref:StemBranchRef,dayMaster:HeavenlyStem):BaziPillar {
  const hidden=HIDDEN_STEMS[ref.branch];
  const hiddenWeights = hidden.length===1?[1]:hidden.length===2?[0.7,0.3]:[0.6,0.3,0.1];
  return {
    ...ref,
    stemElement:STEM_ELEMENT[ref.stem],
    stemPolarity:STEM_POLARITY[ref.stem],
    branchElement:BRANCH_ELEMENT[ref.branch],
    hiddenStems:hidden.map((stem,i)=>({stem,weight:hiddenWeights[i],tenGod:tenGodFor(dayMaster,stem)})),
    tenGod:tenGodFor(dayMaster,ref.stem),
  };
}

export function sexagenaryIndex(ref:StemBranchRef):number {
  const si=STEMS.indexOf(ref.stem), bi=BRANCHES.indexOf(ref.branch);
  for (let i=0;i<60;i++) if (i%10===si && i%12===bi) return i;
  throw new Error(`Invalid stem/branch pairing: ${ref.stem}/${ref.branch}`);
}
export function sexagenaryFromIndex(index:number):StemBranchRef {
  const i=((index%60)+60)%60;
  return {stem:STEMS[i%10],branch:BRANCHES[i%12]};
}

export function yearPillarFromLiChunYear(year:number):StemBranchRef {
  return sexagenaryFromIndex(year-1984);
}

export function monthPillarFromOffset(yearStem:HeavenlyStem,offsetFromYin:number):StemBranchRef {
  const yearStemIndex=STEMS.indexOf(yearStem);
  const stemIndex=((yearStemIndex%5)*2+2+offsetFromYin)%10;
  const branchIndex=(2+offsetFromYin)%12;
  return {stem:STEMS[stemIndex],branch:BRANCHES[branchIndex]};
}

export function hourPillar(dayStem:HeavenlyStem,hour:number):StemBranchRef {
  const branchIndex=Math.floor((hour+1)/2)%12;
  const dayStemIndex=STEMS.indexOf(dayStem);
  return {stem:STEMS[((dayStemIndex%5)*2+branchIndex)%10],branch:BRANCHES[branchIndex]};
}

export function elementThatGenerates(element:FiveElement):FiveElement {
  return (Object.keys(GENERATES) as FiveElement[]).find(k=>GENERATES[k]===element)!;
}
export function polarityOf(stem:HeavenlyStem):YinYang { return STEM_POLARITY[stem]; }
export function elementOf(stem:HeavenlyStem):FiveElement { return STEM_ELEMENT[stem]; }
export function branchElementOf(branch:EarthlyBranch):FiveElement { return BRANCH_ELEMENT[branch]; }
