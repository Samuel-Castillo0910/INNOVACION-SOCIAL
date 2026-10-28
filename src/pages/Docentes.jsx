import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Printer, ArrowRight } from 'lucide-react'
import { Reveal, PageHero, Head } from '../components/ui'
import { Puntos } from '../components/Puntos'
import { Ayuda } from '../components/Ayuda'
import { resultadosFormulario } from '../data/hallazgos'
import { testimonios, temas } from '../data/testimonios'
import { listarPublicaciones } from '../lib/foro'

// frases textuales de la encuesta que se muestran a los adultos
const FRASES = ['CuMaster777', 'La Cabra', 'Tomás Turbado', 'Egresado 06', 'Juanca', 'Cirilo_y_caiman2026']

// la primera conversacion, la solucion que el equipo priorizo, en ideas sencillas
const ideas = [
  ['Conversa antes de sancionar.', 'Pregunta qué pasó antes de decidir qué hacer. Muchas veces la historia cambia cuando el estudiante la puede contar.'],
  ['Habla de lo que pasó, no de cómo es la persona.', '“No entregaste la tarea” se puede corregir. “Eres un perezoso” se queda pegado.'],
  ['Pregunta qué hay detrás.', 'El cansancio, el desinterés o la rabia a veces vienen de algo que el estudiante no ha contado, en su casa o en el colegio.'],
  ['Escucha para entender, no para que se defienda.', 'En la encuesta, algunas personas sintieron que las escuchaban solo para que se defendieran, no para conocerlas.'],
  ['Deja que la etiqueta se vaya.', 'Un error de un día no debería seguir al estudiante todo el año. Mira lo que hace hoy, no la imagen que ya tienes de él.'],
]

export default function Docentes() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let activo = true
    listarPublicaciones()
      .then((filas) => activo && setDatos(filas))
      .catch(() => activo && setError(true))
    return () => {
      activo = false
    }
  }, [])

  // todo se cuenta con lo que hay en el foro en este momento, sin nombres
  const comunidad = (datos || []).filter((p) => !p.fijada)
  const cifras = [
    { valor: testimonios.length + comunidad.length, texto: 'historias publicadas' },
    { valor: (datos || []).reduce((s, p) => s + (p.apoyos || 0), 0), texto: 'veces que alguien marcó “Me identifico”' },
    { valor: (datos || []).reduce((s, p) => s + (p.n_comentarios || 0), 0), texto: 'respuestas entre estudiantes' },
  ]
  const porTema = temas
    .map((t) => ({ nombre: t.nombre, cuantas: comunidad.filter((p) => p.tema === t.nombre).length }))
    .filter((t) => t.cuantas > 0)
    .sort((a, b) => b.cuantas - a.cuantas)
  const maximo = Math.max(1, ...porTema.map((t) => t.cuantas))
  const frases = FRASES.map((alias) => testimonios.find((t) => t.alias === alias)).filter((t) => t?.cita)
  const hoy = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <PageHero
        eyebrow="Para docentes y familias"
        title="Lo que cuentan los estudiantes"
        lead="Un resumen sin nombres de lo que se comparte en la red, y cinco ideas para escuchar antes de juzgar."
      />

      <section>
        <div className="wrap narrow">
          <Reveal className="intro-docentes">
            <p className="muted">
              LOSS OF OTHERNESS es una red de apoyo entre estudiantes. No recibimos datos de nadie ni enviamos historias a ningún
              colegio. Este resumen se arma solo con lo que está publicado en el foro, sin seudónimos ni nombres, para que los
              adultos que acompañan a los estudiantes sepan qué están viviendo.
            </p>
          </Reveal>

          <Head eyebrow={`Resumen al ${hoy}`} title="Lo que hay en la red" />
          {error && <p className="mensaje error">No se pudieron cargar los datos del foro. Recarga la página para intentar de nuevo.</p>}
          <Reveal>
            <div className="resumen-cifras">
              {cifras.map((c) => (
                <div className="cifra" key={c.texto}>
                  <b>{datos ? c.valor : '…'}</b>
                  <span>{c.texto}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h3 className="subtitulo-grafica">Temas de las historias de la comunidad</h3>
            {porTema.length > 0 ? (
              <div className="barras">
                {porTema.map((t) => (
                  <div className="barra" key={t.nombre}>
                    <span>{t.nombre}</span>
                    <span className="barra-pista" aria-hidden="true"><span style={{ width: `${(t.cuantas / maximo) * 100}%` }} /></span>
                    <b>{t.cuantas}</b>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">{datos ? 'Todavía no hay historias de la comunidad con tema. Cuando las haya, aparecerán aquí.' : 'Cargando…'}</p>
            )}
          </Reveal>

          <Reveal>
            <h3 className="subtitulo-grafica separada">Lo que contaron 9 estudiantes y egresados en la encuesta</h3>
            <Puntos total={9} filas={resultadosFormulario} />
          </Reveal>

          <h3 className="subtitulo-grafica separada">En sus palabras</h3>
          <div className="citas sin-margen">
            {frases.map((t) => (
              <Reveal key={t.id}>
                <figure className="cita">
                  <q>{t.cita}</q>
                  <span>Estudiante o egresado, en la encuesta</span>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap narrow">
          <Head eyebrow="La primera conversación" title="Cinco ideas para escuchar mejor" />
          <ol className="ideas">
            {ideas.map(([titulo, texto]) => (
              <li key={titulo}>
                <div>
                  <b>{titulo}</b>
                  <p className="muted">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <Ayuda />
          <div className="solo-pantalla">
            <button type="button" className="btn fill" onClick={() => window.print()}>
              <Printer size={18} /> Imprimir o guardar en PDF
            </button>
            <p className="muted center chica">
              ¿Quieres ver de dónde salen estas ideas? Mira <Link to="/hallazgos" className="subrayado">lo que encontramos</Link>.
            </p>
            <Link to="/blog#testimonials" className="btn small">Leer las historias <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
