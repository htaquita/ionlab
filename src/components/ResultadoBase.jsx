import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from './Background'
import Navbar from './Navbar'

export default function ResultadoBase({ title, sub, score, total, time, badge, badgeName, nextLabel, nextRoute }) {
  const navigate = useNavigate()
  const [starsLit, setStarsLit] = useState(0)
  const xp = score * 60
  const acc = Math.round((score / total) * 100)

  useEffect(() => {
    const t = setTimeout(() => setStarsLit(score >= total ? 3 : score >= total * 0.6 ? 2 : score > 0 ? 1 : 0), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Background />
      <Navbar />
      <div style={{ paddingTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '5rem 1.5rem 2rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>{title}</h1>
        <p style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>{sub}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <span key={i} style={{ fontSize: 38, opacity: starsLit >= i ? 1 : 0.15, transition: `opacity 0.4s ${i * 0.15}s, transform 0.4s ${i * 0.15}s`, transform: starsLit >= i ? 'scale(1.1)' : 'scale(1)' }}>⭐</span>
          ))}
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 16, padding: '1.5rem 3rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: 'var(--gold)' }}>+{xp} XP</div>
          <div style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>Experiência conquistada</div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{ v: `${score}/${total}`, l: 'Corretas' }, { v: time, l: 'Tempo' }, { v: `${acc}%`, l: 'Precisão' }].map((s, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 12, padding: '1rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--teal-border)', borderRadius: 14, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem', maxWidth: 360 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--teal-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {badge}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', letterSpacing: 1, textTransform: 'uppercase' }}>Badge desbloqueado</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{badgeName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ padding: '13px 24px', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 14, fontWeight: 600, borderRadius: 12 }}>
            Revisar erros
          </button>
          <button onClick={() => navigate(nextRoute)} style={{ padding: '13px 28px', background: 'var(--teal)', color: '#0a1628', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 12 }}>
            {nextLabel}
          </button>
        </div>
      </div>
    </>
  )
}
