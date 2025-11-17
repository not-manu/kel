import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { createSettingsApi } from './api/settings'

const api = {
  settings: createSettingsApi(ipcRenderer)
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
