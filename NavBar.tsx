'use client'

type Vista = 'inicio' | 'partidos' | 'nuevo'

export default function NavBar({ vista, setVista }: { vista: Vista; setVista: (v: Vista) => void }) {
  return (
    <nav className="bg-boca-azul border-b border-blue-700 flex">
      {[
        { id: 'inicio', label: '📊 STATS' },
        { id: 'partidos', label: '⚽ PARTIDOS' },
      ].map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setVista(id as Vista)}
          className={`flex-1 py-3 text-sm font-display font-bold tracking-wide transition-colors ${
            vista === id
              ? 'text-boca-amarillo border-b-2 border-boca-amarillo'
              : 'text-blue-300'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
