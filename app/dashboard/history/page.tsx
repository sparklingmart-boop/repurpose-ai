'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { HistoryEntry } from '@/types'
import toast from 'react-hot-toast'
import HistoryCard from '@/components/HistoryCard'

export default function HistoryPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchHistory() {
    if (!user) return
    setLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch('/api/history', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const { entries: data } = await res.json()
      setEntries(data)
    } catch {
      toast.error('Could not load history.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const token = await user!.getIdToken()
      await fetch('/api/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })
      setEntries((prev) => prev.filter((e) => e.id !== id))
      toast.success('Entry deleted')
    } catch {
      toast.error('Could not delete entry.')
    }
  }

  useEffect(() => { fetchHistory() }, [user])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-1">History</h1>
        <p className="text-white/40 text-sm">Your last 50 generations, newest first.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="text-yellow-500 text-3xl animate-spin">✦</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-16 flex flex-col items-center text-center">
          <p className="text-5xl mb-4">↺</p>
          <p className="text-2xl font-bold text-white/40 mb-2">No history yet</p>
          <p className="text-white/30 text-sm">Generate some content and it will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <HistoryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}