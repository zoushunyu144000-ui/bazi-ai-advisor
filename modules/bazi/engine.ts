import type {
  BaziCalculationContext,
  BaziCalculationMetadata,
  BaziCalculationResult,
  BaziChart,
  BirthProfile,
  HeavenlyStem,
  StemBranchRef,
} from '../../types/domain';
import { ENGINE_VERSION, RULE_PROFILE_VERSION } from './constants';
import { dayPillarForCivilDate, solarTermInstantMs } from './adapters/tyme4ts-adapter';
import { deriveFeatures } from './derived';
import { deterministicUuid } from './id';
import { calculateLuckStructure } from './luck';
import { calculateRelations } from './relations';
import { elementOf, hourPillar, monthPillarFromOffset, pillarFromRef, polarityOf, yearPillarFromLiChunYear } from './rules';
import { ZIPING_RULE_PROFILE_VERSION } from './traditional-pattern/constants';
import { resolveBirthInstant } from './timezone';

const MONTH_JIE:[number,number][]=[[3,0],[5,1],[7,2],[9,3],[11,4],[13,5],[15,6],[17,7],[19,8],[21,9],[23,10]];

type SupportedRuleProfile =
  | typeof RULE_PROFILE_VERSION
  | typeof ZIPING_RULE_PROFILE_VERSION;

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

function canonicalInput(profile:BirthProfile,ruleProfileVersion:SupportedRuleProfile):string {
  return JSON.stringify({
    id:profile.id,calendar:profile.calendar,birthDate:profile.birthDate,birthTime:profile.birthTime,
    birthTimePrecision:profile.birthTimePrecision,timezone:profile.timezone,
    resolvedBirthInstant:profile.resolvedBirthInstant,utcOffsetMinutesAtBirth:profile.utcOffsetMinutesAtBirth,
    sexForTraditionalRules:profile.sexForTraditionalRules,
    engine_version:ENGINE_VERSION,rule_profile_version:ruleProfileVersion,
  });
}

function nextCivilDate(year:number,month:number,day:number):{year:number;month:number;day:number} {
  const next=new Date(Date.UTC(year,month-1,day)+86_400_000);
  return {
    year:next.getUTCFullYear(),
    month:next.getUTCMonth()+1,
    day:next.getUTCDate(),
  };
}

function hourStemEffectiveDayStem(
  ruleProfileVersion:SupportedRuleProfile,
  local:{year:number;month:number;day:number;hour:number},
  currentCivilDayStem:HeavenlyStem,
):HeavenlyStem {
  if(ruleProfileVersion!==ZIPING_RULE_PROFILE_VERSION || local.hour!==23) {
    return currentCivilDayStem;
  }

  const next=nextCivilDate(local.year,local.month,local.day);
  return dayPillarForCivilDate(next.year,next.month,next.day).stem;
}

function hourPillarForProfile(
  ruleProfileVersion:SupportedRuleProfile,
  local:{year:number;month:number;day:number;hour:number},
  currentCivilDayStem:HeavenlyStem,
  birthTimeKnown:boolean,
):StemBranchRef|null {
  if(!birthTimeKnown) return null;
  const effectiveDayStem=hourStemEffectiveDayStem(
    ruleProfileVersion,
    local,
    currentCivilDayStem,
  );
  return hourPillar(effectiveDayStem,local.hour);
}

function profileWarnings(
  ruleProfileVersion:SupportedRuleProfile,
  birthTimeKnown:boolean,
  hour:number,
):string[] {
  if(ruleProfileVersion===RULE_PROFILE_VERSION) {
    return [
      'civil_time_rule_profile_no_true_solar_time_correction',
      'late_zi_hour_uses_same_civil_day',
    ];
  }

  const warnings=[
    'civil_time_rule_profile_no_true_solar_time_correction',
    'late_zi_night_zi_split_hour_stem_effective_day',
  ];
  if(birthTimeKnown && (hour===23 || hour===0)) {
    warnings.push('school_sensitivity_late_zi');
  }
  return warnings;
}

function calculateBaziForProfile(
  profile:BirthProfile,
  ruleProfileVersion:SupportedRuleProfile,
):BaziCalculationResult {
  const resolved=resolveBirthInstant(profile);
  const {year,month,day,hour}=resolved.local;
  const baziYear=baziYearAt(resolved.instantMs,year);
  const yearRef=yearPillarFromLiChunYear(baziYear);
  const monthRef=monthPillarFromOffset(yearRef.stem,monthOffsetAt(resolved.instantMs,baziYear));
  const dayRef=dayPillarForCivilDate(year,month,day);
  const hourRef=hourPillarForProfile(
    ruleProfileVersion,
    {year,month,day,hour},
    dayRef.stem,
    resolved.birthTimeKnown,
  );
  const chartId=deterministicUuid(`chart|${canonicalInput(profile,ruleProfileVersion)}`);
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
  const derivedFeatures=deriveFeatures(
    chart,
    relations,
    calculatedAt,
    timeQuality,
    ruleProfileVersion,
  );
  derivedFeatures.id=deterministicUuid(`derived|${chartId}|${derivedFeatures.mapping_version}`);
  const calculationMetadata:BaziCalculationMetadata={
    engine_version:ENGINE_VERSION,rule_profile_version:ruleProfileVersion,sourceTimezone:profile.timezone,
    calendarConversion:'gregorian_to_solar_terms',birthTimeWasKnown:resolved.birthTimeKnown,calculatedAt,
    warnings:[
      ...resolved.warnings,
      ...profileWarnings(ruleProfileVersion,resolved.birthTimeKnown,hour),
    ],
  };
  const context:BaziCalculationContext={
    chart,
    calculationMetadata,
    relations,
    luck:calculateLuckStructure(chart,profile,resolved.instantMs),
  };
  return {...context,derivedFeatures};
}

/**
 * Legacy compatibility calculation. Its rule-profile identity and late-Zi
 * semantics remain civil-local-jieqi-v1 until explicit retirement.
 */
export function calculateBazi(profile:BirthProfile):BaziCalculationResult {
  return calculateBaziForProfile(profile,RULE_PROFILE_VERSION);
}

/**
 * Versioned ziping-v1.0.0 calendar path.
 *
 * This establishes the frozen calendar/profile prerequisite only. It does not
 * by itself produce a TraditionalPatternResult.
 */
export function calculateBaziZipingV1(profile:BirthProfile):BaziCalculationResult {
  return calculateBaziForProfile(profile,ZIPING_RULE_PROFILE_VERSION);
}
