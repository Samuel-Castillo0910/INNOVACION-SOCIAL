import { useEffect, useMemo, useState } from 'react'
import { CornerDownRight, Flag, Trash2 } from 'lucide-react'
import { Avatar, Texto, CajaComentario } from './Partes'
import { haceCuanto } from './util'
import { listarComentarios, crearComentario, borrarComentario } from '../../lib/foro'
import { useSesion } from '../../lib/sesion'

// a partir de este nivel las respuestas ya no se corren mas a la derecha
const NIVEL_MAXIMO = 5

// hilo de comentarios de una publicacion, como en reddit cada comentario puede tener respuestas
// onComentario recibe cuantos comentarios se sumaron o se quitaron
export default function Hilo({ publicacionId, onComentario, reportados, onReportar }) {
  const { usuario } = useSesion()
  const [comentarios, setComentarios] = useState([])
  const [estado, setEstado] = useState('cargando')

  useEffect(() => {
    let activo = true
    listarComentarios(publicacionId)
      .then((filas) => {
        if (!activo) return
        setComentarios(filas)
        setEstado('listo')
      })
      .catch(() => activo && setEstado('error'))
    return () => {
      activo = false
    }
  }, [publicacionId])

  // agrupa los comentarios por su padre, los que no tienen padre van en raiz
  const ramas = useMemo(() => {
    const grupos = {}
    for (const c of comentarios) {
      const llave = c.padre_id || 'raiz'
      if (!grupos[llave]) grupos[llave] = []
      grupos[llave].push(c)
    }
    return grupos
  }, [comentarios])

  const responder = async ({ padreId, texto }) => {
    const nuevo = await crearComentario({ usuario, publicacionId, padreId, texto })
    setComentarios((lista) => [...lista, nuevo])
    onComentario?.(1)
  }

  // borra el comentario y todas sus respuestas
  const borrar = async (id) => {
    if (!window.confirm('¿Borrar este comentario y sus respuestas? No se puede deshacer.')) return
    const fuera = new Set([id])
    const juntar = (padre) => (ramas[padre] || []).forEach((h) => { fuera.add(h.id); juntar(h.id) })
    juntar(id)
    try {
      await borrarComentario(id)
      setComentarios((lista) => lista.filter((c) => !fuera.has(c.id)))
      onComentario?.(-fuera.size)
    } catch (error) {
      window.alert(error.message || 'No se pudo borrar.')
    }
  }

  const comunes = { ramas, responder, borrar, usuario, reportados, onReportar }

  return (
    <div className="hilo">
      <CajaComentario placeholder="Escribe un comentario…" textoBoton="Comentar" onEnviar={(texto) => responder({ padreId: null, texto })} />

      {estado === 'cargando' && <p className="muted chico">Cargando comentarios…</p>}
      {estado === 'error' && <p className="mensaje error">No se pudieron cargar los comentarios.</p>}
      {estado === 'listo' && !ramas.raiz && <p className="muted chico">Nadie ha comentado todavía.</p>}

      {ramas.raiz && (
        <ul className="ramas">
          {ramas.raiz.map((c) => (
            <Comentario key={c.id} c={c} nivel={1} {...comunes} />
          ))}
        </ul>
      )}
    </div>
  )
}

function Comentario({ c, nivel, ramas, responder, borrar, usuario, reportados, onReportar }) {
  const [respondiendo, setRespondiendo] = useState(false)
  const [plegado, setPlegado] = useState(false)
  const hijos = ramas[c.id] || []
  const reportado = reportados.has(c.id)
  const mio = usuario && c.user_id === usuario.id

  return (
    <li className="comentario">
      <div className="autor chico">
        <Avatar alias={c.alias} chico />
        <b>{c.alias}</b>
        <span className="muted">· {haceCuanto(c.created_at)}</span>
      </div>

      <div className="comentario-cuerpo">
        <Texto texto={c.texto} limite={500} />
        <div className="acciones chicas">
          <button type="button" className={'accion' + (respondiendo ? ' activa' : '')} onClick={() => setRespondiendo(!respondiendo)}>
            <CornerDownRight size={14} /> Responder
          </button>
          {hijos.length > 0 && (
            <button type="button" className="accion" onClick={() => setPlegado(!plegado)} aria-expanded={!plegado}>
              {plegado ? `Ver ${hijos.length} ${hijos.length === 1 ? 'respuesta' : 'respuestas'}` : 'Ocultar respuestas'}
            </button>
          )}
          {mio ? (
            <button type="button" className="accion discreta" onClick={() => borrar(c.id)} aria-label="Borrar">
              <Trash2 size={13} /> <span className="etq">Borrar</span>
            </button>
          ) : (
            <button type="button" className="accion discreta" onClick={() => onReportar('comentario', c.id)} disabled={reportado} aria-label={reportado ? 'Reportado' : 'Reportar'}>
              <Flag size={13} /> <span className="etq">{reportado ? 'Reportado' : 'Reportar'}</span>
            </button>
          )}
        </div>

        {respondiendo && (
          <CajaComentario
            autoFocus
            placeholder={`Responder a ${c.alias}…`}
            onCancelar={() => setRespondiendo(false)}
            onEnviar={async (texto) => {
              await responder({ padreId: c.id, texto })
              setRespondiendo(false)
              setPlegado(false)
            }}
          />
        )}
      </div>

      {hijos.length > 0 && !plegado && (
        <ul className={'ramas anidadas' + (nivel >= NIVEL_MAXIMO ? ' planas' : '')}>
          {hijos.map((h) => (
            <Comentario key={h.id} c={h} nivel={nivel + 1} ramas={ramas} responder={responder} borrar={borrar} usuario={usuario} reportados={reportados} onReportar={onReportar} />
          ))}
        </ul>
      )}
    </li>
  )
}
