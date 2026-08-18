import type { SupabaseClient } from "@supabase/supabase-js";

import type { JsonValue, Report, ReportStatus } from "@/types/domain";

import { throwRepositoryError } from "./errors";
import { mapReportRow } from "./mappers";
import type { ReportRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

export type CreateReportInput = Omit<
  Report,
  "id" | "userId" | "createdAt" | "updatedAt"
> & {
  title?: string;
};

export class ReportRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async list(): Promise<Report[]> {
    const { data, error } = await this.client
      .from("reports")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false });

    throwRepositoryError(error, "reports");
    return ((data ?? []) as ReportRow[]).map(mapReportRow);
  }

  async getById(id: string): Promise<Report> {
    const { data, error } = await this.client
      .from("reports")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "report");
    return mapReportRow(data as ReportRow);
  }

  async create(input: CreateReportInput): Promise<Report> {
    const { data, error } = await this.client
      .from("reports")
      .insert({
        user_id: this.userId,
        chart_id: input.chartId,
        derived_features_id: input.derivedFeaturesId,
        tier: input.tier,
        status: input.status,
        title: input.title ?? null,
        personality_profile: input.personalityProfile as unknown as JsonValue,
        content: input.sections as unknown as JsonValue,
        engine_version: input.engine_version,
        rule_profile_version: input.rule_profile_version,
        mapping_version: input.mapping_version,
        prompt_version: input.prompt_version,
        report_schema_version: input.report_schema_version,
      })
      .select("*")
      .single();

    throwRepositoryError(error, "report");
    return mapReportRow(data as ReportRow);
  }

  async updateStatus(id: string, status: ReportStatus): Promise<Report> {
    const { data, error } = await this.client
      .from("reports")
      .update({ status })
      .eq("id", id)
      .eq("user_id", this.userId)
      .select("*")
      .single();

    throwRepositoryError(error, "report");
    return mapReportRow(data as ReportRow);
  }
}
