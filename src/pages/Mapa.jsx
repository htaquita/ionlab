import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const MODULES = [
  { id:'m1', num:1, title:'Identificação de Íons',   desc:'Aprenda a identificar cátions e ânions',           xp:'+200 XP', route:'/modulo1/teoria' },
  { id:'m2', num:2, title:'Ligações Iônicas',         desc:'Domine a transferência de elétrons entre átomos', xp:'+250 XP', route:'/modulo2/teoria' },
  { id:'m3', num:3, title:'Fórmulas e Nomenclatura', desc:'Monte fórmulas e nomeie compostos iônicos',       xp:'+300 XP', route:'/modulo3/teoria' },
  { id:'m4', num:4, title:'Desafio Final',             desc:'Aplique tudo que aprendeu nos quiz finais',      xp:'+400 XP', route:'/modulo4' },
]

const MIN_PCT = 80 // 80% para desbloquear próximo módulo

function AtomIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="12" cy="12" r="8" strokeDasharray="3 2" opacity="0.5"/>
      <circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/>
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}
function MenuItem({ icon, label, onClick, color }) {
  return (
    <button onClick={onClick} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'transparent', border:'none', color:color||'#e2e8f8', fontSize:13, fontWeight:500, cursor:'pointer', borderRadius:8, textAlign:'left' }}
      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
      <span style={{ color:color||'#94a3b8', display:'flex' }}>{icon}</span>
      {label}
    </button>
  )
}

