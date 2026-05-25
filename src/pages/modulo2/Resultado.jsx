import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'

const MIN_APROVACAO = 0.8 // 80%

export default function Resultado() {
  const navigate  = useNavigate()
  const { state } = useLocation()
  const score     = state?.score ?? 0
  const total     = state?.total ?? 5
  const elapsed   = state?.time  ?? 0
  const [starsLit, setStarsLit] = useState(0)

  const mins    = Math.floor(elapsed / 60)
  const secs    = (elapsed % 60).toString().padStart(2, '0')
  const acc     = Math.round((score / total) * 100)
  const xp      = score * 80
  const aprovado = score / total >= MIN_APROVACAO
  const stars   = score >= total ? 3 : score / total >= MIN_APROVACAO ? 2 : score > 0 ? 1 : 0

  useEffect(() => {
    const t = setTimeout(() => setStarsLit(stars), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Background />
      <Navbar />
      <div style={wrap}>

        {/* Ícone de aprovado/reprovado */}
        <div style={{ width:72, height:72, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.2rem', background: aprovado ? 'rgba(134,239,172,0.12)' : 'rgba(252,165,165,0.1)', border:`2px solid ${aprovado ? 'rgba(134,239,172,0.3)' : 'rgba(252,165,165,0.3)'}` }}>
          {aprovado
            ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          }
        </div>

        <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>
          {aprovado ? 'Módulo Completo!' : 'Quase lá!'}
        </h1>
        <p style={{ color:'#94a3b8', marginBottom:'1.5rem', fontSize:14 }}>
          {aprovado
            ? 'Você dominou as Ligações Iônicas'
            : `Você precisa de ${Math.ceil(total * MIN_APROVACAO)} acertos (80%) para avançar. Tente novamente!`
          }
        </p>

        {/* Estrelas */}
        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:'1.5rem' }}>
          {[1,2,3].map(i => (
            <span key={i} style={{ fontSize:36, opacity:starsLit>=i?1:0.15, transition:`opacity 0.4s ${i*0.15}s, transform 0.4s ${i*0.15}s`, transform:starsLit>=i?'scale(1.1)':'scale(1)', display:'inline-block' }}>⭐</span>
          ))}
        </div>

        {/* XP (só se aprovado) */}
        {aprovado && (
          <div style={xpCard}>
            <div style={{ fontSize:36, fontWeight:800, color:'#f59e0b' }}>+{xp} XP</div>
            <div style={{ fontSize:13, color:'#94a3b8', marginTop:4 }}>Experiência conquistada</div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:'flex', gap:12, marginBottom:'1.5rem', flexWrap:'wrap', justifyContent:'center' }}>
          {[
            { v:`${score}/${total}`, l:'Corretas', c: aprovado ? '#86efac' : '#fca5a5' },
            { v:`${mins}:${secs}`,   l:'Tempo',    c:'#e2e8f8' },
            { v:`${acc}%`,           l:'Precisão', c: aprovado ? '#3b82f6' : '#fca5a5' },
          ].map((s,i) => (
            <div key={i} style={statCard}>
              <div style={{ fontSize:22, fontWeight:700, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Nota de aprovação */}
        {!aprovado && (
          <div style={{ background:'rgba(252,165,165,0.08)', border:'1px solid rgba(252,165,165,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:'1.5rem', fontSize:13, color:'#fca5a5', maxWidth:380, textAlign:'center' }}>
            Mínimo para avançar: <strong>80%</strong> ({Math.ceil(total * MIN_APROVACAO)} de {total} questões)
          </div>
        )}

        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => navigate('/modulo2/exercicios')} style={btnRev}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            {aprovado ? 'Refazer' : 'Tentar novamente'}
          </button>
          {aprovado && (
            <button onClick={() => navigate('/mapa')} style={btnNext}>
              Próximo Módulo →
            </button>
          )}
        </div>

      </div>
    </>
  )
}

const wrap     = { paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'5rem 1.5rem 2rem', position:'relative', zIndex:1, textAlign:'center' }
const xpCard   = { background:'#111c30', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'1.2rem 3rem', marginBottom:'1.5rem', textAlign:'center' }
const statCard = { background:'#111c30', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1rem 1.5rem', textAlign:'center' }
const btnRev   = { padding:'12px 22px', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f8', fontSize:14, fontWeight:600, borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }
const btnNext  = { padding:'12px 26px', background:'#3b82f6', color:'#fff', fontSize:14, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }
