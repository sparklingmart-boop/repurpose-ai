'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

const MARQUEE_ITEMS = [
  '📸 Instagram Captions', '🎵 TikTok Scripts', '💼 LinkedIn Posts',
  '🧵 Twitter Threads', '▶️ YouTube Shorts', '📧 Email Subject Lines',
  '🪝 Viral Hooks', '# Hashtag Sets', '📖 Blog Intros', '🎯 CTAs',
]

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube']

const EXAMPLES = [
  {
    platform: '📸 Instagram',
    input: 'I woke up at 5am for 30 days straight...',
    hook: '⚡ I tried waking up at 5am for 30 days. My income went up 40%. Here\'s the ugly truth...',
    caption: '30 days. 5am. Every single day. 😤\n\n✅ 3x more work done before 9am\n💰 2 new clients closed\n🧠 Mental clarity was insane\n❌ Social life? Gone lol\n\nWas it worth it? Drop your thoughts 👇',
    tags: ['#morningroutine', '#5amclub', '#productivity', '#entrepreneur'],
    color: 'from-pink-500 to-purple-600',
  },
  {
    platform: '💼 LinkedIn',
    input: 'Our startup just hit 100K users without any funding...',
    hook: 'We hit 100K users with $0 in funding. No ads. No investors. Here\'s exactly how we did it 👇',
    caption: 'Everyone told us we needed VC money to scale.\n\nWe proved them wrong.\n\n100,000 users.\n$0 raised.\n18 months.\n\nHere\'s our exact playbook:\n\n1. Built in public from day 1\n2. Obsessed over 1 channel only\n3. Made our users our marketers\n\nThe best growth hack? A product people actually want.\n\nWhat\'s your bootstrapping story? 👇',
    tags: ['#startup', '#bootstrapped', '#entrepreneurship', '#growth'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    platform: '🎵 TikTok',
    input: 'Learning to code changed my life completely...',
    hook: 'POV: You learned to code and your entire life changed in 6 months 🤯',
    caption: 'No CS degree. No bootcamp. Just YouTube and consistency 💻\n\n6 months later:\n- Remote job ✅\n- 3x salary ✅  \n- Work from anywhere ✅\n\nDrop a 💻 if you\'re learning to code rn',
    tags: ['#coding', '#learntocode', '#techcareer', '#programmer'],
    color: 'from-red-500 to-orange-500',
  },
]

const STATS = [
  { number: '2,400+', label: 'Active Creators', icon: '👥' },
  { number: '180K+', label: 'Posts Generated', icon: '📱' },
  { number: '4.9★', label: 'Average Rating', icon: '⭐' },
  { number: '<10s', label: 'Generation Time', icon: '⚡' },
]

const FEATURES = [
  { emoji: '🪝', title: 'Viral Hooks', desc: 'Stop-the-scroll openers', color: 'from-yellow-400 to-orange-500' },
  { emoji: '🎬', title: 'Video Scripts', desc: 'Full 60-sec scripts with cues', color: 'from-pink-400 to-red-500' },
  { emoji: '📝', title: 'Smart Captions', desc: 'Platform-native copy', color: 'from-blue-400 to-cyan-500' },
  { emoji: '🧵', title: 'Tweet Threads', desc: 'Viral 5-tweet threads', color: 'from-green-400 to-emerald-500' },
  { emoji: '📧', title: 'Email Subject Lines', desc: 'High open-rate subjects', color: 'from-purple-400 to-violet-500' },
  { emoji: '📖', title: 'Blog Intros', desc: '3-sentence hook paragraphs', color: 'from-orange-400 to-amber-500' },
]

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Instagram · 45K followers', text: 'My engagement went up 60% in 2 weeks. I used to spend 3 hours on captions. Now it\'s 30 seconds.', avatar: 'PS', color: 'bg-pink-500' },
  { name: 'Rahul M.', role: 'YouTube · 120K subscribers', text: 'My Reels went from 2K to 80K views after using this for 1 month. The scripts are insane.', avatar: 'RM', color: 'bg-blue-500' },
  { name: 'Anjali K.', role: 'LinkedIn Marketer', text: 'I now manage 5 clients with the same effort as 1 before. Best tool I\'ve ever paid for.', avatar: 'AK', color: 'bg-purple-500' },
  { name: 'Dev P.', role: 'TikTok Creator · 200K', text: 'Went from 0 to 200K followers in 4 months. This tool is my secret weapon.', avatar: 'DP', color: 'bg-green-500' },
  { name: 'Meera R.', role: 'Content Agency Owner', text: 'We 10x\'d our output without hiring. RepurposeAI is now core to our workflow.', avatar: 'MR', color: 'bg-orange-500' },
  { name: 'Arjun T.', role: 'Startup Founder', text: 'Our LinkedIn content went viral 3 times in a month. 10K new followers in 6 weeks.', avatar: 'AT', color: 'bg-red-500' },
]

