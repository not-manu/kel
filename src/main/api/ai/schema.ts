export const SupportedModels = ['anthropic/claude-sonnet-4.5', 'anthropic/claude-haiku-4.5'] as const
export type SupportedModel = (typeof SupportedModels)[number]