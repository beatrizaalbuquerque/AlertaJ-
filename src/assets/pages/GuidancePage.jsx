import { guidance } from '../data/guidance'
import GuidanceCard from '../components/GuidanceCard'

export default function GuidancePage() {
  return (
    <main className="space-y-6 p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Orientações de prevenção</h1>
      </header>
      {guidance.length ? (
        <section className="grid gap-4 md:grid-cols-2">
          {guidance.map(item => <GuidanceCard key={item.title} {...item} />)}
        </section>
      ) : (
        <p className="text-gray-400">
          As orientações aprovadas pelo grupo ainda não foram cadastradas.
        </p>
      )}
    </main>
  )
}