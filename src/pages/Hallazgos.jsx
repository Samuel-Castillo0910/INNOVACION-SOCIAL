import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal, PageHero, Head } from '../components/ui'
import { Puntos } from '../components/Puntos'
import { manuales, focos, normas, resultadosFormulario } from '../data/hallazgos'
import { testimonios } from '../data/testimonios'

// citas textuales del formulario que mejor muestran lo que encontramos
const CITAS = ['CuMaster777', 'La Cabra', 'Tomás Turbado']

export default function Hallazgos() {
  const porFoco = focos.map((f) => ({ ...f, normas: normas.filter((n) => n.foco === f.id) }))
  const citas = CITAS.map((alias) => testimonios.find((t) => t.alias === alias)).filter((t) => t?.cita)

  return (
    <>
      <PageHero
        eyebrow="Evidencia"
        title="Lo que encontramos"
        lead="Revisamos manuales de convivencia y escuchamos a 9 estudiantes y egresados. Esto es lo que vimos y lo que aprendimos."
      />

      <section>
        <div className="wrap narrow">
          <Head eyebrow="¿Por qué pasa esto?" title="Lo que dicen los manuales" />
          <Reveal>
            <p className="muted">
              Revisamos 12 normas de tres manuales de convivencia. Buscamos normas que juzgan cómo es el estudiante y no lo que
              hizo, o que dejan tanto a la interpretación que todo depende de quién sancione.
            </p>
            <ul className="manuales">
              {manuales.map((m) => (
                <li key={m.nombre}>
                  {m.nombre}
                  <span className="muted">{m.detalle}</span>
                </li>
              ))}
            </ul>
            <p className="muted nota-limite">
              Ninguno de estos tres manuales es de un colegio de Medellín. Por eso son ejemplos de cómo se puede escribir una norma
              que juzga a la persona, no una muestra de lo que pasa en todos los colegios. Revisar manuales de colegios privados
              católicos de Medellín es nuestro siguiente paso.
            </p>
          </Reveal>

          <Reveal>
            <h3 className="subtitulo-grafica">Las 12 normas, según lo que hacen</h3>
            <Puntos total={normas.length} filas={porFoco.map((f) => ({ valor: f.normas.length, texto: f.nombre }))} />
            <p className="muted chica">La agrupación la hizo el equipo a partir del análisis de cada norma.</p>
          </Reveal>

          {porFoco.map((f) => (
            <div className="foco" key={f.id}>
              <Reveal className="foco-titulo">
                <h3>{f.nombre}</h3>
                <span>{f.normas.length} de {normas.length} normas</span>
              </Reveal>
              <div className="normas">
                {f.normas.map((n) => (
                  <Reveal key={n.donde + n.colegio}>
                    <article className="norma">
                      <span className="fuente">{n.colegio} · {n.donde}</span>
                      <blockquote>«{n.cita}»</blockquote>
                      <p className="muted"><b>Por qué importa:</b> {n.porque}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="alt">
        <div className="wrap narrow">
          <Head eyebrow="La encuesta" title="Lo que nos contaron" />
          <Reveal>
            <p className="muted">
              Entre el 5 y el 7 de octubre de 2026, 9 estudiantes y egresados respondieron una encuesta anónima sobre cómo los
              describía el colegio, cómo manejaban los problemas y si de verdad los escuchaban. Sus respuestas completas están en
              las <Link to="/blog#testimonials" className="subrayado">historias</Link>.
            </p>
          </Reveal>
          <Reveal>
            <h3 className="subtitulo-grafica">De las 9 personas…</h3>
            <Puntos total={9} filas={resultadosFormulario} />
          </Reveal>
          <div className="citas">
            {citas.map((t) => (
              <Reveal key={t.id}>
                <figure className="cita">
                  <q>{t.cita}</q>
                  <span>{t.alias}, en la encuesta</span>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap narrow aprendimos">
          <Head eyebrow="Lo que aprendimos" title="No salió como esperábamos" />
          <Reveal>
            <p className="muted">
              Empezamos creyendo que el problema estaba sobre todo en los manuales y en la forma en que los colegios describen a
              los estudiantes. La encuesta no lo confirmó del todo: 6 de las 9 personas sintieron que el colegio las describía por
              sus acciones, y varias contaron que, cuando tuvieron un problema, el colegio sí intentó entender lo que pasó.
            </p>
            <p className="muted">
              Lo que sí se repitió fue otra cosa: poco espacio para decir cómo se sentían, una escucha que a veces solo servía para
              que se defendieran y etiquetas que, cuando aparecen, se quedan pegadas. Una persona lo dijo así: “La frontera entre
              lo que hice y lo que soy se volvía progresivamente borrosa”.
            </p>
            <p className="muted">
              Por eso cambiamos el enfoque. No podemos cambiar las normas de un colegio, pero sí podemos ofrecerles a los
              estudiantes un lugar donde no se sientan solos. Así pasamos de una plataforma pensada para directivos a una red de
              apoyo hecha por estudiantes para estudiantes, con un resumen para los adultos que quieran escuchar mejor.
            </p>
          </Reveal>
          <Reveal className="botones-centro">
            <Link to="/blog#testimonials" className="btn fill">Ir a las historias <ArrowRight size={18} /></Link>
            <Link to="/docentes-y-familias" className="btn">Para docentes y familias</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
