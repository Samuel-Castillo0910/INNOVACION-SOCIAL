import { Reveal, PageHero, Foto } from '../components/ui'

export default function Mission() {
  return (
    <>
      <PageHero eyebrow="Nuestra misión" title="Misión y visión" lead={null} />
      <section>
        <div className="wrap split">
          <Reveal><Foto src="/img/espejo.webp" alt="Persona frente a un espejo rodeado de flores" alto /></Reveal>
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
            <p className="muted">TEXTO VA AQUI</p>
            <p className="muted">TEXTO VA AQUI</p>
          </Reveal>
          <Reveal delay={0.15}><Foto src="/img/diversidad.webp" alt="Ilustración de personas diversas bailando y abrazándose" /></Reveal>
        </div>
      </section>
    </>
  )
}
