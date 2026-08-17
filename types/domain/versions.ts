export interface VersionFields {
  engine_version: string;
  rule_profile_version: string;
  mapping_version: string;
  prompt_version: string;
  report_schema_version: string;
}

export const INITIAL_VERSION_FIELDS: VersionFields = {
  engine_version: "bazi-engine/0.1.0",
  rule_profile_version: "rules/0.1.0",
  mapping_version: "personality-map/0.1.0",
  prompt_version: "prompt/0.1.0",
  report_schema_version: "report-schema/0.1.0",
};
