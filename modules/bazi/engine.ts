import type { BaziCalculationMetadata, BaziChart, BirthProfile, StemBranchRef } from '../../types/domain';
import { ENGINE_VERSION, RULE_PROFILE_VERSION } from './constants';
import { dayPillarForCivilDate, solarTermInstantMs } from './adapters/tyme4ts-adapter';
import { deriveFeatures } from './derived';
import { deterministicUuid } from './id';
import { calculateLuckStructure } from './luck';
import { calculateRelations } from './relations';
import { elementOf, hourPillar, monthPillarFromOffset, pillarFromRef, polarityOf, yearPillarFromLiChunYear } from './rules';
import { resolveBirthInstant } from './timezone';
import type { BaziEngineResult } from './types';

const MONTH_JIE:[number,number][]=[[3,0],[5,1],[7,2],[9,3],[11,4],[13,5],[15,6],[17,7],[19,8],[21,9],[23,10]];

function baziYearAt(instantMs:number,civilYear:number):number {
  return instantMs>=solarTermInstantMs(civilYear,3)?civilYear:civilYear-1;
}

function monthOffsetAt(instantMs:number,baziYear:number):number {
  if(instantMs>=solarTermInstantMs(baziYear+1,1)) return 11;
  for(let i=MONTH_JIE.length-1;i>=0;i--) {
    const [termIndex,offset]=MONTH_JIE[i];
    if(instantMs>=solarTermInstantMs(baziYear,termIndex)) return offset;
  }
  throw new Error(`Unable to resolve BaZi month for year ${baziYear}`);
}

function canonicalInput(profile:BirthProfile):string {
  return JSON.stringify({
    id:profile.id,calendar:profile.calendar,birthDate:profile.birthDate,birthTime:profile.birthTime,
    birthTimePrecision:profile.birthTimePrecision,timezone:profile.timezone,sexForTraditionalRules:profile.sexForTraditionalRules,
    engine_version:ENGINE_VERSION,rule_profile_version:RULE_PROFILE_VERSION,
  });
}

export function calculateBazi(profile:BirthProfile):BaziEngineResult {
  const resolved=resolveBirthInstant(profile);
  const {year,month,day,hour}=resolved.local;
  const baziYear=baziYearAt(resolved.instantMs,year);
  const yearRef=yearPillarFromLiChunYear(baziYear);
  const monthRef=monthPillarFromOffset(yearRef.stem,monthOffsetAt(resolved.instantMs,baziYear));
  const dayRef=dayPillarForCivilDate(year,month,day);
  const hourRef:StemBranchRef|null=resolved.birthTimeKnown?hourPillar(dayRef.stem,hour):null;
  const chartId=deterministicUuid(`chart|${canonicalInput(profile)}`);
  const calculatedAt=profile.updatedAt;
  const chart:BaziChart={
    id:chartId,birthProfileId:profile.id,
    pillars:{
      year:pillarFromRef(yearRef,dayRef.stem),month:pillarFromRef(monthRef,dayRef.stem),day:pillarFromRef(dayRef,dayRef.stem),
      hour:hourRef?pillarFromRef(hourRef,dayRef.stem):null,
    },
    dayMaster:{stem:dayRef.stem,element:elementOf(dayRef.stem),polarity:polarityOf(dayRef.stem)},calculatedAt,
  };
  const relations=calculateRelations(chart);
  const timeQuality=resolved.birthTimeKnown ? profile.birthTimePrecision : 'unknown';
  const derivedFeatures=deriveFeatures(chart,relations,calculatedAt,timeQuality);
  derivedFeatures.id=deterministicUuid(`derived|${chartId}|${derivedFeatures.mapping_version}`);
  const calculationMetadata:BaziCalculationMetadata={
    engine_version:ENGINE_VERSION,rule_profile_version:RULE_PROFILE_VERSION,sourceTimezone:profile.timezone,
    calendarConversion:'gregorian_to_solar_terms',birthTimeWasKnown:resolved.birthTimeKnown,calculatedAt,
    warnings:[...resolved.warnings,'civil_time_rule_profile_no_true_solar_time_correction','late_zi_hour_uses_same_civil_day'],
  };
  return {
    engine_version:ENGINE_VERSION,rule_profile_version:RULE_PROFILE_VERSION,chart,calculationMetadata,derivedFeatures,relations,
    luck:calculateLuckStructure(chart,profile,resolved.instantMs),
  };
}
