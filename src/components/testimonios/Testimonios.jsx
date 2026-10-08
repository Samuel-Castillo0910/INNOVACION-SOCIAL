import { useEffect, useState } from 'react'
import Foro from './Foro'
import { testimonios } from '../../data/testimonios'
import { listarPublicaciones, cambiarApoyo, reportar, misApoyos, misReportes } from '../../lib/foro'
import './testimonios.css'

// seccion de testimonios del blog, junta los testimonios del formulario con lo que publica la comunidad
export default function Testimonios() {
  const [publicaciones, setPublicaciones] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [apoyos, setApoyos] = useState(misApoyos.leer)
  const [reportados, setReportados] = useState(misReportes.leer)

  useEffect(() => {
    let activo = true
    listarPublicaciones()
      .then((filas) => {
        if (!activo) return
        setPublicaciones(filas)
        setEstado('listo')
      })
      .catch(() => activo && setEstado('error'))
    return () => {
      activo = false
    }
  }, [])

  // cambia una publicacion de la lista sin volver a cargar todo
  const editar = (id, cambiar) => setPublicaciones((lista) => lista.map((p) => (p.id === id ? { ...p, ...cambiar(p) } : p)))

  const alternarApoyo = async (pub) => {
    const quitar = apoyos.has(pub.id)
    const cambio = quitar ? -1 : 1
    const nuevos = new Set(apoyos)
    if (quitar) nuevos.delete(pub.id)
    else nuevos.add(pub.id)
    setApoyos(nuevos)
    misApoyos.guardar(nuevos)
    editar(pub.id, (p) => ({ apoyos: Math.max(p.apoyos + cambio, 0) }))
    try {
      const total = await cambiarApoyo(pub.id, cambio)
      if (typeof total === 'number') editar(pub.id, () => ({ apoyos: total }))
    } catch {
      // si falla, todo vuelve a como estaba
      setApoyos(apoyos)
      misApoyos.guardar(apoyos)
      editar(pub.id, (p) => ({ apoyos: Math.max(p.apoyos - cambio, 0) }))
    }
  }

  const reportarFila = async (tipo, id) => {
    if (reportados.has(id)) return
    const nuevos = new Set(reportados).add(id)
    setReportados(nuevos)
    misReportes.guardar(nuevos)
    try {
      await reportar(tipo, id)
    } catch {
      setReportados(reportados)
      misReportes.guardar(reportados)
    }
  }

  const sumarComentario = (id) => editar(id, (p) => ({ n_comentarios: p.n_comentarios + 1 }))
  const agregarPublicacion = (nueva) => setPublicaciones((lista) => [nueva, ...lista])

  // el texto de los testimonios sale de data/testimonios.js, de la base solo salen los apoyos y comentarios
  const porId = new Map(publicaciones.map((p) => [p.id, p]))
  const delFormulario = testimonios.map((t) => ({
    id: t.id,
    alias: t.alias,
    titulo: t.titulo,
    texto: t.texto,
    created_at: t.fecha,
    origen: 'formulario',
    apoyos: porId.get(t.id)?.apoyos ?? 0,
    n_comentarios: porId.get(t.id)?.n_comentarios ?? 0,
  }))
  const deLaComunidad = publicaciones.filter((p) => !p.fijada).map((p) => ({ ...p, origen: 'comunidad' }))

  return (
    <Foro
      publicaciones={[...deLaComunidad, ...delFormulario]}
      estado={estado}
      apoyos={apoyos}
      reportados={reportados}
      onApoyar={alternarApoyo}
      onReportar={reportarFila}
      onComentario={sumarComentario}
      onPublicada={agregarPublicacion}
    />
  )
}
