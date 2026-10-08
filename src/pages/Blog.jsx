import { Quote, ArrowUpRight } from 'lucide-react'
import { T, Img, Reveal, Head, PageHero } from '../components/ui'

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Stories & Updates" />

      <section>
        <div className="wrap">
          <Reveal className="card split feat">
            <Img h={260} />
            <div><p className="eyebrow">Featured</p><h2>{T}</h2><p className="muted">{T}</p><p className="muted">{T}</p></div>
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <Head eyebrow="Latest" title="Recent posts" />
          <div className="grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Reveal key={n} delay={(n % 3) * 0.1}>
                <article className="card post">
                  <Img h={150} />
                  <span className="tag">{T}</span>
                  <h3>{T}</h3>
                  <p className="muted">{T}</p>
                  <span className="read">Read more <ArrowUpRight size={16} /></span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="wrap">
          <Head eyebrow="Testimonials" title="Voices from our community" center />
          <Reveal className="card big"><Quote className="ico" size={36} /><p className="bigq">{T}</p><span className="muted">{T}</span></Reveal>
          <div className="grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Reveal key={n} delay={(n % 3) * 0.1}>
                <div className="card"><Quote className="ico" size={22} /><p>{T}</p><div className="who"><i className="av" /><span className="muted">{T}</span></div></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
