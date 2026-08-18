import type { BaziChart, BaziDerivedFeatures, DayMasterStrength, FiveElement, PersonalityProfile, TenGod } from "@/types/domain";

export const INTERPRETATION_MAPPING_VERSION = "personality-map/0.2.0";
export const INTERPRETATION_RULE_PROFILE_VERSION = "interpretation-rules/0.2.0";

export type PersonalityDimensionKey = "autonomy" | "structure_need" | "expression_drive" | "risk_tolerance" | "emotional_sensitivity" | "social_adaptation" | "competition_drive" | "novelty_seeking" | "decision_speed" | "control_need" | "planning_orientation" | "conflict_style" | "external_validation_need" | "energy_variability" | "learning_orientation";
export interface InterpretationSignals { dayMasterElement: FiveElement; dayMasterStrength: DayMasterStrength; elementBalance: number; tenGodConcentration: number; visibleYangRatio: number; hourKnown: boolean; sourceConfidence: number; }
export type ContributorDirection = "increase" | "decrease" | "neutral";
export interface DimensionContributor { code: string; factor: string; signal: number; weight: number; contribution: number; direction: ContributorDirection; observed: number | string; }
export interface PersonalityDimensionDetail { key: PersonalityDimensionKey; label: string; score: number; confidence: number; contributors: DimensionContributor[]; positiveExpression: string; stressExpression: string; explanationCodes: string[]; }
export interface PersonalityMappingResult { profile: PersonalityProfile; dimensionDetails: PersonalityDimensionDetail[]; }
export interface InterpretationResult extends PersonalityMappingResult { signals: InterpretationSignals; mapping_version: string; }

type FactorKey = `ten_god:${TenGod}` | `element:${FiveElement}` | "day_master_strength" | "element_balance" | "ten_god_concentration" | "visible_yang_ratio";
interface Rule { factor: FactorKey; weight: number; code: string; }
interface Definition { key: PersonalityDimensionKey; label: string; rules: Rule[]; }
interface Context { derived: BaziDerivedFeatures; signals: InterpretationSignals; elements: Record<FiveElement, number>; tenGods: Record<TenGod, number>; }

const ELEMENTS: FiveElement[] = ["wood", "fire", "earth", "metal", "water"];
const TEN_GODS: TenGod[] = ["bi_jian", "jie_cai", "shi_shen", "shang_guan", "pian_cai", "zheng_cai", "qi_sha", "zheng_guan", "pian_yin", "zheng_yin"];
const tg = (key: TenGod, weight: number, code: string): Rule => ({ factor: `ten_god:${key}`, weight, code });
const el = (key: FiveElement, weight: number, code: string): Rule => ({ factor: `element:${key}`, weight, code });
const sg = (factor: Exclude<FactorKey, `ten_god:${TenGod}` | `element:${FiveElement}`>, weight: number, code: string): Rule => ({ factor, weight, code });

