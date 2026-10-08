import { T, Reveal, PageHero } from '../components/ui'

const items = ['Data we collect', 'How we use it', 'Cookies', 'Your rights', 'Contact us']

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy Policy" />
      <section>
        <div className="wrap narrow">
          {items.map((t, i) => (
            <Reveal key={t} delay={0.05}>
              <div className="card item">
                <span className="num grad">0{i + 1}</span>
                <div><h3>{t}</h3><p className="muted">{T}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
