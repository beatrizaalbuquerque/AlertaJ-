import { guidance } from '../data/guidance'
import GuidanceCard from '../components/GuidanceCard'
import EmptyState from '../components/EmptyState'
import { BookOpenCheck } from 'lucide-react'

export default function GuidancePage() {
  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:p-8">
      <header className="flex items-start gap-4 border-b border-white/10 pb-5">
        <span aria-hidden="true" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-500/10 text-pink-300">
          <BookOpenCheck size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold">Prevenção</h1>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Orientações preventivas cadastradas pela equipe do AlertaJá.
          </p>
        </div>
      </header>
      {guidance.length ? (
        <section className="grid gap-4 md:grid-cols-2">
          {guidance.map(item => <GuidanceCard key={item.title} {...item} />)}
        </section>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-[#1b1b22] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Conteúdo ainda não disponível</h2>
          <EmptyState className="mt-4">
            As orientações aprovadas pelo grupo ainda não foram cadastradas. Nenhuma recomendação foi adicionada sem validação da equipe.
          </EmptyState>
        </section>
      )}
    </main>
  )
}