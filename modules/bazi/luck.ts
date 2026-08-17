import type { BaziChart, BirthProfile } from '../../types/domain';
import { STEM_POLARITY } from './constants';
import { nearbyJieBoundaries } from './adapters/tyme4ts-adapter';
import { sexagenaryFromIndex, sexagenaryIndex } from './rules';
import type { BaziLuckStructure, LuckDirection } from './types';

const DAY_MS=86_400_000;

function directionFor(chart:BaziChart,profile:BirthProfile):LuckDirection {
  const sex=profile.sexForTraditionalRules;
  if(sex==='unspecified') return 'unknown';
  const yang=STEM_POLARITY[chart.pillars.year.stem]==='yang';
  return (sex==='male'&&yang)||(sex==='female'&&!yang)?'forward':'reverse';
}

export function calculateLuckStructure(chart:BaziChart,profile:BirthProfile,birthInstantMs:number):BaziLuckStructure {
  const direction=directionFor(chart,profile);
  if(direction==='unknown') return {direction,startAgeYears:null,boundaryTerm:null,boundaryInstant:null,method:'three_days_one_year',cycles:[],warnings:['luck_direction_requires_sex_for_traditional_rules']};
  const year=new Date(birthInstantMs).getUTCFullYear();
  const boundaries=nearbyJieBoundaries(year);
  const boundary=direction==='forward'
    ? boundaries.find(b=>b.instantMs>birthInstantMs)
    : [...boundaries].reverse().find(b=>b.instantMs<birthInstantMs);
  if(!boundary) throw new Error('Unable to find adjacent Jie boundary for luck calculation');
  const startAgeYears=Math.round((Math.abs(boundary.instantMs-birthInstantMs)/(3*DAY_MS))*1_000_000)/1_000_000;
  const monthIndex=sexagenaryIndex(chart.pillars.month);
  const step=direction==='forward'?1:-1;
  const cycles=Array.from({length:8},(_,i)=>({
    index:i+1,
    pillar:sexagenaryFromIndex(monthIndex+step*(i+1)),
    startAgeYears:Math.round((startAgeYears+i*10)*1_000_000)/1_000_000,
    endAgeYears:Math.round((startAgeYears+(i+1)*10)*1_000_000)/1_000_000,
  }));
  return {direction,startAgeYears,boundaryTerm:boundary.name,boundaryInstant:new Date(boundary.instantMs).toISOString(),method:'three_days_one_year',cycles,warnings:['luck_start_age_uses_three_days_equals_one_year_rule_profile']};
}
