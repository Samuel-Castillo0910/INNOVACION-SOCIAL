import { db, modoLocal } from './supabase'
import { testimonios } from '../data/testimonios'
import { aTexto } from './imagen'

export { modoLocal }

// con 3 reportes una publicacion o comentario deja de mostrarse
const LIMITE_REPORTES = 3

// en modo de prueba las imagenes se guardan en el navegador, por eso quedan mas pequenas
export const opcionesImagen = modoLocal ? { ladoMaximo: 1000, calidad: 0.7 } : { ladoMaximo: 1600, calidad: 0.82 }

// limites de lo que escribe la gente, son los mismos que revisa supabase
export const MAX_TITULO = 120
export const MAX_PUBLICACION = 20000
export const MAX_COMENTARIO = 2000

// modo de prueba, todo vive en el localstorage del navegador con la misma forma que las tablas de supabase
const LLAVE_LOCAL = 'loo-foro-v3'
const nuevoId = () =>
  globalThis.crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)

function leerLocal() {
  let datos
  try {
    datos = JSON.parse(localStorage.getItem(LLAVE_LOCAL))
  } catch {
    datos = null
  }
  if (!datos) datos = { publicaciones: [], comentarios: [], apoyos: [], reportes: [] }
  // cada testimonio del formulario tiene su fila, asi se puede comentar y apoyar
  for (const t of testimonios) {
    if (!datos.publicaciones.some((p) => p.id === t.id)) {
      datos.publicaciones.push({ id: t.id, user_id: null, alias: t.alias, fijada: true, apoyos: 0, reportes: 0, created_at: t.fecha })
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

// lo que esta cuenta ya apoyo y ya reporto
export async function misMarcas(usuario) {
  if (!usuario) return { apoyos: new Set(), reportes: new Set() }

  if (modoLocal) {
    const d = leerLocal()
    return {
      apoyos: new Set(d.apoyos.filter((a) => a.user_id === usuario.id).map((a) => a.publicacion_id)),
      reportes: new Set(d.reportes.filter((r) => r.user_id === usuario.id).map((r) => r.objeto_id)),
    }
  }

  const [apoyos, reportes] = await Promise.all([
    db.from('apoyos').select('publicacion_id'),
    db.from('reportes').select('objeto_id'),
  ])
  if (apoyos.error) throw apoyos.error
  if (reportes.error) throw reportes.error
  return {
    apoyos: new Set(apoyos.data.map((a) => a.publicacion_id)),
    reportes: new Set(reportes.data.map((r) => r.objeto_id)),
  }
}

// imagen es opcional y llega ya achicada desde el formulario
export async function crearPublicacion({ usuario, titulo, texto, tema, imagen }) {
  const fila = {
    alias: usuario.seudonimo,
    titulo: (titulo || '').trim().slice(0, MAX_TITULO) || null,
    texto: texto.trim().slice(0, MAX_PUBLICACION),
    tema: tema || null,
    imagen_url: null,
  }

  if (modoLocal) {
    if (imagen) fila.imagen_url = await aTexto(imagen)
    const d = leerLocal()
    const nueva = { id: nuevoId(), user_id: usuario.id, ...fila, fijada: false, apoyos: 0, reportes: 0, created_at: new Date().toISOString() }
    d.publicaciones.push(nueva)
    if (!guardarLocal(d)) throw new Error('En el modo de prueba ya no cabe más en este navegador. Intenta sin imagen.')
    return { ...nueva, n_comentarios: 0 }
  }

  if (imagen) {
    const ruta = `${usuario.id}/${nuevoId()}.jpg`
    const subida = await db.storage.from('imagenes').upload(ruta, imagen, { contentType: 'image/jpeg', upsert: false })
    if (subida.error) throw subida.error
    fila.imagen_url = db.storage.from('imagenes').getPublicUrl(ruta).data.publicUrl
  }

  // user_id lo pone supabase solo, con la cuenta que esta publicando
  const { data, error } = await db.from('publicaciones').insert(fila).select().single()
  if (error) throw error
  return { ...data, n_comentarios: 0 }
}

export async function borrarPublicacion(id) {
  if (modoLocal) {
    const d = leerLocal()
    d.publicaciones = d.publicaciones.filter((p) => p.id !== id)
    d.comentarios = d.comentarios.filter((c) => c.publicacion_id !== id)
    d.apoyos = d.apoyos.filter((a) => a.publicacion_id !== id)
    guardarLocal(d)
    return
  }
  const { data, error } = await db.from('publicaciones').delete().eq('id', id).select('id')
  if (error) throw error
  if (!data.length) throw new Error('Solo puedes borrar lo que tú publicaste.')
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

export async function crearComentario({ usuario, publicacionId, padreId, texto }) {
  const fila = {
    publicacion_id: publicacionId,
    padre_id: padreId || null,
    alias: usuario.seudonimo,
    texto: texto.trim().slice(0, MAX_COMENTARIO),
  }

  if (modoLocal) {
    const d = leerLocal()
    const nuevo = { id: nuevoId(), user_id: usuario.id, ...fila, reportes: 0, created_at: new Date().toISOString() }
    d.comentarios.push(nuevo)
    if (!guardarLocal(d)) throw new Error('No se pudo guardar en este navegador.')
    return nuevo
  }

  const { data, error } = await db.from('comentarios').insert(fila).select().single()
  if (error) throw error
  return data
}

// borrar un comentario tambien borra las respuestas que tenga debajo
export async function borrarComentario(id) {
  if (modoLocal) {
    const d = leerLocal()
    const fuera = new Set([id])
    let crecio = true
    while (crecio) {
      crecio = false
      for (const c of d.comentarios) {
        if (c.padre_id && fuera.has(c.padre_id) && !fuera.has(c.id)) {
          fuera.add(c.id)
          crecio = true
        }
      }
    }
    d.comentarios = d.comentarios.filter((c) => !fuera.has(c.id))
    guardarLocal(d)
    return
  }
  const { data, error } = await db.from('comentarios').delete().eq('id', id).select('id')
  if (error) throw error
  if (!data.length) throw new Error('Solo puedes borrar lo que tú comentaste.')
}

// me identifico, poner en true lo marca y en false lo quita, devuelve el total nuevo
export async function cambiarApoyo(usuario, publicacionId, poner) {
  if (modoLocal) {
    const d = leerLocal()
    const ya = d.apoyos.some((a) => a.publicacion_id === publicacionId && a.user_id === usuario.id)
    if (poner && !ya) d.apoyos.push({ publicacion_id: publicacionId, user_id: usuario.id })
    if (!poner) d.apoyos = d.apoyos.filter((a) => !(a.publicacion_id === publicacionId && a.user_id === usuario.id))
    const p = d.publicaciones.find((x) => x.id === publicacionId)
    if (p) p.apoyos = d.apoyos.filter((a) => a.publicacion_id === publicacionId).length
    guardarLocal(d)
    return p?.apoyos ?? 0
  }

  const cambio = poner
    ? await db.from('apoyos').insert({ publicacion_id: publicacionId })
    : await db.from('apoyos').delete().eq('publicacion_id', publicacionId).eq('user_id', usuario.id)
  // si ya estaba marcado supabase responde que esta repetido, eso no es un error para la persona
  if (cambio.error && cambio.error.code !== '23505') throw cambio.error

  const { data, error } = await db.from('publicaciones').select('apoyos').eq('id', publicacionId).single()
  if (error) throw error
  return data.apoyos
}

// tipo es 'publicacion' o 'comentario', los testimonios del formulario no se pueden reportar
export async function reportar(usuario, tipo, id) {
  if (modoLocal) {
    const d = leerLocal()
    if (d.reportes.some((r) => r.objeto_id === id && r.user_id === usuario.id)) return
    d.reportes.push({ objeto_id: id, tipo, user_id: usuario.id })
    const lista = tipo === 'publicacion' ? d.publicaciones : d.comentarios
    const fila = lista.find((x) => x.id === id)
    if (fila && !fila.fijada) fila.reportes += 1
    guardarLocal(d)
    return
  }

  const { error } = await db.from('reportes').insert({ objeto_id: id, tipo })
  if (error && error.code !== '23505') throw error
}
