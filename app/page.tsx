'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--boca-dark)' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #003082 0%, #001a4d 100%)', borderBottom: '3px solid #F5C900' }}
        className="px-4 py-3 flex items-center gap-3">
        <div className="relative">
          <Image src="/estadio.png" alt="La Bombonera" width={44} height={44} className="object-contain drop-shadow-lg" />
        </div>
        <div>
          <h1 className="font-display text-boca-amarillo font-bold leading-none tracking-widest"
            style={{ fontSize: '1.1rem', textShadow: '0 2px 8px rgba(245,201,0,0.3)' }}>
            LA BOMBONERA
          </h1>
          <p style={{ color: '#7fa3d4', fontSize: '0.7rem', letterSpacing: '0.15em' }} className="font-display uppercase">
            Tracker de asistencia
          </p>
        </div>
        <button
          onClick={() => setVista('nuevo')}
          style={{ background: 'linear-gradient(135deg, #F5C900, #e6b800)', color: '#00061a' }}
          className="ml-auto font-display font-bold px-4 py-2 rounded-lg text-sm tracking-wide active:scale-95 transition-transform shadow-lg"
        >
          + PARTIDO
        </button>
      </header>

      <NavBar vista={vista} setVista={setVista} />

      <main className="flex-1 p-4 space-y-4 animate-fadein max-w-2xl mx-auto w-full">
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
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => setAñoFiltro(null)}
                className="px-3 py-1.5 rounded-full text-xs font-display font-bold whitespace-nowrap transition-all"
                style={!añoFiltro ? { background: '#F5C900', color: '#00061a' } : { background: '#0a1f4e', color: '#7fa3d4', border: '1px solid #1a3a6e' }}>
                TODOS
              </button>
              {años.map(a => (
                <button key={a} onClick={() => setAñoFiltro(a)}
                  className="px-3 py-1.5 rounded-full text-xs font-display font-bold whitespace-nowrap transition-all"
                  style={añoFiltro === a ? { background: '#F5C900', color: '#00061a' } : { background: '#0a1f4e', color: '#7fa3d4', border: '1px solid #1a3a6e' }}>
                  {a}
                </button>
              ))}
            </div>
            <ListaPartidos partidos={partidosFiltrados} onRefresh={fetchPartidos} />
          </>
        ) : (
          <FormPartido
            onSuccess={() => { fetchPartidos(); setVista('partidos') }}
            onCancel={() => setVista(partidos.length > 0 ? 'partidos' : 'inicio')}
          />
        )}
      </main>
    </div>
  )
}
