import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User, Dices } from 'lucide-react'
import { useSesion, crearCuenta, entrar, salir, baseDe } from '../lib/sesion'
import { seudonimoAlAzar } from '../lib/seudonimo'
import { modoLocal } from '../lib/supabase'

const Field = ({ icon: I, error, right, ...p }) => (
  <label className="field">
    <div className={'inp' + (error ? ' bad' : '')}>
      <I size={18} />
      <input {...p} />
      {right}
    </div>
    {error && <small>{error}</small>}
  </label>
)

// pagina para entrar o crear cuenta, solo con seudonimo y contrasena, sin correo
export default function Auth({ mode }) {
  const reg = mode === 'register'
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario } = useSesion()
  const volver = location.state?.volver || '/blog#testimonials'

  const [f, setF] = useState(() => ({ alias: reg ? seudonimoAlAzar() : '', password: '', confirm: '' }))
  const [err, setErr] = useState({})
  const [show, setShow] = useState(false)
  const [fallo, setFallo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const x = {}
    const a = f.alias.trim()
    if (a.length < 3 || a.length > 30) x.alias = 'Entre 3 y 30 caracteres'
    else if (a.includes('@')) x.alias = 'No uses un correo como seudónimo'
    else if (baseDe(a).replace(/\./g, '').length < 3) x.alias = 'Usa al menos 3 letras o números'
    if (f.password.length < 8) x.password = 'Mínimo 8 caracteres'
    if (reg && f.confirm !== f.password) x.confirm = 'Las contraseñas no coinciden'
    setErr(x)
    setFallo('')
    if (Object.keys(x).length) return

    setEnviando(true)
    try {
      if (reg) await crearCuenta({ seudonimo: a, password: f.password })
      else await entrar({ seudonimo: a, password: f.password })
      navigate(volver)
    } catch (error) {
      setFallo(error.message)
    } finally {
      setEnviando(false)
    }
  }

  // si ya entro no tiene sentido mostrar el formulario
  if (usuario) {
    return (
      <div className="auth">
        <div className="card box">
          <h2>Hola, {usuario.seudonimo}</h2>
          <p className="muted">Ya iniciaste sesión.</p>
          <Link to="/blog#testimonials" className="btn fill full">Ir a los testimonios</Link>
          <button type="button" className="btn full" onClick={salir}>Cerrar sesión</button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth">
      <motion.form className="card box" onSubmit={submit} noValidate initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2>{reg ? 'Crear cuenta' : 'Bienvenido de nuevo'}</h2>
        <p className="muted">{reg ? 'Elige un seudónimo. No uses tu nombre real ni tu correo.' : 'Entra con tu seudónimo y tu contraseña.'}</p>
        {modoLocal && <p className="aviso-cuenta">Modo de prueba: la cuenta solo existe en este navegador.</p>}

        <Field
          icon={User}
          placeholder="Seudónimo"
          autoComplete="username"
          value={f.alias}
          onChange={set('alias')}
          maxLength={30}
          error={err.alias}
          aria-label="Seudónimo"
          right={
            reg && (
              <button type="button" onClick={() => setF({ ...f, alias: seudonimoAlAzar() })} aria-label="Generar otro seudónimo" title="Generar otro seudónimo">
                <Dices size={18} />
              </button>
            )
          }
        />
        {reg && <small className="pista">Es el nombre que verán los demás. Usa uno inventado, nunca tu nombre real. Con el dado sale otro al azar.</small>}
        <Field
          icon={Lock}
          type={show ? 'text' : 'password'}
          placeholder="Contraseña"
          autoComplete={reg ? 'new-password' : 'current-password'}
          value={f.password}
          onChange={set('password')}
          error={err.password}
          aria-label="Contraseña"
          right={<button type="button" onClick={() => setShow(!show)} aria-label="Mostrar contraseña">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
        />
        {reg && <Field icon={Lock} type={show ? 'text' : 'password'} placeholder="Confirmar contraseña" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={err.confirm} aria-label="Confirmar contraseña" />}
        {reg && <small className="pista">Guarda bien tu contraseña: como no pedimos correo, si la olvidas no se puede recuperar.</small>}

        <button className="btn fill full" type="submit" disabled={enviando}>
          {enviando ? 'Un momento…' : reg ? 'Registrarse' : 'Iniciar sesión'}
        </button>
        {fallo && <p className="errmsg">{fallo}</p>}
        <p className="muted switch">
          {reg ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
          <Link to={reg ? '/login' : '/register'} state={location.state} className="grad">{reg ? 'Iniciar sesión' : 'Registrarse'}</Link>
        </p>
      </motion.form>
    </div>
  )
}
