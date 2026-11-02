'use client'

import { useMemo, useState } from 'react'
import { supabase, Partido } from '@/lib/supabase'
import { canonicalizarRival } from '@/lib/equipos'
import { normalizarTexto } from '@/lib/texto'

type Props = { partidos: Partido[]; onRefresh: () => void }

export default function UnirEquipos({ partidos, onRefresh }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [sel, setSel] = useState<string[]>([])
  const [destino, setDestino] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  // Nombres distintos tal cual están guardados, con cantidad de partidos
  const nombres = useMemo(() => {
    const conteo = new Map<string, number>()
    partidos.forEach(p => conteo.set(p.rival, (conteo.get(p.rival) ?? 0) + 1))
    return Array.from(conteo.entries())
      .map(([nombre, n]) => ({ nombre, n }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  }, [partidos])

  const pendientes = nombres.filter(x => canonicalizarRival(x.nombre) !== x.nombre)

  const q = normalizarTexto(busqueda)
  const visibles = nombres.filter(x => !q || normalizarTexto(x.nombre).includes(q))

  function toggle(nombre: string) {
    const nuevo = sel.indexOf(nombre) >= 0 ? sel.filter(n => n !== nombre) : sel.concat(nombre)
    setSel(nuevo)
    if (nuevo.length > 0) {
      // sugerir el nombre más usado entre los elegidos
      const mejor = nombres.filter(x => nuevo.indexOf(x.nombre) >= 0).sort((a, b) => b.n - a.n)[0]
      setDestino(canonicalizarRival(mejor.nombre))
    } else setDestino('')
  }

  async function renombrar(pares: Array<[string, string]>) {
    setGuardando(true); setError(''); setMensaje('')
    for (let i = 0; i < pares.length; i++) {
      const [origen, nuevo] = pares[i]
      if (origen === nuevo) continue
      const { error: err } = await supabase.from('partidos').update({ rival: nuevo }).eq('rival', origen)
      if (err) { setGuardando(false); setError(err.message); return }
    }
    setGuardando(false)
    setSel([])
    setDestino('')
    setMensaje('✅ Listo, equipos unidos')
    onRefresh()
  }

  const boton = { borderRadius: '10px', fontSize: '0.7rem', letterSpacing: '0.08em', padding: '11px 12px', cursor: 'pointer' as const }

  return (
    <div style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '14px', padding: '12px' }} className="space-y-2">
      <p style={{ color: '#F5C900', fontSize: '0.7rem', letterSpacing: '0.15em' }} className="font-display font-bold">UNIR EQUIPOS</p>
      <p style={{ color: '#7fa3d4', fontSize: '0.7rem' }} className="font-body">
        Marcá los nombres que son el mismo equipo, elegí cómo se tiene que llamar y apretá UNIR.
      </p>

      {pendientes.length > 0 && (
        <button
          type="button"
          disabled={guardando}
          onClick={() => renombrar(pendientes.map(x => [x.nombre, canonicalizarRival(x.nombre)] as [string, string]))}
          className="font-display font-bold"
          style={{ ...boton, width: '100%', background: 'rgba(245,201,0,0.12)', color: '#F5C900', border: '1px solid rgba(245,201,0,0.4)' }}
        >
          ✨ NORMALIZAR AUTOMÁTICO ({pendientes.length}): {pendientes.slice(0, 3).map(x => `${x.nombre}→${canonicalizarRival(x.nombre)}`).join(', ')}{pendientes.length > 3 ? '…' : ''}
        </button>
      )}

      <input
        type="text"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        placeholder="🔍 Buscar nombre..."
        style={{ width: '100%', background: '#0a1f4e', border: '1px solid #1a3a6e', borderRadius: '10px', padding: '10px 14px', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
      />

      <div style={{ maxHeight: '220px', overflowY: 'auto' }} className="space-y-1">
        {visibles.map(x => {
          const marcado = sel.indexOf(x.nombre) >= 0
          return (
            <button
              key={x.nombre}
              type="button"
              onClick={() => toggle(x.nombre)}
              style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px',
                background: marcado ? 'rgba(245,201,0,0.1)' : '#040f2a',
                border: `1px solid ${marcado ? 'rgba(245,201,0,0.5)' : '#0d2560'}`,
                borderRadius: '8px', padding: '8px 10px', cursor: 'pointer',
              }}
            >
              <span style={{ width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: marcado ? '#F5C900' : '#0a1f4e', border: `1px solid ${marcado ? '#F5C900' : '#1a3a6e'}`, color: '#00061a', fontSize: '0.7rem', fontWeight: 'bold' }}>
                {marcado ? '✓' : ''}
              </span>
              <span style={{ color: 'white', fontSize: '0.8rem', flex: 1 }} className="font-display font-bold">{x.nombre}</span>
              <span style={{ color: '#3d6499', fontSize: '0.65rem' }} className="font-display">{x.n}</span>
            </button>
          )
        })}
      </div>

      {sel.length >= 1 && (
        <>
          <input
            type="text"
            value={destino}
            onChange={e => setDestino(e.target.value)}
            placeholder="Nombre final..."
            style={{ width: '100%', background: '#0a1f4e', border: '1px solid #1a3a6e', borderRadius: '10px', padding: '10px 14px', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
          />
          <button
            type="button"
            disabled={guardando || !destino.trim()}
            onClick={() => renombrar(sel.map(n => [n, destino.trim()] as [string, string]))}
            className="font-display font-bold"
            style={{ ...boton, width: '100%', background: 'linear-gradient(135deg, #F5C900, #e6b800)', color: '#00061a', border: 'none', opacity: guardando || !destino.trim() ? 0.4 : 1 }}
          >
            {guardando ? 'GUARDANDO...' : `UNIR ${sel.length} NOMBRE${sel.length === 1 ? '' : 'S'} COMO "${destino.trim()}"`}
          </button>
        </>
      )}

      {error && <p style={{ color: '#ef4444', fontSize: '0.75rem' }} className="font-body">{error}</p>}
      {mensaje && <p style={{ color: '#22c55e', fontSize: '0.75rem' }} className="font-body">{mensaje}</p>}
    </div>
  )
}
