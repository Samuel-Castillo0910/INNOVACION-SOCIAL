import { useMemo, useState } from 'react'
import { Send, ShieldCheck, LifeBuoy, FlaskConical, ImagePlus, X } from 'lucide-react'
import { Head } from '../ui'
import { Avatar, Texto, BarraAcciones } from './Partes'
import Hilo from './Hilo'
import { haceCuanto } from './util'
import { temas } from '../../data/testimonios'
import { prepararImagen, aTexto } from '../../lib/imagen'
import {
  crearPublicacion, leerAlias, guardarAlias, modoLocal, opcionesImagen,
  MAX_ALIAS, MAX_TITULO, MAX_PUBLICACION,
} from '../../lib/foro'

const MINIMO = 10

const filtros = [
  ['todas', 'Todas'],
  ['formulario', 'Del formulario'],
  ['comunidad', 'De la comunidad'],
]

// seccion completa, el formulario para escribir arriba y todas las historias abajo
export default function Foro({ publicaciones, estado, apoyos, reportados, onApoyar, onReportar, onComentario, onPublicada }) {
  const [orden, setOrden] = useState('recientes')
  const [filtro, setFiltro] = useState('todas')

  const lista = useMemo(() => {
    const copia = publicaciones.filter((p) => filtro === 'todas' || p.origen === filtro)
    const fecha = (p) => new Date(p.created_at).getTime()
    if (orden === 'apoyadas') copia.sort((a, b) => b.apoyos - a.apoyos || fecha(b) - fecha(a))
    else copia.sort((a, b) => fecha(b) - fecha(a))
    return copia
  }, [publicaciones, orden, filtro])

  const cuantas = (clave) => (clave === 'todas' ? publicaciones.length : publicaciones.filter((p) => p.origen === clave).length)

  return (
    <section id="testimonials">
      <div className="wrap narrow">
        <Head eyebrow="Testimonios" title="Voces del colegio" center />
        <p className="muted center foro-intro">
          Las primeras historias vienen de un formulario anónimo, cada una junta en un solo texto lo que respondió una
          persona. Aquí cualquiera puede contar la suya con un seudónimo, decir que se identifica con otras y responderles.
        </p>

        {modoLocal && (
          <p className="aviso">
            <FlaskConical size={16} /> Modo de prueba: todavía no hay base de datos conectada, así que lo que publiques solo se
            guarda en este navegador.
          </p>
        )}

        <Compositor onPublicada={onPublicada} />

        <div className="foro-barra">
          <div className="filtros" role="group" aria-label="Mostrar">
            {filtros.map(([clave, nombre]) => (
              <button
                type="button"
                key={clave}
                className={'chip' + (filtro === clave ? ' on' : '')}
                aria-pressed={filtro === clave}
                onClick={() => setFiltro(clave)}
              >
                {nombre} <span className="cuenta-filtro">{cuantas(clave)}</span>
              </button>
            ))}
          </div>
          <div className="orden" role="group" aria-label="Ordenar">
            <button type="button" className={orden === 'recientes' ? 'on' : ''} onClick={() => setOrden('recientes')} aria-pressed={orden === 'recientes'}>
              Recientes
            </button>
            <button type="button" className={orden === 'apoyadas' ? 'on' : ''} onClick={() => setOrden('apoyadas')} aria-pressed={orden === 'apoyadas'}>
              Más apoyadas
            </button>
          </div>
        </div>

        {estado === 'cargando' && <p className="muted chico cargando">Cargando historias de la comunidad…</p>}
        {estado === 'error' && <p className="mensaje error">No se pudieron cargar las historias de la comunidad. Recarga la página para intentar de nuevo.</p>}
        {lista.length === 0 && (
          <div className="vacio">
            {filtro === 'comunidad' ? 'Todavía nadie de la comunidad ha publicado. La tuya puede ser la primera historia.' : 'No hay historias para mostrar.'}
          </div>
        )}

        <div className="foro-lista">
          {lista.map((p) => (
            <Publicacion
              key={p.id}
              p={p}
              apoyado={apoyos.has(p.id)}
              reportados={reportados}
              onApoyar={() => onApoyar(p)}
              onReportar={onReportar}
              onComentario={() => onComentario(p.id)}
            />
          ))}
        </div>

        <p className="ayuda">
          <LifeBuoy size={18} />
          <span>
            Si contar esto te removió algo o estás pasando por un momento difícil, no tienes que cargar con eso sin ayuda. En Medellín
            puedes llamar gratis a la <b>Línea 106</b>, las 24 horas. En una emergencia, marca <b>123</b>.
          </span>
        </p>
      </div>
    </section>
  )
}

