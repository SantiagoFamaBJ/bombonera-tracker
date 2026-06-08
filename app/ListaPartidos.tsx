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
    return <FormPartido partido={editando} onSuccess={() => { setEditando(null); onRefresh() }} onCancel={() => setEditando(null)} />
  }

  return (
    <div className="space-y-2">
      {partidos.map(p => {
        const resultado = parseResultado(p.resultado)
        const isV = resultado === 'V'
        const isE = resultado === 'E'
        const isD = resultado === 'D'

        const resultColor = isV ? '#22c55e' : isE ? '#eab308' : '#ef4444'
        const resultBg = isV ? 'rgba(34,197,94,0.1)' : isE ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)'
        const resultBorder = isV ? 'rgba(34,197,94,0.3)' : isE ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'
        const resultLabel = isV ? 'V' : isE ? 'E' : 'D'

        const fecha = new Date(p.fecha + 'T12:00:00')
        const fechaStr = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })

        return (
          <div key={p.id} style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px' }}
            className="animate-fadein">
            {/* Asistencia badge */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: p.fui ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${p.fui ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '0.05em',
              color: p.fui ? '#22c55e' : '#ef4444',
              fontFamily: 'var(--font-display)'
            }}>
              {p.fui ? 'FUI' : 'NO'}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                className="font-display">{p.rival}</p>
              <p style={{ color: '#3d6499', fontSize: '0.65rem', marginTop: '1px' }} className="font-display">{fechaStr}</p>
            </div>

            {/* Resultado */}
            <div style={{ background: resultBg, border: `1px solid ${resultBorder}`, borderRadius: '10px', padding: '6px 10px', textAlign: 'center', flexShrink: 0 }}>
              <p style={{ color: resultColor, fontSize: '0.85rem', fontWeight: 'bold', lineHeight: 1 }} className="font-display">{p.resultado}</p>
              <p style={{ color: resultColor, fontSize: '0.5rem', letterSpacing: '0.15em', marginTop: '2px', opacity: 0.8 }} className="font-display">{resultLabel}</p>
            </div>

            {/* Acciones */}
            <div className="flex gap-1">
              <button onClick={() => setEditando(p)}
                style={{ color: '#3d6499', padding: '6px', borderRadius: '8px', fontSize: '0.8rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                className="hover:text-boca-amarillo transition-colors">✏️</button>
              {confirmDelete === p.id ? (
                <div className="flex gap-1">
                  <button onClick={() => eliminar(p.id)}
                    style={{ background: '#ef4444', color: 'white', fontSize: '0.6rem', padding: '4px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                    className="font-display font-bold">SÍ</button>
                  <button onClick={() => setConfirmDelete(null)}
                    style={{ background: '#0a1f4e', color: 'white', fontSize: '0.6rem', padding: '4px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                    className="font-display font-bold">NO</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(p.id)}
                  style={{ color: '#3d6499', padding: '6px', borderRadius: '8px', fontSize: '0.8rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  className="hover:text-red-400 transition-colors">🗑️</button>
              )}
            </div>
          </div>
        )
      })}
      {partidos.length === 0 && (
        <div className="text-center py-10" style={{ color: '#3d6499' }}>
          <p className="text-4xl mb-2">⚽</p>
          <p className="font-body text-sm">No hay partidos para mostrar</p>
        </div>
      )}
    </div>
  )
}
