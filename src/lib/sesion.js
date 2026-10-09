import { useSyncExternalStore } from 'react'
import { db, modoLocal } from './supabase'

// guarda quien entro a su cuenta y avisa a la pagina cuando cambia
let estado = { listo: false, usuario: null }
const oyentes = new Set()

function cambiar(nuevo) {
  estado = nuevo
  oyentes.forEach((avisar) => avisar())
}

const aUsuario = (u) => (u ? { id: u.id, seudonimo: u.user_metadata?.seudonimo || 'Anónimo' } : null)

// no pedimos correo, supabase necesita uno asi que se arma uno interno con el seudonimo
// el dominio .invalid no existe en internet, a esa direccion nunca llega nada
const DOMINIO = 'usuarios.lossofotherness.invalid'

export function baseDe(seudonimo) {
  return (seudonimo || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
}

const correoDe = (seudonimo) => `${baseDe(seudonimo)}@${DOMINIO}`

// en modo de prueba las cuentas viven solo en este navegador y no se revisa la contrasena
const LLAVE_LOCAL = 'loo-sesion-prueba'
const LLAVE_CUENTAS = 'loo-cuentas-prueba'

function cuentasLocales() {
  try {
    return JSON.parse(localStorage.getItem(LLAVE_CUENTAS)) || {}
  } catch {
    return {}
  }
}

function leerLocal() {
  try {
    return JSON.parse(localStorage.getItem(LLAVE_LOCAL))
  } catch {
    return null
  }
}

function guardarLocal(usuario) {
  try {
    if (usuario) localStorage.setItem(LLAVE_LOCAL, JSON.stringify(usuario))
    else localStorage.removeItem(LLAVE_LOCAL)
  } catch {
    // sin almacenamiento la sesion dura hasta recargar
  }
}

if (modoLocal) {
  cambiar({ listo: true, usuario: leerLocal() })
} else {
  db.auth.getSession().then(({ data }) => cambiar({ listo: true, usuario: aUsuario(data.session?.user) }))
  db.auth.onAuthStateChange((_evento, sesion) => cambiar({ listo: true, usuario: aUsuario(sesion?.user) }))
}

export function useSesion() {
  return useSyncExternalStore(
    (avisar) => {
      oyentes.add(avisar)
      return () => oyentes.delete(avisar)
    },
    () => estado,
  )
}

// pasa los errores de supabase a mensajes que se entiendan
function traducir(error) {
  const codigo = error?.code || ''
  const texto = (error?.message || '').toLowerCase()
  if (codigo === 'invalid_credentials' || texto.includes('invalid login')) return new Error('Seudónimo o contraseña incorrectos.')
  if (codigo === 'user_already_exists' || texto.includes('already registered')) return new Error('Ese seudónimo ya está en uso. Prueba otro o usa el dado.')
  if (codigo === 'email_not_confirmed' || texto.includes('not confirmed')) return new Error('La cuenta no se pudo activar. Avísale al equipo que revise la configuración de Supabase.')
  if (codigo === 'weak_password' || texto.includes('password should')) return new Error('La contraseña es muy débil, usa al menos 8 caracteres.')
  if (codigo.includes('rate_limit') || texto.includes('rate limit')) return new Error('Hubo demasiados intentos seguidos. Espera un rato e intenta de nuevo.')
  if (codigo === 'email_address_invalid' || texto.includes('invalid')) return new Error('Ese seudónimo no se puede usar. Prueba con letras y números.')
  return new Error('No se pudo completar. Revisa tu conexión e intenta de nuevo.')
}

// crea la cuenta solo con seudonimo y contrasena
export async function crearCuenta({ seudonimo, password }) {
  if (modoLocal) {
    const cuentas = cuentasLocales()
    const llave = baseDe(seudonimo)
    if (cuentas[llave]) throw new Error('Ese seudónimo ya está en uso. Prueba otro o usa el dado.')
    try {
      localStorage.setItem(LLAVE_CUENTAS, JSON.stringify({ ...cuentas, [llave]: seudonimo }))
    } catch {
      // no pasa nada
    }
    const usuario = { id: 'prueba-' + llave, seudonimo }
    guardarLocal(usuario)
    cambiar({ listo: true, usuario })
    return
  }

  const { data, error } = await db.auth.signUp({ email: correoDe(seudonimo), password, options: { data: { seudonimo } } })
  if (error) throw traducir(error)
  if (data.user?.identities?.length === 0) throw new Error('Ese seudónimo ya está en uso. Prueba otro o usa el dado.')
  if (!data.session) throw new Error('La cuenta se creó pero no se pudo entrar. En Supabase hay que apagar Confirm email.')
}

export async function entrar({ seudonimo, password }) {
  if (modoLocal) {
    const llave = baseDe(seudonimo)
    const guardado = cuentasLocales()[llave]
    if (!guardado) throw new Error('Seudónimo o contraseña incorrectos.')
    const usuario = { id: 'prueba-' + llave, seudonimo: guardado }
    guardarLocal(usuario)
    cambiar({ listo: true, usuario })
    return
  }
  const { error } = await db.auth.signInWithPassword({ email: correoDe(seudonimo), password })
  if (error) throw traducir(error)
}

export async function salir() {
  if (modoLocal) {
    guardarLocal(null)
    cambiar({ listo: true, usuario: null })
    return
  }
  await db.auth.signOut()
}
