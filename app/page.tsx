'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

const DEMO_INPUT = "I woke up at 5am for 30 days straight. Here's what happened to my productivity, mental health, and income..."

const DEMO_OUTPUT = {
  hook: "⚡ I woke up at 5am for 30 days. My income went up 40%. Here's the ugly truth nobody tells you...",
  caption: "30 days. 5am. Every. Single. Day. 😤\n\nHere's what actually changed:\n\n✅ Finished 3x more work before 9am\n💰 Closed 2 new clients\n🧠 Mental clarity was insane\n❌ Social life? Gone.\n\nWorth it? Drop your thoughts below 👇",
  hashtags: ['morningroutine', '5amclub', 'productivity', 'entrepreneur', 'mindset'],
}

const STATS = [
  { number: '2,400+', label: 'Creators using this' },
  { number: '180,000+', label: 'Posts generated' },
  { number: '4.9★', label: 'Average rating' },
  { number: '30 sec', label: 'Average time to generate' },
]

const FEATURES = [
  {
    emoji: '🪝',
    title: 'Viral Hook Generator',
    desc: 'Stop-the-scroll openers that make people read every word',
    color: 'text-yellow-400',
  },
  {
    emoji: '🎬',
    title: 'Shorts & Reels Script',
    desc: 'Full 60-second video scripts with scene cues and CTAs',
    color: 'text-pink-400',
  },
  {
    emoji: '📝',
    title: 'Smart Captions',
    desc: 'Platform-native captions with emojis, hooks and hashtags',
    color: 'text-blue-400',
  },
  {
    emoji: '🧵',
    title: 'Twitter Threads',
    desc: '5-tweet threads that go viral and grow your following fast',
    color: 'text-green-400',
  },
  {
    emoji: '📧',
    title: 'Email Subject Lines',
    desc: 'High open-rate subject lines that get clicks every time',
    color: 'text-purple-400',
  },
  {
    emoji: '📖',
    title: 'Blog Introductions',
    desc: 'Compelling blog intros that hook readers in 3 sentences',
    color: 'text-orange-400',
  },
]

const STEPS = [
  { step: '01', title: 'Paste your content', desc: 'Any text — blog post, idea, transcript, notes' },
  { step: '02', title: 'Pick your platform', desc: 'Instagram, TikTok, LinkedIn, Twitter, YouTube' },
  { step: '03', title: 'Get viral content', desc: 'Hooks, scripts, captions, hashtags in 5 seconds' },
]

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    role: 'Instagram Creator • 45K followers',
    text: 'I used to spend 3 hours writing captions. Now it takes 30 seconds. My engagement went up 60% in 2 weeks.',
    avatar: 'PS',
    color: 'bg-pink-500',
  },
  {
    name: 'Rahul M.',
    role: 'YouTube Creator • 120K subscribers',
    text: 'The shorts scripts are insane. My Reels went from 2K to 80K views after using this tool for 1 month.',
    avatar: 'RM',
    color: 'bg-blue-500',
  },
  {
    name: 'Anjali K.',
    role: 'LinkedIn Marketer',
    text: 'Best investment for my content business. I now manage 5 clients with the same effort as 1 before.',
    avatar: 'AK',
    color: 'bg-purple-500',
  },
]

