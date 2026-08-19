import "server-only";

import type {
  AdvisorRequest,
  AdvisorRequestReleaseReason,
} from "@/types/domain";

import type {
  AdvisorBillingPort,
  ReserveAdvisorRequestInput,
} from "../../modules/ai/contracts";

/**
 * Thin handoff boundary for the future 08/09 atomic billing service.
 * These operations must be backed by trusted server-side RPC/transactions;
 * this adapter deliberately contains no wallet, ledger, or SQL logic.
 */
export interface AdvisorBillingOperations {
  reserve(input: ReserveAdvisorRequestInput): Promise<AdvisorRequest>;
  commit(request: AdvisorRequest, assistantMessageId: string): Promise<AdvisorRequest>;
  release(request: AdvisorRequest, reason: AdvisorRequestReleaseReason): Promise<AdvisorRequest>;
}

export class AdvisorBillingAdapter implements AdvisorBillingPort {
  constructor(private readonly operations: AdvisorBillingOperations) {}

  reserve(input: ReserveAdvisorRequestInput): Promise<AdvisorRequest> {
    return this.operations.reserve(input);
  }

  commit(request: AdvisorRequest, assistantMessageId: string): Promise<AdvisorRequest> {
    return this.operations.commit(request, assistantMessageId);
  }

  release(
    request: AdvisorRequest,
    reason: AdvisorRequestReleaseReason,
  ): Promise<AdvisorRequest> {
    return this.operations.release(request, reason);
  }
}
