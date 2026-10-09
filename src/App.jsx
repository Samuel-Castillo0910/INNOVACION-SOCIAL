import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Privacy from './pages/Privacy'
import Mission from './pages/Mission'
import Auth from './pages/Auth'
import { useSesion, salir } from './lib/sesion'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 120)
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const { usuario } = useSesion()
  return (
    <nav className="nav">
      <div className="wrap">
        <Link to="/" className="logo" onClick={close}>LOSS OF OTHERNESS</Link>
        <div className={'links' + (open ? ' open' : '')}>
          <NavLink to="/" end onClick={close}>Inicio</NavLink>
          <NavLink to="/blog" onClick={close}>Blog</NavLink>
          <NavLink to="/privacy" onClick={close}>Privacidad</NavLink>
          <NavLink to="/our-mission" onClick={close}>Nuestra misión</NavLink>
          {usuario ? (
            <>
              <span className="nav-usuario" title={usuario.seudonimo}>{usuario.seudonimo}</span>
              <button type="button" className="enlace" onClick={() => { close(); salir() }}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Iniciar sesión</NavLink>
              <Link to="/register" className="btn fill small" onClick={close}>Registrarse</Link>
            </>
          )}
        </div>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/our-mission" element={<Mission />} />
          <Route path="/login" element={<Auth key="login" mode="login" />} />
          <Route path="/register" element={<Auth key="register" mode="register" />} />
        </Routes>
      </main>
      <footer className="foot">
        <div className="wrap">
          <span className="logo">LOSS OF OTHERNESS</span>
          <div className="links">
            <Link to="/blog">Blog</Link>
            <Link to="/privacy">Privacidad</Link>
            <Link to="/our-mission">Nuestra misión</Link>
          </div>
          <span className="muted">© 2026 LOSS OF OTHERNESS</span>
        </div>
      </footer>
    </>
  )
}
