import { registerSettingsApi, SettingsApi } from './settings'

export function registerAllApis() {
  console.log('Registering all APIs...')
  registerSettingsApi()
  console.log('All APIs registered')
  // Add more API registrations here as you create them
  // registerUsersApi()
  // registerOtherApi()
}

// Unified API namespace for type-safe access
export namespace Api {
  export import settings = SettingsApi.client
  // Add more API clients here as you create them
  // export import users = UsersApi.client
}

// Export type for use in preload/renderer
export type ApiClient = typeof Api
