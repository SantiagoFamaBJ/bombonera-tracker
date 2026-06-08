'use client'

import { useState } from 'react'
import { Partido } from '@/lib/supabase'
import { parseResultado } from '@/lib/stats'

type AñoStats = {
  año: number
  partidos: Partido[]
  stats: { fui: number; noFui: number; victorias: number; empates: number; derrotas: number; total: number }
}

export default function StatsAnuales({ statsPorAño }: { statsPorAño: AñoStats[] }) {
  const [expandido, setExpandido] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      <p style={{ color: '#F5C900', fontSize: '0.65rem', letterSpacing: '0.2em', paddingLeft: '4px' }} className="font-display font-bold">
        📅 POR AÑO
      </p>
      {statsPorAño.map(({ año, stats, partidos }) => {
        const abierto = expandido === año
        const pctFui = Math.round((stats.fui / stats.total) * 100)

        return (
          <div key={año} style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '14px', overflow: 'hidden' }}>
            {/* Header clickeable */}
            <button
              type="button"
              onClick={() => setExpandido(abierto ? null : año)}
              style={{ width: '100%', background: 'linear-gradient(90deg, #001a4d, #020e2e)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #0d2560', cursor: 'pointer' }}
            >
              <span style={{ color: 'white', fontSize: '1.1rem' }} className="font-display font-bold">{año}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#3d6499', fontSize: '0.6rem', letterSpacing: '0.1em' }} className="font-display">{stats.total} partidos</span>
                <span style={{ color: '#F5C900', fontSize: '0.75rem', transition: 'transform 0.2s', display: 'inline-block', transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </div>
            </button>

            {/* Stats del año — siempre visibles */}
            <div className="p-3">
              {/* ASISTENCIA */}
              <p style={{ color: '#3d6499', fontSize: '0.55rem', letterSpacing: '0.2em', marginBottom: '6px' }} className="font-display">ASISTENCIA</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                <div style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.35)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
                  <p style={{ color: '#22c55e', fontSize: '1.5rem', lineHeight: 1 }} className="font-display font-bold">{stats.fui}</p>
                  <p style={{ color: '#22c55e', fontSize: '0.6rem', letterSpacing: '0.1em', marginTop: '3px' }} className="font-display">✅ FUI</p>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.35)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
                  <p style={{ color: '#ef4444', fontSize: '1.5rem', lineHeight: 1 }} className="font-display font-bold">{stats.noFui}</p>
                  <p style={{ color: '#ef4444', fontSize: '0.6rem', letterSpacing: '0.1em', marginTop: '3px' }} className="font-display">❌ NO FUI</p>
                </div>
              </div>
              {/* Barra asistencia */}
              <div style={{ background: '#0a1f4e', borderRadius: '999px', height: '5px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ width: `${pctFui}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '999px' }} />
              </div>

              {/* RESULTADOS */}
              <p style={{ color: '#3d6499', fontSize: '0.55rem', letterSpacing: '0.2em', marginBottom: '6px' }} className="font-display">RESULTADOS</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', padding: '10px 4px', textAlign: 'center' }}>
                  <p style={{ color: '#22c55e', fontSize: '1.5rem', lineHeight: 1 }} className="font-display font-bold">{stats.victorias}</p>
                  <p style={{ color: '#22c55e', fontSize: '0.55rem', letterSpacing: '0.1em', marginTop: '3px' }} className="font-display">VICTORIAS</p>
                </div>
                <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: '10px', padding: '10px 4px', textAlign: 'center' }}>
                  <p style={{ color: '#eab308', fontSize: '1.5rem', lineHeight: 1 }} className="font-display font-bold">{stats.empates}</p>
                  <p style={{ color: '#eab308', fontSize: '0.55rem', letterSpacing: '0.1em', marginTop: '3px' }} className="font-display">EMPATES</p>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '10px 4px', textAlign: 'center' }}>
                  <p style={{ color: '#ef4444', fontSize: '1.5rem', lineHeight: 1 }} className="font-display font-bold">{stats.derrotas}</p>
                  <p style={{ color: '#ef4444', fontSize: '0.55rem', letterSpacing: '0.1em', marginTop: '3px' }} className="font-display">DERROTAS</p>
                </div>
              </div>
              {/* Barra V/E/D */}
              <div style={{ background: '#0a1f4e', borderRadius: '999px', height: '5px', overflow: 'hidden', display: 'flex', marginTop: '8px' }}>
                <div style={{ width: `${(stats.victorias/stats.total)*100}%`, background: '#22c55e' }} />
                <div style={{ width: `${(stats.empates/stats.total)*100}%`, background: '#eab308' }} />
                <div style={{ width: `${(stats.derrotas/stats.total)*100}%`, background: '#ef4444' }} />
              </div>
            </div>

            {/* Lista de partidos expandible */}
            {abierto && (
              <div style={{ borderTop: '1px solid #0d2560', padding: '8px 12px 12px' }}>
                <p style={{ color: '#3d6499', fontSize: '0.55rem', letterSpacing: '0.2em', marginBottom: '8px', paddingTop: '4px' }} className="font-display">PARTIDOS {año}</p>
                <div className="space-y-1.5">
                  {partidos
                    .slice()
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map(p => {
                      const res = parseResultado(p.resultado)
                      const resColor = res === 'V' ? '#22c55e' : res === 'E' ? '#eab308' : '#ef4444'
                      const resBg = res === 'V' ? 'rgba(34,197,94,0.1)' : res === 'E' ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)'
                      const resBorder = res === 'V' ? 'rgba(34,197,94,0.25)' : res === 'E' ? 'rgba(234,179,8,0.25)' : 'rgba(239,68,68,0.25)'
                      const fecha = new Date(p.fecha + 'T12:00:00')
                      const fechaStr = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })

                      return (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#040f2a', borderRadius: '8px', padding: '8px 10px' }}>
                          {/* Asistencia */}
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 'bold', letterSpacing: '0.05em', fontFamily: 'var(--font-display)', background: p.fui ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${p.fui ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: p.fui ? '#22c55e' : '#ef4444' }}>
                            {p.fui ? 'FUI' : 'NO'}
                          </div>
                          {/* Fecha */}
                          <span style={{ color: '#3d6499', fontSize: '0.65rem', flexShrink: 0, width: '32px' }} className="font-display">{fechaStr}</span>
                          {/* Rival */}
                          <span style={{ color: 'white', fontSize: '0.78rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-display font-bold">{p.rival}</span>
                          {/* Resultado */}
                          <div style={{ background: resBg, border: `1px solid ${resBorder}`, borderRadius: '7px', padding: '4px 8px', textAlign: 'center', flexShrink: 0 }}>
                            <p style={{ color: resColor, fontSize: '0.75rem', fontWeight: 'bold', lineHeight: 1 }} className="font-display">{p.resultado}</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
