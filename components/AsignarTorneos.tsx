'use client'

import { useMemo, useState } from 'react'
import { supabase, Partido } from '@/lib/supabase'
import { COMPETICIONES } from '@/lib/competiciones'
import { formatFecha, normalizarTexto, ordenarPorFecha, parseResultado } from '@/lib/stats'

type Props = { partidos: Partido[]; onRefresh: () => void; onClose: () => void }

const COLOR = { V: '#22c55e', E: '#eab308', D: '#ef4444' }

export default function AsignarTorneos({ partidos, onRefresh, onClose }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [año, setAño] = useState('todos')
  const [soloSin, setSoloSin] = useState(true)
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set())
  const [torneo, setTorneo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const años = useMemo(() => {
    const set = new Set<string>()
    partidos.forEach(p => set.add(p.fecha.slice(0, 4)))
    return Array.from(set).sort()
  }, [partidos])

  const visibles = useMemo(() => {
    const q = normalizarTexto(busqueda)
    return ordenarPorFecha(partidos).filter(p => {
      if (soloSin && p.competicion?.trim()) return false
      if (año !== 'todos' && p.fecha.slice(0, 4) !== año) return false
      if (q && !normalizarTexto(p.rival).includes(q)) return false
      return true
    })
  }, [partidos, busqueda, año, soloSin])

  function toggle(id: string) {
    setSeleccion(prev => {
      const next = new Set<string>(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function seleccionarVisibles() {
    setSeleccion(prev => {
      const next = new Set<string>(prev)
      visibles.forEach(p => next.add(p.id))
      return next
    })
  }

  async function aplicar(valor: string | null) {
    const ids = Array.from(seleccion)
    if (ids.length === 0) return
    setGuardando(true)
    setError('')
    setMensaje('')

    for (let i = 0; i < ids.length; i += 50) {
      const lote = ids.slice(i, i + 50)
      const { error: err } = await supabase.from('partidos').update({ competicion: valor }).in('id', lote)
      if (err) {
        setGuardando(false)
        setError(
          err.message.includes('competicion')
            ? 'Falta crear la columna "competicion" en Supabase (corré el SQL del archivo supabase-competicion.sql).'
            : err.message
        )
        return
      }
    }

    setGuardando(false)
    setMensaje(valor ? `✅ ${ids.length} partidos → ${valor}` : `✅ Torneo borrado en ${ids.length} partidos`)
    setSeleccion(new Set())
    onRefresh()
  }

  const chip = (activo: boolean) => ({
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
    ...(activo
      ? { background: '#F5C900', color: '#00061a', border: '1px solid #F5C900' }
      : { background: '#0a1f4e', color: '#7fa3d4', border: '1px solid #1a3a6e' }),
  })

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="font-display font-bold"
          style={{ background: '#0a1f4e', color: '#7fa3d4', border: '1px solid #1a3a6e', borderRadius: '10px', padding: '8px 12px', fontSize: '0.7rem', letterSpacing: '0.08em' }}
        >
          ← VOLVER
        </button>
        <h2 style={{ color: '#F5C900', fontSize: '0.8rem', letterSpacing: '0.2em' }} className="font-display font-bold">ASIGNAR TORNEOS</h2>
      </div>

      {/* Filtros */}
      <input
        type="text"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        placeholder="🔍 Filtrar por rival..."
        style={{ width: '100%', background: '#0a1f4e', border: '1px solid #1a3a6e', borderRadius: '10px', padding: '11px 14px', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button type="button" className="font-display font-bold" style={chip(año === 'todos')} onClick={() => setAño('todos')}>TODOS</button>
        {años.map(a => (
          <button key={a} type="button" className="font-display font-bold" style={chip(año === a)} onClick={() => setAño(a)}>{a}</button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button type="button" className="font-display font-bold" style={chip(soloSin)} onClick={() => setSoloSin(true)}>SOLO SIN TORNEO</button>
        <button type="button" className="font-display font-bold" style={chip(!soloSin)} onClick={() => setSoloSin(false)}>TODOS</button>
        <button type="button" className="font-display font-bold" style={{ ...chip(false), color: '#F5C900', border: '1px solid rgba(245,201,0,0.4)' }} onClick={seleccionarVisibles}>
          SELECCIONAR LOS {visibles.length}
        </button>
        {seleccion.size > 0 && (
          <button type="button" className="font-display font-bold" style={chip(false)} onClick={() => setSeleccion(new Set())}>LIMPIAR</button>
        )}
      </div>

      {/* Lista */}
      <div className="space-y-1.5">
        {visibles.map(p => {
          const marcado = seleccion.has(p.id)
          const res = parseResultado(p.resultado)
          return (
            <button
              key={p.id}
              type="button"
              role="checkbox"
              aria-checked={marcado}
              onClick={() => toggle(p.id)}
              style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '10px',
                background: marcado ? 'rgba(245,201,0,0.1)' : '#020e2e',
                border: `1px solid ${marcado ? 'rgba(245,201,0,0.5)' : '#0d2560'}`,
                borderRadius: '10px', padding: '10px 12px', cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: marcado ? '#F5C900' : '#0a1f4e',
                  border: `1px solid ${marcado ? '#F5C900' : '#1a3a6e'}`,
                  color: '#00061a', fontSize: '0.8rem', fontWeight: 'bold',
                }}
              >
                {marcado ? '✓' : ''}
              </span>
              <span style={{ color: '#7fa3d4', fontSize: '0.7rem', flexShrink: 0 }} className="font-display">{formatFecha(p.fecha)}</span>
              <span style={{ color: 'white', fontSize: '0.8rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-display font-bold">
                {p.rival}
              </span>
              {p.competicion?.trim() && (
                <span style={{ color: '#3d6499', fontSize: '0.6rem', flexShrink: 0, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-display">
                  {p.competicion}
                </span>
              )}
              <span style={{ color: res ? COLOR[res] : '#7fa3d4', fontSize: '0.8rem', flexShrink: 0 }} className="font-display font-bold">{p.resultado}</span>
            </button>
          )
        })}
        {visibles.length === 0 && (
          <div className="text-center py-8" style={{ color: '#3d6499' }}>
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-body text-sm">No hay partidos con este filtro</p>
          </div>
        )}
      </div>

      {/* Barra de acción fija abajo */}
      <div
        style={{
          position: 'sticky', bottom: 0, zIndex: 5,
          background: '#020e2e', border: '1px solid #0d2560', borderRadius: '14px',
          padding: '12px 12px calc(12px + env(safe-area-inset-bottom))',
          boxShadow: '0 -8px 24px rgba(0,6,26,0.8)',
        }}
        className="space-y-2"
      >
        <p style={{ color: seleccion.size > 0 ? '#F5C900' : '#3d6499', fontSize: '0.65rem', letterSpacing: '0.15em' }} className="font-display font-bold">
          {seleccion.size} SELECCIONADOS
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {COMPETICIONES.map(c => (
            <button key={c} type="button" className="font-display font-bold" style={chip(torneo === c)} onClick={() => setTorneo(c)}>
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={torneo}
          onChange={e => setTorneo(e.target.value)}
          placeholder="O escribí otro torneo..."
          style={{ width: '100%', background: '#0a1f4e', border: '1px solid #1a3a6e', borderRadius: '10px', padding: '10px 14px', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
        />
        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(239,68,68,0.2)' }} className="font-body">{error}</p>
        )}
        {mensaje && <p style={{ color: '#22c55e', fontSize: '0.75rem' }} className="font-body">{mensaje}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
          <button
            type="button"
            disabled={guardando || seleccion.size === 0}
            onClick={() => aplicar(null)}
            className="font-display font-bold"
            style={{ padding: '12px', background: '#0a1f4e', color: '#7fa3d4', borderRadius: '10px', border: '1px solid #1a3a6e', fontSize: '0.65rem', letterSpacing: '0.08em', opacity: guardando || seleccion.size === 0 ? 0.4 : 1 }}
          >
            QUITAR TORNEO
          </button>
          <button
            type="button"
            disabled={guardando || seleccion.size === 0 || !torneo.trim()}
            onClick={() => aplicar(torneo.trim())}
            className="font-display font-bold"
            style={{ padding: '12px', background: 'linear-gradient(135deg, #F5C900, #e6b800)', color: '#00061a', borderRadius: '10px', border: 'none', fontSize: '0.75rem', letterSpacing: '0.08em', opacity: guardando || seleccion.size === 0 || !torneo.trim() ? 0.4 : 1 }}
          >
            {guardando ? 'GUARDANDO...' : `APLICAR A ${seleccion.size}`}
          </button>
        </div>
      </div>
    </div>
  )
}
