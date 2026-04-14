'use client'

type Props = {
  stats: {
    total: number
    fui: number
    noFui: number
    pctAsistencia: number
    victorias: number
    empates: number
    derrotas: number
    efectividad: number
    invictos: number
  }
  total: number
}

export default function StatsGlobales({ stats, total }: Props) {
  return (
    <div className="space-y-3">
      {/* Asistencia */}
      <div className="bg-boca-azul rounded-2xl p-4 border border-blue-700">
        <h2 className="font-display text-boca-amarillo text-sm font-bold tracking-widest mb-3">
          ASISTENCIA TOTAL
        </h2>
        <div className="flex gap-3 mb-3">
          <StatBox label="FUI" value={stats.fui} color="text-green-400" />
          <StatBox label="NO FUI" value={stats.noFui} color="text-red-400" />
          <StatBox label="% ASISTENCIA" value={`${stats.pctAsistencia}%`} color="text-boca-amarillo" />
        </div>
        {/* Barra de asistencia */}
        <div className="w-full bg-blue-900 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-boca-amarillo rounded-full transition-all duration-700"
            style={{ width: `${stats.pctAsistencia}%` }}
          />
        </div>
        <p className="text-blue-300 text-xs mt-1 text-right">{total} partidos totales</p>
      </div>

      {/* Historial */}
      <div className="bg-boca-azul rounded-2xl p-4 border border-blue-700">
        <h2 className="font-display text-boca-amarillo text-sm font-bold tracking-widest mb-3">
          HISTORIAL
        </h2>
        <div className="flex gap-3 mb-4">
          <StatBox label="VICTORIAS" value={stats.victorias} color="text-green-400" />
          <StatBox label="EMPATES" value={stats.empates} color="text-yellow-300" />
          <StatBox label="DERROTAS" value={stats.derrotas} color="text-red-400" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-blue-900 rounded-xl p-3 text-center">
            <p className="text-green-400 font-display text-2xl font-bold">{stats.efectividad}%</p>
            <p className="text-blue-300 text-xs font-display tracking-wide">EFECTIVIDAD</p>
          </div>
          <div className="flex-1 bg-blue-900 rounded-xl p-3 text-center">
            <p className="text-boca-amarillo font-display text-2xl font-bold">{stats.invictos}%</p>
            <p className="text-blue-300 text-xs font-display tracking-wide">INVICTOS</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex-1 bg-blue-900 rounded-xl p-3 text-center">
      <p className={`font-display text-xl font-bold ${color}`}>{value}</p>
      <p className="text-blue-300 text-xs font-display tracking-wide leading-tight">{label}</p>
    </div>
  )
}
