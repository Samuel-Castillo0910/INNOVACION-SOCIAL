import { Link } from 'react-router-dom'
import { Reveal, PageHero, Foto } from '../components/ui'

export default function Mission() {
  return (
    <>
      <PageHero eyebrow="Nuestra misión" title="Misión y visión" lead={null} />
      <section>
        <div className="wrap split">
          <Reveal><Foto src="/img/no-estas-solo.webp" alt="Persona saliendo de una caja transparente con el mensaje: no estás solo, empatía y libertad" /></Reveal>
          <Reveal delay={0.15}>
            <h2>Misión</h2>
            <p className="muted">Somos estudiantes de la Universidad EIA. Creamos LOSS OF OTHERNESS después de escuchar a estudiantes y egresados y de revisar manuales de convivencia. Vimos que muchos jóvenes cargan con etiquetas como “perezoso”, “desinteresado” o “problemático”, y que pocas veces tienen con quién hablar de eso.</p>
            <p className="muted">Nuestra misión es que ningún estudiante se sienta solo frente a una etiqueta. Por eso ofrecemos un lugar para contar lo que viviste sin decir quién eres, leer a otros que pasaron por algo parecido y saber a dónde acudir si necesitas ayuda.</p>
            <p className="muted">Pensamos sobre todo en estudiantes de 10° y 11° y en egresados recientes de colegios privados católicos de Medellín, aunque cualquier estudiante puede participar.</p>
          </Reveal>
        </div>
      </section>
      <section className="alt">
        <div className="wrap split">
          <Reveal>
            <h2>Visión</h2>
            <p className="frase-vision">“Que ningún estudiante tenga que cargar solo con una etiqueta.”</p>
            <p className="muted">Soñamos con que cada estudiante sepa que lo que hizo un día no dice quién es. Que tenga con quién hablar cuando lo juzgan y que sepa que pedir ayuda está bien.</p>
            <p className="muted">También queremos que los adultos que lo rodean aprendan a escuchar antes de juzgar. Para ellos hicimos un <Link to="/docentes-y-familias" className="subrayado">resumen de lo que cuentan los estudiantes</Link>.</p>
          </Reveal>
          <Reveal delay={0.15}><Foto src="/img/vision.webp" alt="Una isla protegida por una cúpula de vidrio con un libro abierto y globos de conversación, y una persona escribiendo en su computador" clase="completa" /></Reveal>
        </div>
      </section>
    </>
  )
}
