import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Define the settings API directly in preload to avoid importing main process code
const settingsApi = {
  get: () => ipcRenderer.invoke('settings:get'),
  update: (data: any) => ipcRenderer.invoke('settings:update', data)
}

const api = {
  settings: settingsApi
}

export function exposeApi() {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } else {
    // @ts-ignore
    window.electron = electronAPI
    // @ts-ignore
    window.api = api
  }
}
