import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, HeartHandshake, MessageCircle, Flag, Send, Trash2, LifeBuoy, ShieldX } from 'lucide-react'
import { iniciales, colorDe } from './util'
import { MAX_COMENTARIO } from '../../lib/foro'
import { useSesion } from '../../lib/sesion'
import { revisar, esRechazoPorNormas, MENSAJE_INSULTO } from '../../lib/moderacion'
import { lineas, EMERGENCIA } from '../../data/ayuda'

// circulo con las iniciales del seudonimo
export function Avatar({ alias, chico, tono }) {
  return (
    <span className={'avatar' + (chico ? ' chico' : '')} style={{ '--tono': tono ?? colorDe(alias) }} aria-hidden="true">
      {iniciales(alias)}
    </span>
  )
}

// corta el texto donde termina un parrafo o una palabra, nunca en la mitad de una palabra
function recortar(texto, limite) {
  const corte = texto.slice(0, limite)
  const parrafo = corte.lastIndexOf('\n\n')
  if (parrafo > limite * 0.5) return corte.slice(0, parrafo).trimEnd()
  const espacio = corte.search(/\s\S*$/)
  return (espacio > limite * 0.6 ? corte.slice(0, espacio) : corte).trimEnd() + '…'
}

// texto que se corta si es muy largo y se puede abrir con ver mas
export function Texto({ texto, limite = 700 }) {
  const [completo, setCompleto] = useState(false)
  const largo = texto.length > limite
  const visible = largo && !completo ? recortar(texto, limite) : texto
  return (
    <div className="texto">
      <p>{visible}</p>
      {largo && (
        <button type="button" className="ver-mas" onClick={() => setCompleto(!completo)}>
          {completo ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  )
}

// botones de abajo de cada publicacion, me identifico, respuestas, borrar y reportar
export function BarraAcciones({ apoyos, apoyado, onApoyar, comentarios, abierto, onComentarios, reportado, onReportar, onBorrar, onQuitar }) {
  const textoComentarios = comentarios === 0 ? 'Responder' : comentarios === 1 ? '1 respuesta' : `${comentarios} respuestas`
  return (
    <div className="acciones">
      <button type="button" className={'accion apoyo' + (apoyado ? ' activa' : '')} onClick={onApoyar} aria-pressed={apoyado}>
        <Heart size={16} fill={apoyado ? 'currentColor' : 'none'} /> Me identifico
        {apoyos > 0 && <span className="cuenta">{apoyos}</span>}
      </button>
      <button type="button" className={'accion' + (abierto ? ' activa' : '')} onClick={onComentarios} aria-expanded={abierto}>
        <MessageCircle size={16} /> {textoComentarios}
      </button>
      {onBorrar && (
        <button type="button" className="accion discreta" onClick={onBorrar} aria-label="Borrar">
          <Trash2 size={14} /> <span className="etq">Borrar</span>
        </button>
      )}
      {onReportar && (
        <button type="button" className={'accion' + (onBorrar ? '' : ' discreta')} onClick={onReportar} disabled={reportado} aria-label={reportado ? 'Reportado' : 'Reportar'}>
          <Flag size={14} /> <span className="etq">{reportado ? 'Reportado' : 'Reportar'}</span>
        </button>
      )}
      {onQuitar && (
        <button type="button" className="accion quitar" onClick={onQuitar} aria-label="Quitar por no cumplir las normas">
          <ShieldX size={14} /> <span className="etq">Quitar</span>
        </button>
      )}
    </div>
  )
}

// aviso con las lineas de ayuda cuando lo que se va a publicar suena a riesgo, no bloquea
export function Cuidado({ onSeguir, onPublicar, textoBoton = 'Publicar igual' }) {
  return (
    <div className="cuidado" role="alert">
      <LifeBuoy size={18} />
      <div>
        <b>Lo que escribiste suena muy difícil.</b>
        <p>
          No tienes que cargarlo solo. Si quieres hablar con alguien ahora, la <a href={lineas[0].tel}>Línea 106</a> y la Línea Amiga
          Saludable, al <a href={lineas[1].tel}>{lineas[1].numero}</a>, atienden gratis las 24 horas. Si estás en peligro, marca{' '}
          <a href={EMERGENCIA.tel}>{EMERGENCIA.numero}</a>.
        </p>
        <div className="botones">
          <button type="button" className="btn small" onClick={onSeguir}>
            Seguir escribiendo
          </button>
          <button type="button" className="btn fill small" onClick={onPublicar}>
            {textoBoton}
          </button>
        </div>
      </div>
    </div>
  )
}

// cajita para comentar o responder, sin cuenta invita a entrar
export function CajaComentario({ onEnviar, onCancelar, placeholder, textoBoton = 'Responder', autoFocus }) {
  const { usuario } = useSesion()
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [cuidado, setCuidado] = useState(false)

  if (!usuario) {
    return (
      <p className="caja-entrar">
        Para comentar, <Link to="/login" state={{ volver: '/blog#testimonials' }}>entra a tu cuenta</Link> o{' '}
        <Link to="/register" state={{ volver: '/blog#testimonials' }}>crea una</Link> con un seudónimo.
        {onCancelar && (
          <button type="button" className="ver-mas" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </p>
    )
  }

  // forzar es cuando la persona ya vio las lineas de ayuda y decide enviar igual
  const enviar = async (e, forzar = false) => {
    e?.preventDefault()
    if (!texto.trim()) return
    const { bloqueo, riesgo } = revisar(texto)
    if (bloqueo) {
      setError(bloqueo)
      return
    }
    if (riesgo && !forzar) {
      setCuidado(true)
      return
    }
    setCuidado(false)
    setEnviando(true)
    setError('')
    try {
      await onEnviar(texto)
      setTexto('')
    } catch (err) {
      setError(esRechazoPorNormas(err) ? MENSAJE_INSULTO : 'No se pudo enviar, intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="caja" onSubmit={enviar}>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={placeholder}
        maxLength={MAX_COMENTARIO}
        rows={3}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      <p className="reglas">
        <HeartHandshake size={14} />
        <span>
          Para acompañar: escucha sin juzgar, cuenta si te pasó algo parecido, no diagnostiques a nadie y, si alguien está en
          riesgo, recomiéndale la <a href="tel:106">Línea 106</a>.
        </span>
      </p>
      <div className="caja-pie">
        <span className="como">
          <Avatar alias={usuario.seudonimo} chico /> {usuario.seudonimo}
        </span>
        {onCancelar && (
          <button type="button" className="btn small" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn fill small" disabled={enviando || !texto.trim()}>
          {enviando ? 'Enviando…' : textoBoton} <Send size={14} />
        </button>
      </div>
      {cuidado && <Cuidado onSeguir={() => setCuidado(false)} onPublicar={() => enviar(null, true)} textoBoton="Enviar igual" />}
      {error && <p className="mensaje error">{error}</p>}
    </form>
  )
}
