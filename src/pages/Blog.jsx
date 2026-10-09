import { ArrowUpRight } from 'lucide-react'
import { T, Reveal, Head, PageHero } from '../components/ui'
import Testimonios from '../components/testimonios/Testimonios'

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Historias y novedades" />

      <section>
        <div className="wrap">
          <Reveal className="card feat">
            <div><p className="eyebrow">Destacado</p><h2>{T}</h2><p className="muted">{T}</p><p className="muted">{T}</p></div>
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <Head eyebrow="Recientes" title="Publicaciones recientes" />
          <div className="grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Reveal key={n} delay={(n % 3) * 0.1}>
                <article className="card post">
                  <span className="tag">{T}</span>
                  <h3>{T}</h3>
                  <p className="muted">{T}</p>
                  <span className="read">Leer más <ArrowUpRight size={16} /></span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonios />
    </>
  )
}
