import Header from '@/components/layout/Header'
import ClipsClient from '@/components/clips/ClipsClient'
import { getClipsByType } from '@/data/clips'

export default function PlayerLibraryPage() {
  const clips = getClipsByType('player')

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <ClipsClient
          clips={clips}
          title="Player Library"
          subtitle="Reference Clips Of Player Performances And Sessions."
          showUpload
        />
      </main>
    </>
  )
}
