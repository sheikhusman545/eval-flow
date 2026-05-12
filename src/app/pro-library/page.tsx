import Header from '@/components/layout/Header'
import ClipsClient from '@/components/clips/ClipsClient'
import { getClipsByType } from '@/data/clips'

export default function ProLibraryPage() {
  const clips = getClipsByType('pro')

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <ClipsClient
          clips={clips}
          title="Pro Library"
          subtitle="Professional Reference Footage For Teaching And Comparison."
          showUpload
          variant="pro"
        />
      </main>
    </>
  )
}
