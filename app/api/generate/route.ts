import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { adminAuth } from '@/lib/firebase-admin'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
  return `You are an expert social media content strategist.

Given the following content, generate repurposed social media assets for ${platform} with a ${tone} tone.

INPUT CONTENT:
"""
${inputText}
"""

Return ONLY a valid JSON object with exactly this shape:
{
  "hook": "A punchy 1-2 sentence opener under 30 words.",
  "shortsScript": "A complete 60-second short-form video script with spoken narration and a strong CTA.",
  "caption": "A compelling post caption with emojis and a CTA at the end.",
  "hashtags": ["array", "of", "10", "to", "15", "relevant", "hashtags", "without", "the", "hash", "symbol"]
}

Tailor everything specifically for ${platform} with a ${tone} tone.`
}

export async function POST(req: NextRequest) {
  const uid = await verifyToken(req)
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { inputText, platform, tone } = await req.json()
  if (!inputText || typeof inputText !== 'string' || inputText.trim().length < 20) {
    return NextResponse.json(
      { error: 'inputText must be at least 20 characters.' },
      { status: 400 }
    )
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: buildPrompt(inputText, platform, tone) }],
      temperature: 0.8,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const generated = JSON.parse(raw)

    if (Array.isArray(generated.hashtags)) {
      generated.hashtags = generated.hashtags.map((h: string) =>
        h.replace(/^#/, '').trim()
      )
    }

    return NextResponse.json({ generated })
  } catch (err: any) {
    console.error('[generate] OpenAI error:', err)
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    )
  }
}