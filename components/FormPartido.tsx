'use client'

import { useState } from 'react'
import { supabase, Partido } from '@/lib/supabase'

type Props = { partido?: Partido; onSuccess: () => void; onCancel: () => void }

export default function FormPartido({ partido, onSuccess, onCancel }: Props) {
  const [fecha, setFecha] = useState(partido?.fecha ?? new Date().toISOString().split('T')[0])
  const [rival, setRival] = useState(partido?.rival ?? '')
  const [resultado, setResultado] = useState(partido?.resultado ?? '')
  const [fui, setFui] = useState(partido?.fui ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!rival.trim()) return setError('Ingresá el rival')
    if (!resultado.trim()) return setError('Ingresá el resultado (ej: 2-0)')
    if (!/^\d+-\d+$/.test(resultado.trim())) return setError('Formato inválido. Usá: 2-0')
    setLoading(true); setError('')
    const data = { fecha, rival: rival.trim(), resultado: resultado.trim(), fui }
    const { error: err } = partido
      ? await supabase.from('partidos').update(data).eq('id', partido.id)
      : await supabase.from('partidos').insert([data])
    setLoading(false)
    if (err) { setError(err.message); return }
    onSuccess()
  }

  const inputStyle = {
    width: '100%', background: '#0a1f4e', border: '1px solid #1a3a6e', borderRadius: '10px',
    padding: '12px 16px', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    outline: 'none'
  }
  const labelStyle = { color: '#7fa3d4', fontSize: '0.6rem', letterSpacing: '0.2em', display: 'block', marginBottom: '6px' }

  return (
    <div style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '16px', overflow: 'hidden' }}
      className="animate-fadein">
      <div style={{ background: 'linear-gradient(90deg, #003082, #001a4d)', padding: '12px 16px', borderBottom: '1px solid #0d2560' }}>
        <h2 style={{ color: '#F5C900', fontSize: '0.75rem', letterSpacing: '0.2em' }} className="font-display font-bold">
          {partido ? '✏️ EDITAR PARTIDO' : '➕ NUEVO PARTIDO'}
        </h2>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label style={labelStyle} className="font-display">FECHA</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle} className="font-display">RIVAL</label>
          <input type="text" value={rival} onChange={e => setRival(e.target.value)}
            placeholder="Ej: River Plate" style={{ ...inputStyle, color: rival ? 'white' : '#3d6499' }} />
        </div>
        <div>
          <label style={labelStyle} className="font-display">RESULTADO</label>
          <input type="text" value={resultado} onChange={e => setResultado(e.target.value)}
            placeholder="Ej: 2-0" style={{ ...inputStyle, color: resultado ? 'white' : '#3d6499' }} />
          <p style={{ color: '#3d6499', fontSize: '0.6rem', marginTop: '4px' }} className="font-display">Primero los goles de Boca</p>
        </div>

        <div>
          <label style={labelStyle} className="font-display">¿FUISTE?</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button type="button" onClick={() => setFui(true)}
              style={{
                padding: '14px', borderRadius: '10px', fontFamily: 'var(--font-display)', fontWeight: 'bold',
                fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
                background: fui ? 'rgba(34,197,94,0.15)' : '#0a1f4e',
                border: fui ? '2px solid rgba(34,197,94,0.6)' : '1px solid #1a3a6e',
                color: fui ? '#22c55e' : '#3d6499'
              }}>
              ✅ SÍ, FUI
            </button>
            <button type="button" onClick={() => setFui(false)}
              style={{
                padding: '14px', borderRadius: '10px', fontFamily: 'var(--font-display)', fontWeight: 'bold',
                fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
                background: !fui ? 'rgba(239,68,68,0.15)' : '#0a1f4e',
                border: !fui ? '2px solid rgba(239,68,68,0.6)' : '1px solid #1a3a6e',
                color: !fui ? '#ef4444' : '#3d6499'
              }}>
              ❌ NO FUI
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.8rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', padding: '10px 14px', border: '1px solid rgba(239,68,68,0.2)' }}
            className="font-body">{error}</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '4px' }}>
          <button type="button" onClick={onCancel}
            style={{ padding: '13px', background: '#0a1f4e', color: '#7fa3d4', borderRadius: '10px', border: '1px solid #1a3a6e', fontFamily: 'var(--font-display)', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer' }}>
            CANCELAR
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading}
            style={{ padding: '13px', background: loading ? '#8a7200' : 'linear-gradient(135deg, #F5C900, #e6b800)', color: '#00061a', borderRadius: '10px', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? '...' : partido ? 'GUARDAR' : 'AGREGAR'}
          </button>
        </div>
      </div>
    </div>
  )
}
