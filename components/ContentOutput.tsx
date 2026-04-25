'use client'

import { useState } from 'react'
import { GeneratedContent } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  generated: GeneratedContent | null
  loading: boolean
}

type Tab = 'hook' | 'shortsScript' | 'caption' | 'hashtags'

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'hook', label: 'Hook', emoji: '💡' },
  { key: 'shortsScript', label: 'Script', emoji: '🎬' },
  { key: 'caption', label: 'Caption', emoji: '💬' },
  { key: 'hashtags', label: 'Hashtags', emoji: '#' },
]

export default function ContentOutput({ generated, loading }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('hook')
  const [copied, setCopied] = useState(false)

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const getTabContent = (): string => {
    if (!generated) return ''
    if (activeTab === 'hashtags') {
      return generated.hashtags.map((h) => `#${h}`).join(' ')
    }
    return generated[activeTab]
  }

  if (loading) {
    return (
      <div className="card min-h-[520px] p-6 flex flex-col gap-4">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <div key={t.key} className="shimmer h-9 w-24 rounded-lg" />
          ))}
        </div>
        <div className="flex-1 space-y-3 pt-2">
          {[100, 80, 90, 60, 75].map((w, i) => (
            <div
              key={i}
              className="shimmer h-4 rounded-full"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="text-yellow-500/60 text-sm flex items-center gap-2">
          <span className="animate-spin inline-block">✦</span>
          AI is writing your content…
        </div>
      </div>
    )
  }

  if (!generated) {
    return (
      <div className="card min-h-[520px] flex flex-col items-center justify-center text-center p-10">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5 text-3xl">
          ✦
        </div>
        <p className="text-2xl font-bold text-white mb-2">Ready to generate</p>
        <p className="text-white/30 text-sm max-w-xs">
          Paste your content, pick a platform and tone, then hit Generate.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-xs">
          {TABS.map((t) => (
            <div
              key={t.key}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/5 text-white/20 text-sm"
            >
              {t.emoji} {t.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card min-h-[520px] flex flex-col">
      <div className="flex gap-1 p-3 border-b border-white/5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === t.key
                ? 'bg-yellow-500 text-black font-semibold'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {activeTab === 'hashtags' ? (
          <div className="flex-1 flex flex-wrap gap-2 content-start">
            {generated.hashtags.map((tag, i) => (
              <button
                key={i}
                onClick={() => {
                  navigator.clipboard.writeText(`#${tag}`)
                  toast.success(`#${tag} copied!`)
                }}
                className="px-3 py-1.5 rounded-full text-sm font-mono bg-neutral-800 text-yellow-500 border border-yellow-500/20 hover:border-yellow-500/50 transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
            {getTabContent()}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleCopy(getTabContent())}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}