import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Conversation,
  ConversationMessage,
  ConversationStatus,
  JsonValue,
  MessageRole,
} from "@/types/domain";

import { throwRepositoryError } from "./errors";
import { mapConversationRow, mapMessageRow } from "./mappers";
import type { ConversationRow, MessageRow } from "./rows";
import { ScopedRepository } from "./scoped-repository";

export interface CreateConversationInput {
  reportId?: string;
  title?: string;
  promptVersion: string;
  modelProvider?: string;
  modelName?: string;
}

export interface AppendUserMessageInput {
  conversationId: string;
  content: string;
  structuredPayload?: JsonValue;
}

export interface AppendServiceMessageInput {
  conversationId: string;
  role: Exclude<MessageRole, "user">;
  content: string;
  structuredPayload?: JsonValue;
  promptVersion?: string;
  modelProvider?: string;
  modelName?: string;
  creditCost?: number;
}

export class ConversationRepository extends ScopedRepository {
  constructor(client: SupabaseClient, userId: string) {
    super(client, userId);
  }

  async list(): Promise<Conversation[]> {
    const { data, error } = await this.client
      .from("conversations")
      .select("*")
      .eq("user_id", this.userId)
      .order("updated_at", { ascending: false });

    throwRepositoryError(error, "conversations");
    return ((data ?? []) as ConversationRow[]).map(mapConversationRow);
  }

  async getById(id: string): Promise<Conversation> {
    const { data, error } = await this.client
      .from("conversations")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    throwRepositoryError(error, "conversation");
    return mapConversationRow(data as ConversationRow);
  }

  async create(input: CreateConversationInput): Promise<Conversation> {
    const { data, error } = await this.client
      .from("conversations")
      .insert({
        user_id: this.userId,
        report_id: input.reportId ?? null,
        title: input.title ?? null,
        prompt_version: input.promptVersion,
        model_provider: input.modelProvider ?? null,
        model_name: input.modelName ?? null,
      })
      .select("*")
      .single();

    throwRepositoryError(error, "conversation");
    return mapConversationRow(data as ConversationRow);
  }

  async updateStatus(
    id: string,
    status: ConversationStatus,
  ): Promise<Conversation> {
    const { data, error } = await this.client
      .from("conversations")
      .update({ status })
      .eq("id", id)
      .eq("user_id", this.userId)
      .select("*")
      .single();

    throwRepositoryError(error, "conversation");
    return mapConversationRow(data as ConversationRow);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client
      .from("conversations")
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);

    throwRepositoryError(error, "conversation");
  }

  async listMessages(conversationId: string): Promise<ConversationMessage[]> {
    const { data, error } = await this.client
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("user_id", this.userId)
      .order("created_at", { ascending: true });

    throwRepositoryError(error, "messages");
    return ((data ?? []) as MessageRow[]).map(mapMessageRow);
  }

  async appendUserMessage(
    input: AppendUserMessageInput,
  ): Promise<ConversationMessage> {
    const { data, error } = await this.client
      .from("messages")
      .insert({
        conversation_id: input.conversationId,
        user_id: this.userId,
        role: "user",
        content: input.content,
        structured_payload: input.structuredPayload ?? null,
        credit_cost: 0,
      })
      .select("*")
      .single();

    throwRepositoryError(error, "message");
    return mapMessageRow(data as MessageRow);
  }

  async appendServiceMessage(
    input: AppendServiceMessageInput,
  ): Promise<ConversationMessage> {
    const creditCost = input.creditCost ?? 0;

    if (!Number.isInteger(creditCost) || creditCost < 0) {
      throw new Error("creditCost must be a non-negative integer.");
    }

    const { data, error } = await this.client
      .from("messages")
      .insert({
        conversation_id: input.conversationId,
        user_id: this.userId,
        role: input.role,
        content: input.content,
        structured_payload: input.structuredPayload ?? null,
        prompt_version: input.promptVersion ?? null,
        model_provider: input.modelProvider ?? null,
        model_name: input.modelName ?? null,
        credit_cost: creditCost,
      })
      .select("*")
      .single();

    throwRepositoryError(error, "message");
    return mapMessageRow(data as MessageRow);
  }
}
