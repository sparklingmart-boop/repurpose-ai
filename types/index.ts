export interface GeneratedContent {
  hook: string
  shortsScript: string
  caption: string
  hashtags: string[]
}

export interface HistoryEntry {
  id: string
  userId: string
  inputText: string
  platform: string
  tone: string
  generated: GeneratedContent
  createdAt: string
}

export type Platform = 'instagram' | 'tiktok' | 'linkedin' | 'twitter' | 'youtube'
export type Tone = 'casual' | 'professional' | 'humorous' | 'inspirational' | 'educational'

export interface GenerateRequest {
  inputText: string
  platform: Platform
  tone: Tone
}