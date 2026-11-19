import { guidance } from '../data/guidance'
import GuidanceCard from '../components/GuidanceCard'
import { ExternalLink, ShieldCheck } from 'lucide-react'

export default function GuidancePage() {
  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:space-y-8 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pink-300">Informação para prevenção</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Prevenção</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Cuidados de saúde e segurança durante e após alagamentos.
          </p>
        </div>
        <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-pink-300/15 text-pink-300">
          <ShieldCheck size={20} />
        </span>
      </header>
      <section aria-label="Orientações de prevenção" className="max-w-4xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-gray-300">Orientações essenciais</h2>
          <span className="text-xs text-gray-600">Selecione para ler</span>
        </div>
        {guidance.map((item, index) => (
          <GuidanceCard key={item.title} {...item} index={index} />
        ))}
      </section>
      <aside className="max-w-4xl border-l-2 border-pink-300/50 py-1 pl-4 text-sm leading-6 text-gray-400">
        <p>Em uma emergência, siga os avisos e as instruções das autoridades locais.</p>
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
          <a
            href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/e/enchentes/enchentes"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-medium text-pink-300 underline underline-offset-4 hover:text-pink-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
          >
            Ministério da Saúde — Enchentes
            <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a
            href="https://www.defesacivil.sp.gov.br/dicas-de-prevencao/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-medium text-pink-300 underline underline-offset-4 hover:text-pink-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
          >
            Defesa Civil SP — Dicas de prevenção
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </aside>
    </main>
  )
}