import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Counter({ to, suffix = '', duration = 1500 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setVal(Math.round(ease * to))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to, duration])
  return <span ref={ref}>{val}{suffix}</span>
}

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
      color:'#8b7cf8', bg:'rgba(139,124,248,0.12)', border:'rgba(139,124,248,0.28)',
      title:'4 módulos progressivos',
      desc:'Do básico ao avançado, com dificuldade crescente e desbloqueio sequencial.',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
      color:'#f0a742', bg:'rgba(240,167,66,0.12)', border:'rgba(240,167,66,0.28)',
      title:'XP e aprendizado interativo',
      desc:'Pontos, badges por módulo, streak de dias consecutivos e quiz final com timer.',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      color:'#f06e7a', bg:'rgba(240,110,122,0.1)', border:'rgba(240,110,122,0.28)',
      title:'Feedback imediato',
      desc:'Cada resposta traz explicação detalhada — acertos e erros têm retorno educativo instantâneo.',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
      color:'#3ee8c4', bg:'rgba(62,232,196,0.1)', border:'rgba(62,232,196,0.25)',
      title:'Perfil e progresso',
      desc:'Acompanhe XP, precisão média, tempo e histórico de conquistas no seu perfil.',
    },
  ]

  const steps = [
    { num:'01', title:'Crie sua conta', desc:'Cadastre-se em menos de 1 minuto com nome, e-mail e turma.', color:'#8b7cf8' },
    { num:'02', title:'Estude a teoria', desc:'Teoria visual com tabela periódica interativa e diagramas de distribuição eletrônica.', color:'#f0a742' },
    { num:'03', title:'Pratique e ganhe XP', desc:'Exercícios de arrastar, múltipla escolha e montagem de fórmulas iônicas.', color:'#3ee8c4' },
    { num:'04', title:'Complete o Desafio Final', desc:'Quiz com 10 questões, 3 fases e bônus de velocidade. Conquiste o badge de Mestre Iônico.', color:'#f06e7a' },
  ]

  const modules = [
    { num:'01', title:'Identificação de Íons',   desc:'Metais, ametais e tabela periódica', c:'v' },
    { num:'02', title:'Ligações Iônicas',         desc:'Transferência de elétrons',          c:'m' },
    { num:'03', title:'Fórmulas e Nomenclatura', desc:'Balanceamento e regras IUPAC',        c:'a' },
    { num:'04', title:'Desafio Final',            desc:'Quiz com timer e 3 fases',            c:'r' },
  ]

  const modColors = {
    v:{ bg:'rgba(139,124,248,0.12)', border:'rgba(139,124,248,0.28)', color:'#8b7cf8' },
    m:{ bg:'rgba(62,232,196,0.1)',   border:'rgba(62,232,196,0.25)',  color:'#3ee8c4' },
    a:{ bg:'rgba(240,167,66,0.12)', border:'rgba(240,167,66,0.28)',  color:'#f0a742' },
    r:{ bg:'rgba(240,110,122,0.1)', border:'rgba(240,110,122,0.28)',color:'#f06e7a' },
  }

  const s = {
    page: { background:'#09090f', color:'#ededfc', fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'100vh', overflowX:'hidden' },
    nav: { position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 40px', background:'rgba(9,9,15,0.92)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(12px)' },
    logoMark: { width:32, height:32, borderRadius:10, background:'rgba(139,124,248,0.12)', border:'1px solid rgba(139,124,248,0.28)', display:'flex', alignItems:'center', justifyContent:'center' },
    logoText: { fontSize:17, fontWeight:700, letterSpacing:'-0.3px' },
    navRight: { display:'flex', gap:10, alignItems:'center' },
    btnGhost: { padding:'7px 18px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#8888aa', fontSize:13, fontWeight:600, borderRadius:9, cursor:'pointer' },
    btnPrimary: { padding:'7px 18px', background:'#8b7cf8', color:'#fff', fontSize:13, fontWeight:700, border:'none', borderRadius:9, cursor:'pointer' },
    hero: { textAlign:'center', padding:'80px 40px 64px', position:'relative' },
    h1: { fontSize:'clamp(30px,4.5vw,52px)', fontWeight:800, lineHeight:1.12, letterSpacing:'-1.5px', marginBottom:16, maxWidth:580, marginLeft:'auto', marginRight:'auto' },
    heroP: { fontSize:15, color:'#8888aa', maxWidth:420, margin:'0 auto 32px', lineHeight:1.7 },
    heroBtns: { display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' },
    btnCta: { padding:'14px 32px', background:'#8b7cf8', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 0 28px rgba(139,124,248,0.25)' },
    btnOutline: { padding:'14px 28px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#ededfc', fontSize:15, fontWeight:600, borderRadius:12, cursor:'pointer' },
    heroStats: { display:'flex', gap:48, justifyContent:'center', marginTop:52, flexWrap:'wrap' },
    divider: { height:'1px', background:'rgba(255,255,255,0.07)', margin:'0 40px' },
    section: { padding:'64px 40px' },
    sectionLabel: { fontSize:11, fontWeight:700, color:'#8b7cf8', letterSpacing:2, textTransform:'uppercase', textAlign:'center', marginBottom:10 },
    sectionTitle: { fontSize:'clamp(22px,2.8vw,32px)', fontWeight:800, letterSpacing:'-0.5px', textAlign:'center', marginBottom:8 },
    sectionSub: { fontSize:14, color:'#8888aa', textAlign:'center', marginBottom:36, lineHeight:1.6 },
    card: { background:'#17171f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16 },
    ctaBox: { background:'#17171f', border:'1px solid rgba(139,124,248,0.28)', borderRadius:24, padding:'52px 40px', textAlign:'center', maxWidth:520, margin:'0 auto', position:'relative', overflow:'hidden' },
    footer: { borderTop:'1px solid rgba(255,255,255,0.07)', padding:'20px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 },
  }

  return (
    <div style={s.page}>

      {/* Blobs */}
      {[
        { w:420, h:420, bg:'rgba(139,124,248,0.055)', top:'-120px', left:'-120px' },
        { w:360, h:360, bg:'rgba(62,232,196,0.04)',   bottom:0,    right:'-80px' },
        { w:300, h:300, bg:'rgba(240,167,66,0.035)',  top:'45%',   left:'48%'   },
      ].map((b,i)=>(
        <div key={i} style={{ position:'fixed', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none', zIndex:0, width:b.w, height:b.h, background:b.bg, top:b.top||'auto', left:b.left||'auto', bottom:b.bottom||'auto', right:b.right||'auto' }}/>
      ))}

      {/* NAVBAR */}
      <nav style={s.nav}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={s.logoMark}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b7cf8" strokeWidth="2">
              <circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity="0.4"/>
              <line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/>
            </svg>
          </div>
          <span style={s.logoText}>Ion<b style={{ color:'#8b7cf8' }}>Lab</b></span>
        </div>
        <div style={s.navRight}>
          <button style={s.btnGhost} onClick={() => navigate('/login')}>Entrar</button>
          <button style={s.btnPrimary} onClick={() => navigate('/cadastro')}>Criar conta</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ ...s.hero, position:'relative', zIndex:1 }}>
        <h1 style={s.h1}>
          Aprenda{' '}
          <span style={{ background:'linear-gradient(135deg,#8b7cf8 0%,#3ee8c4 65%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Ligações Iônicas
          </span>{' '}de forma interativa
        </h1>
        <p style={s.heroP}>
          Teoria visual, exercícios interativos e aprendizado interativo para dominar ligações iônicas.
        </p>
        <div style={s.heroBtns}>
          <button style={s.btnCta} onClick={() => navigate('/cadastro')}>
            Começar agora
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button style={s.btnOutline} onClick={() => navigate('/login')}>Já tenho conta</button>
        </div>
        <div style={s.heroStats}>
          {[
            { to:4,   suffix:' módulos', label:'de conteúdo',    color:'#8b7cf8' },
            { to:10,  suffix:' questões', label:'no quiz final', color:'#f0a742' },
            { to:118, suffix:' elementos', label:'na tabela',    color:'#3ee8c4' },
          ].map((st,i)=>(
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:800, color:st.color }}><Counter to={st.to} suffix={st.suffix}/></div>
              <div style={{ fontSize:12, color:'#4a4a68', marginTop:3 }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider}/>

      {/* MÓDULOS */}
      <section style={{ ...s.section, position:'relative', zIndex:1 }}>
        <div style={s.sectionLabel}>Conteúdo</div>
        <h2 style={s.sectionTitle}>Jornada de aprendizado</h2>
        <p style={s.sectionSub}>Quatro módulos progressivos, do básico ao desafio final.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:640, margin:'0 auto' }}>
          {modules.map((m,i)=>{
            const c = modColors[m.c]
            return (
              <div key={i} style={{ ...s.card, padding:'20px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:c.bg, border:`1px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:c.color, flexShrink:0 }}>{m.num}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>{m.title}</div>
                  <div style={{ fontSize:12, color:'#8888aa', lineHeight:1.4 }}>{m.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div style={s.divider}/>

      {/* FEATURES */}
      <section style={{ ...s.section, position:'relative', zIndex:1 }}>
        <div style={s.sectionLabel}>Recursos</div>
        <h2 style={s.sectionTitle}>Tudo para você aprender</h2>
        <p style={s.sectionSub}>Ferramentas pensadas para tornar a química mais visual e motivadora.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:12, maxWidth:720, margin:'0 auto' }}>
          {features.map((f,i)=>(
            <div key={i} style={{ ...s.card, padding:'20px', transition:'border-color 0.2s, transform 0.15s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=f.border;e.currentTarget.style.transform='translateY(-3px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{ width:38, height:38, borderRadius:10, background:f.bg, border:`1px solid ${f.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, color:f.color }}>
                {f.icon}
              </div>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:6 }}>{f.title}</div>
              <div style={{ fontSize:12, color:'#8888aa', lineHeight:1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider}/>

      {/* COMO FUNCIONA */}
      <section style={{ ...s.section, position:'relative', zIndex:1 }}>
        <div style={s.sectionLabel}>Como funciona</div>
        <h2 style={s.sectionTitle}>4 passos para dominar</h2>
        <p style={s.sectionSub}>Do cadastro ao badge de Mestre Iônico.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:0, maxWidth:540, margin:'0 auto' }}>
          {steps.map((st,i)=>(
            <div key={i} style={{ display:'flex', gap:20, alignItems:'flex-start', position:'relative' }}>
              {i < steps.length-1 && (
                <div style={{ position:'absolute', left:19, top:42, width:1, height:'calc(100% - 10px)', background:'rgba(255,255,255,0.07)' }}/>
              )}
              <div style={{ width:40, height:40, borderRadius:'50%', border:`1.5px solid ${st.color}`, background:'#09090f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:st.color, flexShrink:0, zIndex:1 }}>{st.num}</div>
              <div style={{ paddingBottom:32 }}>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:5, marginTop:9 }}>{st.title}</div>
                <div style={{ fontSize:13, color:'#8888aa', lineHeight:1.65, maxWidth:440 }}>{st.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider}/>

      {/* CTA FINAL */}
      <section style={{ ...s.section, position:'relative', zIndex:1 }}>
        <div style={s.ctaBox}>
          <div style={{ position:'absolute', top:'-80px', left:'50%', transform:'translateX(-50%)', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,124,248,0.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(139,124,248,0.12)', border:'1.5px solid rgba(139,124,248,0.28)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', position:'relative' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b7cf8" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity="0.4"/>
              <line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/>
            </svg>
          </div>
          <h2 style={{ fontSize:'clamp(22px,2.8vw,30px)', fontWeight:800, letterSpacing:'-0.5px', marginBottom:12, position:'relative' }}>Pronto para começar?</h2>
          <p style={{ fontSize:14, color:'#8888aa', lineHeight:1.7, marginBottom:28, position:'relative', maxWidth:380, margin:'0 auto 28px' }}>
            Crie sua conta gratuitamente e comece a dominar as ligações iônicas agora mesmo.
          </p>
          <button style={{ ...s.btnCta, margin:'0 auto', boxShadow:'0 0 40px rgba(139,124,248,0.2)' }} onClick={() => navigate('/cadastro')}>
            Criar conta
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ ...s.footer, position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26, height:26, borderRadius:7, background:'rgba(139,124,248,0.12)', border:'1px solid rgba(139,124,248,0.28)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b7cf8" strokeWidth="2"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity="0.3"/></svg>
          </div>
          <span style={{ fontSize:13, fontWeight:700 }}>Ion<b style={{ color:'#8b7cf8' }}>Lab</b></span>
        </div>
      </footer>

    </div>
  )
}
