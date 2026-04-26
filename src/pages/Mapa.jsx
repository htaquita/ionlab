import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const MODULES = [
  { id:'m1', num:1, title:'Identificação de Íons',   desc:'Aprenda a identificar cátions e ânions',             xp:'+200 XP', route:'/modulo1/teoria' },
  { id:'m2', num:2, title:'Ligações Iônicas',         desc:'Domine a transferência de elétrons entre átomos',   xp:'+250 XP', route:'/modulo2/teoria' },
  { id:'m3', num:3, title:'Fórmulas e Nomenclatura', desc:'Monte fórmulas e nomeie compostos iônicos',         xp:'+300 XP', route:'/modulo3/teoria' },
  { id:'m4', num:4, title:'Desafio Final',             desc:'Aplique tudo que aprendeu nos quiz finais',        xp:'+400 XP', route:'/modulo4' },
]

function AtomIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b7cf8" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="12" cy="12" r="8" strokeDasharray="3 2" opacity="0.5"/>
      <circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/>
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a68" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

export default function Mapa() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const initials = user.name?.[0]?.toUpperCase() || 'A'

  return (
    <div style={{ background:'#09090f', minHeight:'100vh', color:'#ededfc', fontFamily:"'Segoe UI',system-ui,sans-serif", position:'relative', overflowX:'hidden' }}>

      {/* ── BLOBS ── */}
      {[
        { w:420, h:420, bg:'rgba(139,124,248,0.055)', top:'-100px',  left:'-100px'  },
        { w:360, h:360, bg:'rgba(62,232,196,0.04)',   bottom:'0',    right:'-80px'  },
        { w:300, h:300, bg:'rgba(240,167,66,0.035)',  top:'50%',     left:'45%'     },
      ].map((b,i) => (
        <div key={i} style={{ position:'fixed', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none', zIndex:0, width:b.w, height:b.h, background:b.bg, top:b.top||'auto', left:b.left||'auto', bottom:b.bottom||'auto', right:b.right||'auto' }}/>
      ))}

      {/* ── NAVBAR ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, height:56, background:'rgba(9,9,15,0.92)', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.5rem', zIndex:100, backdropFilter:'blur(12px)' }}>
        {/* Logo — clica e volta pra landing */}
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'rgba(139,124,248,0.12)', border:'1px solid rgba(139,124,248,0.28)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7cf8" strokeWidth="2">
              <circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity="0.4"/>
              <line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/>
            </svg>
          </div>
          <span style={{ fontSize:16, fontWeight:700, color:'#ededfc' }}>Ion<b style={{ color:'#8b7cf8' }}>Lab</b></span>
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          {/* Streak */}
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:14, fontWeight:600, color:'#f06e7a' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 7 6 9 6 14a6 6 0 0 0 12 0c0-5-3-7-6-12z"/></svg>
            {user.streak}
          </div>
          {/* XP */}
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:14, fontWeight:600, color:'#f0a742' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {user.xp} XP
          </div>

          {/* Avatar com menu dropdown */}
          <div style={{ position:'relative' }}>
            <div
              onClick={() => setMenuOpen(o => !o)}
              style={{ width:34, height:34, borderRadius:'50%', background:'rgba(139,124,248,0.12)', border:'2px solid rgba(139,124,248,0.28)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#8b7cf8', cursor:'pointer', transition:'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(139,124,248,0.6)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='rgba(139,124,248,0.28)'}
            >
              {initials}
            </div>

            {menuOpen && (
              <>
                {/* Overlay para fechar */}
                <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:198 }}/>
                {/* Menu */}
                <div style={{ position:'absolute', top:42, right:0, background:'#1d1d28', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:8, minWidth:180, zIndex:199, animation:'popIn 0.15s ease', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
                  <div style={{ padding:'8px 12px', fontSize:13, color:'#8888aa', borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:4 }}>
                    <div style={{ fontWeight:700, color:'#ededfc', marginBottom:2 }}>{user.name}</div>
                    <div style={{ fontSize:11 }}>{user.turma}</div>
                  </div>
                  <MenuItem icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} label="Meu perfil" onClick={() => { setMenuOpen(false); navigate('/perfil') }}/>
                  <MenuItem icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>} label="Reiniciar progresso" onClick={() => { setMenuOpen(false) }}/>
                  <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'4px 0' }}/>
                  <MenuItem icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f06e7a" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>} label="Sair" color="#f06e7a" onClick={() => { setMenuOpen(false); navigate('/') }}/>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── CONTEÚDO ── */}
      <div style={{ paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 1.5rem 4rem', position:'relative', zIndex:1 }}>

        {/* Header com mais espaçamento */}
        <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(139,124,248,0.1)', border:'1px solid rgba(139,124,248,0.25)', borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:'#8b7cf8', letterSpacing:1, textTransform:'uppercase', marginBottom:'1.2rem' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#8b7cf8', display:'inline-block' }}/>
            Jornada
          </div>
          <h1 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, marginBottom:10, letterSpacing:'-0.5px' }}>Sua Jornada de Aprendizado</h1>
          <p style={{ color:'#8888aa', fontSize:15 }}>Domine as ligações iônicas passo a passo</p>
        </div>

        {/* Módulos */}
        <div style={{ width:'100%', maxWidth:700, display:'flex', flexDirection:'column' }}>
          {MODULES.map((mod, i) => {
            const pct = user.progress[mod.id] || 0
            const unlocked = mod.num === 1 || (user.progress[`m${mod.num - 1}`] || 0) >= 100

            return (
              <div key={mod.id} style={{ display:'flex', flexDirection:'column' }}>
                {i > 0 && (
                  <div style={{ width:2, height:20, background:'rgba(255,255,255,0.08)', margin:'0 auto' }}/>
                )}
                <div
                  style={{ background:'#17171f', border:`1px solid ${unlocked && pct > 0 ? 'rgba(139,124,248,0.28)' : 'rgba(255,255,255,0.07)'}`, borderRadius:18, padding:'1.5rem', display:'flex', alignItems:'center', gap:'1.2rem', cursor: unlocked ? 'pointer' : 'default', transition:'border-color 0.2s, transform 0.15s', opacity: unlocked ? 1 : 0.5 }}
                  onClick={() => unlocked && navigate(mod.route)}
                  onMouseEnter={e => { if(unlocked) { e.currentTarget.style.borderColor='rgba(139,124,248,0.45)'; e.currentTarget.style.transform='translateY(-2px)' }}}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = unlocked && pct > 0 ? 'rgba(139,124,248,0.28)' : 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <div style={{ width:56, height:56, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: unlocked ? 'rgba(139,124,248,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${unlocked ? 'rgba(139,124,248,0.28)' : 'rgba(255,255,255,0.07)'}` }}>
                    {unlocked ? <AtomIcon /> : <LockIcon />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, color:'#8888aa', marginBottom:4, textTransform:'uppercase', display:'flex', alignItems:'center', gap:8 }}>
                      Módulo {mod.num}
                      {pct > 0 && <span style={{ color:'#8b7cf8' }}>{pct}%</span>}
                    </div>
                    <h3 style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{mod.title}</h3>
                    <p style={{ fontSize:13, color:'#8888aa', marginBottom:12 }}>{mod.desc}</p>
                    <div style={{ height:6, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', background:'#8b7cf8', borderRadius:99, width:`${pct}%`, transition:'width 1s ease' }}/>
                    </div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#f0a742', marginTop:6 }}>{mod.xp}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MenuItem({ icon, label, onClick, color }) {
  return (
    <button onClick={onClick} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'transparent', border:'none', color: color || '#ededfc', fontSize:13, fontWeight:500, cursor:'pointer', borderRadius:8, textAlign:'left', transition:'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <span style={{ color: color || '#8888aa', display:'flex' }}>{icon}</span>
      {label}
    </button>
  )
}
