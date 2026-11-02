'use client'

import { useMemo, useState, CSSProperties } from 'react'
import { Partido } from '@/lib/supabase'
import UnirEquipos from './UnirEquipos'
import { calcularH2H, formatFecha, normalizarTexto, parseResultado } from '@/lib/stats'

type Orden = 'jugados' | 'az'

const COLOR = { V: '#22c55e', E: '#eab308', D: '#ef4444' }
const FONDO = { V: 'rgba(34,197,94,0.1)', E: 'rgba(234,179,8,0.1)', D: 'rgba(239,68,68,0.1)' }
const BORDE = { V: 'rgba(34,197,94,0.28)', E: 'rgba(234,179,8,0.28)', D: 'rgba(239,68,68,0.28)' }

function chip(activo: boolean): CSSProperties {
  return {
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    ...(activo
      ? { background: '#F5C900', color: '#00061a', border: '1px solid #F5C900' }
      : { background: '#0a1f4e', color: '#7fa3d4', border: '1px solid #1a3a6e' }),
  }
}

export default function H2H({ partidos, onRefresh }: { partidos: Partido[]; onRefresh: () => void }) {
  const [unirAbierto, setUnirAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [soloFui, setSoloFui] = useState(false)
  const [orden, setOrden] = useState<Orden>('jugados')
  const [expandido, setExpandido] = useState<string | null>(null)

  const rivales = useMemo(() => {
    const base = soloFui ? partidos.filter(p => p.fui) : partidos
    const q = normalizarTexto(busqueda)
    const lista = calcularH2H(base).filter(r => !q || normalizarTexto(r.nombre).includes(q))
    return lista.sort((a, b) =>
      orden === 'az'
        ? a.nombre.localeCompare(b.nombre, 'es')
        : b.stats.total - a.stats.total || a.nombre.localeCompare(b.nombre, 'es')
    )
  }, [partidos, soloFui, busqueda, orden])

  const totalPartidos = rivales.reduce((acc, r) => acc + r.stats.total, 0)

  return (
    <div className="space-y-3">
      {/* Controles */}
      <div className="space-y-2">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar rival..."
          style={{
            width: '100%',
            background: '#0a1f4e',
            border: '1px solid #1a3a6e',
            borderRadius: '10px',
            padding: '11px 14px',
            color: 'white',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button type="button" className="font-display font-bold" style={chip(!soloFui)} onClick={() => setSoloFui(false)}>
            TODOS LOS PARTIDOS
          </button>
          <button type="button" className="font-display font-bold" style={chip(soloFui)} onClick={() => setSoloFui(true)}>
            SOLO LOS QUE FUI
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button type="button" className="font-display font-bold" style={chip(orden === 'jugados')} onClick={() => setOrden('jugados')}>
            MÁS JUGADOS
          </button>
          <button type="button" className="font-display font-bold" style={chip(orden === 'az')} onClick={() => setOrden('az')}>
            A–Z
          </button>
          <button type="button" className="font-display font-bold" style={chip(unirAbierto)} onClick={() => setUnirAbierto(!unirAbierto)}>
            🔗 UNIR EQUIPOS
          </button>
        </div>
        {unirAbierto && <UnirEquipos partidos={partidos} onRefresh={onRefresh} />}
        <p style={{ color: '#3d6499', fontSize: '0.6rem', letterSpacing: '0.15em', paddingLeft: '2px' }} className="font-display">
          {rivales.length} RIVALES · {totalPartidos} PARTIDOS
        </p>
      </div>

      {/* Lista de rivales */}
      {rivales.map(r => {
        const s = r.stats
        const abierto = expandido === r.key
        const dif = r.golesFavor - r.golesContra
        return (
          <div key={r.key} style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '14px', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setExpandido(abierto ? null : r.key)}
              style={{ width: '100%', textAlign: 'left', padding: '12px 14px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-display font-bold">
                    {r.nombre}
                  </p>
                  <p style={{ color: '#3d6499', fontSize: '0.6rem', letterSpacing: '0.12em', marginTop: '2px' }} className="font-display">
                    {s.total} {s.total === 1 ? 'PARTIDO' : 'PARTIDOS'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {(['V', 'E', 'D'] as const).map(k => {
                    const n = k === 'V' ? s.victorias : k === 'E' ? s.empates : s.derrotas
                    return (
                      <div key={k} style={{ background: FONDO[k], border: `1px solid ${BORDE[k]}`, borderRadius: '8px', minWidth: '34px', padding: '5px 4px', textAlign: 'center' }}>
                        <p style={{ color: COLOR[k], fontSize: '1.05rem', lineHeight: 1 }} className="font-display font-bold">{n}</p>
                        <p style={{ color: COLOR[k], fontSize: '0.5rem', letterSpacing: '0.1em', marginTop: '2px', opacity: 0.85 }} className="font-display">{k}</p>
                      </div>
                    )
                  })}
                </div>
                <span style={{ color: '#F5C900', fontSize: '0.7rem', display: 'inline-block', transition: 'transform 0.2s', transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </div>

              {/* Barra V/E/D */}
              <div style={{ background: '#0a1f4e', borderRadius: '999px', height: '4px', overflow: 'hidden', display: 'flex', marginTop: '10px' }}>
                <div style={{ width: `${(s.victorias / s.total) * 100}%`, background: COLOR.V }} />
                <div style={{ width: `${(s.empates / s.total) * 100}%`, background: COLOR.E }} />
                <div style={{ width: `${(s.derrotas / s.total) * 100}%`, background: COLOR.D }} />
              </div>

              {/* Goles y asistencia */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: '#7fa3d4', fontSize: '0.65rem', letterSpacing: '0.08em' }} className="font-display">
                <span>
                  GOLES {r.golesFavor}–{r.golesContra}{' '}
                  <span style={{ color: dif > 0 ? COLOR.V : dif < 0 ? COLOR.D : COLOR.E }}>
                    ({dif > 0 ? '+' : ''}{dif})
                  </span>
                </span>
                <span>
                  FUI <span style={{ color: COLOR.V }}>{s.fui}</span> · NO <span style={{ color: COLOR.D }}>{s.noFui}</span>
                </span>
              </div>
            </button>

            {/* Partidos del rival */}
            {abierto && (
              <div style={{ borderTop: '1px solid #0d2560', padding: '8px 12px 12px' }} className="space-y-1.5">
                {r.partidos.map(p => {
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
                      <span style={{ color: '#3d6499', fontSize: '0.65rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-display">
                        {p.competicion?.trim() || ''}
                      </span>
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

      {rivales.length === 0 && (
        <div className="text-center py-10" style={{ color: '#3d6499' }}>
          <p className="text-4xl mb-2">🔍</p>
          <p className="font-body text-sm">No hay rivales con ese filtro</p>
        </div>
      )}
    </div>
  )
}
