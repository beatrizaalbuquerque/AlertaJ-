import { MapPin } from 'lucide-react'

export default function Header() {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
      <div className="min-w-0">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-pink-300">
          <MapPin size={14} aria-hidden="true" />
          Itaquaquecetuba · São Paulo
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Monitoramento AlertaJá
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Informações para comunidades mais seguras.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-gray-400">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pink-400" />
        Dados comunitários
      </div>
    </header>
  )
}