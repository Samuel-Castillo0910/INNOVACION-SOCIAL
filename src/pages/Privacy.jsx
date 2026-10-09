import { Reveal, PageHero, Foto } from '../components/ui'

const items = [
  ['Anonimato absoluto', 'No solicitamos, rastreamos ni almacenamos tu nombre real, correo electrónico ni datos personales. Todo lo que compartes se gestiona bajo un seudónimo anónimo que tú mismo eliges.'],
  ['Principio de No-Deformación', 'Nadie escribirá por ti. En nuestros ejercicios de entrevista, ningún testimonio se publica sin que el participante lo haya leído, editado y aprobado previamente en su totalidad.'],
  ['Espacio constructivo', 'La información recolectada se presenta a los directivos y comités de convivencia de forma agregada y anónima como un diagnóstico de salud mental y bienestar escolar, garantizando que nadie pueda ser identificado o sancionado por expresar su experiencia.'],
  ['Espacio de respeto', 'Este portal es un canal de reflexión sobre las normas y el bienestar emocional, no una red de difamación personal. Nos reservamos el derecho de omitir comentarios que revelen nombres de terceros o promuevan agresiones directas. Si estás atravesando una crisis emocional o necesitas orientación confidencial inmediata, te recordamos que este sitio no presta servicios terapéuticos. Puedes acudir a las líneas de atención en salud mental de tu ciudad o consultar con la Secretaría de Salud de tu municipio.'],
]

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Privacidad" title="Privacidad y confianza" lead="Tu identidad y tu voz están 100% protegidas" />
      <section>
        <div className="wrap narrow">
          <Reveal className="head"><Foto src="/img/diario.webp" alt="Persona escribiendo en un diario de autocuidado" /></Reveal>
          {items.map(([t, d], i) => (
            <Reveal key={t} delay={0.05}>
              <div className="card item">
                <span className="num grad">0{i + 1}</span>
                <div><h3>{t}</h3><p className="muted">{d}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
