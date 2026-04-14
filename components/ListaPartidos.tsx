'use client'

import { useState } from 'react'
import { supabase, Partido } from '@/lib/supabase'
import { parseResultado } from '@/lib/stats'
import FormPartido from './FormPartido'

export default function ListaPartidos({ partidos, onRefresh }: { partidos: Partido[]; onRefresh: () => void }) {
  const [editando, setEditando] = useState<Partido | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function eliminar(id: string) {
    await supabase.from('partidos').delete().eq('id', id)
    setConfirmDelete(null)
    onRefresh()
  }

  if (editando) {
    return (
      <FormPartido
        partido={editando}
        onSuccess={() => { setEditando(null); onRefresh() }}
        onCancel={() => setEditando(null)}
      />
    )
  }

  return (
    <div className="space-y-2">
      {partidos.map(p => {
        const resultado = parseResultado(p.resultado)
        const colorResultado =
          resultado === 'V' ? 'text-green-400' :
          resultado === 'E' ? 'text-yellow-300' : 'text-red-400'
        const bgBadge =
          resultado === 'V' ? 'bg-green-900/60' :
          resultado === 'E' ? 'bg-yellow-900/60' : 'bg-red-900/60'

        const fecha = new Date(p.fecha + 'T12:00:00')
        const fechaStr = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

        return (
          <div key={p.id} className="bg-boca-azul rounded-xl p-3 border border-blue-700 flex items-center gap-3 animate-fadein">
            {/* Asistencia dot */}
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${p.fui ? 'bg-green-400' : 'bg-red-500'}`} />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-white text-sm truncate">{p.rival}</p>
              <p className="text-blue-300 text-xs">{fechaStr}</p>
            </div>

            {/* Resultado */}
            <div className={`${bgBadge} rounded-lg px-2.5 py-1 text-center flex-shrink-0`}>
              <p className={`font-display font-bold text-base ${colorResultado}`}>{p.resultado}</p>
            </div>

            {/* Acciones */}
            <div className="flex gap-1">
              <button
                onClick={() => setEditando(p)}
                className="text-blue-300 hover:text-boca-amarillo p-1.5 rounded-lg transition-colors"
              >
                ✏️
              </button>
              {confirmDelete === p.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => eliminar(p.id)}
                    className="bg-red-600 text-white text-xs px-2 py-1 rounded-lg font-display font-bold"
                  >
                    SÍ
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="bg-blue-700 text-white text-xs px-2 py-1 rounded-lg font-display font-bold"
                  >
                    NO
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(p.id)}
                  className="text-blue-400 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        )
      })}
      {partidos.length === 0 && (
        <div className="text-center py-10 text-blue-400 font-body">
          <p className="text-4xl mb-2">⚽</p>
          <p>No hay partidos para mostrar</p>
        </div>
      )}
    </div>
  )
}
