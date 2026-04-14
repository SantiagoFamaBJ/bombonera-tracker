'use client'

import { useEffect, useState } from 'react'
import { supabase, Partido } from '@/lib/supabase'
import { calcularStats, calcularStatsPorAño } from '@/lib/stats'
import StatsGlobales from '@/components/StatsGlobales'
import StatsAnuales from '@/components/StatsAnuales'
import ListaPartidos from '@/components/ListaPartidos'
import FormPartido from '@/components/FormPartido'
import NavBar from '@/components/NavBar'

type Vista = 'inicio' | 'partidos' | 'nuevo'

export default function Home() {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [loading, setLoading] = useState(true)
  const [vista, setVista] = useState<Vista>('inicio')
  const [añoFiltro, setAñoFiltro] = useState<number | null>(null)

  async function fetchPartidos() {
    const { data } = await supabase
      .from('partidos')
      .select('*')
      .order('fecha', { ascending: false })
    if (data) setPartidos(data)
    setLoading(false)
  }

  useEffect(() => { fetchPartidos() }, [])

  const statsGlobal = calcularStats(partidos)
  const statsPorAño = calcularStatsPorAño(partidos)
  const años = statsPorAño.map(s => s.año)

  const partidosFiltrados = añoFiltro
    ? partidos.filter(p => new Date(p.fecha).getFullYear() === añoFiltro)
    : partidos

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-boca-azul border-b-4 border-boca-amarillo px-4 py-4 flex items-center gap-3">
        <div className="text-3xl">🏟️</div>
        <div>
          <h1 className="font-display text-boca-amarillo text-xl font-bold leading-none">
            LA BOMBONERA
          </h1>
          <p className="text-blue-200 text-xs font-body">Tracker de asistencia</p>
        </div>
        <button
          onClick={() => setVista('nuevo')}
          className="ml-auto bg-boca-amarillo text-boca-dark font-display font-bold px-4 py-2 rounded-lg text-sm tracking-wide active:scale-95 transition-transform"
        >
          + PARTIDO
        </button>
      </header>

      {/* Nav */}
      <NavBar vista={vista} setVista={setVista} />

      {/* Content */}
      <main className="flex-1 p-4 space-y-4 animate-fadein">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-10 h-10 border-4 border-boca-amarillo border-t-transparent rounded-full animate-spin" />
          </div>
        ) : vista === 'inicio' ? (
          <>
            <StatsGlobales stats={statsGlobal} total={partidos.length} />
            <StatsAnuales statsPorAño={statsPorAño} />
          </>
        ) : vista === 'partidos' ? (
          <>
            {/* Filtro por año */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setAñoFiltro(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-display font-bold whitespace-nowrap transition-colors ${
                  !añoFiltro ? 'bg-boca-amarillo text-boca-dark' : 'bg-boca-light text-white'
                }`}
              >
                TODOS
              </button>
              {años.map(a => (
                <button
                  key={a}
                  onClick={() => setAñoFiltro(a)}
                  className={`px-3 py-1.5 rounded-full text-sm font-display font-bold whitespace-nowrap transition-colors ${
                    añoFiltro === a ? 'bg-boca-amarillo text-boca-dark' : 'bg-boca-light text-white'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <ListaPartidos partidos={partidosFiltrados} onRefresh={fetchPartidos} />
          </>
        ) : vista === 'nuevo' ? (
          <FormPartido
            onSuccess={() => { fetchPartidos(); setVista('partidos') }}
            onCancel={() => setVista(partidos.length > 0 ? 'partidos' : 'inicio')}
          />
        ) : null}
      </main>
    </div>
  )
}
