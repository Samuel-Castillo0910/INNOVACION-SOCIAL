import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

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

export default function Auth({ mode }) {
  const reg = mode === 'register'
  const [f, setF] = useState({ alias: '', password: '', confirm: '' })
  const [err, setErr] = useState({})
  const [show, setShow] = useState(false)
  const [ok, setOk] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const x = {}
    const a = f.alias.trim()
    if (a.length < 3 || a.length > 30) x.alias = 'Entre 3 y 30 caracteres'
    else if (a.includes('@')) x.alias = 'No uses un correo como seudónimo'
    if (f.password.length < 8) x.password = 'Mínimo 8 caracteres'
    if (reg && f.confirm !== f.password) x.confirm = 'Las contraseñas no coinciden'
    setErr(x)
    setOk('')
    if (Object.keys(x).length) return
    // TODO (backend): fetch('/api/auth/' + mode, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
    setOk('Formulario válido. El backend aún no está conectado.')
  }

  return (
    <div className="auth">
      <motion.form className="card box" onSubmit={submit} noValidate initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2>{reg ? 'Crear cuenta' : 'Bienvenido de nuevo'}</h2>
        <p className="muted">{reg ? 'Elige un seudónimo. No uses tu nombre real ni tu correo.' : 'Entra con tu seudónimo y tu contraseña.'}</p>
        <Field icon={User} placeholder="Seudónimo" autoComplete="username" value={f.alias} onChange={set('alias')} error={err.alias} />
        <Field
          icon={Lock}
          type={show ? 'text' : 'password'}
          placeholder="Contraseña"
          value={f.password}
          onChange={set('password')}
          error={err.password}
          right={<button type="button" onClick={() => setShow(!show)} aria-label="Mostrar contraseña">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
        />
        {reg && <Field icon={Lock} type={show ? 'text' : 'password'} placeholder="Confirmar contraseña" value={f.confirm} onChange={set('confirm')} error={err.confirm} />}
        <button className="btn fill full" type="submit">{reg ? 'Registrarse' : 'Iniciar sesión'}</button>
        {ok && <p className="okmsg">{ok}</p>}
        <p className="muted switch">
          {reg ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
          <Link to={reg ? '/login' : '/register'} className="grad">{reg ? 'Iniciar sesión' : 'Registrarse'}</Link>
        </p>
      </motion.form>
    </div>
  )
}
