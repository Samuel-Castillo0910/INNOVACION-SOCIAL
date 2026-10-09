import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Foro from './Foro'
import { testimonios } from '../../data/testimonios'
import { PALETA } from './util'
import { listarPublicaciones, misMarcas, cambiarApoyo, reportar, borrarPublicacion } from '../../lib/foro'
import { useSesion } from '../../lib/sesion'
import './testimonios.css'

const vacio = new Set()

// seccion de testimonios del blog, junta los testimonios del formulario con lo que publica la comunidad
export default function Testimonios() {
  const { usuario } = useSesion()
  const navigate = useNavigate()
  const [publicaciones, setPublicaciones] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [marcas, setMarcas] = useState({ de: null, apoyos: vacio, reportes: vacio })

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

  // lo que esta cuenta ya marco, se vuelve a pedir cuando alguien entra o sale
  useEffect(() => {
    if (!usuario) return
    let activo = true
    misMarcas(usuario)
      .then((m) => activo && setMarcas({ de: usuario.id, ...m }))
      .catch(() => {})
    return () => {
      activo = false
    }
  }, [usuario])

  const propias = usuario && marcas.de === usuario.id
  const apoyos = propias ? marcas.apoyos : vacio
  const reportados = propias ? marcas.reportes : vacio

  const pedirCuenta = () => navigate('/login', { state: { volver: '/blog#testimonials' } })

  // cambia una publicacion de la lista sin volver a cargar todo
  const editar = (id, cambiar) => setPublicaciones((lista) => lista.map((p) => (p.id === id ? { ...p, ...cambiar(p) } : p)))

  const alternarApoyo = async (pub) => {
    if (!usuario) return pedirCuenta()
    const quitar = apoyos.has(pub.id)
    const nuevos = new Set(apoyos)
    if (quitar) nuevos.delete(pub.id)
    else nuevos.add(pub.id)
    setMarcas((m) => ({ ...m, apoyos: nuevos }))
    editar(pub.id, (p) => ({ apoyos: Math.max(p.apoyos + (quitar ? -1 : 1), 0) }))
    try {
      const total = await cambiarApoyo(usuario, pub.id, !quitar)
      if (typeof total === 'number') editar(pub.id, () => ({ apoyos: total }))
    } catch {
      // si falla, todo vuelve a como estaba
      setMarcas((m) => ({ ...m, apoyos }))
      editar(pub.id, (p) => ({ apoyos: Math.max(p.apoyos + (quitar ? 1 : -1), 0) }))
    }
  }

  const reportarFila = async (tipo, id) => {
    if (!usuario) return pedirCuenta()
    if (reportados.has(id)) return
    setMarcas((m) => ({ ...m, reportes: new Set(m.reportes).add(id) }))
    try {
      await reportar(usuario, tipo, id)
    } catch {
      setMarcas((m) => ({ ...m, reportes: reportados }))
    }
  }

  const borrar = async (pub) => {
    if (!window.confirm('¿Borrar esta publicación y sus comentarios? No se puede deshacer.')) return
    try {
      await borrarPublicacion(pub.id)
      setPublicaciones((lista) => lista.filter((p) => p.id !== pub.id))
    } catch (error) {
      window.alert(error.message || 'No se pudo borrar.')
    }
  }

  const cambiarComentarios = (id, cuantos) => editar(id, (p) => ({ n_comentarios: Math.max(p.n_comentarios + cuantos, 0) }))
  const agregarPublicacion = (nueva) => setPublicaciones((lista) => [nueva, ...lista])

  // el texto de los testimonios sale de data/testimonios.js, de la base solo salen los apoyos y comentarios
  const porId = new Map(publicaciones.map((p) => [p.id, p]))
  const delFormulario = testimonios.map((t, i) => ({
    id: t.id,
    tono: PALETA[i % PALETA.length],
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
      usuario={usuario}
      apoyos={apoyos}
      reportados={reportados}
      onApoyar={alternarApoyo}
      onReportar={reportarFila}
      onBorrar={borrar}
      onComentario={cambiarComentarios}
      onPublicada={agregarPublicacion}
    />
  )
}
