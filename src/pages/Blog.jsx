import { PageHero } from '../components/ui'
import Testimonios from '../components/testimonios/Testimonios'

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Red de apoyo" title="Historias que acompañan" lead="Lee, cuenta lo que viviste y responde a otros. Nadie sabe quién eres." />
      <Testimonios />
    </>
  )
}
