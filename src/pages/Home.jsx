import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Quote } from 'lucide-react'
import { Foto, Reveal, Head } from '../components/ui'
import { Avatar } from '../components/testimonios/Partes'
import { PALETA } from '../components/testimonios/util'

// testimonios ilustrativos, los escribio el equipo a partir de las preguntas de la encuesta, no son de personas reales
const ilustrativos = [
  {
    mirada: 'Desde la perspectiva del profesor',
    alias: 'Docente de Secundaria',
    rol: 'Profesor de aula, 10 años de experiencia',
    texto: [
      'A menudo los manuales de convivencia y el sistema administrativo nos presionan a los profesores a actuar como jueces antes que como educadores. He visto cómo el catálogo de faltas, como sancionar la “actitud de desinterés” o el “incumplimiento de deberes”, nos empuja a llenar fichas del observador calificando al estudiante de “apático” o “rebelde”, cuando en realidad ese estudiante está atravesando un cuadro depresivo, ansiedad o crisis familiar en casa.',
    ],
  },
  {
    mirada: 'Desde la perspectiva de una estudiante actual',
    alias: 'Estudiante de 10° Random',
    rol: 'Etiquetado y estigmatización',
    texto: [
      'Si un día cometes un error en 7° grado o tienes una discusión, esa etiqueta te persigue durante toda la secundaria. En mi caso, tras una llamada de atención, los informes de los profesores empezaron a describirme como “conflictiva” y “rebelde”. Sentía que ya no evaluaban mis acciones del día a día, sino la imagen previa que se habían armado de mí.',
      'Cuando intentaba explicar por qué me había alterado en una clase, sentía que los directivos no me escuchaban para entender la causa, sino para buscar la falla en mi defensa y justificar la sanción. Este foro nos da esperanza de que los profesores aprendan a mirar a cada estudiante con ojos nuevos cada día, sin prejuicios.',
    ],
  },
  {
    mirada: 'Desde la perspectiva de un egresado',
    alias: 'Azulejo99',
    rol: 'Escucha activa y justicia restaurativa',
    texto: [
      'Cada cita en Coordinación Disciplinaria se sentía como estar en un juzgado. No había espacio para hablar de cómo te sentías, de tus problemas en el barrio o de tus miedos; el único objetivo era determinar qué norma del manual habías roto y cuál era el castigo.',
      'La educación no debería basarse en el miedo al observador ni a la expulsión. Necesitamos que los colegios enseñen a resolver conflictos mediante el diálogo restaurativo: donde el estudiante pueda reparar la falta, ser escuchado como persona y comprender el impacto de sus actos sin ser estigmatizado.',
    ],
  },
]

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="glow" />
        <motion.div className="wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <h1>LOSS OF<br /><span className="grad">OTHERNESS</span></h1>
          <div className="row" style={{ marginTop: 40 }}>
            <Link to="/register" className="btn fill">Comenzar <ArrowRight size={18} /></Link>
            <Link to="/our-mission" className="btn">Nuestra misión</Link>
          </div>
        </motion.div>
      </header>

      <section>
        <div className="wrap split">
          <Reveal><Foto src="/img/bosque.webp" alt="Jóvenes en un bosque, superpuestos con la naturaleza" /></Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow">Bienvenida</p>
            <h2>Un espacio para contar cómo viviste el colegio</h2>
            <p className="muted">LOSS OF OTHERNESS nace de una pregunta: ¿qué pasa cuando un colegio deja de mirar lo que un estudiante hizo y empieza a juzgar quién cree que es? Aquí reunimos experiencias de estudiantes, egresados y profesores sobre las normas, los manuales de convivencia y la forma en que se escucha, o no, a la persona que está detrás de una falta.</p>
            <p className="muted">Puedes leer los testimonios sin registrarte. Si quieres contar tu historia, responder a otras personas o decir que te identificas, crea una cuenta con un seudónimo inventado: no pedimos tu nombre ni tu correo.</p>
            <Link to="/blog#testimonials" className="btn bienvenida-btn">Ir a los testimonios <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <Head eyebrow="Testimonios ilustrativos" title="Tres miradas a la convivencia escolar" center />
          <Reveal>
            <p className="nota-ilustrativa">
              Estos tres testimonios los escribió el equipo a partir de las preguntas de la encuesta, para mostrar el tipo de experiencias
              que recoge el foro. No son de personas reales. Las respuestas reales del formulario están en el blog.
            </p>
          </Reveal>
          <div className="grid">
            {ilustrativos.map((t, n) => (
              <Reveal key={t.alias} delay={n * 0.1}>
                <div className="card testimonio">
                  <Quote className="ico" size={26} />
                  <p className="eyebrow">{t.mirada}</p>
                  {t.texto.map((p, i) => <p key={i}>{p}</p>)}
                  <div className="who"><Avatar alias={t.alias} tono={PALETA[n]} /><div><b>{t.alias}</b><span className="muted">{t.rol}</span></div></div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="center more"><Link to="/blog#testimonials" className="btn">Leer todos los testimonios <ArrowRight size={18} /></Link></Reveal>
        </div>
      </section>

    </>
  )
}
