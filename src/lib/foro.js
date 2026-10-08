import { createClient } from '@supabase/supabase-js'
import { testimonios } from '../data/testimonios'
import { aTexto } from './imagen'

// con 3 reportes una publicacion o comentario deja de mostrarse
const LIMITE_REPORTES = 3

const url = import.meta.env.VITE_SUPABASE_URL
const llave = import.meta.env.VITE_SUPABASE_KEY

// si no hay llaves el foro funciona igual, pero solo guarda en este navegador
export const modoLocal = !url || !llave
const db = modoLocal ? null : createClient(url, llave)

// en modo local las imagenes se guardan en el navegador, por eso quedan mas pequenas
export const opcionesImagen = modoLocal ? { ladoMaximo: 1000, calidad: 0.7 } : { ladoMaximo: 1600, calidad: 0.82 }

// limites de lo que escribe la gente, son los mismos que revisa supabase
export const MAX_ALIAS = 40
export const MAX_TITULO = 120
export const MAX_PUBLICACION = 4000
export const MAX_COMENTARIO = 2000
const limpiarAlias = (alias) => (alias || '').trim().slice(0, MAX_ALIAS) || 'Anónimo'

// modo local, todo vive en el localstorage del navegador
const LLAVE_LOCAL = 'loo-foro-v2'
const nuevoId = () =>
  globalThis.crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)

function leerLocal() {
  let datos
  try {
    datos = JSON.parse(localStorage.getItem(LLAVE_LOCAL))
  } catch {
    datos = null
  }
  if (!datos) datos = { publicaciones: [], comentarios: [] }
  // cada testimonio del formulario tiene su fila, asi se puede comentar y apoyar
  for (const t of testimonios) {
    if (!datos.publicaciones.some((p) => p.id === t.id)) {
      datos.publicaciones.push({ id: t.id, alias: t.alias, fijada: true, apoyos: 0, reportes: 0, created_at: t.fecha })
    }
  }
  return datos
}

function guardarLocal(datos) {
  try {
    localStorage.setItem(LLAVE_LOCAL, JSON.stringify(datos))
    return true
  } catch {
    return false
  }
}

// publicaciones, cada una trae cuantos comentarios tiene en n_comentarios
export async function listarPublicaciones() {
  if (modoLocal) {
    const d = leerLocal()
    return d.publicaciones
      .filter((p) => p.reportes < LIMITE_REPORTES)
      .map((p) => ({
        ...p,
        n_comentarios: d.comentarios.filter((c) => c.publicacion_id === p.id && c.reportes < LIMITE_REPORTES).length,
      }))
  }

  const { data, error } = await db
    .from('publicaciones')
    .select('*, comentarios(count)')
    .lt('reportes', LIMITE_REPORTES)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(({ comentarios, ...p }) => ({ ...p, n_comentarios: comentarios?.[0]?.count ?? 0 }))
}

// imagen es opcional, llega ya achicada desde el formulario
export async function crearPublicacion({ alias, titulo, texto, tema, imagen }) {
  const fila = {
    alias: limpiarAlias(alias),
    titulo: (titulo || '').trim().slice(0, MAX_TITULO) || null,
    texto: texto.trim().slice(0, MAX_PUBLICACION),
    tema: tema || null,
    imagen_url: null,
  }

  if (modoLocal) {
    if (imagen) fila.imagen_url = await aTexto(imagen)
    const d = leerLocal()
    const nueva = { id: nuevoId(), ...fila, fijada: false, apoyos: 0, reportes: 0, created_at: new Date().toISOString() }
    d.publicaciones.push(nueva)
    if (!guardarLocal(d)) {
      throw new Error('En el modo de prueba ya no cabe más en este navegador. Intenta sin imagen.')
    }
    return { ...nueva, n_comentarios: 0 }
  }

  if (imagen) {
    const ruta = `${nuevoId()}.jpg`
    const subida = await db.storage.from('imagenes').upload(ruta, imagen, { contentType: 'image/jpeg', upsert: false })
    if (subida.error) throw subida.error
    fila.imagen_url = db.storage.from('imagenes').getPublicUrl(ruta).data.publicUrl
  }

  const { data, error } = await db.from('publicaciones').insert(fila).select().single()
  if (error) throw error
  return { ...data, n_comentarios: 0 }
}

