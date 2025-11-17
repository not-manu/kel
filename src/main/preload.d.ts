import { ElectronAPI } from '@electron-toolkit/preload'
import type { SettingsApi } from './api/settings'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      settings: SettingsApi
    }
  }
}
