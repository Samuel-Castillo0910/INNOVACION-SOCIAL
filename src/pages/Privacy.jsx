import { Reveal, PageHero, Foto } from '../components/ui'
import { Ayuda } from '../components/Ayuda'

const items = [
  ['Solo se ve tu seudónimo', 'No te pedimos tu nombre, tu correo ni ningún dato personal. Creas tu cuenta con un seudónimo inventado y eso es lo único que ven los demás. Puedes borrar lo que publiques cuando quieras.'],
  ['Los testimonios del formulario', 'Las primeras historias vienen de una encuesta anónima. Cada una es un resumen que hizo el equipo con las respuestas de una persona, sin agregar nada. Si reconoces la tuya y quieres corregirla o retirarla, avísanos con un comentario en esa historia, sin dar tu nombre.'],
  ['Una red de apoyo, no un buzón para el colegio', 'No enviamos tus historias ni tus datos a ningún colegio. Lo que publicas está aquí para que otros estudiantes sepan que no son los únicos. En la página para docentes y familias solo mostramos un resumen sin nombres.'],
  ['Respeto', 'Puedes criticar una norma, a un profesor o a un colegio, pero sin insultar y sin escribir nombres reales. Los mensajes con insultos no se publican, lo que se reporta tres veces deja de verse y las cuentas con la etiqueta Equipo pueden quitar lo que no cumpla las normas del foro.'],
]

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Privacidad" title="Privacidad y confianza" lead="Aquí nadie sabe quién eres" />
      <section>
        <div className="wrap narrow">
          <Reveal className="head"><Foto src="/img/privacidad.webp" alt="Un laberinto rojo de rejas, candados y balanzas se transforma, a través de un puente, en un paisaje verde donde las personas conversan y se ayudan" clase="completa" /></Reveal>
          {items.map(([t, d], i) => (
            <Reveal key={t} delay={0.05}>
              <div className="card item">
                <span className="num grad">0{i + 1}</span>
                <div><h3>{t}</h3><p className="muted">{d}</p></div>
              </div>
            </Reveal>
          ))}
          <Reveal><Ayuda /></Reveal>
        </div>
      </section>
    </>
  )
}
