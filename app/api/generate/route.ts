import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { adminAuth } from '@/lib/firebase-admin'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function verifyToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const token = authHeader.split('Bearer ')[1]
    const decoded = await adminAuth.verifyIdToken(token)
    return decoded.uid
  } catch {
    return null
  }
}

function buildPrompt(inputText: string, platform: string, tone: string): string {
  return `You are an expert social media content strategist and viral content creator.

Given the following content, generate repurposed social media assets for ${platform} with a ${tone} tone.

INPUT CONTENT:
"""
${inputText}
"""

Return ONLY a valid JSON object with exactly this shape, no extra text:
{
  "hook": "A punchy 1-2 sentence scroll-stopping opener under 30 words",
  "shortsScript": "A complete 60-second short-form video script with spoken narration, scene cues in [brackets], and strong CTA at end",
  "caption": "A compelling post caption with emojis, line breaks, and CTA question at end",
  "hashtags": ["10", "to", "15", "relevant", "hashtags", "without", "hash", "symbol"],
  "twitterThread": "A 5-tweet thread with each tweet separated by ---",
  "emailSubject": "A compelling email subject line under 10 words",
  "blogIntro": "A 3-sentence blog introduction paragraph"
}

Tailor everything specifically for ${platform} with a ${tone} tone. Make it viral and engaging.`
}

export async function POST(req: NextRequest) {
  const uid = await verifyToken(req)
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { inputText, platform, tone } = await req.json()
  if (!inputText || typeof inputText !== 'string' || inputText.trim().length < 20) {
    return NextResponse.json(
      { error: 'Please enter at least 20 characters.' },
      { status: 400 }
    )
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media strategist. Always respond with valid JSON only, no markdown, no extra text.',
        },
        {
          role: 'user',
          content: buildPrompt(inputText, platform, tone),
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const cleanRaw = raw.replace(/```json|```/g, '').trim()
    const generated = JSON.parse(cleanRaw)

    if (Array.isArray(generated.hashtags)) {
      generated.hashtags = generated.hashtags.map((h: string) =>
        h.replace(/^#/, '').trim()
      )
    }

    return NextResponse.json({ generated })
  } catch (err: any) {
    console.error('[generate] Groq error:', err)
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    )
  }
}