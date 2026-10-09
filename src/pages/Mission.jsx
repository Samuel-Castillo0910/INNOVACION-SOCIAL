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
            <p className="muted">Somos una iniciativa de investigación y concientización fundamentada en el diseño centrado en las personas (<em>Human-Centered Design</em>). Surgimos a partir del trabajo de campo, la auditoría sistemática a manuales de convivencia escolares en Medellín y Rionegro, y el desarrollo de conversaciones coautoradas con estudiantes y egresados.</p>
            <p className="muted">A través del análisis de datos de los reglamentos institucionales, evidenciamos cómo el lenguaje normativo juzga por <em>atributos</em> en lugar de <em>conductas</em>, limitando el derecho a ser escuchado exclusivamente a escenarios de acusación (<em>descargos</em>). Nuestra misión es visibilizar esta pérdida de la otredad, ofreciendo herramientas basadas en evidencia que transformen el juzgamiento punitivo en un acompañamiento real que proteja la salud mental y la dignidad de los estudiantes.</p>
          </Reveal>
        </div>
      </section>
      <section className="alt">
        <div className="wrap split">
          <Reveal>
            <h2>Visión</h2>
            <p className="frase-vision">“Trascender la norma sancionatoria para construir comunidades educativas empáticas y humanas.”</p>
            <p className="muted">Creemos que las políticas disciplinarias y los manuales de convivencia no deben ser instrumentos de etiquetado o castigo, sino herramientas para el cuidado, la justicia restaurativa y el bienestar mental. Por eso este foro nace como un espacio anónimo, seguro y constructivo donde las voces de estudiantes, egresados y profesores se transforman en retroalimentación viva para que las instituciones educativas identifiquen sus brechas de empatía, reevalúen normativas rígidas y migren hacia una convivencia basada en el entendimiento mutuo y la escucha activa.</p>
          </Reveal>
          <Reveal delay={0.15}><Foto src="/img/vision.webp" alt="Una isla protegida por una cúpula de vidrio con un libro abierto y globos de conversación, y una persona escribiendo en su computador" clase="completa" /></Reveal>
        </div>
      </section>
    </>
  )
}
