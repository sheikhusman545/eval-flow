import { Evaluation } from '@/types'

export const EVALUATIONS: Evaluation[] = [
  {
    id: 1,
    type: 'session',
    traineeId: 1,
    title: 'Forehand Evaluation',
    date: '2026-03-05',
    overallScore: 8.0,
    coachRating: 8.8,
    coachFeedback:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Condimentum Curabitur Vel Odio Tortor Egestas Eius. Cursus Volutpat Tincidunt Tellus In Blandit Sociis Nunc Eu Scelerisque Purus Morbi Vel Phasellus Dolor Vel Proin Sed.',
    whatsWorking: ['Excellent Racket Preparation Timing', 'Good Follow-Through On Cross-Court Shots'],
    needsImprovement: ['Racquet Back Late', 'Poor Spacing From The Ball'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    refClipCount: 2,
    strokes: [],
  },
  {
    id: 2,
    type: 'full',
    traineeId: 1,
    title: 'Full Player Evaluation',
    date: '2026-03-05',
    overallScore: 8.5,
    coachRating: 8.5,
    coachFeedback:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Netus In Maximus In Venenatis Efficitur. Dignissim Ac Consequat Morbi Tellus. Fusce Vel A Posuere Viverra Vestibulum Ac At Amet Commodo Ut Odio.',
    whatsWorking: ['Excellent Racket Preparation Timing', 'Strong Baseline Game'],
    needsImprovement: ['Racquet Back Late On Backhand', 'Poor Spacing At Net'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    refClipCount: 3,
    strokes: [
      { name: 'Forehand', score: 8.0, color: 'green' },
      { name: 'Backhand', score: 7.5, color: 'blue' },
      { name: 'Serve', score: 8.2, color: 'orange' },
      { name: 'Volley', score: 7.8, color: 'red' },
    ],
  },
  {
    id: 3,
    type: 'session',
    traineeId: 1,
    title: 'Forehand Evaluation',
    date: '2026-08-03',
    overallScore: 8.0,
    coachRating: 8.6,
    coachFeedback:
      'Lorem Ipsum Dolor Sit Amet Consectetur. Malesuada Ac Condimentum Curabitur Vel Odio Tortor Egestas Eius.',
    whatsWorking: ['Excellent Racket Preparation Timing'],
    needsImprovement: ['Racquet Back Late', 'Poor Spacing'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    refClipCount: 1,
    strokes: [],
  },
  {
    id: 4,
    type: 'session',
    traineeId: 2,
    title: 'Serve Evaluation',
    date: '2024-12-01',
    overallScore: 9.0,
    coachRating: 9.2,
    coachFeedback: 'Excellent serve mechanics. Power and placement are outstanding. Work on second serve consistency.',
    whatsWorking: ['Powerful First Serve', 'Great Ball Toss Consistency'],
    needsImprovement: ['Second Serve Depth', 'Follow-Through Rotation'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    refClipCount: 2,
    strokes: [],
  },
  {
    id: 5,
    type: 'full',
    traineeId: 2,
    title: 'Full Player Evaluation',
    date: '2024-11-25',
    overallScore: 9.1,
    coachRating: 9.0,
    coachFeedback: 'Michael shows advanced level play across all strokes. Focus on mental game and match strategy.',
    whatsWorking: ['Dominant Baseline Play', 'Strong Net Game', 'Consistent First Serve'],
    needsImprovement: ['Mental Resilience Under Pressure', 'Approach Shot Selection'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    refClipCount: 4,
    strokes: [
      { name: 'Forehand', score: 9.2, color: 'green' },
      { name: 'Backhand', score: 8.8, color: 'blue' },
      { name: 'Serve', score: 9.5, color: 'orange' },
      { name: 'Volley', score: 8.9, color: 'red' },
    ],
  },
]

export function getEvaluationsByTraineeId(traineeId: number): Evaluation[] {
  return EVALUATIONS.filter((e) => e.traineeId === traineeId).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function getEvaluationById(id: number): Evaluation | undefined {
  return EVALUATIONS.find((e) => e.id === id)
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}
