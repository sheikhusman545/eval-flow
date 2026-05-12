import { Trainee } from '@/types'

export const TRAINEES: Trainee[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@gmail.com',
    phone: '(555) 234-5678',
    age: 14,
    level: 'Intermediate',
    levelRank: 3,
    trainingGroup: 'mon-thu',
    joinedAt: '2025-01-15',
    lastEvalAt: '2026-08-03',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    searchTags: ['intermediate', 'focus', 'footwork', 'timing'],
    rating: 4,
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@gmail.com',
    phone: '(555) 876-5432',
    age: 31,
    level: 'Advanced',
    levelRank: 4,
    trainingGroup: 'sun-wed',
    joinedAt: '2024-11-20',
    lastEvalAt: '2024-12-01',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    searchTags: ['advanced', 'power', 'serve', 'baseline'],
    rating: 4,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@gmail.com',
    phone: '(555) 345-6789',
    age: 25,
    level: 'Beginner',
    levelRank: 1,
    trainingGroup: 'sat-tue',
    joinedAt: '2026-02-01',
    lastEvalAt: '2026-02-15',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    searchTags: ['beginner', 'balance', 'agility', 'recovery'],
    rating: 4,
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james.wilson@gmail.com',
    phone: '(555) 456-7890',
    age: 11,
    level: 'Intermediate',
    levelRank: 3,
    trainingGroup: 'mon-thu',
    joinedAt: '2025-09-10',
    lastEvalAt: '2025-08-01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    searchTags: ['intermediate', 'backhand', 'cardio', 'endurance'],
    rating: 3,
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    email: 'olivia.martinez@gmail.com',
    phone: '(555) 567-8901',
    age: 16,
    level: 'Adult Beginner',
    levelRank: 2,
    trainingGroup: 'sun-wed',
    joinedAt: '2025-06-01',
    lastEvalAt: '2025-11-20',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=256&q=80',
    searchTags: ['adult beginner', 'consistency', 'volleys', 'net play'],
    rating: 3,
  },
]

export const TRAINING_GROUP_LABELS: Record<string, string> = {
  'mon-thu': 'Mon & Thu, 3–5 PM',
  'sun-wed': 'Sun & Wed, 3–5 PM',
  'sat-tue': 'Sat & Tue, 3–5 PM',
}

export const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'yellow',
  'Adult Beginner': 'red',
  Intermediate: 'blue',
  Advanced: 'green',
}

export function getTraineeById(id: number): Trainee | undefined {
  return TRAINEES.find((t) => t.id === id)
}
