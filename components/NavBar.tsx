'use client'

type Vista = 'inicio' | 'partidos' | 'nuevo'

export default function NavBar({ vista, setVista }: { vista: Vista; setVista: (v: Vista) => void }) {
  return (
    <nav style={{ background: '#020e2e', borderBottom: '1px solid #0d2560' }} className="flex">
      {[
        { id: 'inicio', label: 'STATS', icon: '📊' },
        { id: 'partidos', label: 'PARTIDOS', icon: '⚽' },
      ].map(({ id, label, icon }) => (
        <button key={id} onClick={() => setVista(id as Vista)}
          className="flex-1 py-3 text-xs font-display font-bold tracking-widest transition-all flex items-center justify-center gap-2"
          style={vista === id
            ? { color: '#F5C900', borderBottom: '2px solid #F5C900', background: 'rgba(245,201,0,0.05)' }
            : { color: '#3d6499' }}>
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  )
}
