import type { ISODateTime, UUID } from "@/types/domain";

export interface UserProfile {
  userId: UUID;
  displayName?: string;
  avatarUrl?: string;
  countryCode?: string;
  marketingConsent: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
