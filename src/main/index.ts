import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, globalShortcut, ipcMain, screen, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { runMigrations } from './db'

let mainWindow: BrowserWindow | null = null

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
    const y = displayY  // Use the display's y offset (accounts for menu bar)
    
    mainWindow!.setPosition(x, y)
    // Don't show automatically - wait for the global shortcut
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
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function toggleWindow(): void {
  if (!mainWindow) return

  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    // Reposition window in case screen configuration changed
    const primaryDisplay = screen.getPrimaryDisplay()
    const { x: displayX, y: displayY, width: screenWidth } = primaryDisplay.workArea
    const [windowWidth] = mainWindow.getSize()

    const x = displayX + screenWidth - windowWidth
    const y = displayY  // Use the display's y offset (accounts for menu bar)

    mainWindow.setPosition(x, y)
    mainWindow.showInactive() // Show without taking focus
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Run database migrations
  await runMigrations();

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

  // Register global shortcut Control+K (or Command+K on macOS)
  const ret = globalShortcut.register('Control+K', () => {
    toggleWindow()
  })

  if (!ret) {
    console.log('Global shortcut registration failed')
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

// Clean up global shortcuts when app is quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
