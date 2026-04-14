'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type PartidoImport = {
  fecha: string
  rival: string
  resultado: string
  fui: boolean
  error?: string
}

function parseFecha(raw: string): string | null {
  const limpio = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(limpio)) return limpio
  const match = limpio.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (match) {
    const [, d, m, y] = match
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return null
}

function parseResultado(raw: string): string | null {
  const limpio = raw.trim().replace(',', '-').replace('–', '-')
  if (/^\d+-\d+$/.test(limpio)) return limpio
  return null
}

function parseFui(raw: string): boolean | null {
  const v = raw.trim().toUpperCase()
  if (v === 'SI' || v === 'SÍ' || v === 'S' || v === '1' || v === 'TRUE') return true
  if (v === 'NO' || v === 'N' || v === '0' || v === 'FALSE') return false
  return null
}

export default function ImportPage() {
  const [preview, setPreview] = useState<PartidoImport[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [importados, setImportados] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
      const partidos: PartidoImport[] = []

      for (const line of lines) {
        const cols = line.split(/[;,]/).map(c => c.trim().replace(/^"|"$/g, ''))
        if (cols.length < 4) continue
        const [col0, col1, col2, col3] = cols
        if (!col0) continue
        if (col0.toUpperCase().includes('FECHA') || col0.toUpperCase().includes('AÑO')) continue
        if (/^\d{4}$/.test(col0.trim())) continue
        if (!/\d/.test(col0)) continue

        const fecha = parseFecha(col0)
        const resultado = parseResultado(col2)
        const fui = parseFui(col3)

        if (!fecha || !resultado || fui === null || !col1.trim()) {
          partidos.push({ fecha: col0, rival: col1 || '?', resultado: col2 || '?', fui: false, error: 'Fila inválida' })
          continue
        }
        partidos.push({ fecha, rival: col1.trim(), resultado, fui })
      }
      setPreview(partidos)
      setDone(false)
    }
    reader.readAsText(file, 'UTF-8')
  }

  async function handleImport() {
    const validos = preview.filter(p => !p.error)
    if (validos.length === 0) return
    setLoading(true)
    const { error } = await supabase.from('partidos').insert(
      validos.map(p => ({ fecha: p.fecha, rival: p.rival, resultado: p.resultado, fui: p.fui }))
    )
    setLoading(false)
    if (!error) {
      setImportados(validos.length)
      setDone(true)
      setPreview([])
    }
  }

  const validos = preview.filter(p => !p.error)
  const invalidos = preview.filter(p => p.error)

  return (
    <div className="min-h-screen bg-boca-dark p-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-3 py-2">
          <a href="/" className="text-boca-amarillo text-2xl">←</a>
          <h1 className="font-display text-boca-amarillo text-xl font-bold tracking-widest">IMPORTAR CSV</h1>
        </div>

        <div className="bg-boca-azul rounded-2xl p-4 border border-blue-700 text-sm font-body text-blue-200 space-y-2">
          <p className="font-display text-white font-bold">¿Cómo exportar el CSV?</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>En Excel, seleccioná solo las filas de partidos</li>
            <li>Copiá a una hoja nueva (sin totales ni filas de año)</li>
            <li>Guardá como <span className="text-boca-amarillo">CSV UTF-8</span></li>
            <li>El orden debe ser: Fecha, Rival, Resultado, SI/NO</li>
          </ol>
        </div>

        {!done && (
          <div>
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display: 'none' }} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full bg-boca-azul border-2 border-dashed border-boca-amarillo rounded-2xl p-8 text-center active:opacity-70 transition-opacity"
            >
              <p className="text-4xl mb-2">📂</p>
              <p className="font-display text-boca-amarillo font-bold text-lg">SELECCIONAR CSV</p>
              <p className="text-blue-300 text-xs mt-1">tocá para buscar el archivo</p>
            </button>
          </div>
        )}

        {preview.length > 0 && (
          <div className="bg-boca-azul rounded-2xl p-4 border border-blue-700 space-y-3">
            <p className="font-display text-white font-bold">
              {validos.length} partidos válidos
              {invalidos.length > 0 && <span className="text-red-400 ml-2">({invalidos.length} con error)</span>}
            </p>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {preview.map((p, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg ${p.error ? 'bg-red-900/40 text-red-300' : 'bg-blue-900/60 text-white'}`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.fui ? 'bg-green-400' : 'bg-red-500'}`} />
                  <span className="font-display w-20 flex-shrink-0">{p.fecha}</span>
                  <span className="flex-1 truncate font-body">{p.rival}</span>
                  <span className="font-display font-bold">{p.resultado}</span>
                  {p.error && <span className="text-red-400">⚠️</span>}
                </div>
              ))}
            </div>
            <button type="button" onClick={handleImport} disabled={loading || validos.length === 0}
              className="w-full py-3 bg-boca-amarillo text-boca-dark rounded-xl font-display font-bold tracking-wide disabled:opacity-60 active:scale-95 transition-transform">
              {loading ? 'IMPORTANDO...' : `IMPORTAR ${validos.length} PARTIDOS`}
            </button>
          </div>
        )}

        {done && (
          <div className="bg-green-900/40 border border-green-600 rounded-2xl p-6 text-center space-y-3">
            <p className="text-4xl">✅</p>
            <p className="font-display text-green-400 text-lg font-bold">¡IMPORTADO!</p>
            <p className="text-white font-body">{importados} partidos cargados correctamente</p>
            <a href="/" className="block bg-boca-amarillo text-boca-dark py-3 rounded-xl font-display font-bold tracking-wide">VER STATS</a>
          </div>
        )}
      </div>
    </div>
  )
}
