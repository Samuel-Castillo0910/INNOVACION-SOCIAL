import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Flag, Send, Trash2 } from 'lucide-react'
import { iniciales, colorDe } from './util'
import { MAX_COMENTARIO } from '../../lib/foro'
import { useSesion } from '../../lib/sesion'

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
export function BarraAcciones({ apoyos, apoyado, onApoyar, comentarios, abierto, onComentarios, reportado, onReportar, onBorrar }) {
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
    </div>
  )
}

// cajita para comentar o responder, sin cuenta invita a entrar
export function CajaComentario({ onEnviar, onCancelar, placeholder, textoBoton = 'Responder', autoFocus }) {
  const { usuario } = useSesion()
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

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

  const enviar = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    setEnviando(true)
    setError('')
    try {
      await onEnviar(texto)
      setTexto('')
    } catch {
      setError('No se pudo enviar, intenta de nuevo.')
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
      {error && <p className="mensaje error">{error}</p>}
    </form>
  )
}
