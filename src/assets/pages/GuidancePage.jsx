import { guidance } from '../data/guidance'
import GuidanceCard from '../components/GuidanceCard'
import { BookOpenCheck, ExternalLink } from 'lucide-react'

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
            Informações úteis durante e após alagamentos e inundações.
          </p>
        </div>
      </header>
      <section aria-label="Orientações de prevenção" className="grid gap-4 md:grid-cols-2">
        {guidance.map(item => <GuidanceCard key={item.title} {...item} />)}
      </section>
      <aside className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4 text-sm leading-6 text-gray-300">
        Em situações de emergência, siga os avisos e as instruções das autoridades locais.
        <a
          href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/e/enchentes"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex min-h-11 items-center gap-2 font-medium text-pink-300 underline underline-offset-4 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
        >
          Fonte: Ministério da Saúde — Enchentes
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </aside>
    </main>
  )
}