// formulario para escribir una historia nueva, empieza cerrado como una barra
function Compositor({ onPublicada }) {
  const [abierto, setAbierto] = useState(false)
  const [alias, setAlias] = useState(leerAlias)
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const [tema, setTema] = useState(null)
  const [imagen, setImagen] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const pregunta = temas.find((t) => t.nombre === tema)?.pregunta

  const elegirImagen = async (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    setProcesando(true)
    setMensaje(null)
    try {
      const blob = await prepararImagen(archivo, opcionesImagen)
      setImagen({ blob, vista: await aTexto(blob) })
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message })
    } finally {
      setProcesando(false)
    }
  }

  const publicar = async (e) => {
    e.preventDefault()
    if (texto.trim().length < MINIMO) {
      setMensaje({ tipo: 'error', texto: `Escribe un poco más para publicar, mínimo ${MINIMO} caracteres.` })
      return
    }
    setEnviando(true)
    setMensaje(null)
    try {
      const nueva = await crearPublicacion({ alias, titulo, texto, tema, imagen: imagen?.blob })
      guardarAlias(alias)
      onPublicada(nueva)
      setTitulo('')
      setTexto('')
      setTema(null)
      setImagen(null)
      setAbierto(false)
      setMensaje({ tipo: 'ok', texto: 'Tu historia ya está publicada. Gracias por contarla.' })
    } catch (err) {
      const textoError = modoLocal && err?.message ? err.message : 'No se pudo publicar. Revisa tu conexión e intenta de nuevo.'
      setMensaje({ tipo: 'error', texto: textoError })
    } finally {
      setEnviando(false)
    }
  }

  const aviso = mensaje && (
    <p className={'mensaje ' + mensaje.tipo} role="status">
      {mensaje.texto}
    </p>
  )

  if (!abierto) {
    return (
      <div>
        <button
          type="button"
          className="compositor-cerrado"
          onClick={() => {
            setAbierto(true)
            setMensaje(null)
          }}
        >
          <Avatar alias={alias.trim() || 'Anónimo'} />
          <span className="falso-campo">¿Qué viviste en el colegio? Cuéntalo aquí…</span>
          <span className="btn fill small">Escribir</span>
        </button>
        {aviso}
      </div>
    )
  }

  return (
    <form className="compositor" onSubmit={publicar}>
      <div className="campo-alias">
        <Avatar alias={alias.trim() || 'Anónimo'} />
        <input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Tu seudónimo (ej. Azulejo88)" maxLength={MAX_ALIAS} aria-label="Seudónimo" />
      </div>

      <p className="chips-titulo muted">¿Sobre qué quieres hablar?</p>
      <div className="chips" role="group" aria-label="Tema">
        {temas.map((t) => (
          <button
            type="button"
            key={t.nombre}
            className={'chip' + (tema === t.nombre ? ' on' : '')}
            aria-pressed={tema === t.nombre}
            onClick={() => setTema(tema === t.nombre ? null : t.nombre)}
          >
            {t.nombre}
          </button>
        ))}
      </div>

      {pregunta && <p className="pregunta-guia">{pregunta}</p>}

      <input
        className="campo-titulo"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título (opcional)"
        maxLength={MAX_TITULO}
        aria-label="Título"
      />
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="¿Qué viviste en el colegio? Cuéntalo como quieras."
        maxLength={MAX_PUBLICACION}
        rows={5}
        autoFocus
        aria-label="Tu historia"
      />

      <div className="adjuntar">
        {imagen ? (
          <div className="vista-previa">
            <img src={imagen.vista} alt="Vista previa de la imagen que vas a publicar" />
            <button type="button" onClick={() => setImagen(null)} aria-label="Quitar imagen">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="accion boton-imagen">
            <ImagePlus size={16} /> {procesando ? 'Preparando imagen…' : 'Añadir imagen (opcional)'}
            <input type="file" accept="image/*" className="oculto" onChange={elegirImagen} disabled={procesando} />
          </label>
        )}
      </div>

      <p className="compositor-nota muted">
        <ShieldCheck size={15} />
        <span>
          Es anónimo. No pongas tu nombre real ni nombres de profesores, compañeros o colegios, y no subas fotos donde se vean
          caras. Lo que publiques lo puede leer cualquier persona.
        </span>
      </p>

      <div className="compositor-pie">
        <span className="muted contador">
          {texto.length}/{MAX_PUBLICACION}
        </span>
        <div className="botones">
          <button type="button" className="btn small" onClick={() => setAbierto(false)}>
            Cancelar
          </button>
          <button type="submit" className="btn fill small" disabled={enviando || procesando}>
            {enviando ? 'Publicando…' : 'Publicar'} <Send size={15} />
          </button>
        </div>
      </div>

      {aviso}
    </form>
  )
}

// una historia con su hilo de respuestas, las del formulario llevan su etiqueta y no se reportan
function Publicacion({ p, apoyado, reportados, onApoyar, onReportar, onComentario }) {
  const [abierto, setAbierto] = useState(false)
  const deFormulario = p.origen === 'formulario'

  return (
    <article className="publicacion">
      <header className="autor">
        <Avatar alias={p.alias} />
        <div className="autor-datos">
          <b>{p.alias}</b>
          <span className="muted">{haceCuanto(p.created_at)}</span>
        </div>
        {deFormulario ? <span className="tema formulario">Formulario</span> : p.tema && <span className="tema">{p.tema}</span>}
      </header>

      {p.titulo && <h3 className="publicacion-titulo">{p.titulo}</h3>}
      <Texto texto={p.texto} />
      {p.imagen_url && <Imagen url={p.imagen_url} alias={p.alias} />}

      <BarraAcciones
        apoyos={p.apoyos}
        apoyado={apoyado}
        onApoyar={onApoyar}
        comentarios={p.n_comentarios}
        abierto={abierto}
        onComentarios={() => setAbierto(!abierto)}
        reportado={reportados.has(p.id)}
        onReportar={deFormulario ? undefined : () => onReportar('publicacion', p.id)}
      />

      {abierto && <Hilo publicacionId={p.id} onComentario={onComentario} reportados={reportados} onReportar={onReportar} />}
    </article>
  )
}

// imagen de una publicacion, con clic se ve completa
function Imagen({ url, alias }) {
  const [grande, setGrande] = useState(false)
  return (
    <button type="button" className={'imagen' + (grande ? ' grande' : '')} onClick={() => setGrande(!grande)} aria-label={grande ? 'Reducir imagen' : 'Ver imagen completa'}>
      <img src={url} alt={`Imagen que compartió ${alias}`} loading="lazy" />
    </button>
  )
}
