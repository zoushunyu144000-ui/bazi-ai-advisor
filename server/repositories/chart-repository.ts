import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  BaziCalculationContext,
  BaziCalculationResult,
  BaziChart,
  BaziDerivedFeatures,
  JsonValue,
} from "@/types/domain";

import { mapCalculationContextRow } from "./calculation-persistence-mappers";
import { RepositoryError, throwRepositoryError } from "./errors";
import { mapChartRow, mapDerivedFeatureRow } from "./mappers";
import type { ChartRow, DerivedFeatureRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

function validateCalculationResult(result: BaziCalculationResult): void {
  if (result.derivedFeatures.chartId !== result.chart.id) {
    throw new RepositoryError(
      "validation",
      "Bazi derived features must reference the persisted chart id.",
    );
  }

  if (
    result.derivedFeatures.engine_version !==
      result.calculationMetadata.engine_version ||
    result.derivedFeatures.rule_profile_version !==
      result.calculationMetadata.rule_profile_version
  ) {
    throw new RepositoryError(
      "validation",
      "Bazi calculation metadata and derived feature versions must match.",
    );
  }
}

export class ChartRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async getById(id: string): Promise<BaziChart> {
    const { data, error } = await this.client
      .from("bazi_charts")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "bazi chart");
    return mapChartRow(data as ChartRow);
  }

  async getForBirthProfile(birthProfileId: string): Promise<BaziChart[]> {
    const { data, error } = await this.client
      .from("bazi_charts")
      .select("*")
      .eq("birth_profile_id", birthProfileId)
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false });

    throwRepositoryError(error, "bazi charts");
    return ((data ?? []) as ChartRow[]).map(mapChartRow);
  }

  async getCalculationContextByChartId(
    chartId: string,
  ): Promise<BaziCalculationContext> {
    const { data, error } = await this.client
      .from("bazi_charts")
      .select("*")
      .eq("id", chartId)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "bazi calculation context");
    return mapCalculationContextRow(data as ChartRow);
  }

  async getCalculationResultByChartId(
    chartId: string,
    mappingVersion?: string,
  ): Promise<BaziCalculationResult> {
    const [context, features] = await Promise.all([
      this.getCalculationContextByChartId(chartId),
      this.getCanonicalDerivedFeatures(chartId, mappingVersion),
    ]);

    return {
      ...context,
      derivedFeatures: features,
    };
  }

  async saveCalculationContext(
    context: BaziCalculationContext,
  ): Promise<BaziCalculationContext> {
    const { chart, calculationMetadata, relations, luck } = context;
    const { data, error } = await this.client
      .from("bazi_charts")
      .insert({
        id: chart.id,
        user_id: this.userId,
        birth_profile_id: chart.birthProfileId,
        chart: chart as unknown as JsonValue,
        calculation_metadata: calculationMetadata as unknown as JsonValue,
        relations: relations as unknown as JsonValue,
        luck: luck as unknown as JsonValue,
        engine_version: calculationMetadata.engine_version,
        rule_profile_version: calculationMetadata.rule_profile_version,
      })
      .select("*")
      .single();

    throwRepositoryError(error, "bazi calculation context");
    return mapCalculationContextRow(data as ChartRow);
  }

  async saveCalculationResult(
    result: BaziCalculationResult,
  ): Promise<BaziCalculationResult> {
    validateCalculationResult(result);

    const context = await this.saveCalculationContext(result);
    const derivedFeatures = await this.saveDerivedFeatures(
      result.derivedFeatures,
    );

    return {
      ...context,
      derivedFeatures,
    };
  }

  async getDerivedFeatures(chartId: string): Promise<BaziDerivedFeatures[]> {
    const { data, error } = await this.client
      .from("bazi_derived_features")
      .select("*")
      .eq("chart_id", chartId)
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false });

    throwRepositoryError(error, "bazi derived features");
    return ((data ?? []) as DerivedFeatureRow[]).map(mapDerivedFeatureRow);
  }

  async getCanonicalDerivedFeatures(
    chartId: string,
    mappingVersion?: string,
  ): Promise<BaziDerivedFeatures> {
    let query = this.client
      .from("bazi_derived_features")
      .select("*")
      .eq("chart_id", chartId)
      .eq("user_id", this.userId);

    if (mappingVersion !== undefined) {
      query = query.eq("mapping_version", mappingVersion);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    throwRepositoryError(error, "canonical bazi derived features");

    if (!data) {
      throwRepositoryError(
        { code: "PGRST116", message: "No canonical derived features found." },
        "canonical bazi derived features",
      );
    }

    return mapDerivedFeatureRow(data as DerivedFeatureRow);
  }

  async saveDerivedFeatures(
    features: BaziDerivedFeatures,
  ): Promise<BaziDerivedFeatures> {
    const { data, error } = await this.client
      .from("bazi_derived_features")
      .insert({
        id: features.id,
        user_id: this.userId,
        chart_id: features.chartId,
        features: features as unknown as JsonValue,
        engine_version: features.engine_version,
        rule_profile_version: features.rule_profile_version,
        mapping_version: features.mapping_version,
      })
      .select("*")
      .single();

    throwRepositoryError(error, "bazi derived features");
    return mapDerivedFeatureRow(data as DerivedFeatureRow);
  }
}