const FAQS = [
  { q: 'Is this really free?', a: 'Yes! 10 free generations per day, forever. No credit card needed.' },
  { q: 'What platforms are supported?', a: 'Instagram, TikTok, LinkedIn, Twitter/X, and YouTube Shorts — each with platform-specific optimisation.' },
  { q: 'How is this different from ChatGPT?', a: 'We are purpose-built for creators. Every output is formatted, platform-optimised, and ready to post in one click.' },
  { q: 'Do I need writing skills?', a: 'Zero. Paste any idea, transcript, or rough notes and we handle everything.' },
  { q: 'How fast is it?', a: 'Under 10 seconds from paste to ready-to-post content.' },
  { q: 'Can I use it for client work?', a: 'Absolutely. Pro plan has unlimited generations — perfect for agencies and freelancers.' },
]

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeExample, setActiveExample] = useState(0)
  const [activeTab, setActiveTab] = useState<'hook' | 'caption' | 'tags'>('hook')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [marqueePos, setMarqueePos] = useState(0)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  useEffect(() => {
    const text = EXAMPLES[activeExample].input
    setTyped('')
    let i = 0
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (i <= text.length) {
        setTyped(text.slice(0, i))
        i++
      } else {
        clearInterval(intervalRef.current)
      }
    }, 40)
    return () => clearInterval(intervalRef.current)
  }, [activeExample])

  const ex = EXAMPLES[activeExample]

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* Gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-yellow-500/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✦</span>
            <span className="font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              RepurposeAI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#demo" className="text-white/50 hover:text-white text-sm transition-colors">Demo</a>
            <a href="#features" className="text-white/50 hover:text-white text-sm transition-colors">Features</a>
            <a href="#pricing" className="text-white/50 hover:text-white text-sm transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/50 hover:text-white text-sm transition-colors hidden md:block">
              Sign in
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold px-5 py-2 rounded-xl text-sm transition-all active:scale-95">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 text-sm mb-8 animate-pulse">
            🔥 2,400+ creators are growing faster with this
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-6">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Turn 1 idea into
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              10 viral posts
            </span>
            <br />
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              in 30 seconds
            </span>
          </h1>

          <p className="text-white/40 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            No writing skills needed. Paste any content → choose platform → get hooks, scripts, captions and hashtags instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/signup" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black px-10 py-5 rounded-2xl text-xl transition-all active:scale-95 shadow-2xl shadow-yellow-500/25">
              Generate 10 posts FREE now →
            </Link>
            <a href="#demo" className="border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur text-white/70 hover:text-white font-semibold px-10 py-5 rounded-2xl text-xl transition-all">
              See live demo ↓
            </a>
          </div>
          <p className="text-white/20 text-sm">No credit card • Free forever • 10 generations/day</p>

          {/* Platform pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-10">
            {PLATFORMS.map(p => (
              <span key={p} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/50 text-sm">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-6 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-white/30 text-sm font-medium shrink-0">
              {item} <span className="text-yellow-500/50 mx-4">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center hover:border-yellow-500/20 transition-all">
              <p className="text-3xl mb-1">{s.icon}</p>
              <p className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{s.number}</p>
              <p className="text-white/30 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Watch it </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">work live</span>
            </h2>
            <p className="text-white/30 text-lg">Real AI output. Click an example below.</p>
          </div>

          {/* Example selector */}
          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            {EXAMPLES.map((e, i) => (
              <button
                key={i}
                onClick={() => { setActiveExample(i); setActiveTab('hook') }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeExample === i
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                    : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'
                }`}
              >
                {e.platform}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input side */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-white/20 text-xs ml-2">Your content input</span>
              </div>
              <div className="bg-black/30 rounded-2xl p-5 min-h-[140px] mb-5">
                <p className="text-white/60 text-sm leading-relaxed font-mono">
                  {typed}<span className="animate-pulse text-yellow-400">|</span>
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${ex.color}`}>
                  {ex.platform}
                </span>
                <span className="px-4 py-1.5 rounded-full text-xs bg-white/5 text-white/40 border border-white/10">
                  ✦ Generating...
                </span>
              </div>
            </div>

            {/* Output side */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <div className="flex gap-2 mb-6">
                {(['hook', 'caption', 'tags'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                        : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {tab === 'hook' ? '💡 Hook' : tab === 'caption' ? '📝 Caption' : '# Tags'}
                  </button>
                ))}
              </div>

              <div className="bg-black/30 rounded-2xl p-5 min-h-[140px] mb-5">
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {activeTab === 'hook' ? ex.hook : activeTab === 'caption' ? ex.caption : ex.tags.join(' ')}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Ready to post
                </div>
                <Link href="/signup" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-5 py-2 rounded-xl text-sm transition-all hover:scale-105">
                  Try free →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Everything to </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">go viral</span>
            </h2>
            <p className="text-white/30 text-lg">7 content formats. Every platform. One click.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="group bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-default">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {f.emoji}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-white/30 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Creators </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">love it</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-xs`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/30 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Start free. </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Scale when ready.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <p className="text-white/40 text-sm uppercase tracking-widest mb-3">Free</p>
              <div className="flex items-end gap-2 mb-1">
                <p className="text-6xl font-black text-white">₹0</p>
              </div>
              <p className="text-white/20 text-sm mb-8">Forever free</p>
              <ul className="space-y-4 mb-8">
                {['10 generations per day', 'All 5 platforms', 'Hook + Caption + Hashtags', 'History (7 days)', 'Email support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/50 text-sm">
                    <span className="text-green-400 text-lg">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-white/10 hover:border-yellow-500/30 text-white font-semibold py-4 rounded-2xl transition-all hover:bg-white/5">
                Get started free →
              </Link>
            </div>

            <div className="bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border-2 border-yellow-500/50 rounded-3xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-6 py-2 rounded-full">
                MOST POPULAR
              </div>
              <p className="text-yellow-400 text-sm uppercase tracking-widest mb-3">Pro</p>
              <div className="flex items-end gap-2 mb-1">
                <p className="text-6xl font-black text-white">₹499</p>
                <p className="text-white/30 text-sm mb-3">/month</p>
              </div>
              <p className="text-white/20 text-sm mb-8">Everything you need to dominate</p>
              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited generations',
                  'All 5 platforms',
                  'All 7 content formats',
                  'Unlimited history',
                  'Twitter threads',
                  'Email subject lines',
                  'Priority support',
                  'New features first',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="text-yellow-400 text-lg">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black py-4 rounded-2xl transition-all hover:scale-[1.02]">
                Get Pro now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">FAQ</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-white font-semibold text-sm">{faq.q}</span>
                  <span className={`text-2xl transition-transform ${openFaq === i ? 'rotate-45' : ''} text-yellow-400`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              Ready to go viral?
            </span>
          </h2>
          <p className="text-white/40 text-xl mb-10">
            Join 2,400+ creators who save 10+ hours every week
          </p>
          <Link href="/signup" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black px-12 py-6 rounded-2xl text-2xl transition-all active:scale-95 shadow-2xl shadow-yellow-500/30 inline-block hover:scale-105">
            Start creating for FREE →
          </Link>
          <p className="text-white/20 text-sm mt-6">No credit card • Setup in 30 seconds • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">✦</span>
            <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">RepurposeAI</span>
          </div>
          <p className="text-white/20 text-sm">© {new Date().getFullYear()} RepurposeAI. Built for creators who move fast.</p>
          <div className="flex gap-6">
            <Link href="/login" className="text-white/20 hover:text-white text-sm transition-colors">Login</Link>
            <Link href="/signup" className="text-white/20 hover:text-white text-sm transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </main>
  )
}