import type { ISODateTime, JsonValue, UUID } from "./common";

export type UserMemoryKind = "preference" | "goal" | "constraint" | "fact" | "advisor_note";

export interface UserMemory {
  id: UUID;
  userId: UUID;
  conversationId?: UUID;
  sourceMessageId?: UUID;
  key: string;
  kind: UserMemoryKind;
  value: JsonValue;
  confidence: number;
  userEditable: boolean;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
