// achica la imagen en el navegador antes de subirla, asi pesa poco y carga rapido

const PESO_MAXIMO_ORIGINAL = 15 * 1024 * 1024

export async function prepararImagen(archivo, { ladoMaximo = 1600, calidad = 0.82 } = {}) {
  if (!archivo.type.startsWith('image/')) throw new Error('El archivo no es una imagen.')
  if (archivo.size > PESO_MAXIMO_ORIGINAL) throw new Error('La imagen pesa demasiado, máximo 15 MB.')

  const direccion = URL.createObjectURL(archivo)
  try {
    const img = await new Promise((listo, fallo) => {
      const i = new Image()
      i.onload = () => listo(i)
      i.onerror = () => fallo(new Error('No se pudo leer la imagen, prueba con una JPG o PNG.'))
      i.src = direccion
    })

    // se mantiene la proporcion y el lado mas largo queda en ladoMaximo
    const escala = Math.min(1, ladoMaximo / Math.max(img.naturalWidth, img.naturalHeight))
    const ancho = Math.round(img.naturalWidth * escala)
    const alto = Math.round(img.naturalHeight * escala)

    const lienzo = document.createElement('canvas')
    lienzo.width = ancho
    lienzo.height = alto
    const ctx = lienzo.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, ancho, alto)
    ctx.drawImage(img, 0, 0, ancho, alto)

    const blob = await new Promise((listo) => lienzo.toBlob(listo, 'image/jpeg', calidad))
    if (!blob) throw new Error('No se pudo procesar la imagen.')
    return blob
  } finally {
    URL.revokeObjectURL(direccion)
  }
}

// convierte la imagen en texto para poder mostrarla o guardarla en el navegador
export function aTexto(blob) {
  return new Promise((listo, fallo) => {
    const lector = new FileReader()
    lector.onload = () => listo(lector.result)
    lector.onerror = () => fallo(new Error('No se pudo leer la imagen.'))
    lector.readAsDataURL(blob)
  })
}
