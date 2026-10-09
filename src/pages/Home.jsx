import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Shield, Compass, Quote } from 'lucide-react'
import { T, Foto, Reveal, Head } from '../components/ui'
import { testimonios } from '../data/testimonios'

const pillars = [Sparkles, Shield, Compass]
const elegidos = ['CuMaster777', 'Emhdm', 'Comuna 8'].map((a) => testimonios.find((t) => t.alias === a))
const resumen = (t, n = 190) => {
  const p = t.split('\n\n')[0]
  return p.length <= n ? p : p.slice(0, n).replace(/\s+\S*$/, '') + '…'
}

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
            <Link to="/register" className="btn fill">Comenzar <ArrowRight size={18} /></Link>
            <Link to="/our-mission" className="btn">Nuestra misión</Link>
          </div>
        </motion.div>
      </header>

      <section>
        <div className="wrap split">
          <Reveal><Foto src="/img/bosque.webp" alt="Jóvenes en un bosque, superpuestos con la naturaleza" /></Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow">Acerca de</p>
            <h2>{T}</h2>
            <p className="muted">{T}</p>
            <p className="muted">{T}</p>
          </Reveal>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <Head eyebrow="Qué hacemos" title="Nuestros pilares" center />
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
          <Head eyebrow="Testimonios" title="Lo que dicen" center />
          <div className="grid">
            {elegidos.map((t, n) => (
              <Reveal key={t.id} delay={n * 0.1}>
                <div className="card"><Quote className="ico" size={26} /><h3>{t.titulo}</h3><p className="muted">{resumen(t.texto)}</p><div className="who"><i className="av" /><span>{t.alias}</span></div></div>
              </Reveal>
            ))}
          </div>
          <Reveal className="center more"><Link to="/blog#testimonials" className="btn">Leer todos los testimonios <ArrowRight size={18} /></Link></Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal className="card cta split"><Foto src="/img/no-estas-solo.webp" alt="Persona saliendo de una caja transparente: no estás solo" /><div><h2>{T}</h2><p className="muted">{T}</p><Link to="/register" className="btn fill">Únete ahora</Link></div></Reveal>
        </div>
      </section>
    </>
  )
}
