'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const { signUp, signInWithGoogle, user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setBusy(true)
    try {
      await signUp(email, password)
      toast.success('Account created! Welcome 🎉')
      router.replace('/dashboard')
    } catch (err: any) {
      toast.error('Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setBusy(true)
    try {
      await signInWithGoogle()
      router.replace('/dashboard')
    } catch {
      toast.error('Google sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <span className="text-yellow-500 text-2xl font-bold">✦ Repurpose AI</span>
        </Link>

        <div className="card p-8">
          <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-white/40 text-sm mb-8">Start repurposing content today</p>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition-all mb-6 disabled:opacity-50"
          >
            🌐 Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1.5">
                Password <span className="text-white/30">(min 8 chars)</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-yellow-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}