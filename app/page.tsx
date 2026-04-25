'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <span className="text-yellow-500 text-xl font-bold">✦ Repurpose AI</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn-primary text-sm py-2">Get started</Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-sm mb-8">
          ✦ Powered by GPT-4o-mini
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-4xl mb-6">
          Turn one piece of content into{' '}
          <span className="text-yellow-500">everything</span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mb-10">
          Instantly generate hooks, short-form video scripts, captions, and hashtags from any text.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/signup" className="btn-primary px-8 py-4 text-base">
            Start repurposing free →
          </Link>
          <Link href="/login" className="btn-ghost px-8 py-4 text-base">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="px-8 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Hook Generator', desc: 'Stop-the-scroll openers', color: 'text-yellow-500' },
            { label: 'Shorts Script', desc: '60-second video scripts', color: 'text-green-500' },
            { label: 'Captions', desc: 'Platform-native copy', color: 'text-red-400' },
            { label: 'Hashtags', desc: 'SEO-optimised tags', color: 'text-yellow-300' },
          ].map((f) => (
            <div key={f.label} className="card p-5">
              <p className={`text-lg font-bold ${f.color} mb-1`}>{f.label}</p>
              <p className="text-white/40 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}