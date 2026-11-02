import { Partido } from './supabase'
import { SIN_TORNEO, SIN_TORNEO_KEY } from './competiciones'

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

export function parseGoles(resultado: string): [number, number] | null {
  const partes = resultado.trim().split('-')
  if (partes.length !== 2) return null
  const a = parseInt(partes[0])
  const b = parseInt(partes[1])
  if (isNaN(a) || isNaN(b)) return null
  return [a, b]
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

// ---------- Helpers ----------

// "Vélez" y "velez" → misma clave
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// "2025-02-23" → "23/02/25" (sin pasar por Date para evitar corrimientos de zona horaria)
export function formatFecha(fecha: string): string {
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y.slice(2)}`
}

export function ordenarPorFecha(partidos: Partido[]): Partido[] {
  return [...partidos].sort((a, b) => a.fecha.localeCompare(b.fecha))
}

function agrupar(partidos: Partido[], clave: (p: Partido) => string): Map<string, Partido[]> {
  const grupos = new Map<string, Partido[]>()
  partidos.forEach(p => {
    const k = clave(p)
    const lista = grupos.get(k)
    if (lista) lista.push(p)
    else grupos.set(k, [p])
  })
  return grupos
}

function nombreMasUsado(nombres: string[]): string {
  const conteo = new Map<string, number>()
  nombres.forEach(n => conteo.set(n, (conteo.get(n) ?? 0) + 1))
  let mejor = nombres[0]
  let max = 0
  conteo.forEach((c, n) => {
    if (c > max) {
      max = c
      mejor = n
    }
  })
  return mejor
}

// ---------- H2H ----------

export type RivalH2H = {
  key: string
  nombre: string
  stats: ReturnType<typeof calcularStats>
  golesFavor: number
  golesContra: number
  partidos: Partido[]
}

export function calcularH2H(partidos: Partido[]): RivalH2H[] {
  const grupos = agrupar(partidos, p => normalizarTexto(p.rival))
  return Array.from(grupos.entries()).map(([key, ps]) => {
    const ordenados = ordenarPorFecha(ps)
    let golesFavor = 0
    let golesContra = 0
    ordenados.forEach(p => {
      const g = parseGoles(p.resultado)
      if (g) {
        golesFavor += g[0]
        golesContra += g[1]
      }
    })
    return {
      key,
      nombre: nombreMasUsado(ordenados.map(p => p.rival.trim())),
      stats: calcularStats(ordenados),
      golesFavor,
      golesContra,
      partidos: ordenados,
    }
  })
}

// ---------- Torneos ----------

export type CompeticionStats = {
  key: string
  nombre: string
  stats: ReturnType<typeof calcularStats>
  partidos: Partido[]
}

export function calcularStatsPorCompeticion(partidos: Partido[]): CompeticionStats[] {
  const grupos = agrupar(partidos, p => {
    const c = p.competicion?.trim()
    return c ? normalizarTexto(c) : SIN_TORNEO_KEY
  })
  return Array.from(grupos.entries())
    .map(([key, ps]) => {
      const ordenados = ordenarPorFecha(ps)
      const nombre =
        key === SIN_TORNEO_KEY
          ? SIN_TORNEO
          : nombreMasUsado(ordenados.map(p => (p.competicion ?? '').trim()))
      return { key, nombre, stats: calcularStats(ordenados), partidos: ordenados }
    })
    .sort((a, b) => {
      if (a.key === SIN_TORNEO_KEY) return 1
      if (b.key === SIN_TORNEO_KEY) return -1
      return b.stats.total - a.stats.total || a.nombre.localeCompare(b.nombre, 'es')
    })
}