const DEFINITIONS: Definition[] = [
  { key: "autonomy", label: "自主性", rules: [tg("bi_jian",9,"autonomy.bi_jian"),tg("jie_cai",8,"autonomy.jie_cai"),tg("shang_guan",7,"autonomy.shang_guan"),tg("zheng_guan",-7,"autonomy.zheng_guan"),tg("zheng_yin",-4,"autonomy.zheng_yin"),sg("visible_yang_ratio",3,"autonomy.yang")] },
  { key: "structure_need", label: "结构需求", rules: [tg("zheng_guan",10,"structure.zheng_guan"),tg("zheng_yin",8,"structure.zheng_yin"),el("earth",5,"structure.earth"),el("metal",4,"structure.metal"),tg("shang_guan",-7,"structure.shang_guan")] },
  { key: "expression_drive", label: "表达驱动力", rules: [tg("shi_shen",10,"expression.shi_shen"),tg("shang_guan",12,"expression.shang_guan"),el("fire",6,"expression.fire"),sg("visible_yang_ratio",3,"expression.yang"),tg("zheng_yin",-4,"expression.zheng_yin")] },
  { key: "risk_tolerance", label: "风险容忍", rules: [tg("jie_cai",7,"risk.jie_cai"),tg("shang_guan",7,"risk.shang_guan"),tg("pian_cai",8,"risk.pian_cai"),el("fire",5,"risk.fire"),sg("visible_yang_ratio",4,"risk.yang"),tg("zheng_guan",-6,"risk.zheng_guan")] },
  { key: "emotional_sensitivity", label: "情绪敏感度", rules: [tg("zheng_yin",7,"sensitivity.zheng_yin"),tg("pian_yin",10,"sensitivity.pian_yin"),el("water",8,"sensitivity.water"),el("wood",3,"sensitivity.wood"),el("metal",-3,"sensitivity.metal"),sg("day_master_strength",-2,"sensitivity.strength")] },
  { key: "social_adaptation", label: "社会适应", rules: [tg("zheng_cai",7,"adaptation.zheng_cai"),tg("zheng_guan",7,"adaptation.zheng_guan"),tg("shi_shen",6,"adaptation.shi_shen"),el("earth",4,"adaptation.earth"),sg("element_balance",6,"adaptation.balance"),tg("jie_cai",-4,"adaptation.jie_cai")] },
  { key: "competition_drive", label: "竞争驱动力", rules: [tg("bi_jian",8,"competition.bi_jian"),tg("jie_cai",11,"competition.jie_cai"),tg("qi_sha",9,"competition.qi_sha"),sg("visible_yang_ratio",4,"competition.yang"),el("metal",3,"competition.metal")] },
  { key: "novelty_seeking", label: "新奇探索", rules: [tg("shang_guan",10,"novelty.shang_guan"),tg("pian_yin",7,"novelty.pian_yin"),tg("pian_cai",7,"novelty.pian_cai"),el("fire",4,"novelty.fire"),el("wood",4,"novelty.wood"),tg("zheng_guan",-6,"novelty.zheng_guan")] },
  { key: "decision_speed", label: "决策速度", rules: [tg("qi_sha",8,"decision.qi_sha"),tg("bi_jian",6,"decision.bi_jian"),el("fire",6,"decision.fire"),sg("visible_yang_ratio",6,"decision.yang"),sg("day_master_strength",4,"decision.strength"),tg("zheng_yin",-6,"decision.zheng_yin")] },
  { key: "control_need", label: "控制需求", rules: [tg("zheng_guan",8,"control.zheng_guan"),tg("qi_sha",7,"control.qi_sha"),tg("zheng_cai",6,"control.zheng_cai"),el("metal",5,"control.metal"),el("earth",4,"control.earth"),sg("day_master_strength",4,"control.strength")] },
  { key: "planning_orientation", label: "规划倾向", rules: [tg("zheng_yin",9,"planning.zheng_yin"),tg("zheng_guan",9,"planning.zheng_guan"),tg("zheng_cai",6,"planning.zheng_cai"),el("earth",6,"planning.earth"),el("metal",3,"planning.metal"),tg("shang_guan",-5,"planning.shang_guan")] },
  { key: "conflict_style", label: "冲突直接度", rules: [tg("qi_sha",10,"conflict.qi_sha"),tg("shang_guan",8,"conflict.shang_guan"),tg("jie_cai",7,"conflict.jie_cai"),el("metal",4,"conflict.metal"),sg("visible_yang_ratio",5,"conflict.yang"),tg("zheng_yin",-4,"conflict.zheng_yin")] },
  { key: "external_validation_need", label: "外部认可需求", rules: [tg("zheng_guan",8,"validation.zheng_guan"),tg("zheng_cai",5,"validation.zheng_cai"),tg("zheng_yin",5,"validation.zheng_yin"),el("earth",3,"validation.earth"),tg("bi_jian",-7,"validation.bi_jian"),tg("shang_guan",-6,"validation.shang_guan")] },
  { key: "energy_variability", label: "能量波动性", rules: [tg("shang_guan",6,"energy.shang_guan"),tg("pian_yin",8,"energy.pian_yin"),el("fire",6,"energy.fire"),el("water",5,"energy.water"),sg("ten_god_concentration",4,"energy.concentration"),el("earth",-6,"energy.earth")] },
  { key: "learning_orientation", label: "学习取向", rules: [tg("zheng_yin",10,"learning.zheng_yin"),tg("pian_yin",10,"learning.pian_yin"),tg("shi_shen",5,"learning.shi_shen"),el("water",5,"learning.water"),el("wood",4,"learning.wood"),sg("element_balance",3,"learning.balance")] },
];

