import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireCurrentUser } from "@/server/auth/auth-service";

import {
  BillingReadRepository,
  TrustedBillingRepository,
} from "./billing-repository";
import { BirthProfileRepository } from "./birth-profile-repository";
import { ChartRepository } from "./chart-repository";
import { ConversationRepository } from "./conversation-repository";
import { MemoryRepository } from "./memory-repository";
import { OrderRepository } from "./order-repository";
import { ProfileRepository } from "./profile-repository";
import { PurchaseRepository } from "./purchase-repository";
import { ReportRepository } from "./report-repository";
import { WalletRepository } from "./wallet-repository";

export {
  BillingReadRepository,
  BirthProfileRepository,
  ChartRepository,
  ConversationRepository,
  MemoryRepository,
  OrderRepository,
  ProfileRepository,
  PurchaseRepository,
  ReportRepository,
  TrustedBillingRepository,
  WalletRepository,
};

export type { UserProfile } from "./models";
export type {
  PaymentProviderEvent,
  RecordProviderEventInput,
  ReserveAdvisorCreditInput,
} from "./billing-repository";

export interface RepositorySet {
  profile: ProfileRepository;
  birthProfiles: BirthProfileRepository;
  charts: ChartRepository;
  reports: ReportRepository;
  conversations: ConversationRepository;
  memories: MemoryRepository;
  wallet: WalletRepository;
  orders: OrderRepository;
  purchases: PurchaseRepository;
  billing: BillingReadRepository;
}

export function createRepositories(
  client: SupabaseClient,
  userId: string,
): RepositorySet {
  return {
    profile: new ProfileRepository(client, userId),
    birthProfiles: new BirthProfileRepository(client, userId),
    charts: new ChartRepository(client, userId),
    reports: new ReportRepository(client, userId),
    conversations: new ConversationRepository(client, userId),
    memories: new MemoryRepository(client, userId),
    wallet: new WalletRepository(client, userId),
    orders: new OrderRepository(client, userId),
    purchases: new PurchaseRepository(client, userId),
    billing: new BillingReadRepository(client, userId),
  };
}

export async function createCurrentUserRepositories(): Promise<{
  userId: string;
  repositories: RepositorySet;
}> {
  const [user, client] = await Promise.all([
    requireCurrentUser(),
    createSupabaseServerClient(),
  ]);

  return {
    userId: user.id,
    repositories: createRepositories(client, user.id),
  };
}

export function createAdminRepositoriesForUser(userId: string): RepositorySet {
  return createRepositories(createSupabaseAdminClient(), userId);
}

export function createTrustedBillingRepository(): TrustedBillingRepository {
  return new TrustedBillingRepository(createSupabaseAdminClient());
}
