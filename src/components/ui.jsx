import { motion } from 'framer-motion'

export const T = 'TEXTO VA AQUI'

export const Img = ({ h = 240 }) => (
  <div className="img" style={{ minHeight: h }}>IMAGEN PUEDE IR AQUI</div>
)

export const Foto = ({ src, alt, alto }) => (
  <img className={'foto' + (alto ? ' alto' : '')} src={src} alt={alt} loading="lazy" />
)

export const Reveal = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
)

export const Head = ({ eyebrow, title, center }) => (
  <Reveal className={center ? 'center head' : 'head'}>
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
  </Reveal>
)

export const PageHero = ({ eyebrow, title, lead }) => (
  <header className="page-hero">
    <motion.div className="wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lead !== null && <p className="muted lead">{lead ?? T}</p>}
    </motion.div>
  </header>
)
