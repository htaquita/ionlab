import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'

export default function Resultado() {
  const navigate   = useNavigate()
  const { state }  = useLocation()
  const score      = state?.score  ?? 3
  const total      = state?.total  ?? 3
  const elapsed    = state?.time   ?? 0
  const [starsLit, setStarsLit] = useState(0)

  const mins  = Math.floor(elapsed / 60)
  const secs  = (elapsed % 60).toString().padStart(2, '0')
  const acc   = Math.round((score / total) * 100)
  const xp    = score * 100
  const stars = score >= total ? 3 : score >= total * 0.6 ? 2 : score > 0 ? 1 : 0

  useEffect(() => {
    const t = setTimeout(() => setStarsLit(stars), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Background />
      <Navbar />
      <div style={wrap}>
        <h1 style={{ fontSize:30, fontWeight:800, marginBottom:6 }}>Módulo Completo!</h1>
        <p style={{ color:'var(--text2)', marginBottom:'1.5rem' }}>Você dominou Fórmulas e Nomenclatura</p>

        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:'1.5rem' }}>
          {[1,2,3].map(i => (
            <span key={i} style={{ fontSize:38, opacity: starsLit>=i?1:0.15, transition:`opacity 0.4s ${i*0.15}s, transform 0.4s ${i*0.15}s`, transform: starsLit>=i?'scale(1.15)':'scale(1)', display:'inline-block' }}>⭐</span>
          ))}
        </div>

        <div style={xpCard}>
          <div style={{ fontSize:38, fontWeight:800, color:'var(--gold)' }}>+{xp} XP</div>
          <div style={{ fontSize:14, color:'var(--text2)', marginTop:4 }}>Experiência conquistada</div>
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:'1.5rem', flexWrap:'wrap', justifyContent:'center' }}>
          {[{v:`${score}/${total}`,l:'Corretas'},{v:`${mins}:${secs}`,l:'Tempo'},{v:`${acc}%`,l:'Precisão'}].map((s,i) => (
            <div key={i} style={statCard}>
              <div style={{ fontSize:22, fontWeight:700 }}>{s.v}</div>
              <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={badgeCard}>
          <div style={badgeIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--teal)', letterSpacing:1, textTransform:'uppercase' }}>Badge desbloqueado</div>
            <div style={{ fontSize:16, fontWeight:700, marginTop:2 }}>Químico de Fórmulas</div>
          </div>
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => navigate('/modulo3/exercicios')} style={btnRev}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Revisar erros
          </button>
          <button onClick={() => navigate('/mapa')} style={btnNext}>
            Próximo Módulo →
          </button>
        </div>
      </div>
    </>
  )
}

const wrap     = { paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'5rem 1.5rem 2rem', position:'relative', zIndex:1, textAlign:'center' }
const xpCard   = { background:'var(--card)', border:'1px solid var(--border2)', borderRadius:16, padding:'1.5rem 3rem', marginBottom:'1.5rem', textAlign:'center' }
const statCard = { background:'var(--card)', border:'1px solid var(--border2)', borderRadius:12, padding:'1rem 1.5rem', textAlign:'center' }
const badgeCard= { background:'var(--card)', border:'1px solid var(--teal-border)', borderRadius:14, padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:14, marginBottom:'2rem', maxWidth:360 }
const badgeIcon= { width:44, height:44, borderRadius:12, background:'var(--teal-dim)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }
const btnRev   = { padding:'13px 24px', background:'transparent', border:'1px solid var(--border2)', color:'var(--text)', fontSize:14, fontWeight:600, borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }
const btnNext  = { padding:'13px 28px', background:'var(--teal)', color:'#0a1628', fontSize:14, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }
