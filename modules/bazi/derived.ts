import type { BaziChart, BaziDerivedFeatures, BaziRelation, FiveElement, TenGod } from '../../types/domain';
import { ELEMENTS, ENGINE_VERSION, MAPPING_VERSION, RULE_PROFILE_VERSION, STEM_ELEMENT } from './constants';
import { elementThatGenerates } from './rules';

const TEN_GODS:TenGod[]=['bi_jian','jie_cai','shi_shen','shang_guan','pian_cai','zheng_cai','qi_sha','zheng_guan','pian_yin','zheng_yin'];
const round=(n:number)=>Math.round(n*1_000_000)/1_000_000;
const percentage=(value:number,total:number)=>round((value/total)*100);

export function deriveFeatures(chart:BaziChart,relations:BaziRelation[],calculatedAt:string,birthTimeQuality:'exact'|'approximate'|'unknown'):BaziDerivedFeatures {
  const elementScores=Object.fromEntries(ELEMENTS.map(e=>[e,0])) as Record<FiveElement,number>;
  const tenGodScores=Object.fromEntries(TEN_GODS.map(t=>[t,0])) as Record<TenGod,number>;
  const entries=Object.entries(chart.pillars) as [keyof BaziChart['pillars'],BaziChart['pillars'][keyof BaziChart['pillars']]][];
  for(const [name,pillar] of entries) {
    if(!pillar) continue;
    elementScores[pillar.stemElement]+=1;
    if(pillar.tenGod) tenGodScores[pillar.tenGod]+=1;
    const branchWeight=name==='month'?1.5:1;
    for(const hidden of pillar.hiddenStems) {
      const weight=(hidden.weight??0)*branchWeight;
      elementScores[STEM_ELEMENT[hidden.stem]]+=weight;
      if(hidden.tenGod) tenGodScores[hidden.tenGod]+=weight;
    }
  }
  const elementTotal=Object.values(elementScores).reduce((a,b)=>a+b,0);
  const tenGodTotal=Object.values(tenGodScores).reduce((a,b)=>a+b,0);
  const elementDistribution=ELEMENTS.map(element=>({element,score:percentage(elementScores[element],elementTotal)}));
  const tenGodDistribution=TEN_GODS.map(tenGod=>({tenGod,score:percentage(tenGodScores[tenGod],tenGodTotal)}));
  const dm=chart.dayMaster.element;
  const resource=elementThatGenerates(dm);
  const support=(elementScores[dm]+elementScores[resource])/elementTotal;
  const dayMasterStrength=support>=0.58?'strong':support<=0.42?'weak':'balanced';
  const monthElement=chart.pillars.month.branchElement;
  const structuralTags=[
    `day_master:${chart.dayMaster.stem}:${chart.dayMaster.element}:${chart.dayMaster.polarity}`,
    `season:${chart.pillars.month.branch}:${monthElement}`,
    `support_ratio:${round(support)}`,
    ...[...new Set(relations.map(r=>`relation:${r.kind}`))],
  ];
  const confidence=birthTimeQuality==='exact'?0.72:birthTimeQuality==='approximate'?0.62:0.5;
  return {
    id:'',chartId:chart.id,engine_version:ENGINE_VERSION,rule_profile_version:RULE_PROFILE_VERSION,mapping_version:MAPPING_VERSION,
    dayMasterStrength,elementDistribution,tenGodDistribution,
    seasonalContext:`month_branch=${chart.pillars.month.branch};month_element=${monthElement};resource_element=${resource};support_ratio=${round(support)}`,
    structuralTags,confidence,derivedAt:calculatedAt,
  };
}