// comentarios de una publicacion, en orden de llegada, las respuestas traen padre_id
export async function listarComentarios(publicacionId) {
  if (modoLocal) {
    return leerLocal()
      .comentarios.filter((c) => c.publicacion_id === publicacionId && c.reportes < LIMITE_REPORTES)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
  }

  const { data, error } = await db
    .from('comentarios')
    .select('*')
    .eq('publicacion_id', publicacionId)
    .lt('reportes', LIMITE_REPORTES)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function crearComentario({ publicacionId, padreId, alias, texto }) {
  const fila = {
    publicacion_id: publicacionId,
    padre_id: padreId || null,
    alias: limpiarAlias(alias),
    texto: texto.trim().slice(0, MAX_COMENTARIO),
  }

  if (modoLocal) {
    const d = leerLocal()
    const nuevo = { id: nuevoId(), ...fila, reportes: 0, created_at: new Date().toISOString() }
    d.comentarios.push(nuevo)
    if (!guardarLocal(d)) throw new Error('No se pudo guardar en este navegador.')
    return nuevo
  }

  const { data, error } = await db.from('comentarios').insert(fila).select().single()
  if (error) throw error
  return data
}

// me identifico, cambio es 1 para sumar o -1 para quitar, devuelve el total nuevo
export async function cambiarApoyo(publicacionId, cambio) {
  if (modoLocal) {
    const d = leerLocal()
    const p = d.publicaciones.find((x) => x.id === publicacionId)
    if (!p) return 0
    p.apoyos = Math.max(p.apoyos + (cambio < 0 ? -1 : 1), 0)
    guardarLocal(d)
    return p.apoyos
  }

  const { data, error } = await db.rpc('apoyar_publicacion', { p_id: publicacionId, p_cambio: cambio })
  if (error) throw error
  return data
}

// tipo es 'publicacion' o 'comentario', los testimonios del formulario no se pueden reportar
export async function reportar(tipo, id) {
  if (modoLocal) {
    const d = leerLocal()
    const lista = tipo === 'publicacion' ? d.publicaciones : d.comentarios
    const fila = lista.find((x) => x.id === id)
    if (fila && !fila.fijada) fila.reportes += 1
    guardarLocal(d)
    return
  }

  const { error } = await db.rpc(tipo === 'publicacion' ? 'reportar_publicacion' : 'reportar_comentario', { p_id: id })
  if (error) throw error
}

// lo que esta persona ya apoyo o reporto, y su ultimo seudonimo, se recuerdan en su navegador
function leerLista(nombre) {
  try {
    return new Set(JSON.parse(localStorage.getItem(nombre)) || [])
  } catch {
    return new Set()
  }
}

function guardarLista(nombre, conjunto) {
  try {
    localStorage.setItem(nombre, JSON.stringify([...conjunto]))
  } catch {
    // sin almacenamiento solo se pierde el recuerdo, el foro sigue funcionando
  }
}

export const misApoyos = {
  leer: () => leerLista('loo-apoyos'),
  guardar: (conjunto) => guardarLista('loo-apoyos', conjunto),
}

export const misReportes = {
  leer: () => leerLista('loo-reportes'),
  guardar: (conjunto) => guardarLista('loo-reportes', conjunto),
}

export function leerAlias() {
  try {
    return localStorage.getItem('loo-alias') || ''
  } catch {
    return ''
  }
}

export function guardarAlias(alias) {
  try {
    localStorage.setItem('loo-alias', alias.trim().slice(0, MAX_ALIAS))
  } catch {
    // no pasa nada
  }
}
