import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import type { SettingsApi } from './api/settings/schema'
import type { ChatApi } from './api/chat/schema'
import type { MessageApi } from './api/message/schema'

const settingsApi: SettingsApi = {
  get: () => ipcRenderer.invoke('settings:get'),
  update: (data) => ipcRenderer.invoke('settings:update', data)
}

const chatApi: ChatApi = {
  list: () => ipcRenderer.invoke('chat:list'),
  create: (data) => ipcRenderer.invoke('chat:create', data),
  update: (id, data) => ipcRenderer.invoke('chat:update', id, data),
  delete: (id) => ipcRenderer.invoke('chat:delete', id),
  get: (id) => ipcRenderer.invoke('chat:get', id)
}

const messageApi: MessageApi = {
  listByChatId: (chatId) => ipcRenderer.invoke('message:listByChatId', chatId),
  create: (data) => ipcRenderer.invoke('message:create', data),
  delete: (id) => ipcRenderer.invoke('message:delete', id)
}

const api = {
  settings: settingsApi,
  chat: chatApi,
  message: messageApi
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
