import { Partido } from './supabase'

export function parseResultado(resultado: string): 'V' | 'E' | 'D' | null {
  const partes = resultado.trim().split('-')
  if (partes.length !== 2) return null
  const local = parseInt(partes[0])
  const visitante = parseInt(partes[1])
  if (isNaN(local) || isNaN(visitante)) return null
  if (local > visitante) return 'V'
  if (local === visitante) return 'E'
  return 'D'
}

export function calcularStats(partidos: Partido[]) {
  const total = partidos.length
  const fui = partidos.filter(p => p.fui).length
  const noFui = total - fui
  const pctAsistencia = total > 0 ? Math.round((fui / total) * 100 * 100) / 100 : 0

  const victorias = partidos.filter(p => parseResultado(p.resultado) === 'V').length
  const empates = partidos.filter(p => parseResultado(p.resultado) === 'E').length
  const derrotas = partidos.filter(p => parseResultado(p.resultado) === 'D').length

  const efectividad = total > 0 ? Math.round(((victorias + empates * 0.5) / total) * 100) : 0
  const invictos = total > 0 ? Math.round(((victorias + empates) / total) * 100) : 0

  return { total, fui, noFui, pctAsistencia, victorias, empates, derrotas, efectividad, invictos }
}

export function calcularStatsPorAño(partidos: Partido[]) {
  const porAño: Record<number, Partido[]> = {}
  for (const p of partidos) {
    const año = new Date(p.fecha).getFullYear()
    if (!porAño[año]) porAño[año] = []
    porAño[año].push(p)
  }
  return Object.entries(porAño)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([año, ps]) => ({ año: Number(año), stats: calcularStats(ps), partidos: ps }))
}
