// grafica sencilla de puntos, por ejemplo 6 de 9 se pintan 6 puntos de 9
export function Puntos({ filas, total }) {
  return (
    <div className="puntos">
      {filas.map((f) => (
        <div className="puntos-fila" key={f.texto}>
          <div className="puntos-dato" role="img" aria-label={`${f.valor} de ${total}`}>
            <span className="puntos-cuenta">
              <b>{f.valor}</b> de {total}
            </span>
            <span className="puntos-lista" aria-hidden="true">
              {Array.from({ length: total }, (_, i) => (
                <span key={i} className={'punto' + (i < f.valor ? ' lleno' : '')} />
              ))}
            </span>
          </div>
          <p className="puntos-texto">{f.texto}</p>
        </div>
      ))}
    </div>
  )
}
