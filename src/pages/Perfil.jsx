import React, { useEffect, useRef } from 'react'
import { useUser } from '../context/UserContext'
import Background from '../components/Background'
import Navbar from '../components/Navbar'

const BADGES = [
  { id:'explorador',  name:'Explorador de Íons',         desc:'Complete o Módulo 1', mod:'m1' },
  { id:'transferidor',name:'Mestre das Transferências',   desc:'Complete o Módulo 2', mod:'m2' },
  { id:'quimico',     name:'Químico de Fórmulas',         desc:'Complete o Módulo 3', mod:'m3' },
  { id:'mestre',      name:'Mestre Iônico',               desc:'Complete o Desafio Final', mod:'m4' },
]

export default function Perfil() {
  const { user } = useUser()
  const initials = user.name?.[0]?.toUpperCase() || 'A'
  const m1Pct = user.progress.m1 || 0

  return (
    <>
      <Background />
      <Navbar />
      <div style={wrap}>
        <div style={content}>

          {/* HEADER */}
          <div style={headerCard}>
            <div style={avatar}>{initials}</div>
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{user.name}</h2>
              <div style={{ fontSize:13, color:'var(--text2)', marginBottom:8 }}>{user.email}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={badgePill('var(--blue-dim)','var(--blue-border)','var(--blue)')}>{user.turma}</span>
                <span style={badgePill('rgba(255,140,66,0.15)','rgba(255,140,66,0.3)','var(--streak)')}>🔥 {user.streak} dias seguidos</span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div style={statsGrid}>
            <StatCard label="XP Total" value={user.xp} sub="pontos de experiência" color="var(--gold)" />
            <StatCard label="Sequência" value={`${user.streak}`} sub="dias consecutivos" color="var(--streak)" />
            <StatCard label="Módulos feitos" value="1" sub="de 4 módulos" color="var(--teal)" />
            <StatCard label="Precisão média" value="83%" sub="de acertos" color="var(--blue)" />
          </div>

          {/* PROGRESSO */}
          <div style={section}>
            <h3 style={sectionTitle}>Progresso por módulo</h3>
            {['Módulo 1','Módulo 2','Módulo 3','Módulo 4'].map((m, i) => {
              const key = `m${i+1}`
              const pct = user.progress[key] || 0
              return (
                <div key={m} style={progRow}>
                  <span style={progLabel}>{m}</span>
                  <div style={progBarWrap}>
                    <div style={{ ...progBarFill, width:`${pct}%`, background: pct === 100 ? 'var(--teal)' : pct > 0 ? 'var(--orange)' : 'transparent' }} />
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color: pct > 0 ? 'var(--text2)' : 'var(--text3)', width:36, textAlign:'right' }}>{pct}%</span>
                </div>
              )
            })}
          </div>

          {/* BADGES */}
          <div style={section}>
            <h3 style={sectionTitle}>Conquistas</h3>
            <div style={badgesGrid}>
              {BADGES.map(b => {
                const unlocked = (user.progress[b.mod] || 0) >= 100
                return (
                  <div key={b.id} style={{ ...badgeCard, opacity: unlocked ? 1 : 0.4 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background: unlocked ? 'var(--teal-dim)' : 'rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={unlocked?'#4ecdc4':'#4a6280'} strokeWidth="2">
                        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color: unlocked ? 'var(--text)' : 'var(--text3)' }}>{b.name}</div>
                      <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{b.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={statCard}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{sub}</div>
    </div>
  )
}

const badgePill = (bg, border, color) => ({ padding:'3px 12px', borderRadius:20, fontSize:11, fontWeight:700, background:bg, border:`1px solid ${border}`, color })
const wrap = { paddingTop:56, minHeight:'100vh', position:'relative', zIndex:1 }
const content = { flex:1, padding:'2.5rem 2rem', maxWidth:700, margin:'0 auto' }
const headerCard = { display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'1.5rem', padding:'1.5rem', background:'var(--card)', border:'1px solid var(--border2)', borderRadius:20 }
const avatar = { width:72, height:72, borderRadius:'50%', background:'var(--teal-dim)', border:'3px solid var(--teal-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:700, color:'var(--teal)', flexShrink:0 }
const statsGrid = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:'1.5rem' }
const statCard = { background:'var(--card)', border:'1px solid var(--border2)', borderRadius:14, padding:'1.2rem' }
const section = { background:'var(--card)', border:'1px solid var(--border2)', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem' }
const sectionTitle = { fontSize:15, fontWeight:700, marginBottom:'1rem' }
const progRow = { display:'flex', alignItems:'center', gap:12, marginBottom:12 }
const progLabel = { fontSize:11, fontWeight:700, color:'var(--text3)', width:60, flexShrink:0 }
const progBarWrap = { flex:1, height:8, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden' }
const progBarFill = { height:'100%', borderRadius:99, transition:'width 0.8s ease' }
const badgesGrid = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }
const badgeCard = { background:'var(--card2)', border:'1px solid var(--border2)', borderRadius:12, padding:12, display:'flex', alignItems:'center', gap:12 }
