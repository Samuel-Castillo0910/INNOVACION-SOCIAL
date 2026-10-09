import { createClient } from '@supabase/supabase-js'

// las llaves salen de .env.local en el computador y de las variables de entorno en vercel
// la llave se acepta con cualquiera de los nombres que muestra supabase en el boton connect
const entorno = import.meta.env
const url = (entorno.VITE_SUPABASE_URL || entorno.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const llave = (
  entorno.VITE_SUPABASE_KEY ||
  entorno.VITE_SUPABASE_PUBLISHABLE_KEY ||
  entorno.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  entorno.VITE_SUPABASE_ANON_KEY ||
  entorno.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  entorno.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  entorno.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''
).trim()

// que le falta a la pagina para conectarse, sirve para el aviso de modo de prueba
const urlValida = /^https?:\/\/\S+$/.test(url)
export const faltante = !url
  ? 'la variable VITE_SUPABASE_URL'
  : !urlValida
    ? 'una VITE_SUPABASE_URL válida, debe empezar por https://'
    : !llave
      ? 'la variable VITE_SUPABASE_KEY'
      : ''

// si falta algo la pagina funciona en modo de prueba, todo se guarda solo en este navegador
export const modoLocal = Boolean(faltante)
export const db = modoLocal ? null : createClient(url, llave)
