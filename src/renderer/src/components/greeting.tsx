import { useFolders } from '@renderer/hooks/use-folders'
import { useSettings } from '@renderer/hooks/use-settings'
import { useEffect, useState } from 'react'

function getMessage() {
  const hours = new Date().getHours()
  if (hours < 4) {
    return 'Happy late night'
  } else if (hours < 12) {
    return 'Good morning'
  } else if (hours < 18) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

const lines = ["What's on your mind today?", 'How can I assist you?', "Let's make something great!"]

export function Greeting() {
  const { settings } = useSettings()
  const { folders } = useFolders()
  const [greeting, setGreeting] = useState<string>('')
  const [randomLine, setRandomLine] = useState<string>('')

  useEffect(() => {
    setGreeting(getMessage())
    setRandomLine(lines[Math.floor(Math.random() * lines.length)])
  }, [])

  return (
    <div>
      <div className="font-[450] antialiased font-serif text-2xl">
        {greeting}, {settings?.preferredName || 'User'}.
      </div>
      <div className="font-[450] antialiased font-serif text-2xl text-f-500">{randomLine}</div>
      <br />
      <br />
      <div className="text-xs text-f-300 font-[400] mb-3">Recents</div>
      <pre>{JSON.stringify(folders, null, 2)}</pre>
    </div>
  )
}
