'use client'

import { useState } from 'react'
import { HistoryEntry } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  entry: HistoryEntry
  onDelete: (id: string) => void
}

const PLATFORM_EMOJI: Record<string, string> = {
  instagram: '📸',
  tiktok: '🎵',
  linkedin: '💼',
  twitter: '𝕏',
  youtube: '▶️',
}

export default function HistoryCard({ entry, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  function copyAll() {
    const g = entry.generated
    const text = [
      `🪝 HOOK\n${g.hook}`,
      `🎬 SCRIPT\n${g.shortsScript}`,
      `📝 CAPTION\n${g.caption}`,
      `#️⃣ HASHTAGS\n${g.hashtags.map((h) => `#${h}`).join(' ')}`,
    ].join('\n\n---\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('All content copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card overflow-hidden">
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-2xl">{PLATFORM_EMOJI[entry.platform] ?? '🌐'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{entry.inputText}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-white/30 text-xs">{date}</span>
            <span className="text-yellow-500/60 text-xs capitalize">{entry.platform}</span>
            <span className="text-white/20 text-xs capitalize">{entry.tone}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); copyAll() }}
            className={`p-2 rounded-lg text-sm transition-all ${
              copied ? 'text-green-400' : 'text-white/30 hover:text-white hover:bg-white/10'
            }`}
          >
            {copied ? '✓' : '⎘'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(entry.id) }}
            className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            🗑
          </button>
          <span className="text-white/20 ml-1">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/5 px-5 pb-5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: '💡 Hook', text: entry.generated.hook },
            { label: '📝 Caption', text: entry.generated.caption },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{item.label}</p>
              <p className="text-white/60 text-sm leading-relaxed bg-neutral-800/50 rounded-xl p-3">
                {item.text}
              </p>
            </div>
          ))}
          <div className="md:col-span-2">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2">🎬 Script</p>
            <p className="text-white/60 text-sm leading-relaxed bg-neutral-800/50 rounded-xl p-3 whitespace-pre-wrap">
              {entry.generated.shortsScript}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-2"># Hashtags</p>
            <div className="flex flex-wrap gap-2">
              {entry.generated.hashtags.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-800 text-yellow-500 border border-yellow-500/20">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}