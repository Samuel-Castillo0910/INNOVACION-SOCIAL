import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Quote, PenLine, Users, LifeBuoy } from 'lucide-react'
import { Foto, Reveal, Head } from '../components/ui'
import { Encuesta } from '../components/Ayuda'
import { Avatar } from '../components/testimonios/Partes'
import { PALETA } from '../components/testimonios/util'

// testimonios ilustrativos, los escribio el equipo a partir de las preguntas de la encuesta, no son de personas reales
const ilustrativos = [
  {
    mirada: 'Desde la mirada de una egresada',
    alias: 'Cometa Lila',
    rol: 'Sentirse acompañada',
    texto: [
      'En 9° me volví “la distraída” del salón. Nadie me preguntó por qué no me concentraba, y en mi casa las cosas no estaban bien. Con el tiempo yo también empecé a creer que era así.',
      'Lo que me ayudó fue leer a otra persona contar algo casi igual. Entendí que no era la única y me animé a hablar con alguien. Por eso escribo aquí, por si a alguien le sirve leerme.',
    ],
  },
  {
    mirada: 'Desde la mirada de una estudiante',
    alias: 'Estudiante de 10° Random',
    rol: 'Etiquetado y estigmatización',
    texto: [
      'Si un día cometes un error en 7° o tienes una discusión, esa etiqueta te persigue durante toda la secundaria. En mi caso, después de una llamada de atención, los informes empezaron a describirme como “conflictiva” y “rebelde”. Sentía que ya no miraban lo que hacía cada día, sino la imagen que se habían armado de mí.',
      'Leer aquí que a otras personas les pasó lo mismo me hizo sentir menos sola. Ya no pienso que “conflictiva” sea lo que soy.',
    ],
  },
  {
    mirada: 'Desde la mirada de un egresado',
    alias: 'Azulejo99',
    rol: 'Ser escuchado',
    texto: [
      'Cada cita en coordinación se sentía como estar en un juzgado. No había espacio para hablar de cómo te sentías, de tus problemas en el barrio o de tus miedos. Lo único que importaba era qué norma habías roto y cuál era el castigo.',
      'Me hubiera servido saber que no era el único y tener a quién contarle. Hoy le diría a cualquiera que esté pasando por eso que una anotación en el observador no dice quién es.',
    ],
  },
]

// lo que gana un estudiante al entrar, es la propuesta de valor
const ofrece = [
  {
    icono: PenLine,
    titulo: 'Cuenta tu historia sin decir quién eres',
    texto: 'Creas una cuenta con un seudónimo inventado. No pedimos tu nombre ni tu correo, y puedes borrar lo que publiques cuando quieras.',
  },
  {
    icono: Users,
    titulo: 'Lee a otros que vivieron algo parecido',
    texto: 'Marca “Me identifico” o responde a una historia. Saber que a otra persona le pasó lo mismo ayuda a no cargarlo solo.',
  },
  {
    icono: LifeBuoy,
    titulo: 'Encuentra ayuda si la necesitas',
    texto: 'En el foro están las líneas de salud mental gratuitas de Medellín y Antioquia, que atienden las 24 horas.',
  },
]

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="glow" />
        <motion.div className="wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <h1>LOSS OF<br /><span className="grad">OTHERNESS</span></h1>
          <p className="lema">Una etiqueta no dice quién eres.</p>
          <div className="row" style={{ marginTop: 36 }}>
            <Link to="/blog#testimonials" className="btn fill">Leer las historias <ArrowRight size={18} /></Link>
            <Link to="/register" className="btn">Crear cuenta</Link>
          </div>
        </motion.div>
      </header>

      <section>
        <div className="wrap split">
          <Reveal><Foto src="/img/bosque.webp" alt="Jóvenes en un bosque, superpuestos con la naturaleza" /></Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow">Bienvenida</p>
            <h2>Una red de apoyo hecha por estudiantes</h2>
            <p className="muted">Si en el colegio te pusieron una etiqueta, como “perezoso”, “desinteresado” o “problemático”, y sientes que cargas con eso solo, este espacio es para ti. Aquí puedes contar tu historia sin decir quién eres, leer a otros que vivieron algo parecido y encontrar ayuda profesional gratuita si la necesitas.</p>
            <p className="muted">La hicimos pensando en estudiantes de 10° y 11° y en egresados recientes de colegios privados católicos de Medellín, pero cualquier estudiante puede leer y participar. Puedes leer sin registrarte.</p>
            <Link to="/blog#testimonials" className="btn bienvenida-btn">Ir a las historias <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <Head eyebrow="Qué encuentras aquí" title="No tienes que cargarlo solo" center />
          <div className="grid">
            {ofrece.map(({ icono: Icono, titulo, texto }, n) => (
              <Reveal key={titulo} delay={n * 0.1}>
                <div className="card ofrece">
                  <Icono className="ico" size={28} />
                  <h3>{titulo}</h3>
                  <p className="muted">{texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Head eyebrow="Testimonios ilustrativos" title="Historias como la tuya" center />
          <Reveal>
            <p className="nota-ilustrativa">
              Estos tres testimonios los escribió el equipo a partir de las preguntas de la encuesta, para mostrar el tipo de experiencias
              que recoge el foro. No son de personas reales. Las respuestas reales del formulario están en las historias.
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
          <Reveal className="center more"><Link to="/blog#testimonials" className="btn">Leer todas las historias <ArrowRight size={18} /></Link></Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="wrap narrow">
          <Reveal><Encuesta /></Reveal>
          <Reveal>
            <p className="muted center pie-inicio">
              ¿Quieres saber de dónde salió esta idea? Mira <Link to="/hallazgos" className="subrayado">lo que encontramos</Link> en
              los manuales de convivencia y en la encuesta. Si eres docente o familia, tenemos <Link to="/docentes-y-familias" className="subrayado">un resumen para ti</Link>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
