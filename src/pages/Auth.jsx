import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

const emailRe = /^\S+@\S+\.\S+$/

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
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [err, setErr] = useState({})
  const [show, setShow] = useState(false)
  const [ok, setOk] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (reg && f.name.trim().length < 2) x.name = 'Enter your name'
    if (!emailRe.test(f.email)) x.email = 'Enter a valid email'
    if (f.password.length < 8) x.password = 'At least 8 characters'
    if (reg && f.confirm !== f.password) x.confirm = 'Passwords do not match'
    setErr(x)
    setOk('')
    if (Object.keys(x).length) return
    // TODO (backend): fetch('/api/auth/' + mode, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
    setOk('Form is valid. Backend not connected yet.')
  }

  return (
    <div className="auth">
      <motion.form className="card box" onSubmit={submit} noValidate initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2>{reg ? 'Create account' : 'Welcome back'}</h2>
        <p className="muted">TEXTO VA AQUI</p>
        {reg && <Field icon={User} placeholder="Name" value={f.name} onChange={set('name')} error={err.name} />}
        <Field icon={Mail} type="email" placeholder="Email" value={f.email} onChange={set('email')} error={err.email} />
        <Field
          icon={Lock}
          type={show ? 'text' : 'password'}
          placeholder="Password"
          value={f.password}
          onChange={set('password')}
          error={err.password}
          right={<button type="button" onClick={() => setShow(!show)} aria-label="Show password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
        />
        {reg && <Field icon={Lock} type={show ? 'text' : 'password'} placeholder="Confirm password" value={f.confirm} onChange={set('confirm')} error={err.confirm} />}
        <button className="btn fill full" type="submit">{reg ? 'Sign up' : 'Log in'}</button>
        {ok && <p className="okmsg">{ok}</p>}
        <p className="muted switch">
          {reg ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={reg ? '/login' : '/register'} className="grad">{reg ? 'Log in' : 'Sign up'}</Link>
        </p>
      </motion.form>
    </div>
  )
}
