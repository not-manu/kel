import { registerSettingsHandlers } from './settings/handlers'
import { registerFoldersApi } from './folders'
import { registerChatApi } from './chat'
import { registerMessageApi } from './message'

export function registerAllApis() {
  registerSettingsHandlers()
  registerFoldersApi()
  registerChatApi()
  registerMessageApi()
}

// Re-export schemas for type-safe imports (safe for client-side)
export * from './settings/schema'
