'use client'

type AñoStats = {
  año: number
  stats: {
    fui: number
    noFui: number
    victorias: number
    empates: number
    derrotas: number
    efectividad: number
    invictos: number
    total: number
  }
}

export default function StatsAnuales({ statsPorAño }: { statsPorAño: AñoStats[] }) {
  return (
    <div className="space-y-2">
      <h2 className="font-display text-boca-amarillo text-sm font-bold tracking-widest px-1">
        POR AÑO
      </h2>
      {statsPorAño.map(({ año, stats }) => (
        <div key={año} className="bg-boca-azul rounded-2xl p-4 border border-blue-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-white text-lg font-bold">{año}</h3>
            <span className="text-blue-300 text-xs">{stats.total} partidos</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            <MiniStat label="FUI" value={stats.fui} color="text-green-400" />
            <MiniStat label="NO" value={stats.noFui} color="text-red-400" />
            <MiniStat label="V" value={stats.victorias} color="text-green-300" />
            <MiniStat label="E" value={stats.empates} color="text-yellow-300" />
            <MiniStat label="D" value={stats.derrotas} color="text-red-400" />
          </div>
        </div>
      ))}
      {statsPorAño.length === 0 && (
        <div className="text-center py-10 text-blue-400 font-body">
          <p className="text-4xl mb-2">⚽</p>
          <p>Todavía no cargaste partidos</p>
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-blue-900 rounded-lg p-2 text-center">
      <p className={`font-display text-lg font-bold ${color}`}>{value}</p>
      <p className="text-blue-400 text-xs font-display">{label}</p>
    </div>
  )
}
