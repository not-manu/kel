import { ElectronAPI } from '@electron-toolkit/preload'
import type { SettingsApi } from './api/settings'
import type { FoldersApi } from './api/folders'
import type { ChatApi } from './api/chat'
import type { MessageApi } from './api/message'
import type { AiApi } from './api/ai'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      settings: SettingsApi
      folders: FoldersApi
      chat: ChatApi
      message: MessageApi
      ai: AiApi
    }
  }
}
