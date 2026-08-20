import type { BaziCalculationResult, BirthProfile } from "@/types/domain";
import type { ArchetypeCandidate, InterpretationResult } from "@/modules/interpretation";
import type { CharacterGender } from "@/lib/public-personalities";

export const PUBLIC_RESULT_STORAGE_KEY = "bazi:public-result:v1";
export const PUBLIC_RESULT_SCHEMA_VERSION = "public-result/1.0.0";

export interface PublicResultBundle {
  schemaVersion: string;
  createdAt: string;
  profile: BirthProfile;
  characterGender: CharacterGender;
  calculation: BaziCalculationResult;
  interpretation: InterpretationResult;
  archetype: ArchetypeCandidate;
  normalization: {
    locationProvider: string;
    timezoneResolver: string;
    warnings: string[];
  };
}

export function savePublicResult(bundle: PublicResultBundle): void {
  window.sessionStorage.setItem(PUBLIC_RESULT_STORAGE_KEY, JSON.stringify(bundle));
}

export function loadPublicResult(): PublicResultBundle | null {
  const raw = window.sessionStorage.getItem(PUBLIC_RESULT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PublicResultBundle;
    if (parsed.schemaVersion !== PUBLIC_RESULT_SCHEMA_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}
