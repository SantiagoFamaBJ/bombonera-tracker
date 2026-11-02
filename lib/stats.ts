import { Partido } from './supabase'
import { SIN_TORNEO, SIN_TORNEO_KEY, canonicoCompeticion } from './competiciones'
import { canonicalizarRival } from './equipos'
import { normalizarTexto } from './texto'

export { normalizarTexto }

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

// Los partidos sin público (pandemia) no cuentan en ninguna estadística: se muestran en las listas pero no suman.
export function calcularStats(todos: Partido[]) {
  const partidos = todos.filter(p => !p.pandemia)
  const total = partidos.length
  const fui = partidos.filter(p => p.fui).length
  const noFui = total - fui
  const pctAsistencia = total > 0 ? Math.round((fui / total) * 100 * 100) / 100 : 0

  // El historial (V/E/D, efectividad, invictos) cuenta SOLO los partidos a los que fui.
  const fuiList = partidos.filter(p => p.fui)
  const victorias = fuiList.filter(p => parseResultado(p.resultado) === 'V').length
  const empates = fuiList.filter(p => parseResultado(p.resultado) === 'E').length
  const derrotas = fuiList.filter(p => parseResultado(p.resultado) === 'D').length

  const efectividad = fui > 0 ? Math.round(((victorias + empates * 0.5) / fui) * 100) : 0
  const invictos = fui > 0 ? Math.round(((victorias + empates) / fui) * 100) : 0

  // Cómo le fue a Boca en los partidos a los que NO fui
  const noList = partidos.filter(p => !p.fui)
  const nV = noList.filter(p => parseResultado(p.resultado) === 'V').length
  const nE = noList.filter(p => parseResultado(p.resultado) === 'E').length
  const nD = noList.filter(p => parseResultado(p.resultado) === 'D').length
  const sinAsistir = {
    total: noList.length,
    victorias: nV,
    empates: nE,
    derrotas: nD,
    efectividad: noList.length > 0 ? Math.round(((nV + nE * 0.5) / noList.length) * 100) : 0,
    invictos: noList.length > 0 ? Math.round(((nV + nE) / noList.length) * 100) : 0,
  }

  return { total, fui, noFui, pctAsistencia, victorias, empates, derrotas, efectividad, invictos, sinAsistir }
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
  const grupos = agrupar(partidos, p => normalizarTexto(canonicalizarRival(p.rival)))
  return Array.from(grupos.entries()).map(([key, ps]) => {
    const ordenados = ordenarPorFecha(ps)
    let golesFavor = 0
    let golesContra = 0
    ordenados.forEach(p => {
      if (!p.fui || p.pandemia) return
      const g = parseGoles(p.resultado)
      if (g) {
        golesFavor += g[0]
        golesContra += g[1]
      }
    })
    return {
      key,
      nombre: nombreMasUsado(ordenados.map(p => canonicalizarRival(p.rival))),
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
    return c ? normalizarTexto(canonicoCompeticion(c)) : SIN_TORNEO_KEY
  })
  return Array.from(grupos.entries())
    .map(([key, ps]) => {
      const ordenados = ordenarPorFecha(ps)
      const nombre =
        key === SIN_TORNEO_KEY
          ? SIN_TORNEO
          : nombreMasUsado(ordenados.map(p => canonicoCompeticion(p.competicion ?? '')))
      return { key, nombre, stats: calcularStats(ordenados), partidos: ordenados }
    })
    .sort((a, b) => {
      if (a.key === SIN_TORNEO_KEY) return 1
      if (b.key === SIN_TORNEO_KEY) return -1
      return b.stats.total - a.stats.total || a.nombre.localeCompare(b.nombre, 'es')
    })
}
