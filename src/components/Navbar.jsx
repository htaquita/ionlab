import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import PopupAviso from './PopupAviso'

const EXERCISE_ROUTES = ['/modulo1/exercicios', '/modulo2/exercicios', '/modulo3/exercicios', '/modulo4/quiz']

const BREADCRUMBS = {
  '/mapa': '',
  '/perfil': '/ Meu Perfil',
  '/modulo1/teoria': '/ Módulo 1 · Identificação de Íons',
  '/modulo1/exercicios': '/ Módulo 1 · Exercícios',
  '/modulo1/resultado': '/ Módulo 1 · Resultado',
  '/modulo2/teoria': '/ Módulo 2 · Ligações Iônicas',
  '/modulo2/exercicios': '/ Módulo 2 · Exercícios',
  '/modulo2/resultado': '/ Módulo 2 · Resultado',
  '/modulo3/teoria': '/ Módulo 3 · Fórmulas e Nomenclatura',
  '/modulo3/exercicios': '/ Módulo 3 · Exercícios',
  '/modulo3/resultado': '/ Módulo 3 · Resultado',
  '/modulo4': '/ Módulo 4 · Desafio Final',
  '/modulo4/quiz': '/ Módulo 4 · Quiz em andamento',
  '/modulo4/resultado': '/ Módulo 4 · Resultado',
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const [showPopup, setShowPopup] = useState(false)

  const isExercise = EXERCISE_ROUTES.includes(location.pathname)
  const bc = BREADCRUMBS[location.pathname] || ''
  const initials = user.name?.[0]?.toUpperCase() || 'A'

  function handleLogo() {
    if (isExercise) setShowPopup(true)
    else navigate('/mapa')
  }

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.left}>
          <button style={styles.logoBtn} onClick={handleLogo}>
            <div style={styles.logoIcon}>
              <AtomIcon />
            </div>
            <span style={styles.logoText}>Ion<b style={{ color: 'var(--teal)' }}>Lab</b></span>
          </button>
          {bc && <span style={styles.bc} dangerouslySetInnerHTML={{ __html: bc }} />}
        </div>
        <div style={styles.right}>
          <div style={{ ...styles.stat, color: 'var(--streak)' }}>
            <FireIcon /> {user.streak}
          </div>
          <div style={{ ...styles.stat, color: 'var(--gold)' }}>
            <StarIcon /> {user.xp} XP
          </div>
          <div style={styles.avatar} onClick={() => navigate('/perfil')}>
            {initials}
          </div>
        </div>
      </nav>
      {showPopup && (
        <PopupAviso
          onCancel={() => setShowPopup(false)}
          onConfirm={() => { setShowPopup(false); navigate('/mapa') }}
        />
      )}
    </>
  )
}

function AtomIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2">
      <circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="9" opacity="0.4" />
      <line x1="12" y1="3" x2="12" y2="7" /><line x1="12" y1="17" x2="12" y2="21" />
      <line x1="3" y1="12" x2="7" y2="12" /><line x1="17" y1="12" x2="21" y2="12" />
    </svg>
  )
}
function FireIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 7 6 9 6 14a6 6 0 0 0 12 0c0-5-3-7-6-12z" /></svg> }
function StarIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> }

const styles = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: 'rgba(10,22,40,0.97)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', zIndex: 100 },
  left: { display: 'flex', alignItems: 'center', gap: 10 },
  logoBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer' },
  logoIcon: { width: 30, height: 30, borderRadius: 8, background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 16, fontWeight: 700, color: 'var(--text)' },
  bc: { fontSize: 13, color: 'var(--text2)', marginLeft: 4 },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  stat: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 600 },
  avatar: { width: 32, height: 32, borderRadius: '50%', background: 'var(--teal-dim)', border: '2px solid var(--teal-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--teal)', cursor: 'pointer' },
}
