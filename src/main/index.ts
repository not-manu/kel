import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  screen,
  shell,
  Tray,
  Menu,
  nativeImage
} from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { runMigrations, initializeSettings } from './db'
import { registerAllApis } from './api'
import { setMainWindow } from './api/ai/handlers'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let windowPosition: 'left' | 'right' = 'right' // Start on the right by default
let isQuitting = false

function createWindow(): void {
  // Get the primary display's work area
  const primaryDisplay = screen.getPrimaryDisplay()
  const { height: screenHeight } = primaryDisplay.workAreaSize

  // Window dimensions
  const windowWidth = 375
  const windowHeight = screenHeight

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    show: false,
    frame: false,
    resizable: true,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    minWidth: 375,
    maxWidth: 450,
    autoHideMenuBar: true,
    transparent: true,
    vibrancy: 'sidebar',
    visualEffectState: 'active',
    roundedCorners: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Make window visible on all workspaces/desktops
  if (process.platform === 'darwin') {
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  }

  mainWindow.on('ready-to-show', () => {
    // Position the window now that it's properly sized
    const primaryDisplay = screen.getPrimaryDisplay()
    const { x: displayX, y: displayY, width: screenWidth } = primaryDisplay.workArea
    const [windowWidth] = mainWindow!.getSize()

    const x = displayX + screenWidth - windowWidth
    const y = displayY // Use the display's y offset (accounts for menu bar)

    mainWindow!.setPosition(x, y)
    // Don't show automatically - wait for the global shortcut
  })

  // Prevent the window from closing (e.g., when pressing Cmd+W)
  // Instead, hide it like the global shortcut does
  // But allow closing when the app is quitting
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
      // On macOS, use app.hide() to properly restore focus to the previous application
      if (process.platform === 'darwin') {
        app.hide()
      }
    }
  })

  // Remove blur handler - window will only hide when shortcut is pressed again
  // This matches Raycast behavior where clicking outside doesn't hide the window

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    // Open DevTools in detached mode for easier debugging
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function toggleWindow(): void {
  if (!mainWindow) return

  if (mainWindow.isVisible()) {
    mainWindow.hide()
    // On macOS, use app.hide() to properly restore focus to the previous application
    if (process.platform === 'darwin') {
      app.hide()
    } else {
      // On other platforms, blur the window to return focus to previous application
      mainWindow.blur()
    }
  } else {
    // Reposition window in case screen configuration changed
    const primaryDisplay = screen.getPrimaryDisplay()
    const { x: displayX, y: displayY, width: screenWidth } = primaryDisplay.workArea
    const [windowWidth] = mainWindow.getSize()

    const x = windowPosition === 'right' ? displayX + screenWidth - windowWidth : displayX
    const y = displayY // Use the display's y offset (accounts for menu bar)

    mainWindow.setPosition(x, y)
    mainWindow.show() // Show and take focus
    mainWindow.focus() // Explicitly focus the window
  }
}

function cycleWindowPosition(): void {
  if (!mainWindow) return

  // Cycle the position state
  windowPosition = windowPosition === 'right' ? 'left' : 'right'

  // Reposition the window
  const primaryDisplay = screen.getPrimaryDisplay()
  const { x: displayX, y: displayY, width: screenWidth } = primaryDisplay.workArea
  const [windowWidth] = mainWindow.getSize()

  const x = windowPosition === 'right' ? displayX + screenWidth - windowWidth : displayX
  const y = displayY

  mainWindow.setPosition(x, y)
}

function createTray(): void {
  const iconPath = join(__dirname, '../../resources/dock-icon.png')
  const trayIcon = nativeImage.createFromPath(iconPath)
  const scaledIcon = trayIcon.resize({ width: 20, height: 20 })

  tray = new Tray(scaledIcon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Kel — ' + app.getVersion(),
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: 'Talk to Kel',
      accelerator: 'ctrl+k',
      click: () => {
        toggleWindow()
      }
    },
    {
      label: 'Cycle Window Position',
      accelerator: 'ctrl+j',
      click: () => {
        cycleWindowPosition()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Close Window',
      accelerator: 'cmd+w',
      click: () => {
        if (mainWindow?.isVisible()) {
          mainWindow.hide()
          if (process.platform === 'darwin') {
            app.hide()
          }
        }
      }
    },
    {
      label: 'Quit',
      accelerator: 'cmd+q',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Run database migrations
  await runMigrations()

  // Initialize settings with default values if needed
  await initializeSettings()

  // Register all IPC handlers
  registerAllApis()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  // Pass window reference to handlers
  if (mainWindow) {
    setMainWindow(mainWindow)
  }

  // Create menu bar icon on macOS
  if (process.platform === 'darwin') {
    createTray()
  }

  // Register global shortcut Control+K (or Command+K on macOS)
  const ret = globalShortcut.register('Control+K', () => {
    toggleWindow()
  })

  if (!ret) {
    console.log('Global shortcut registration failed')
  }

  // Register global shortcut Control+L to cycle window position
  const ret2 = globalShortcut.register('Control+J', () => {
    cycleWindowPosition()
  })

  if (!ret2) {
    console.log('Control+L shortcut registration failed')
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Keep the app running in the background even when all windows are closed
// This allows the global shortcut to work at all times
app.on('window-all-closed', () => {
  // Don't quit the app - keep it running in the background for the global shortcut
  // Users can quit via Cmd+Q or the menu
})

// Set flag before quitting to allow window to close
app.on('before-quit', () => {
  isQuitting = true
})

// Clean up global shortcuts when app is quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
