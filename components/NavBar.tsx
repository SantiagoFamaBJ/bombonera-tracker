'use client'

type Vista = 'inicio' | 'partidos' | 'h2h' | 'torneos' | 'nuevo'

const TABS: { id: Vista; label: string; icon: string }[] = [
  { id: 'inicio', label: 'STATS', icon: '📊' },
  { id: 'partidos', label: 'PARTIDOS', icon: '⚽' },
  { id: 'h2h', label: 'H2H', icon: '🆚' },
  { id: 'torneos', label: 'TORNEOS', icon: '🏆' },
]

export default function NavBar({ vista, setVista }: { vista: Vista; setVista: (v: Vista) => void }) {
  return (
    <nav style={{ background: '#020e2e', borderBottom: '1px solid #0d2560' }} className="flex">
      {TABS.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setVista(id)}
          className="flex-1 py-2.5 font-display font-bold transition-all flex flex-col items-center justify-center gap-0.5"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            ...(vista === id
              ? { color: '#F5C900', borderBottom: '2px solid #F5C900', background: 'rgba(245,201,0,0.05)' }
              : { color: '#3d6499', borderBottom: '2px solid transparent' }),
          }}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  )
}
