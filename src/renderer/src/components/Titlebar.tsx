import { useTitlebar } from '@renderer/hooks/use-titlebar'
import { ArrowLeft, ArrowRight, CogIcon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function Titlebar() {
  const { title } = useTitlebar()
  const navigate = useNavigate()
  const location = useLocation()
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  useEffect(() => {
    // Check if we can navigate back/forward using the history state
    // In a hash router, we can check if there's history
    const canGoBack = window.history.length > 1
    setCanGoBack(canGoBack)

    // Note: Browser API doesn't expose forward history state directly
    // For a more complete implementation, you'd need to track this in state management
    setCanGoForward(false)
  }, [location])

  const handleBack = () => {
    navigate(-1)
  }

  const handleForward = () => {
    navigate(1)
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <div>
      <div className="h-7 flex items-center justify-center text-xs font-[450] text-f-500 gap-2 relative">
        <div className="absolute left-1.5 flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            tabIndex={-1}
            className="hover:bg-f-850 group rounded p-0.5 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:text-f-300" />
          </button>
          <button
            onClick={handleForward}
            disabled={!canGoForward}
            tabIndex={-1}
            className="hover:bg-f-850 group rounded p-0.5 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Go forward"
          >
            <ArrowRight className="w-3.5 h-3.5 group-hover:text-f-300" />
          </button>
        </div>
        {title}
        <div className="absolute right-1 p-0.5 hover:bg-f-850 group rounded">
          <button
            onClick={handleSettings}
            tabIndex={-1}
            className="group-hover:text-f-300 flex"
            aria-label="Settings"
          >
            <CogIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
