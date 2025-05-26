'use client'

import { useEffect, useState } from 'react'

export default function NetworkDetector() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-red-600 via-[#1a1a1a] to-black flex flex-col items-center justify-center text-white px-6 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20 mb-6 animate-pulse text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 00-12.728 0M15.536 8.464a5 5 0 00-7.072 0M12 15h.01M21 21L3 3" />
      </svg>

      <h1 className="text-3xl font-bold mb-2 drop-shadow">Sei offline</h1>
      <p className="text-gray-300 max-w-md">
        Controlla la tua connessione a Internet per continuare a usare l’applicazione.
      </p>
    </div>
  )
}