const FAQS = [
  {
    q: 'Is this free to use?',
    a: 'Yes! You get 10 free generations per day. No credit card needed to start.',
  },
  {
    q: 'What platforms does it support?',
    a: 'Instagram, TikTok, LinkedIn, Twitter/X, and YouTube Shorts. Each platform gets custom optimised content.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'We are built specifically for content creators. Every output is platform-optimised, formatted correctly, and ready to post instantly.',
  },
  {
    q: 'Do I need writing skills?',
    a: 'Zero writing skills needed. Just paste any idea or text and we handle everything else.',
  },
  {
    q: 'How fast does it generate?',
    a: 'Under 10 seconds. Paste → click → post. That is the whole workflow.',
  },
]

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [demoTab, setDemoTab] = useState<'hook' | 'caption' | 'hashtags'>('hook')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= DEMO_INPUT.length) {
        setTyped(DEMO_INPUT.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const getDemoContent = () => {
    if (demoTab === 'hook') return DEMO_OUTPUT.hook
    if (demoTab === 'caption') return DEMO_OUTPUT.caption
    return DEMO_OUTPUT.hashtags.map(h => `#${h}`).join(' ')
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-yellow-500 text-xl font-bold">✦ RepurposeAI</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg text-sm transition-all">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-sm mb-8">
            ✦ 100% Free to start • No credit card needed
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Turn 1 idea into
            <span className="text-yellow-500"> 10 viral posts</span>
            <br />in 30 seconds
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto mb-10">
            No writing skills needed. Just paste any content and get hooks, scripts, captions, threads and hashtags instantly. Perfect for beginners and pro creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all active:scale-95">
              Generate 10 posts FREE now →
            </Link>
            <a href="#demo" className="border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium px-8 py-4 rounded-xl text-lg transition-all">
              See live demo ↓
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="bg-neutral-900 border border-white/5 rounded-2xl p-4">
                <p className="text-2xl font-bold text-yellow-500">{s.number}</p>
                <p className="text-white/40 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="py-20 px-6 bg-neutral-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              See it work <span className="text-yellow-500">live</span>
            </h2>
            <p className="text-white/40 text-lg">Real output. No fluff. Just results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-white/30 text-xs ml-2">Your content</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed font-mono min-h-[120px]">
                {typed}
                <span className="animate-pulse">|</span>
              </p>
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs border border-yellow-500/20">📸 Instagram</span>
                <span className="px-3 py-1 bg-white/5 text-white/40 rounded-full text-xs border border-white/10">💪 Inspirational</span>
              </div>
            </div>

            {/* Output */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
              <div className="flex gap-2 mb-4">
                {(['hook', 'caption', 'hashtags'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDemoTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                      demoTab === tab
                        ? 'bg-yellow-500 text-black'
                        : 'text-white/40 hover:text-white border border-white/10'
                    }`}
                  >
                    {tab === 'hook' ? '💡 Hook' : tab === 'caption' ? '📝 Caption' : '# Tags'}
                  </button>
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed min-h-[120px] whitespace-pre-wrap">
                {getDemoContent()}
              </p>
              <div className="mt-4 flex items-center gap-2 text-green-400 text-xs">
                <span>✓</span>
                <span>Ready to post in 5 seconds</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/signup" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all inline-block">
              Try it yourself — it's free →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple as <span className="text-yellow-500">1-2-3</span>
            </h2>
            <p className="text-white/40 text-lg">No learning curve. No writing skills. Just results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-neutral-900 border border-white/5 rounded-2xl p-8 text-center">
                <p className="text-5xl font-bold text-yellow-500/20 mb-4">{s.step}</p>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-neutral-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to <span className="text-yellow-500">go viral</span>
            </h2>
            <p className="text-white/40 text-lg">7 content formats. Every platform. One click.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-yellow-500/20 transition-all">
                <p className="text-4xl mb-4">{f.emoji}</p>
                <h3 className={`text-lg font-bold mb-2 ${f.color}`}>{f.title}</h3>
                <p className="text-white/40 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Creators <span className="text-yellow-500">love it</span>
            </h2>
            <p className="text-white/40 text-lg">Real results from real creators</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
                <p className="text-yellow-500 text-lg mb-4">★★★★★</p>
                <p className="text-white/70 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-white/30 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-neutral-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Start free. <span className="text-yellow-500">Scale when ready.</span>
            </h2>
            <p className="text-white/40 text-lg">No credit card needed to start</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
              <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Free</p>
              <p className="text-5xl font-bold text-white mb-1">₹0</p>
              <p className="text-white/30 text-sm mb-8">Forever free</p>
              <ul className="space-y-3 mb-8">
                {['10 generations per day', 'All 5 platforms', 'Hook + Caption + Hashtags', 'Save history (7 days)'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/60 text-sm">
                    <span className="text-green-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-white/10 hover:border-yellow-500/50 text-white font-semibold py-3 rounded-xl transition-all">
                Start free →
              </Link>
            </div>

            <div className="bg-neutral-900 border-2 border-yellow-500 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-4 py-1.5 rounded-full">
                MOST POPULAR
              </div>
              <p className="text-yellow-500 text-sm uppercase tracking-widest mb-2">Pro</p>
              <p className="text-5xl font-bold text-white mb-1">₹499</p>
              <p className="text-white/30 text-sm mb-8">per month</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited generations',
                  'All 5 platforms',
                  'All 7 content formats',
                  'Unlimited history',
                  'Priority support',
                  'New features first',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="text-yellow-500">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all">
                Get Pro →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Got <span className="text-yellow-500">questions?</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-white font-medium">{faq.q}</span>
                  <span className="text-yellow-500 text-xl">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-yellow-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
            Start creating viral content today
          </h2>
          <p className="text-black/60 text-lg mb-8">
            Join 2,400+ creators who save 10+ hours every week
          </p>
          <Link href="/signup" className="bg-black hover:bg-neutral-900 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all inline-block">
            Generate your first post FREE →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-white/5 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-yellow-500 font-bold">✦ RepurposeAI</span>
          <p className="text-white/20 text-sm">© {new Date().getFullYear()} RepurposeAI. Built for creators.</p>
          <div className="flex gap-6">
            <Link href="/login" className="text-white/30 hover:text-white text-sm transition-colors">Login</Link>
            <Link href="/signup" className="text-white/30 hover:text-white text-sm transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}