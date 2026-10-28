import { LifeBuoy, Phone, ClipboardList, ArrowUpRight } from 'lucide-react'
import { lineas, EMERGENCIA, FORMULARIO } from '../data/ayuda'

// recuadro con las lineas de salud mental, completo o en una sola franja
export function Ayuda({ compacta, id }) {
  if (compacta) {
    return (
      <p className="ayuda-franja">
        <LifeBuoy size={16} />
        <span>
          ¿Necesitas hablar con alguien? La <a href={lineas[0].tel}><b>Línea 106</b></a> atiende gratis las 24 horas.{' '}
          <a href="#ayuda" className="subrayado">Ver más líneas</a>
        </span>
      </p>
    )
  }

  return (
    <aside className="ayuda-box" id={id}>
      <div className="ayuda-titulo">
        <LifeBuoy size={22} />
        <h3>¿Necesitas hablar con alguien?</h3>
      </div>
      <p>No tienes que cargar con esto solo. Estas líneas son gratuitas y atienden las 24 horas:</p>
      <ul className="lineas">
        {lineas.map((l) => (
          <li key={l.nombre}>
            <a href={l.tel} className="linea">
              <Phone size={16} />
              <span>
                <b>{l.nombre}</b>
                <span className="numero">{l.numero}</span>
              </span>
            </a>
            <span className="muted detalle">{l.detalle}</span>
          </li>
        ))}
      </ul>
      <p className="emergencia">
        Si tú o alguien más está en peligro ahora mismo, marca <a href={EMERGENCIA.tel}><b>{EMERGENCIA.numero}</b></a>.
      </p>
      <p className="muted nota-ayuda">LOSS OF OTHERNESS es una red de apoyo entre estudiantes y no reemplaza la atención de un profesional.</p>
    </aside>
  )
}

// invitacion a responder la encuesta de la exposicion
export function Encuesta() {
  return (
    <div className="encuesta">
      <ClipboardList size={22} />
      <div>
        <b>¿Ya leíste algunas historias? Cuéntanos cómo te fue.</b>
        <span className="muted">Es una encuesta anónima de 2 a 5 minutos. Nos ayuda a saber si esta red sirve.</span>
      </div>
      <a href={FORMULARIO} target="_blank" rel="noopener noreferrer" className="btn fill small">
        Responder la encuesta <ArrowUpRight size={15} />
      </a>
    </div>
  )
}
