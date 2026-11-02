'use client'

import { useMemo, useState } from 'react'
import { Partido } from '@/lib/supabase'
import { SIN_TORNEO_KEY } from '@/lib/competiciones'
import { calcularStatsPorCompeticion, formatFecha, parseResultado } from '@/lib/stats'
import AsignarTorneos from './AsignarTorneos'

const COLOR = { V: '#22c55e', E: '#eab308', D: '#ef4444' }
const FONDO = { V: 'rgba(34,197,94,0.1)', E: 'rgba(234,179,8,0.1)', D: 'rgba(239,68,68,0.1)' }
const BORDE = { V: 'rgba(34,197,94,0.28)', E: 'rgba(234,179,8,0.28)', D: 'rgba(239,68,68,0.28)' }

function Caja({ valor, label, color, fondo, borde }: { valor: number; label: string; color: string; fondo: string; borde: string }) {
  return (
    <div style={{ background: fondo, border: `1px solid ${borde}`, borderRadius: '10px', padding: '10px 4px', textAlign: 'center' }}>
      <p style={{ color, fontSize: '1.4rem', lineHeight: 1 }} className="font-display font-bold">{valor}</p>
      <p style={{ color, fontSize: '0.55rem', letterSpacing: '0.1em', marginTop: '3px' }} className="font-display">{label}</p>
    </div>
  )
}

export default function Torneos({ partidos, onRefresh }: { partidos: Partido[]; onRefresh: () => void }) {
  const [asignando, setAsignando] = useState(false)
  const [expandido, setExpandido] = useState<string | null>(null)

  const grupos = useMemo(() => calcularStatsPorCompeticion(partidos), [partidos])
  const sinAsignar = partidos.filter(p => !p.competicion?.trim()).length

  if (asignando) {
    return <AsignarTorneos partidos={partidos} onRefresh={onRefresh} onClose={() => setAsignando(false)} />
  }

  return (
    <div className="space-y-3">
      {/* Banner asignación */}
      <div
        style={{
          background: sinAsignar > 0 ? 'rgba(245,201,0,0.08)' : '#020e2e',
          border: `1px solid ${sinAsignar > 0 ? 'rgba(245,201,0,0.35)' : '#0d2560'}`,
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: sinAsignar > 0 ? '#F5C900' : '#7fa3d4', fontSize: '0.8rem' }} className="font-display font-bold">
            {sinAsignar > 0 ? `${sinAsignar} partidos sin torneo` : 'Todos los partidos tienen torneo'}
          </p>
          <p style={{ color: '#3d6499', fontSize: '0.65rem', marginTop: '2px' }} className="font-body">
            Elegí varios y asignales el torneo de una
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAsignando(true)}
          className="font-display font-bold"
          style={{ background: 'linear-gradient(135deg, #F5C900, #e6b800)', color: '#00061a', borderRadius: '10px', padding: '10px 14px', fontSize: '0.7rem', letterSpacing: '0.08em', flexShrink: 0 }}
        >
          {sinAsignar > 0 ? 'ASIGNAR' : 'EDITAR'}
        </button>
      </div>

      {/* Cards por torneo */}
      {grupos.map(g => {
        const s = g.stats
        const abierto = expandido === g.key
        const sinTorneo = g.key === SIN_TORNEO_KEY
        return (
          <div key={g.key} style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '14px', overflow: 'hidden', opacity: sinTorneo ? 0.85 : 1 }}>
            <button
              type="button"
              onClick={() => setExpandido(abierto ? null : g.key)}
              style={{ width: '100%', background: 'linear-gradient(90deg, #001a4d, #020e2e)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #0d2560', cursor: 'pointer' }}
            >
              <span style={{ color: sinTorneo ? '#7fa3d4' : 'white', fontSize: '1rem', textAlign: 'left' }} className="font-display font-bold">
                {sinTorneo ? '❔ ' : '🏆 '}{g.nombre}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{ color: '#3d6499', fontSize: '0.6rem', letterSpacing: '0.1em' }} className="font-display">{s.total} partidos</span>
                <span style={{ color: '#F5C900', fontSize: '0.75rem', display: 'inline-block', transition: 'transform 0.2s', transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </div>
            </button>

            <div className="p-3">
              <p style={{ color: '#3d6499', fontSize: '0.55rem', letterSpacing: '0.2em', marginBottom: '6px' }} className="font-display">ASISTENCIA</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                <Caja valor={s.fui} label="✅ FUI" color="#22c55e" fondo="rgba(34,197,94,0.12)" borde="rgba(34,197,94,0.35)" />
                <Caja valor={s.noFui} label="❌ NO FUI" color="#ef4444" fondo="rgba(239,68,68,0.12)" borde="rgba(239,68,68,0.35)" />
              </div>
              <div style={{ background: '#0a1f4e', borderRadius: '999px', height: '5px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ width: `${s.pctAsistencia}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '999px' }} />
              </div>

              <p style={{ color: '#3d6499', fontSize: '0.55rem', letterSpacing: '0.2em', marginBottom: '6px' }} className="font-display">RESULTADOS</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <Caja valor={s.victorias} label="VICTORIAS" color={COLOR.V} fondo={FONDO.V} borde={BORDE.V} />
                <Caja valor={s.empates} label="EMPATES" color={COLOR.E} fondo={FONDO.E} borde={BORDE.E} />
                <Caja valor={s.derrotas} label="DERROTAS" color={COLOR.D} fondo={FONDO.D} borde={BORDE.D} />
              </div>
              <div style={{ background: '#0a1f4e', borderRadius: '999px', height: '5px', overflow: 'hidden', display: 'flex', marginTop: '8px' }}>
                <div style={{ width: `${(s.victorias / s.total) * 100}%`, background: COLOR.V }} />
                <div style={{ width: `${(s.empates / s.total) * 100}%`, background: COLOR.E }} />
                <div style={{ width: `${(s.derrotas / s.total) * 100}%`, background: COLOR.D }} />
              </div>
            </div>

            {abierto && (
              <div style={{ borderTop: '1px solid #0d2560', padding: '8px 12px 12px' }} className="space-y-1.5">
                {g.partidos.map(p => {
                  const res = parseResultado(p.resultado)
                  const color = res ? COLOR[res] : '#7fa3d4'
                  const fondo = res ? FONDO[res] : 'rgba(127,163,212,0.1)'
                  const borde = res ? BORDE[res] : 'rgba(127,163,212,0.28)'
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#040f2a', borderRadius: '8px', padding: '8px 10px' }}>
                      <div
                        className="font-display"
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.55rem', fontWeight: 'bold',
                          background: p.fui ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          border: `1px solid ${p.fui ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                          color: p.fui ? '#22c55e' : '#ef4444',
                        }}
                      >
                        {p.fui ? 'FUI' : 'NO'}
                      </div>
                      <span style={{ color: '#7fa3d4', fontSize: '0.7rem', flexShrink: 0 }} className="font-display">{formatFecha(p.fecha)}</span>
                      <span style={{ color: 'white', fontSize: '0.78rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-display font-bold">{p.rival}</span>
                      <div style={{ background: fondo, border: `1px solid ${borde}`, borderRadius: '7px', padding: '4px 10px', flexShrink: 0 }}>
                        <p style={{ color, fontSize: '0.8rem', fontWeight: 'bold', lineHeight: 1 }} className="font-display">{p.resultado}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {partidos.length === 0 && (
        <div className="text-center py-10" style={{ color: '#3d6499' }}>
          <p className="text-4xl mb-2">🏆</p>
          <p className="font-body text-sm">Todavía no hay partidos cargados</p>
        </div>
      )}
    </div>
  )
}
