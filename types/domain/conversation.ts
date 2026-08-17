import type { ISODateTime, JsonValue, UUID } from "./common";

export type ConversationStatus = "active" | "archived";
export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Conversation {
  id: UUID;
  userId: UUID;
  reportId?: UUID;
  title?: string;
  status: ConversationStatus;
  modelProvider?: string;
  modelName?: string;
  prompt_version: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ConversationMessage {
  id: UUID;
  conversationId: UUID;
  userId: UUID;
  role: MessageRole;
  content: string;
  structuredPayload?: JsonValue;
  prompt_version?: string;
  creditCost: number;
  createdAt: ISODateTime;
}
