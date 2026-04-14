'use client'

import { useState } from 'react'
import { supabase, Partido } from '@/lib/supabase'

type Props = {
  partido?: Partido
  onSuccess: () => void
  onCancel: () => void
}

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

    setLoading(true)
    setError('')

    const data = { fecha, rival: rival.trim(), resultado: resultado.trim(), fui }

    if (partido) {
      const { error: err } = await supabase.from('partidos').update(data).eq('id', partido.id)
      if (err) { setError(err.message); setLoading(false); return }
    } else {
      const { error: err } = await supabase.from('partidos').insert([data])
      if (err) { setError(err.message); setLoading(false); return }
    }

    setLoading(false)
    onSuccess()
  }

  return (
    <div className="bg-boca-azul rounded-2xl p-5 border border-blue-700 animate-fadein">
      <h2 className="font-display text-boca-amarillo text-lg font-bold tracking-widest mb-5">
        {partido ? 'EDITAR PARTIDO' : 'NUEVO PARTIDO'}
      </h2>

      <div className="space-y-4">
        {/* Fecha */}
        <div>
          <label className="text-blue-300 text-xs font-display tracking-wide block mb-1.5">FECHA</label>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="w-full bg-blue-900 border border-blue-700 rounded-xl px-4 py-3 text-white font-body focus:outline-none focus:border-boca-amarillo transition-colors"
          />
        </div>

        {/* Rival */}
        <div>
          <label className="text-blue-300 text-xs font-display tracking-wide block mb-1.5">RIVAL</label>
          <input
            type="text"
            value={rival}
            onChange={e => setRival(e.target.value)}
            placeholder="Ej: River Plate"
            className="w-full bg-blue-900 border border-blue-700 rounded-xl px-4 py-3 text-white font-body placeholder-blue-500 focus:outline-none focus:border-boca-amarillo transition-colors"
          />
        </div>

        {/* Resultado */}
        <div>
          <label className="text-blue-300 text-xs font-display tracking-wide block mb-1.5">RESULTADO</label>
          <input
            type="text"
            value={resultado}
            onChange={e => setResultado(e.target.value)}
            placeholder="Ej: 2-0"
            className="w-full bg-blue-900 border border-blue-700 rounded-xl px-4 py-3 text-white font-body placeholder-blue-500 focus:outline-none focus:border-boca-amarillo transition-colors"
          />
          <p className="text-blue-500 text-xs mt-1">Primero los goles de Boca</p>
        </div>

        {/* Fui */}
        <div>
          <label className="text-blue-300 text-xs font-display tracking-wide block mb-2">¿FUISTE?</label>
          <div className="flex gap-3">
            <button
              onClick={() => setFui(true)}
              className={`flex-1 py-3 rounded-xl font-display font-bold text-sm tracking-wide transition-all ${
                fui
                  ? 'bg-green-600 text-white border-2 border-green-400'
                  : 'bg-blue-900 text-blue-300 border border-blue-700'
              }`}
            >
              ✅ SÍ, FUI
            </button>
            <button
              onClick={() => setFui(false)}
              className={`flex-1 py-3 rounded-xl font-display font-bold text-sm tracking-wide transition-all ${
                !fui
                  ? 'bg-red-700 text-white border-2 border-red-400'
                  : 'bg-blue-900 text-blue-300 border border-blue-700'
              }`}
            >
              ❌ NO FUI
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm font-body bg-red-900/30 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-blue-900 text-blue-300 rounded-xl font-display font-bold tracking-wide border border-blue-700 active:scale-95 transition-transform"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-boca-amarillo text-boca-dark rounded-xl font-display font-bold tracking-wide active:scale-95 transition-transform disabled:opacity-60"
          >
            {loading ? '...' : partido ? 'GUARDAR' : 'AGREGAR'}
          </button>
        </div>
      </div>
    </div>
  )
}
