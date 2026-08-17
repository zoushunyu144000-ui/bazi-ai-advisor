// Boundary: provider adapter and report/advisor generation orchestration. Prompts are intentionally not implemented in foundation.
export interface AIProviderDescriptor {
  provider: string;
  model: string;
  gatewayUrl?: string;
}
