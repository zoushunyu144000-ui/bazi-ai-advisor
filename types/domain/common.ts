export type UUID = string;
export type ISODate = string;
export type ISOTime = string;
export type ISODateTime = string;
export type IANATimeZone = string;
export type CurrencyCode = string;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface LocalizedText {
  zhHans: string;
  zhHant?: string;
  en?: string;
}
