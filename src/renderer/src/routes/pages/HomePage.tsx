import React from 'react'
import { Link } from 'react-router-dom'

type Settings = Awaited<ReturnType<typeof window.api.settings.get>>

export function HomePage() {
  const [data, setData] = React.useState<Settings>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchSettings() {
      const settings = await window.api.settings.get()
      console.log('Settings fetched:', settings)
      setData(settings)
      setLoading(false)
    }
    fetchSettings()
  }, [])
  return (
    <div className="p-4">
      <div className="font-[450] antialiased font-serif text-2xl">Good morning, Manu.</div>
      <div className="font-[450] antialiased font-serif text-2xl text-f-500">
        What&apos;s on your mind today?
      </div>
      <br />
      <Link to="/settings">Go to settings</Link>
      <br/>
      <br/>
      <pre className='text-sm'>{loading ? 'Loading settings...' : JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
