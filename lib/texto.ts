// Clave de comparación: sin tildes, en minúsculas, sin apóstrofes ni puntos y con espacios colapsados.
// "Newell's", "Newells" y "NEWELLS" dan la misma clave.
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[.,'’`´]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
