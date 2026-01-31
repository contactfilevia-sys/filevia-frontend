'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setStatus('online')
        } else {
          setStatus('offline')
        }
      } catch {
        setStatus('offline')
      }
    }

    checkBackend()
    const interval = setInterval(checkBackend, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Checking backend...</span>
      </div>
    )
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center space-x-2 text-xs text-red-600">
        <XCircle className="w-3 h-3" />
        <span>Backend offline</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-xs text-green-600">
      <CheckCircle2 className="w-3 h-3" />
      <span>Backend online</span>
    </div>
  )
}
