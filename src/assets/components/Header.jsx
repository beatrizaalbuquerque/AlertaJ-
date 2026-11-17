export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-7">
      <div>
        <h1 className="text-2xl font-bold">
          Monitoramento AlertaJá
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Informações para comunidades mais seguras.
        </p>
      </div>

      <div className="text-sm text-gray-400">
        <span className="text-pink-400">●</span>
        {' '}Sistema de monitoramento
      </div>
    </header>
  )
}