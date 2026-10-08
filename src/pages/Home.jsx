import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Shield, Compass, Quote } from 'lucide-react'
import { T, Img, Reveal, Head } from '../components/ui'

const pillars = [Sparkles, Shield, Compass]

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="glow" />
        <motion.div className="wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <p className="eyebrow">{T}</p>
          <h1>LOSS OF<br /><span className="grad">OTHERNESS</span></h1>
          <p className="muted lead">{T}</p>
          <div className="row">
            <Link to="/register" className="btn fill">Get started <ArrowRight size={18} /></Link>
            <Link to="/our-mission" className="btn">Our mission</Link>
          </div>
        </motion.div>
      </header>

      <section>
        <div className="wrap split">
          <Reveal><Img h={320} /></Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow">About</p>
            <h2>{T}</h2>
            <p className="muted">{T}</p>
            <p className="muted">{T}</p>
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <Head eyebrow="What we do" title="Our pillars" center />
          <div className="grid">
            {pillars.map((I, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="card"><I className="ico" size={30} /><h3>{T}</h3><p className="muted">{T}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap stats">
          {[1, 2, 3, 4].map((n) => (
            <Reveal key={n} delay={n * 0.08}><b className="grad">00</b><span className="muted">{T}</span></Reveal>
          ))}
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <Head eyebrow="Testimonials" title="What people say" center />
          <div className="grid">
            {[1, 2, 3].map((n) => (
              <Reveal key={n} delay={n * 0.1}>
                <div className="card"><Quote className="ico" size={26} /><p>{T}</p><div className="who"><i className="av" /><span className="muted">{T}</span></div></div>
              </Reveal>
            ))}
          </div>
          <Reveal className="center more"><Link to="/blog#testimonials" className="btn">Read all testimonials <ArrowRight size={18} /></Link></Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal className="card cta"><h2>{T}</h2><p className="muted">{T}</p><Link to="/register" className="btn fill">Join now</Link></Reveal>
        </div>
      </section>
    </>
  )
}
