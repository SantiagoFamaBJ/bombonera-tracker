import { normalizarTexto } from './texto'

// Torneos fijos del selector. El campo es texto libre: podés escribir cualquier otro y queda creado.
export const COMPETICIONES = ['Torneo Local', 'Libertadores', 'Sudamericana']

export const SIN_TORNEO = 'Sin asignar'
export const SIN_TORNEO_KEY = '__sin_torneo__'

// Otras formas de escribir los torneos fijos (así "Copa Libertadores" y "Libertadores" cuentan juntos)
const ALIAS_COMPETICION: Record<string, string[]> = {
  'Torneo Local': ['local', 'torneos locales'],
  'Libertadores': ['copa libertadores', 'la libertadores', 'conmebol libertadores', 'copa conmebol libertadores'],
  'Sudamericana': ['copa sudamericana', 'la sudamericana', 'conmebol sudamericana', 'copa conmebol sudamericana'],
}

const ALIAS = new Map<string, string>()
Object.keys(ALIAS_COMPETICION).forEach(canonico => {
  ALIAS.set(normalizarTexto(canonico), canonico)
  ALIAS_COMPETICION[canonico].forEach(a => ALIAS.set(normalizarTexto(a), canonico))
})

export function canonicoCompeticion(nombre: string): string {
  const limpio = nombre.trim().replace(/\s+/g, ' ')
  return ALIAS.get(normalizarTexto(limpio)) ?? limpio
}
