import { PageHero } from '../components/ui'
import Testimonios from '../components/testimonios/Testimonios'

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Historias y novedades" lead={null} />
      <Testimonios />
    </>
  )
}
