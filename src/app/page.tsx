import Header from '@/components/layout/Header'
import TraineesClient from '@/components/trainees/TraineesClient'
import { TRAINEES } from '@/data/trainees'

export default function TraineesPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <TraineesClient trainees={TRAINEES} />
      </main>
    </>
  )
}
