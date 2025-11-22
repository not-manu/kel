import { ElectronAPI } from '@electron-toolkit/preload'
import type { SettingsApi } from './api/settings/schema'
import type { ChatApi } from './api/chat/schema'
import type { MessageApi } from './api/message/schema'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      settings: SettingsApi
      chat: ChatApi
      message: MessageApi
    }
  }
}
