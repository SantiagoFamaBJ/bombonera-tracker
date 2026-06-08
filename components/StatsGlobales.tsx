'use client'

type Props = {
  stats: {
    total: number; fui: number; noFui: number; pctAsistencia: number
    victorias: number; empates: number; derrotas: number; efectividad: number; invictos: number
  }
  total: number
}

export default function StatsGlobales({ stats, total }: Props) {
  return (
    <div className="space-y-3">
      {/* Asistencia */}
      <div style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(90deg, #003082, #001a4d)', padding: '10px 16px', borderBottom: '1px solid #0d2560' }}
          className="flex items-center gap-2">
          <span style={{ color: '#F5C900', fontSize: '0.65rem', letterSpacing: '0.2em' }} className="font-display font-bold">🎟️ ASISTENCIA TOTAL</span>
          <span style={{ marginLeft: 'auto', background: 'rgba(245,201,0,0.15)', color: '#F5C900', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '999px', border: '1px solid rgba(245,201,0,0.3)' }}
            className="font-display font-bold">{total} partidos</span>
        </div>
        <div className="p-4 space-y-4">
          {/* Fui / No fui */}
          <div className="grid grid-cols-2 gap-3">
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <p style={{ color: '#22c55e', fontSize: '2rem', lineHeight: 1 }} className="font-display font-bold">{stats.fui}</p>
              <p style={{ color: '#22c55e', fontSize: '0.6rem', letterSpacing: '0.2em', marginTop: '4px' }} className="font-display">FUI</p>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <p style={{ color: '#ef4444', fontSize: '2rem', lineHeight: 1 }} className="font-display font-bold">{stats.noFui}</p>
              <p style={{ color: '#ef4444', fontSize: '0.6rem', letterSpacing: '0.2em', marginTop: '4px' }} className="font-display">NO FUI</p>
            </div>
          </div>
          {/* Barra */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span style={{ color: '#7fa3d4', fontSize: '0.65rem' }} className="font-display">ASISTENCIA</span>
              <span style={{ color: '#F5C900', fontSize: '0.65rem' }} className="font-display font-bold">{stats.pctAsistencia}%</span>
            </div>
            <div style={{ background: '#0a1f4e', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${stats.pctAsistencia}%`, height: '100%', background: 'linear-gradient(90deg, #F5C900, #e6b800)', borderRadius: '999px', transition: 'width 1s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div style={{ background: '#020e2e', border: '1px solid #0d2560', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(90deg, #003082, #001a4d)', padding: '10px 16px', borderBottom: '1px solid #0d2560' }}>
          <span style={{ color: '#F5C900', fontSize: '0.65rem', letterSpacing: '0.2em' }} className="font-display font-bold">🏆 HISTORIAL</span>
        </div>
        <div className="p-4 space-y-3">
          {/* V / E / D */}
          <div className="grid grid-cols-3 gap-2">
            <ResultadoBox label="VICTORIAS" value={stats.victorias} color="#22c55e" bg="rgba(34,197,94,0.08)" border="rgba(34,197,94,0.25)" />
            <ResultadoBox label="EMPATES" value={stats.empates} color="#eab308" bg="rgba(234,179,8,0.08)" border="rgba(234,179,8,0.25)" />
            <ResultadoBox label="DERROTAS" value={stats.derrotas} color="#ef4444" bg="rgba(239,68,68,0.08)" border="rgba(239,68,68,0.25)" />
          </div>
          {/* Barras V/E/D */}
          <div style={{ background: '#0a1f4e', borderRadius: '999px', height: '6px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${(stats.victorias/stats.total)*100}%`, background: '#22c55e', transition: 'width 1s ease' }} />
            <div style={{ width: `${(stats.empates/stats.total)*100}%`, background: '#eab308', transition: 'width 1s ease' }} />
            <div style={{ width: `${(stats.derrotas/stats.total)*100}%`, background: '#ef4444', transition: 'width 1s ease' }} />
          </div>
          {/* Efectividad e Invictos */}
          <div className="grid grid-cols-2 gap-2">
            <div style={{ background: 'rgba(245,201,0,0.06)', border: '1px solid rgba(245,201,0,0.2)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: '#F5C900', fontSize: '1.6rem', lineHeight: 1 }} className="font-display font-bold">{stats.efectividad}%</p>
              <p style={{ color: '#7fa3d4', fontSize: '0.6rem', letterSpacing: '0.15em', marginTop: '4px' }} className="font-display">EFECTIVIDAD</p>
            </div>
            <div style={{ background: 'rgba(245,201,0,0.06)', border: '1px solid rgba(245,201,0,0.2)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <p style={{ color: '#F5C900', fontSize: '1.6rem', lineHeight: 1 }} className="font-display font-bold">{stats.invictos}%</p>
              <p style={{ color: '#7fa3d4', fontSize: '0.6rem', letterSpacing: '0.15em', marginTop: '4px' }} className="font-display">INVICTOS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultadoBox({ label, value, color, bg, border }: { label: string; value: number; color: string; bg: string; border: string }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
      <p style={{ color, fontSize: '1.6rem', lineHeight: 1 }} className="font-display font-bold">{value}</p>
      <p style={{ color, fontSize: '0.55rem', letterSpacing: '0.15em', marginTop: '4px', opacity: 0.8 }} className="font-display">{label}</p>
    </div>
  )
}
