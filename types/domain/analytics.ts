import type { ISODateTime, JsonValue, UUID } from "./common";

export interface AnalyticsEvent {
  id: UUID;
  userId?: UUID;
  anonymousId?: string;
  sessionId?: string;
  name: string;
  properties: Record<string, JsonValue>;
  occurredAt: ISODateTime;
}
