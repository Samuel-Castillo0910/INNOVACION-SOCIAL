import { ScrollText } from 'lucide-react'

// normas del foro, se pueden criticar normas y colegios pero sin insultar
const normas = [
  'Habla de lo que pasó y de cómo te sentiste. Puedes criticar una norma, a un profesor o a un colegio, pero sin insultar.',
  'No insultes ni te burles de nadie. Los mensajes con insultos no se publican.',
  'No escribas nombres reales de personas ni de colegios.',
  'Acompaña sin juzgar: escucha, cuenta si te pasó algo parecido y no diagnostiques a nadie.',
  'Si alguien está en riesgo, recomiéndale la Línea 106.',
]

export function Normas() {
  return (
    <details className="normas-foro" id="normas">
      <summary>
        <ScrollText size={16} /> Normas del foro
      </summary>
      <ol>
        {normas.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ol>
      <p className="muted">
        Lo que se reporte tres veces se oculta solo. Las cuentas con la etiqueta <span className="equipo">Equipo</span> son del grupo
        que hizo esta página y pueden quitar lo que no cumpla estas normas.
      </p>
    </details>
  )
}

// etiqueta junto al seudonimo de las cuentas moderadoras
export const EtiquetaEquipo = () => (
  <span className="equipo" title="Cuenta moderadora del equipo de LOSS OF OTHERNESS">
    Equipo
  </span>
)
