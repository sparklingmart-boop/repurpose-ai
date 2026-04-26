'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'
import { GeneratedContent, Platform, Tone } from '@/types'

const PLATFORMS: { value: Platform; label: string; emoji: string; color: string }[] = [
  { value: 'instagram', label: 'Instagram', emoji: '📸', color: 'from-pink-500 to-purple-600' },
  { value: 'tiktok', label: 'TikTok', emoji: '🎵', color: 'from-red-500 to-pink-500' },
  { value: 'linkedin', label: 'LinkedIn', emoji: '💼', color: 'from-blue-500 to-cyan-500' },
  { value: 'twitter', label: 'Twitter / X', emoji: '𝕏', color: 'from-gray-500 to-gray-700' },
  { value: 'youtube', label: 'YouTube', emoji: '▶️', color: 'from-red-600 to-red-800' },
]

const TONES: { value: Tone; label: string; emoji: string }[] = [
  { value: 'casual', label: 'Casual', emoji: '😎' },
  { value: 'professional', label: 'Pro', emoji: '💼' },
  { value: 'humorous', label: 'Funny', emoji: '😂' },
  { value: 'inspirational', label: 'Inspire', emoji: '🔥' },
  { value: 'educational', label: 'Educate', emoji: '🎓' },
]

const TABS = [
  { key: 'hook', label: 'Hook', emoji: '💡', desc: 'Stop-the-scroll opener' },
  { key: 'shortsScript', label: 'Script', emoji: '🎬', desc: '60-sec video script' },
  { key: 'caption', label: 'Caption', emoji: '📝', desc: 'Ready-to-post copy' },
  { key: 'hashtags', label: 'Tags', emoji: '#', desc: 'SEO hashtags' },
  { key: 'twitterThread', label: 'Thread', emoji: '🧵', desc: '5-tweet thread' },
  { key: 'emailSubject', label: 'Email', emoji: '📧', desc: 'Subject line' },
  { key: 'blogIntro', label: 'Blog', emoji: '📖', desc: 'Blog introduction' },
]

const TEMPLATES = [
  { label: '5am Wake Up Challenge', text: 'I woke up at 5am every day for 30 days. My productivity tripled, my income went up 40%, but I lost my social life completely. Here is everything that happened...' },
  { label: 'Zero to 100K Followers', text: 'From 0 to 100K followers in 6 months with no paid ads. I used only 3 content strategies that nobody talks about. Here is the exact playbook...' },
  { label: 'Quit Job Story', text: 'I quit my 6 figure corporate job to build my own business. Everyone said I was crazy. 18 months later, I make 3x more working half the hours. Here is the real story...' },
  { label: 'AI Productivity Stack', text: 'My AI productivity stack saves me 20 hours every week. I use 5 tools that work together to automate my entire content workflow...' },
]

type TabKey = 'hook' | 'shortsScript' | 'caption' | 'hashtags' | 'twitterThread' | 'emailSubject' | 'blogIntro'

