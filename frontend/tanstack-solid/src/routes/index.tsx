import { createFileRoute } from '@tanstack/solid-router'
import { HanoiPageClient } from '../components/HanoiPageClient'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <main class="container mx-auto flex-1 px-4 py-6">
      <HanoiPageClient />
    </main>
  )
}
