import type { BirthProfile, TraditionalRuleSex } from '../../types/domain';
import { partsAtInstant } from '../../modules/bazi/timezone';

let seq=0;
export function profileAtInstant(instantMs:number,timezone='UTC',sex:TraditionalRuleSex='male'):BirthProfile {
  const p=partsAtInstant(instantMs,timezone);
  const pad=(n:number)=>String(n).padStart(2,'0');
  const stamp=new Date(instantMs).toISOString();
  seq+=1;
  return {
    id:`00000000-0000-4000-8000-${String(seq).padStart(12,'0')}`,
    label:'test',calendar:'gregorian',
    birthDate:`${p.year}-${pad(p.month)}-${pad(p.day)}`,
    birthTime:`${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`,
    birthTimePrecision:'exact',timezone,sexForTraditionalRules:sex,
    createdAt:stamp,updatedAt:'2026-08-18T00:00:00.000Z',
  };
}
