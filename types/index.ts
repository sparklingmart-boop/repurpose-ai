export interface GeneratedContent {
  hook: string
  shortsScript: string
  caption: string
  hashtags: string[]
  twitterThread: string
  emailSubject: string
  blogIntro: string
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

export interface TrendingTopic {
  id: string
  title: string
  platform: string
  category: string
  engagement: string
}

export interface UserStats {
  totalGenerations: number
  thisMonth: number
  favouritePlatform: string
  timeSaved: string
}