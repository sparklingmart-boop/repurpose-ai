'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [time, setTime] = useState('')

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-yellow-500/40 animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <span className="text-yellow-400 text-2xl">✦</span>
            </div>
          </div>
          <p className="text-white/20 text-sm font-mono">Initializing workspace...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Generate', icon: '⚡' },
    { href: '/dashboard/history', label: 'History', icon: '◷' },
    { href: '/dashboard/tools', label: 'AI Tools', icon: '🛠' },
    { href: '/dashboard/trending', label: 'Trending', icon: '🔥' },
  ]

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black text-sm font-black group-hover:scale-110 transition-transform">
              ✦
            </div>
            <span className="font-black text-base bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              RepurposeAI
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'text-white/30 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/30 text-xs font-mono">{time}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black text-xs font-black">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className="text-white/40 text-xs hidden md:block truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl text-white/20 hover:text-white/60 text-xs border border-white/[0.06] hover:border-white/10 transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden flex border-b border-white/[0.06] bg-[#050505] overflow-x-auto">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-all ${
              pathname === item.href
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-white/30'
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        {children}
      </main>

      {/* Bottom glow */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent pointer-events-none" />
    </div>
  )
}