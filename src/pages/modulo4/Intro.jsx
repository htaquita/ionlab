import React from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'

export default function Intro() {
  const navigate = useNavigate()

  return (
    <>
      <Background />
      <Navbar />
      <div style={wrap}>
        <div style={bossIcon}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>

        <h1 style={{ fontSize:30, fontWeight:800, marginBottom:10 }}>Desafio Final</h1>
        <p style={{ fontSize:15, color:'var(--text2)', maxWidth:480, lineHeight:1.7, marginBottom:'2rem', textAlign:'center' }}>
          Você chegou ao último módulo! Este quiz aplica <strong style={{ color:'var(--text)' }}>todos os conceitos</strong> dos módulos anteriores. São 10 questões divididas em 3 fases com dificuldade crescente.
        </p>

        <div style={recapGrid}>
          {[
            { num:'Fase 1', title:'Identificação de Íons',   color:'var(--orange)' },
            { num:'Fase 2', title:'Ligações Iônicas',        color:'var(--blue)'   },
            { num:'Fase 3 · Boss', title:'Fórmulas Completas', color:'var(--purple)' },
          ].map(f => (
            <div key={f.num} style={{ background:'var(--card)', border:'1px solid var(--border2)', borderRadius:12, padding:'12px 14px', textAlign:'left' }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color: f.color, textTransform:'uppercase', marginBottom:3 }}>{f.num}</div>
              <div style={{ fontSize:13, fontWeight:700 }}>{f.title}</div>
            </div>
          ))}
          <div style={{ background:'var(--card)', border:'1px solid var(--border2)', borderRadius:12, padding:'12px 14px', textAlign:'left' }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:'var(--gold)', textTransform:'uppercase', marginBottom:3 }}>Bônus</div>
            <div style={{ fontSize:13, fontWeight:700 }}>Velocidade = XP extra</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text2)', marginBottom:'1.5rem' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
          </svg>
          20 segundos por questão · Resposta rápida vale bônus de XP
        </div>

        <button style={btnStart} onClick={() => navigate('/modulo4/quiz')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Começar Desafio
        </button>
      </div>
    </>
  )
}

const wrap = { paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'5rem 1.5rem 2rem', position:'relative', zIndex:1 }
const bossIcon = { width:90, height:90, borderRadius:'50%', background:'var(--purple-dim)', border:'2px solid var(--purple-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem', animation:'pulse 2s infinite' }
const recapGrid = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, maxWidth:480, width:'100%', margin:'0 auto 2rem' }
const btnStart = { padding:'15px 40px', background:'var(--purple)', color:'#fff', fontSize:16, fontWeight:700, border:'none', borderRadius:14, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'opacity 0.2s' }
