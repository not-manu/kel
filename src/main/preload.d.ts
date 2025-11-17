import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      settings: {
        get: () => Promise<any>
        update: (data: any) => Promise<any>
      }
    }
  }
}