export function deriveInterpretationSignals(chart: BaziChart, derived: BaziDerivedFeatures): InterpretationSignals {
  assertCompatible(chart, derived);
  const elements = canonicalElements(derived);
  const tenGods = canonicalTenGods(derived);
  const visible = [chart.pillars.year, chart.pillars.month, chart.pillars.day, chart.pillars.hour].filter((p): p is NonNullable<typeof p> => p !== null);
  const yang = visible.filter((p) => p.stemPolarity === "yang").length;
  return { dayMasterElement: chart.dayMaster.element, dayMasterStrength: derived.dayMasterStrength, elementBalance: r3(entropy(ELEMENTS.map((e) => elements[e]))), tenGodConcentration: r2(Math.max(...TEN_GODS.map((g) => tenGods[g]))), visibleYangRatio: r2(visible.length ? yang / visible.length * 100 : 50), hourKnown: chart.pillars.hour !== null, sourceConfidence: r3(clamp(derived.confidence,0,1)) };
}

export function mapPersonalityProfile(derived: BaziDerivedFeatures, signals: InterpretationSignals): PersonalityMappingResult {
  const context: Context = { derived, signals, elements: canonicalElements(derived), tenGods: canonicalTenGods(derived) };
  const dimensionDetails = DEFINITIONS.map((d) => scoreDimension(d, context));
  const salient = [...dimensionDetails].sort((a,b) => salience(b)-salience(a) || a.key.localeCompare(b.key)).slice(0,3);
  const profile: PersonalityProfile = {
    id: stableUuid(`${derived.chartId}|profile|${INTERPRETATION_MAPPING_VERSION}`), chartId: derived.chartId, mapping_version: INTERPRETATION_MAPPING_VERSION,
    summary: `这是传统八字结构的现代行为解释模型，不属于科学心理诊断。较显著的相对倾向：${salient.map((d)=>`${d.label}${bandLabel(d.score)}`).join("、")}。`,
    dimensions: dimensionDetails.map((d)=>({key:d.key,label:d.label,score:d.score,confidence:d.confidence,evidenceKeys:d.explanationCodes})),
    strengths: salient.map((d)=>d.positiveExpression), growthEdges: salient.map((d)=>d.stressExpression), behaviorSuggestions: salient.map((d)=>`用真实行为记录持续校准${d.label}。`), generatedAt: derived.derivedAt,
  };
  return { profile, dimensionDetails };
}

export function interpretBaziChart(chart: BaziChart, derived: BaziDerivedFeatures): InterpretationResult {
  const signals = deriveInterpretationSignals(chart, derived);
  return { ...mapPersonalityProfile(derived, signals), signals, mapping_version: INTERPRETATION_MAPPING_VERSION };
}

function scoreDimension(def: Definition, context: Context): PersonalityDimensionDetail {
  const all = def.rules.map((rule)=>contributor(rule,context));
  const score = Math.round(clamp(50 + all.reduce((s,c)=>s+c.contribution,0),0,100));
  const contributors = [...all].sort((a,b)=>Math.abs(b.contribution)-Math.abs(a.contribution) || a.code.localeCompare(b.code)).slice(0,6);
  const evidence = clamp(all.reduce((s,c)=>s+Math.abs(c.contribution),0)/18,0,1);
  const confidence = r3(clamp(.25 + context.signals.sourceConfidence*.55 + evidence*.15,0,1));
  const band = score>=60?"high":score<=40?"low":"balanced";
  return { key:def.key,label:def.label,score,confidence,contributors,positiveExpression:positive(def.label,score),stressExpression:stress(def.label,score),explanationCodes:[`dimension.${def.key}.band.${band}`,...contributors.filter((c)=>Math.abs(c.contribution)>=.25).map((c)=>c.code)] };
}

function contributor(rule: Rule, context: Context): DimensionContributor {
  const {signal,observed}=evaluate(rule.factor,context); const contribution=r2(signal*rule.weight);
  return { code:rule.code,factor:rule.factor,signal:r3(signal),weight:rule.weight,contribution,direction:contribution>.05?"increase":contribution<-.05?"decrease":"neutral",observed };
}
function evaluate(factor: FactorKey, c: Context): {signal:number;observed:number|string} {
  if(factor.startsWith("ten_god:")){const k=factor.slice(8) as TenGod;const v=c.tenGods[k];return{signal:clamp((v-10)/20,-1,1),observed:r2(v)}}
  if(factor.startsWith("element:")){const k=factor.slice(8) as FiveElement;const v=c.elements[k];return{signal:clamp((v-20)/25,-1,1),observed:r2(v)}}
  if(factor==="day_master_strength"){const v=c.derived.dayMasterStrength;return{signal:v==="strong"?1:v==="weak"?-1:0,observed:v}}
  if(factor==="element_balance")return{signal:clamp((c.signals.elementBalance-.72)/.28,-1,1),observed:c.signals.elementBalance};
  if(factor==="ten_god_concentration")return{signal:clamp((c.signals.tenGodConcentration-20)/30,-1,1),observed:c.signals.tenGodConcentration};
  return{signal:clamp((c.signals.visibleYangRatio-50)/50,-1,1),observed:c.signals.visibleYangRatio};
}
function canonicalElements(d:BaziDerivedFeatures):Record<FiveElement,number>{const r=Object.fromEntries(ELEMENTS.map((e)=>[e,0])) as Record<FiveElement,number>;for(const x of d.elementDistribution){pct(x.score);r[x.element]+=x.score}total(Object.values(r),"elementDistribution");return r}
function canonicalTenGods(d:BaziDerivedFeatures):Record<TenGod,number>{const r=Object.fromEntries(TEN_GODS.map((g)=>[g,0])) as Record<TenGod,number>;for(const x of d.tenGodDistribution){pct(x.score);r[x.tenGod]+=x.score}total(Object.values(r),"tenGodDistribution");return r}
function assertCompatible(c:BaziChart,d:BaziDerivedFeatures){if(c.id!==d.chartId)throw new Error("Interpretation input mismatch: chart and canonical derived features differ.");if(!Number.isFinite(d.confidence)||d.confidence<0||d.confidence>1)throw new Error("Canonical confidence must be 0-1.")}
function pct(v:number){if(!Number.isFinite(v)||v<0||v>100)throw new Error("Canonical distribution scores must be 0-100.")}
function total(v:number[],label:string){const n=v.reduce((a,b)=>a+b,0);if(Math.abs(n-100)>.5)throw new Error(`Canonical ${label} must total approximately 100.`)}
function entropy(v:number[]){const t=v.reduce((a,b)=>a+b,0);if(t<=0)return 0;return v.reduce((s,x)=>{if(x<=0)return s;const p=x/t;return s-p*Math.log(p)},0)/Math.log(v.length)}
function positive(label:string,score:number){return score>=60?`${label}偏高时，更容易主动使用这一倾向解决问题。`:score<=40?`${label}偏低时，更容易使用相反或补偿性的策略。`:`${label}处于中间区间，通常能按情境调整。`}
function stress(label:string,score:number){return score>=60?`压力下，偏高的${label}可能被过度使用。`:score<=40?`压力下，偏低的${label}可能导致相关行为启动不足。`:`压力下，${label}可能出现情境性摆动。`}
function bandLabel(s:number){return s>=60?"偏高":s<=40?"偏低":"居中"}
function salience(d:PersonalityDimensionDetail){return Math.abs(d.score-50)*d.confidence}
function stableUuid(seed:string){let a=2166136261,b=2654435769;for(let i=0;i<seed.length;i++){const c=seed.charCodeAt(i);a=Math.imul(a^c,16777619)>>>0;b=Math.imul(b^c,2246822507)>>>0}const h=`${a.toString(16).padStart(8,"0")}${b.toString(16).padStart(8,"0")}${(a^b).toString(16).padStart(8,"0")}${Math.imul(a,31).toString(16).padStart(8,"0")}`.slice(0,32);return`${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-8${h.slice(17,20)}-${h.slice(20,32)}`}
function clamp(v:number,min:number,max:number){return Math.min(max,Math.max(min,v))} function r2(v:number){return Math.round(v*100)/100} function r3(v:number){return Math.round(v*1000)/1000}
