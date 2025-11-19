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
  const [greeting, setGreeting] = useState<string>('')
  const [randomLine, setRandomLine] = useState<string>('')

  useEffect(() => {
    setGreeting(getMessage())
    setRandomLine(lines[Math.floor(Math.random() * lines.length)])
  }, [])

  return (
    <div>
      <div className="h-32"></div>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          {' '}
          <path
            d="M5 3h14v2H5V3zm0 16H3V5h2v14zm14 0v2H5v-2h14zm0 0h2V5h-2v14zM10 8H8v2h2V8zm4 0h2v2h-2V8zm-5 6v-2H7v2h2zm6 0v2H9v-2h6zm0 0h2v-2h-2v2z"
            fill="currentColor"
          />{' '}
        </svg>
      </div>
      <div className="h-6"></div>
      <div className="font-[450] antialiased font-serif text-2xl">
        {greeting}, {settings?.preferredName || 'User'}.
      </div>
      <div className="font-[450] antialiased font-serif text-2xl text-f-500">{randomLine}</div>
    </div>
  )
}
