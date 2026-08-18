import { SolarDay, SolarTerm } from 'tyme4ts';
import type { EarthlyBranch, HeavenlyStem, StemBranchRef } from '../../../types/domain';
import { CHINESE_BRANCH, CHINESE_STEM } from '../constants';
import type { JieBoundary } from '../types';

const CST_OFFSET_MS=8*3600_000;
const JIE_INDICES = [1,3,5,7,9,11,13,15,17,19,21,23] as const;
const TERM_NAMES = ['冬至','小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪'] as const;

function requireStem(name:string):HeavenlyStem { const v=CHINESE_STEM[name]; if(!v) throw new Error(`Unsupported heavenly stem from tyme4ts: ${name}`); return v; }
function requireBranch(name:string):EarthlyBranch { const v=CHINESE_BRANCH[name]; if(!v) throw new Error(`Unsupported earthly branch from tyme4ts: ${name}`); return v; }

export function dayPillarForCivilDate(year:number,month:number,day:number):StemBranchRef {
  const cycle=SolarDay.fromYmd(year,month,day).getLunarDay().getSixtyCycle();
  return {stem:requireStem(cycle.getHeavenStem().getName()),branch:requireBranch(cycle.getEarthBranch().getName())};
}

export function solarTermInstantMs(gregorianYear:number,termIndex:number):number {
  const t=SolarTerm.fromIndex(gregorianYear,termIndex).getJulianDay().getSolarTime();
  return Date.UTC(t.getYear(),t.getMonth()-1,t.getDay(),t.getHour(),t.getMinute(),t.getSecond())-CST_OFFSET_MS;
}

export function jieBoundariesForGregorianYear(year:number):JieBoundary[] {
  return JIE_INDICES.map(termIndex=>({name:TERM_NAMES[termIndex],instantMs:solarTermInstantMs(year,termIndex),gregorianYear:year,termIndex}));
}

export function nearbyJieBoundaries(year:number):JieBoundary[] {
  return [year-1,year,year+1].flatMap(jieBoundariesForGregorianYear).sort((a,b)=>a.instantMs-b.instantMs);
}
