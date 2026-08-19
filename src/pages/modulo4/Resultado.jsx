import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'

const PERF_MSGS = [
  { min:0,  max:4,  msg:'Não desanime! Revise os módulos anteriores e tente novamente. Você consegue! 💪' },
  { min:5,  max:7,  msg:'Bom trabalho! Você já domina bastante coisa. Revise os pontos que errou e tente melhorar. 📚' },
  { min:8,  max:9,  msg:'Excelente! Você domina muito bem as ligações iônicas. Quase perfeito! 🌟' },
  { min:10, max:10, msg:'Perfeito! Você é um verdadeiro Mestre Iônico! 🏆' },
]

const BADGES = [
  { name:'Explorador de Íons',         icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg> },
  { name:'Mestre das Transferências',  icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2"><path d="m13 2-2 6H5l5.5 4-2 6L13 14l4.5 4-2-6L21 8h-6z"/></svg> },
  { name:'Químico de Fórmulas',        icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg> },
  { name:'Mestre Iônico',              icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
]

export default function Resultado() {
  const navigate  = useNavigate()
  const { state } = useLocation()

  const score   = state?.score   ?? 0
  const total   = state?.total   ?? 10
  const elapsed = state?.time    ?? 0
  const bonusXP = state?.bonusXP ?? 0
  const totalXP = state?.totalXP ?? 0

  const [starsLit, setStarsLit] = useState(0)

  const mins    = Math.floor(elapsed / 60)
  const secs    = (elapsed % 60).toString().padStart(2, '0')
  const acc     = Math.round((score / total) * 100)
  const stars   = score >= total ? 3 : score >= total * 0.6 ? 2 : score > 0 ? 1 : 0
  const trophy  = acc >= 100 ? '🏆' : acc >= 80 ? '🥇' : acc >= 50 ? '🥈' : '📚'
  const perfMsg = PERF_MSGS.find(p => score >= p.min && score <= p.max)?.msg ?? ''

  useEffect(() => {
    const t = setTimeout(() => setStarsLit(stars), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Background />
      <Navbar />
      <div style={wrap}>

        <div style={{ fontSize:70, marginBottom:'1rem', animation:'pulse 1.5s infinite', display:'inline-block' }}>{trophy}</div>
        <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Desafio Concluído!</h1>
        <p style={{ color:'var(--text2)', marginBottom:'2rem', fontSize:15 }}>Você completou todos os módulos do IonLab</p>

        {/* Estrelas */}
        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:'1.5rem' }}>
          {[1,2,3].map(i => (
            <span key={i} style={{ fontSize:40, opacity: starsLit>=i?1:0.15, transition:`opacity 0.4s ${i*0.15}s, transform 0.4s ${i*0.15}s`, transform: starsLit>=i?'scale(1.1)':'scale(1)', display:'inline-block' }}>⭐</span>
          ))}
        </div>

        {/* XP total */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border2)', borderRadius:18, padding:'1.8rem 3rem', marginBottom:'1.5rem', textAlign:'center' }}>
          <div style={{ fontSize:44, fontWeight:800, color:'var(--gold)' }}>+{totalXP} XP</div>
          <div style={{ fontSize:14, color:'var(--text2)', marginTop:4 }}>Total conquistado</div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:12, marginBottom:'1.5rem', flexWrap:'wrap', justifyContent:'center' }}>
          {[
            { v:`${score}/${total}`, l:'Corretas',        c:'var(--text)'   },
            { v:`${mins}:${secs}`,   l:'Tempo total',     c:'var(--text)'   },
            { v:`${acc}%`,           l:'Precisão',        c:'var(--teal)'   },
            { v:`+${bonusXP}`,       l:'Bônus velocidade',c:'var(--gold)'   },
          ].map((s,i) => (
            <div key={i} style={{ background:'var(--card)', border:'1px solid var(--border2)', borderRadius:12, padding:'1rem 1.8rem', textAlign:'center' }}>
              <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center', marginBottom:'1.5rem', maxWidth:600 }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'var(--card)', border:`1px solid ${i===3?'var(--purple-border)':'var(--teal-border)'}`, borderRadius:20, padding:'8px 16px', fontSize:13, fontWeight:700 }}>
              {b.icon} {b.name}
            </div>
          ))}
        </div>

        {/* Mensagem de desempenho */}
        {perfMsg && (
          <p style={{ fontSize:15, color:'var(--text2)', marginBottom:'2rem', maxWidth:440, lineHeight:1.7, textAlign:'center' }}>
            {perfMsg}
          </p>
        )}

        {/* Botões */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          <button onClick={() => navigate('/modulo4/quiz')} style={btnRev}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Tentar novamente
          </button>
          <button onClick={() => navigate('/mapa')} style={btnMap}>
            Voltar ao Mapa
          </button>
        </div>

      </div>
    </>
  )
}

const wrap   = { paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'5rem 1.5rem 2rem', position:'relative', zIndex:1, textAlign:'center' }
const btnRev = { padding:'13px 24px', background:'transparent', border:'1px solid var(--border2)', color:'var(--text)', fontSize:14, fontWeight:600, borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }
const btnMap = { padding:'13px 28px', background:'var(--teal)', color:'#0a1628', fontSize:14, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }
