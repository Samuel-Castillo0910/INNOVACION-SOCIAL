// ayudas pequenas para mostrar autores y fechas

const formato = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
const pasos = [
  [60, 'second'],
  [60, 'minute'],
  [24, 'hour'],
  [7, 'day'],
  [4.345, 'week'],
  [12, 'month'],
  [Infinity, 'year'],
]

// convierte una fecha en algo como "hace 3 horas" o "ayer"
export function haceCuanto(fecha) {
  let valor = (new Date(fecha).getTime() - Date.now()) / 1000
  for (const [tope, unidad] of pasos) {
    if (Math.abs(valor) < tope) return formato.format(Math.round(valor), unidad)
    valor /= tope
  }
  return ''
}

// dos letras para el avatar, ej. "Azulejo88" da "A" y "Egresado 06" da "E0"
export function iniciales(alias) {
  const partes = (alias || '').trim().split(/[\s_.-]+/).filter(Boolean)
  if (!partes.length) return '?'
  return ((partes[0][0] || '') + (partes[1]?.[0] || '')).toUpperCase()
}

// el mismo seudonimo siempre da el mismo color
export function colorDe(alias) {
  let tono = 0
  for (const letra of alias || '') tono = (tono * 31 + letra.codePointAt(0)) % 360
  return tono
}
