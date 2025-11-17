import { Outlet } from 'react-router-dom'
import { motion, useAnimate } from 'motion/react'
import { useEffect } from 'react'

export function RootLayout() {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    // Initial animation on mount
    animate(scope.current, { x: 0, opacity: 1 }, { duration: 0.2 })

    // Listen for window visibility changes
    const handleShowing = () => {
      animate(scope.current, { x: 0, opacity: 1 }, { duration: 0.2 })
    }

    const handleHiding = () => {
      animate(scope.current, { x: 50, opacity: 0.8 }, { duration: 0.05 })
    }

    window.api.onWindowShowing(handleShowing)
    window.api.onWindowHiding(handleHiding)
  }, [animate, scope])

  return (
    <motion.div
      ref={scope}
      initial={{ x: 50, opacity: 0.8 }}
      className="p-4 bg-background text-foreground h-[100vh] border-l border-f-900"
    >
      <Outlet />
    </motion.div>
  )
}
