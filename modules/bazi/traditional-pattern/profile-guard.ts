import type { BaziCalculationMetadata } from "../../../types/domain";
import { ZIPING_RULE_PROFILE_VERSION } from "./constants";

export const RULE_PROFILE_MISMATCH = "RULE_PROFILE_MISMATCH" as const;

export class TraditionalPatternRuleProfileMismatchError extends Error {
  readonly code = RULE_PROFILE_MISMATCH;
  readonly expectedRuleProfile = ZIPING_RULE_PROFILE_VERSION;

  constructor(readonly actualRuleProfile: string) {
    super(
      `Traditional Pattern authority requires ${ZIPING_RULE_PROFILE_VERSION}; received ${actualRuleProfile}`,
    );
    this.name = "TraditionalPatternRuleProfileMismatchError";
  }
}

export function assertZipingRuleProfile(
  metadata: Pick<BaziCalculationMetadata, "rule_profile_version">,
): void {
  if (metadata.rule_profile_version !== ZIPING_RULE_PROFILE_VERSION) {
    throw new TraditionalPatternRuleProfileMismatchError(metadata.rule_profile_version);
  }
}