export default function DashboardPage() {
  const { user } = useAuth()
  const [inputText, setInputText] = useState('')
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [tone, setTone] = useState<Tone>('casual')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<GeneratedContent | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('hook')
  const [copied, setCopied] = useState(false)
  const [genCount, setGenCount] = useState(0)

  const charCount = inputText.length

  async function handleGenerate() {
    if (charCount < 20) {
      toast.error('Please enter at least 20 characters.')
      return
    }
    setLoading(true)
    setGenerated(null)
    try {
      const token = await user!.getIdToken()
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ inputText, platform, tone }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Generation failed')
      }
      const { generated: result } = await res.json()
      setGenerated(result)
      setGenCount(c => c + 1)
      setActiveTab('hook')
      fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ inputText, platform, tone, generated: result }),
      }).catch(() => {})
      toast.success('✦ Content generated!')
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function getContent(): string {
    if (!generated) return ''
    if (activeTab === 'hashtags') return generated.hashtags.map(h => `#${h}`).join(' ')
    return (generated as any)[activeTab] ?? ''
  }

  async function copyContent() {
    await navigator.clipboard.writeText(getContent())
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  function copyAll() {
    if (!generated) return
    const text = [
      `💡 HOOK\n${generated.hook}`,
      `🎬 SCRIPT\n${generated.shortsScript}`,
      `📝 CAPTION\n${generated.caption}`,
      `# HASHTAGS\n${generated.hashtags.map(h => `#${h}`).join(' ')}`,
      `🧵 THREAD\n${generated.twitterThread}`,
      `📧 EMAIL SUBJECT\n${generated.emailSubject}`,
      `📖 BLOG INTRO\n${generated.blogIntro}`,
    ].join('\n\n───────────\n\n')
    navigator.clipboard.writeText(text)
    toast.success('All 7 formats copied!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Content <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Studio</span>
          </h1>
          <p className="text-white/20 text-sm mt-0.5">Transform any idea into viral content across all platforms</p>
        </div>
        {genCount > 0 && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <span className="text-green-400 text-sm font-mono">{genCount} generated today</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* LEFT — Input panel */}
        <div className="xl:col-span-2 space-y-4">

          {/* Templates */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <p className="text-white/20 text-xs uppercase tracking-widest mb-3 font-mono">Quick templates</p>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.label}
                  onClick={() => setInputText(t.text)}
                  className="text-left px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all group"
                >
                  <p className="text-white/50 text-xs group-hover:text-yellow-400 transition-colors leading-tight">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Text input */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/20 text-xs uppercase tracking-widest font-mono">Your content</p>
              <span className={`text-xs font-mono ${charCount < 20 ? 'text-white/10' : charCount > 2700 ? 'text-red-400' : 'text-white/20'}`}>
                {charCount}/3000
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              rows={7}
              maxLength={3000}
              placeholder="Paste any content here — blog post, idea, transcript, story, or rough notes. The more detail you give, the better the output..."
              className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-white/10 focus:outline-none focus:border-yellow-500/30 resize-none leading-relaxed transition-all"
            />
          </div>

          {/* Platform */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <p className="text-white/20 text-xs uppercase tracking-widest mb-3 font-mono">Platform</p>
            <div className="space-y-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    platform === p.value
                      ? `bg-gradient-to-r ${p.color} text-white shadow-lg`
                      : 'text-white/30 hover:text-white/60 bg-white/[0.02] border border-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  {p.label}
                  {platform === p.value && <span className="ml-auto text-xs opacity-60">✓ Selected</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <p className="text-white/20 text-xs uppercase tracking-widest mb-3 font-mono">Tone</p>
            <div className="flex flex-wrap gap-2">
              {TONES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    tone === t.value
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                      : 'text-white/30 border border-white/[0.06] hover:border-white/10 hover:text-white/60'
                  }`}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || charCount < 20}
            className="w-full relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:from-white/5 disabled:to-white/5 disabled:text-white/10 text-black font-black py-4 rounded-2xl text-base transition-all active:scale-95 disabled:cursor-not-allowed shadow-2xl shadow-yellow-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Generating 7 formats...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ✦ Generate all 7 formats
              </span>
            )}
          </button>
        </div>

        {/* RIGHT — Output panel */}
        <div className="xl:col-span-3">
          {loading ? (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 h-full min-h-[600px] flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border border-yellow-500/20 animate-ping" />
                <div className="absolute inset-3 rounded-full border border-yellow-500/30 animate-ping" style={{ animationDelay: '0.3s' }} />
                <div className="absolute inset-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <span className="text-yellow-400 text-2xl animate-pulse">✦</span>
                </div>
              </div>
              <p className="text-white/40 font-mono text-sm mb-2">AI is creating your content</p>
              <p className="text-white/20 font-mono text-xs">Generating 7 unique formats...</p>
              <div className="mt-8 space-y-3 w-full max-w-sm">
                {['Hook', 'Script', 'Caption', 'Hashtags', 'Thread', 'Email', 'Blog'].map((item, i) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full animate-pulse"
                        style={{ width: `${40 + i * 8}%`, animationDelay: `${i * 0.1}s` }}
                      />
                    </div>
                    <span className="text-white/10 text-xs font-mono">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : !generated ? (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 h-full min-h-[600px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/10 flex items-center justify-center mb-6 text-4xl">
                ✦
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Ready to create</h3>
              <p className="text-white/20 text-sm max-w-xs mb-10">
                Paste your content, pick a platform and tone, then generate 7 formats instantly
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                {TABS.map(tab => (
                  <div key={tab.key} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-lg">{tab.emoji}</span>
                    <div>
                      <p className="text-white/30 text-xs font-medium">{tab.label}</p>
                      <p className="text-white/10 text-xs">{tab.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden h-full min-h-[600px] flex flex-col">
              {/* Success header */}
              <div className="px-5 py-4 border-b border-white/[0.06] bg-green-500/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-sm font-mono">7 formats ready</span>
                </div>
                <button
                  onClick={copyAll}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white text-xs transition-all hover:border-white/20"
                >
                  ⎘ Copy all formats
                </button>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto border-b border-white/[0.06] px-3 pt-2 gap-1">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as TabKey)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
                      activeTab === tab.key
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400'
                        : 'text-white/20 border-transparent hover:text-white/40'
                    }`}
                  >
                    {tab.emoji} {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {TABS.find(t => t.key === activeTab)?.emoji} {TABS.find(t => t.key === activeTab)?.label}
                    </p>
                    <p className="text-white/20 text-xs">{TABS.find(t => t.key === activeTab)?.desc}</p>
                  </div>
                  <button
                    onClick={copyContent}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      copied
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {copied ? '✓ Copied!' : '⎘ Copy'}
                  </button>
                </div>

                {activeTab === 'hashtags' ? (
                  <div className="flex-1 flex flex-wrap gap-2 content-start">
                    {generated.hashtags.map((tag, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigator.clipboard.writeText(`#${tag}`)
                          toast.success(`#${tag} copied!`)
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-mono bg-yellow-500/5 text-yellow-400 border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 bg-black/20 rounded-xl p-5 overflow-y-auto">
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                      {getContent()}
                    </p>
                  </div>
                )}

                {/* Regenerate */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleGenerate}
                    className="flex-1 py-3 rounded-xl border border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/10 text-sm transition-all"
                  >
                    ↺ Regenerate
                  </button>
                  <button
                    onClick={() => { setGenerated(null); setInputText('') }}
                    className="flex-1 py-3 rounded-xl border border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/10 text-sm transition-all"
                  >
                    + New content
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Tools Recommendation */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold">🛠 Recommended creator tools</h3>
            <p className="text-white/20 text-xs mt-0.5">Pair these with RepurposeAI to dominate your niche</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Canva', desc: 'Design visuals', emoji: '🎨', url: 'https://canva.com', color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' },
            { name: 'CapCut', desc: 'Edit Reels & TikToks', emoji: '🎬', url: 'https://capcut.com', color: 'from-pink-500/10 to-red-500/10 border-pink-500/20' },
            { name: 'ElevenLabs', desc: 'AI voiceovers', emoji: '🎙️', url: 'https://elevenlabs.io', color: 'from-purple-500/10 to-violet-500/10 border-purple-500/20' },
            { name: 'Midjourney', desc: 'AI images', emoji: '🖼️', url: 'https://midjourney.com', color: 'from-green-500/10 to-emerald-500/10 border-green-500/20' },
          ].map(tool => (
            
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-gradient-to-br ${tool.color} border rounded-xl p-4 hover:scale-[1.02] transition-all group`}
            >
              <p className="text-2xl mb-2">{tool.emoji}</p>
              <p className="text-white/70 font-semibold text-sm group-hover:text-white transition-colors">{tool.name}</p>
              <p className="text-white/20 text-xs">{tool.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}