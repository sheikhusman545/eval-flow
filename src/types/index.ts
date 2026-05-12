export type SkillLevel = 'Beginner' | 'Adult Beginner' | 'Intermediate' | 'Advanced'
export type TrainingGroup = 'mon-thu' | 'sun-wed' | 'sat-tue'
export type EvaluationType = 'session' | 'full'
export type ClipType = 'coach' | 'player' | 'pro'
export type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'orange' | 'purple' | 'dark-green'

export interface Trainee {
  id: number
  name: string
  email: string
  phone: string
  age: number
  level: SkillLevel
  levelRank: number
  trainingGroup: TrainingGroup
  joinedAt: string
  lastEvalAt?: string
  avatarUrl?: string
  searchTags: string[]
  rating: number
}

export interface StrokeScore {
  name: string
  score: number
  color: BadgeColor
}

export interface Evaluation {
  id: number
  type: EvaluationType
  traineeId: number
  title: string
  date: string
  overallScore: number
  coachRating: number
  coachFeedback: string
  whatsWorking: string[]
  needsImprovement: string[]
  thumbnailUrl?: string
  videoUrl?: string
  refClipCount: number
  strokes?: StrokeScore[]
}

export interface Clip {
  id: number
  type: ClipType
  title: string
  category: string
  thumbnailUrl?: string
  videoUrl?: string
  duration?: string
  coachName?: string
  coachAvatarUrl?: string
  tags: string[]
  skillLevel?: string
  viewAngle?: string
  strokeType?: string
  views: number
  rating: number
  uploadedAt: string
}

export interface Coach {
  id: number
  name: string
  avatarUrl?: string
  title?: string
}
