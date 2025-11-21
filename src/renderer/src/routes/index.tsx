import { createHashRouter } from 'react-router-dom'
import { RootLayout } from './layouts/root-layout'
import { HomePage } from './pages/home-page'
import { SettingsPage } from './pages/settings-page'
import { ChatPage } from './pages/chat-page'

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: '/chat/:id',
        element: <ChatPage />
      },
      {
        path: '/settings',
        element: <SettingsPage />
      }
    ]
  }
])
