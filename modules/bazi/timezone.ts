import type { BirthProfile } from '../../types/domain';
import type { ResolvedBirthInstant } from './types';

type Parts = { year:number; month:number; day:number; hour:number; minute:number; second:number };

function parseDate(date: string): Pick<Parts,'year'|'month'|'day'> {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) throw new Error(`Invalid ISO birthDate: ${date}`);
  const year=Number(m[1]), month=Number(m[2]), day=Number(m[3]);
  const probe = new Date(Date.UTC(year,month-1,day));
  if (probe.getUTCFullYear()!==year || probe.getUTCMonth()!==month-1 || probe.getUTCDate()!==day) throw new Error(`Invalid calendar date: ${date}`);
  return {year,month,day};
}

function parseTime(time: string): Pick<Parts,'hour'|'minute'|'second'> {
  const m = /^(\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/.exec(time);
  if (!m) throw new Error(`Invalid ISO birthTime: ${time}`);
  const hour=Number(m[1]), minute=Number(m[2]), second=Number(m[3] ?? '0');
  if (hour>23 || minute>59 || second>59) throw new Error(`Invalid clock time: ${time}`);
  return {hour,minute,second};
}

const formatterCache = new Map<string,Intl.DateTimeFormat>();
function formatter(timeZone:string): Intl.DateTimeFormat {
  let f=formatterCache.get(timeZone);
  if (!f) {
    f=new Intl.DateTimeFormat('en-CA',{timeZone,calendar:'gregory',numberingSystem:'latn',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
    formatterCache.set(timeZone,f);
  }
  return f;
}

export function partsAtInstant(epochMs:number,timeZone:string):Parts {
  const out:Partial<Parts>={};
  for (const p of formatter(timeZone).formatToParts(new Date(epochMs))) {
    if (p.type==='year'||p.type==='month'||p.type==='day'||p.type==='hour'||p.type==='minute'||p.type==='second') out[p.type]=Number(p.value);
  }
  if (Object.values(out).some(v=>v===undefined)) throw new Error(`Unable to resolve timezone ${timeZone}`);
  return out as Parts;
}

function pseudoUtc(p:Parts):number { return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second); }
function sameParts(a:Parts,b:Parts):boolean { return a.year===b.year&&a.month===b.month&&a.day===b.day&&a.hour===b.hour&&a.minute===b.minute&&a.second===b.second; }

export function localPartsToInstant(local:Parts,timeZone:string):{instantMs:number;ambiguous:boolean} {
  formatter(timeZone);
  const target = pseudoUtc(local);
  const offsets = new Set<number>();
  for (const delta of [-36,-24,-12,0,12,24,36]) {
    const probe = target + delta*3600_000;
    offsets.add(pseudoUtc(partsAtInstant(probe,timeZone)) - probe);
  }
  const matches:number[]=[];
  for (const offset of offsets) {
    const candidate=target-offset;
    if (sameParts(partsAtInstant(candidate,timeZone),local)) matches.push(candidate);
  }
  const unique=[...new Set(matches)].sort((a,b)=>a-b);
  if (unique.length===0) throw new Error(`Local time ${local.year}-${local.month}-${local.day} ${local.hour}:${local.minute}:${local.second} does not exist in ${timeZone}`);
  return {instantMs:unique[0],ambiguous:unique.length>1};
}

export function resolveBirthInstant(profile:BirthProfile):ResolvedBirthInstant {
  if (profile.calendar!=='gregorian') throw new Error(`Unsupported calendar: ${profile.calendar}`);
  const date=parseDate(profile.birthDate);
  const warnings:string[]=[];
  let time:Pick<Parts,'hour'|'minute'|'second'>;
  const known=profile.birthTime!==null && profile.birthTimePrecision!=='unknown';
  if (profile.birthTime===null || profile.birthTimePrecision==='unknown') {
    time={hour:12,minute:0,second:0};
    warnings.push('birth_time_unknown_assumed_local_noon_for_year_month_day_boundaries');
  } else {
    time=parseTime(profile.birthTime);
    if (profile.birthTimePrecision==='approximate') warnings.push('birth_time_approximate_treated_as_supplied_civil_time');
  }
  const local={...date,...time};
  const resolved=localPartsToInstant(local,profile.timezone);
  if (resolved.ambiguous) warnings.push('ambiguous_local_time_resolved_to_earlier_instant');
  return {instantMs:resolved.instantMs,local,warnings,birthTimeKnown:known};
}
