import Header from '@/components/layout/Header'
import ClipsClient from '@/components/clips/ClipsClient'
import { getClipsByType } from '@/data/clips'

export default function CoachClipsPage() {
  const clips = getClipsByType('coach')

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <ClipsClient
          clips={clips}
          title="Coach Clips"
          subtitle="Your Personal Library Of Drills, Patterns, And Teaching Clips."
          showUpload
          variant="coach"
        />
      </main>
    </>
  )
}