export default function Mapa() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)

  if (loading) return <div style={{ minHeight:'100vh', background:'#0a0f1e' }}/>
  if (!user)   { navigate('/login'); return null }

  const initials = user.name?.[0]?.toUpperCase() || 'A'

  async function handleSignOut() {
    setMenuOpen(false)
    await signOut()
    navigate('/')
  }

  // Módulo desbloqueado se for o 1 ou se o anterior atingiu >= 80%
  function isUnlocked(num) {
    if (num === 1) return true
    const prevId  = `m${num - 1}`
    const prevPct = user.progress?.[prevId] || 0
    return prevPct >= MIN_PCT
  }

  return (
    <div style={{ background:'#0a0f1e', minHeight:'100vh', color:'#e2e8f8', fontFamily:"'Segoe UI',system-ui,sans-serif", position:'relative', overflowX:'hidden' }}>

      {/* Blobs */}
      {[
        { w:420, h:420, bg:'rgba(59,130,246,0.04)',  top:'-100px', left:'-100px'  },
        { w:360, h:360, bg:'rgba(56,189,248,0.03)',  bottom:'0',   right:'-80px'  },
        { w:300, h:300, bg:'rgba(245,158,11,0.03)',  top:'50%',    left:'45%'     },
      ].map((b,i) => (
        <div key={i} style={{ position:'fixed', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none', zIndex:0, width:b.w, height:b.h, background:b.bg, top:b.top||'auto', left:b.left||'auto', bottom:b.bottom||'auto', right:b.right||'auto' }}/>
      ))}

      {/* NAVBAR */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, height:56, background:'rgba(10,15,30,0.92)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.5rem', zIndex:100, backdropFilter:'blur(12px)' }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.28)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity="0.4"/>
              <line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/>
            </svg>
          </div>
          <span style={{ fontSize:16, fontWeight:700, color:'#e2e8f8' }}>Ion<b style={{ color:'#3b82f6' }}>Lab</b></span>
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:14, fontWeight:600, color:'#f87171' }}>
            🔥 {user.streak || 0}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:14, fontWeight:600, color:'#f59e0b' }}>
            ⭐ {user.xp || 0} XP
          </div>
          <div style={{ position:'relative' }}>
            <div onClick={() => setMenuOpen(o=>!o)}
              style={{ width:34, height:34, borderRadius:'50%', background:'rgba(59,130,246,0.12)', border:'2px solid rgba(59,130,246,0.28)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#3b82f6', cursor:'pointer' }}>
              {initials}
            </div>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:198 }}/>
                <div style={{ position:'absolute', top:42, right:0, background:'#111c30', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:8, minWidth:180, zIndex:199, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
                  <div style={{ padding:'8px 12px', fontSize:13, color:'#94a3b8', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:4 }}>
                    <div style={{ fontWeight:700, color:'#e2e8f8', marginBottom:2 }}>{user.name}</div>
                  </div>
                  <MenuItem icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} label="Meu perfil" onClick={()=>{setMenuOpen(false);navigate('/perfil')}}/>
                  <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'4px 0' }}/>
                  <MenuItem icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>} label="Sair" color="#fca5a5" onClick={handleSignOut}/>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* CONTEÚDO */}
      <div style={{ paddingTop:'80px', display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 1.5rem 4rem', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.25)', borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:'#3b82f6', letterSpacing:1, textTransform:'uppercase', marginBottom:'1.2rem' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#3b82f6', display:'inline-block' }}/>
            Jornada
          </div>
          <h1 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, marginBottom:10, letterSpacing:'-0.5px' }}>Sua Jornada de Aprendizado</h1>
          <p style={{ color:'#94a3b8', fontSize:15 }}>Domine as ligações iônicas passo a passo</p>
        </div>

        <div style={{ width:'100%', maxWidth:700, display:'flex', flexDirection:'column' }}>
          {MODULES.map((mod, i) => {
            const pct      = user.progress?.[mod.id] || 0
            const unlocked = isUnlocked(mod.num)
            const prevPct  = mod.num > 1 ? (user.progress?.[`m${mod.num-1}`] || 0) : 100

            return (
              <div key={mod.id} style={{ display:'flex', flexDirection:'column' }}>
                {i > 0 && <div style={{ width:2, height:20, background:'rgba(255,255,255,0.07)', margin:'0 auto' }}/>}

                <div
                  onClick={() => unlocked && navigate(mod.route)}
                  style={{ background:'#111c30', border:`1px solid ${unlocked&&pct>0?'rgba(59,130,246,0.3)':unlocked?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)'}`, borderRadius:18, padding:'1.5rem', display:'flex', alignItems:'center', gap:'1.2rem', cursor:unlocked?'pointer':'default', transition:'border-color 0.2s, transform 0.15s', opacity:unlocked?1:0.45 }}
                  onMouseEnter={e => { if(unlocked){ e.currentTarget.style.borderColor='rgba(59,130,246,0.5)'; e.currentTarget.style.transform='translateY(-2px)' }}}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=unlocked&&pct>0?'rgba(59,130,246,0.3)':unlocked?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)'; e.currentTarget.style.transform='translateY(0)' }}>

                  <div style={{ width:56, height:56, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:unlocked?'rgba(59,130,246,0.1)':'rgba(255,255,255,0.03)', border:`1px solid ${unlocked?'rgba(59,130,246,0.25)':'rgba(255,255,255,0.06)'}` }}>
                    {unlocked ? <AtomIcon/> : <LockIcon/>}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, color:'#64748b', marginBottom:4, textTransform:'uppercase', display:'flex', alignItems:'center', gap:8 }}>
                      Módulo {mod.num}
                      {pct > 0 && <span style={{ color: pct >= MIN_PCT ? '#3b82f6' : '#f59e0b' }}>{pct}%</span>}
                      {!unlocked && mod.num > 1 && (
                        <span style={{ fontSize:10, color:'#475569' }}>
                          — conclua o módulo anterior com ≥{MIN_PCT}%
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{mod.title}</h3>
                    <p style={{ fontSize:13, color:'#94a3b8', marginBottom:12 }}>{mod.desc}</p>
                    <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', background: pct >= MIN_PCT ? '#3b82f6' : '#f59e0b', borderRadius:99, width:`${pct}%`, transition:'width 1s ease' }}/>
                    </div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#f59e0b', marginTop:6 }}>{mod.xp}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legenda */}
        <div style={{ marginTop:'2rem', display:'flex', gap:16, fontSize:12, color:'#475569' }}>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:'#3b82f6' }}/> ≥80% — desbloqueado
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:'#f59e0b' }}/> Em andamento
          </span>
        </div>
      </div>
    </div>
  )
}
