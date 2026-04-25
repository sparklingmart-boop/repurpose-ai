'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-500 text-4xl mb-3 animate-pulse">✦</p>
          <p className="text-white/40 text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-yellow-500 text-lg font-bold">
            ✦ Repurpose AI
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/dashboard" className="btn-ghost text-sm py-1.5">
              ⚡ Generate
            </Link>
            <Link href="/dashboard/history" className="btn-ghost text-sm py-1.5">
              ↺ History
            </Link>
            <button onClick={handleLogout} className="btn-ghost text-sm py-1.5 ml-2">
              → Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  )
}