import { Link } from 'react-router-dom'
import { useSettings } from '@renderer/hooks/useSettings'

export function HomePage() {
  const { settings, isLoading, error } = useSettings()

  return (
    <div className="p-4">
      <div className="font-[450] antialiased font-serif text-2xl">Good morning, Manu.</div>
      <div className="font-[450] antialiased font-serif text-2xl text-f-500">
        What&apos;s on your mind today?
      </div>
      <br />
      <Link to="/settings">Go to settings</Link>
      <br />
      <br />
      {error && <div className="text-red-500">Error: {error.message}</div>}
      <pre className="text-sm">
        {isLoading ? 'Loading settings...' : JSON.stringify(settings, null, 2)}
      </pre>
    </div>
  )
}
