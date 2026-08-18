import type { SupabaseClient } from "@supabase/supabase-js";

import type { JsonValue, UserMemory, UserMemoryKind } from "@/types/domain";

import { throwRepositoryError } from "./errors";
import { mapMemoryRow } from "./mappers";
import type { MemoryRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

export interface CreateMemoryInput {
  conversationId?: string;
  sourceMessageId?: string;
  key: string;
  kind: UserMemoryKind;
  value: JsonValue;
  confidence?: number;
  userEditable?: boolean;
}

export interface UpdateMemoryInput {
  value?: JsonValue;
  confidence?: number;
  active?: boolean;
}

function validateConfidence(confidence: number): void {
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new Error("Memory confidence must be between 0 and 1.");
  }
}

export class MemoryRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async listActive(): Promise<UserMemory[]> {
    const { data, error } = await this.client
      .from("user_memories")
      .select("*")
      .eq("user_id", this.userId)
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    throwRepositoryError(error, "user memories");
    return ((data ?? []) as MemoryRow[]).map(mapMemoryRow);
  }

  async getById(id: string): Promise<UserMemory> {
    const { data, error } = await this.client
      .from("user_memories")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "user memory");
    return mapMemoryRow(data as MemoryRow);
  }

  async create(input: CreateMemoryInput): Promise<UserMemory> {
    const confidence = input.confidence ?? 1;
    validateConfidence(confidence);

    const { data, error } = await this.client
      .from("user_memories")
      .insert({
        user_id: this.userId,
        conversation_id: input.conversationId ?? null,
        source_message_id: input.sourceMessageId ?? null,
        memory_key: input.key,
        memory_type: input.kind,
        value: input.value,
        confidence,
        is_user_editable: input.userEditable ?? true,
      })
      .select("*")
      .single();

    throwRepositoryError(error, "user memory");
    return mapMemoryRow(data as MemoryRow);
  }

  async update(id: string, input: UpdateMemoryInput): Promise<UserMemory> {
    const patch: Record<string, unknown> = {};

    if (input.value !== undefined) patch.value = input.value;
    if (input.confidence !== undefined) {
      validateConfidence(input.confidence);
      patch.confidence = input.confidence;
    }
    if (input.active !== undefined) patch.is_active = input.active;

    const { data, error } = await this.client
      .from("user_memories")
      .update(patch)
      .eq("id", id)
      .eq("user_id", this.userId)
      .select("*")
      .single();

    throwRepositoryError(error, "user memory");
    return mapMemoryRow(data as MemoryRow);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client
      .from("user_memories")
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);

    throwRepositoryError(error, "user memory");
  }
}
