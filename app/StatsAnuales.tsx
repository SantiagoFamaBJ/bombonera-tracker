'use client'

type AñoStats = {
  año: number
  stats: { fui: number; noFui: number; victorias: number; empates: number; derrotas: number; efectividad: number; invictos: number; total: number }
}

export default function StatsAnuales({ statsPorAño }: { statsPorAño: AñoStats[] }) {
  return (
    <div className="space-y-2">
      <p style={{ color: '#F5C900', fontSize: '0.65rem', letterSpacing: '0.2em', paddingLeft: '4px' }} className="font-display font-bold">
        📅 POR AÑO
      </p>
      {statsPorAño.map(({ año, stats }) => (
        <div key={año} style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '14px', overflow: 'hidden' }}>
          {/* Año header */}
          <div style={{ background: 'linear-gradient(90deg, #001a4d, #020e2e)', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #0d2560' }}>
            <span style={{ color: 'white', fontSize: '1rem' }} className="font-display font-bold">{año}</span>
            <span style={{ color: '#3d6499', fontSize: '0.6rem', letterSpacing: '0.1em' }} className="font-display">{stats.total} PARTIDOS</span>
          </div>
          <div className="p-3 space-y-2">
            {/* Asistencia row */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <p style={{ color: '#22c55e', fontSize: '1.2rem', lineHeight: 1 }} className="font-display font-bold">{stats.fui}</p>
                <p style={{ color: '#22c55e', fontSize: '0.55rem', letterSpacing: '0.15em', marginTop: '2px', opacity: 0.8 }} className="font-display">FUI</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <p style={{ color: '#ef4444', fontSize: '1.2rem', lineHeight: 1 }} className="font-display font-bold">{stats.noFui}</p>
                <p style={{ color: '#ef4444', fontSize: '0.55rem', letterSpacing: '0.15em', marginTop: '2px', opacity: 0.8 }} className="font-display">NO FUI</p>
              </div>
              {/* Divider */}
              <div style={{ width: '1px', background: '#0d2560', margin: '0 4px' }} />
              {/* V/E/D */}
              <div style={{ flex: 1, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <p style={{ color: '#22c55e', fontSize: '1.2rem', lineHeight: 1 }} className="font-display font-bold">{stats.victorias}</p>
                <p style={{ color: '#22c55e', fontSize: '0.55rem', letterSpacing: '0.15em', marginTop: '2px', opacity: 0.8 }} className="font-display">V</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <p style={{ color: '#eab308', fontSize: '1.2rem', lineHeight: 1 }} className="font-display font-bold">{stats.empates}</p>
                <p style={{ color: '#eab308', fontSize: '0.55rem', letterSpacing: '0.15em', marginTop: '2px', opacity: 0.8 }} className="font-display">E</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <p style={{ color: '#ef4444', fontSize: '1.2rem', lineHeight: 1 }} className="font-display font-bold">{stats.derrotas}</p>
                <p style={{ color: '#ef4444', fontSize: '0.55rem', letterSpacing: '0.15em', marginTop: '2px', opacity: 0.8 }} className="font-display">D</p>
              </div>
            </div>
            {/* Barra V/E/D */}
            <div style={{ background: '#0a1f4e', borderRadius: '999px', height: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${(stats.victorias/stats.total)*100}%`, background: '#22c55e' }} />
              <div style={{ width: `${(stats.empates/stats.total)*100}%`, background: '#eab308' }} />
              <div style={{ width: `${(stats.derrotas/stats.total)*100}%`, background: '#ef4444' }} />
            </div>
          </div>
        </div>
      ))}
      {statsPorAño.length === 0 && (
        <div className="text-center py-10" style={{ color: '#3d6499' }}>
          <p className="text-4xl mb-2">⚽</p>
          <p className="font-body text-sm">Todavía no cargaste partidos</p>
        </div>
      )}
    </div>
  )
}
