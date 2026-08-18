import type { ISODateTime, JsonValue, ProductCode, UUID } from "@/types/domain";

export interface UserProfile {
  userId: UUID;
  displayName?: string;
  avatarUrl?: string;
  countryCode?: string;
  marketingConsent: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface Purchase {
  id: UUID;
  userId: UUID;
  orderId: UUID;
  productCode: ProductCode;
  quantity: number;
  currency: string;
  unitAmountMinor: number;
  entitlement: JsonValue;
  createdAt: ISODateTime;
}
