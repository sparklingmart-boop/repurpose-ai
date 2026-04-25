'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'
import { GeneratedContent, Platform, Tone } from '@/types'
import ContentOutput from '@/components/ContentOutput'

const PLATFORMS: { value: Platform; label: string; emoji: string }[] = [
  { value: 'instagram', label: 'Instagram', emoji: '📸' },
  { value: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { value: 'linkedin', label: 'LinkedIn', emoji: '💼' },
  { value: 'twitter', label: 'Twitter / X', emoji: '𝕏' },
  { value: 'youtube', label: 'YouTube Shorts', emoji: '▶️' },
]

const TONES: { value: Tone; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'educational', label: 'Educational' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [inputText, setInputText] = useState('')
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [tone, setTone] = useState<Tone>('casual')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<GeneratedContent | null>(null)

  const charCount = inputText.length
  const MIN_CHARS = 20
  const MAX_CHARS = 3000

  async function handleGenerate() {
    if (charCount < MIN_CHARS) {
      toast.error(`Please enter at least ${MIN_CHARS} characters.`)
      return
    }
    setLoading(true)
    setGenerated(null)
    try {
      const token = await user!.getIdToken()
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inputText, platform, tone }),
      })
      if (!genRes.ok) {
        const err = await genRes.json()
        throw new Error(err.error ?? 'Generation failed')
      }
      const { generated: result } = await genRes.json()
      setGenerated(result)
      fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inputText, platform, tone, generated: result }),
      }).catch(() => {})
      toast.success('Content generated!')
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-1">Repurpose your content</h1>
        <p className="text-white/40 text-sm">Paste anything — a blog post, idea, transcript, or notes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-3">Your content</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              maxLength={MAX_CHARS}
              placeholder="Paste your blog post, video transcript, idea, or any content here…"
              className="input-field resize-none text-sm leading-relaxed"
            />
            <div className="flex justify-end mt-2">
              <span className={`text-xs font-mono ${charCount < MIN_CHARS ? 'text-white/20' : 'text-white/40'}`}>
                {charCount} / {MAX_CHARS}
              </span>
            </div>
          </div>

          <div className="card p-5">
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-3">Platform</label>
            <div className="flex flex-col gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                    platform === p.value
                      ? 'bg-yellow-500 text-black font-semibold'
                      : 'text-white/50 hover:text-white border border-white/10 hover:bg-white/5'
                  }`}
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <label className="block text-white/40 text-xs uppercase tracking-widest mb-3">Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    tone === t.value
                      ? 'bg-yellow-500 text-black font-semibold'
                      : 'text-white/50 border border-white/10 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || charCount < MIN_CHARS}
            className="btn-primary w-full justify-center py-4 text-base"
          >
            {loading ? '✦ Generating…' : '✦ Generate content'}
          </button>
        </div>

        <div className="lg:col-span-3">
          <ContentOutput generated={generated} loading={loading} />
        </div>
      </div>
    </div>
  )
}