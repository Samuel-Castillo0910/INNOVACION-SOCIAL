import { Link } from 'react-router-dom'
import { Eye, Target, Heart, Users, Lightbulb, Globe } from 'lucide-react'
import { T, Img, Reveal, Head, PageHero } from '../components/ui'

const core = [[Eye, 'Vision'], [Target, 'Mission'], [Heart, 'Purpose']]
const values = [Users, Lightbulb, Globe, Heart]

export default function Mission() {
  return (
    <>
      <PageHero eyebrow="Our Mission" title="Why we exist" />
      <section>
        <div className="wrap grid">
          {core.map(([I, t], i) => (
            <Reveal key={t} delay={i * 0.12}>
              <div className="card"><I className="ico" size={30} /><h3>{t}</h3><p className="muted">{T}</p></div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="alt">
        <div className="wrap split">
          <Reveal><p className="eyebrow">Our story</p><h2>{T}</h2><p className="muted">{T}</p><p className="muted">{T}</p></Reveal>
          <Reveal delay={0.15}><Img h={320} /></Reveal>
        </div>
      </section>
      <section>
        <div className="wrap">
          <Head eyebrow="Values" title="What we stand for" center />
          <div className="grid">
            {values.map((I, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="card"><I className="ico" size={26} /><h3>{T}</h3><p className="muted">{T}</p></div>
              </Reveal>
            ))}
          </div>
          <Reveal className="center more"><Link to="/register" className="btn fill">Join us</Link></Reveal>
        </div>
      </section>
    </>
  )
}
