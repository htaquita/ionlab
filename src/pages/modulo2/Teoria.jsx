import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import { atomSVG } from '../../utils/drawAtom'

// ── Pares válidos com explicação do porquê ───────────────────────────────────
const TRANSFER_PAIRS = [
  {
    metal:'Na', mLayers:[2,8,1],   nonmetal:'Cl', nLayers:[2,8,7],
    eCount:1, formula:'NaCl', name:'Cloreto de sódio',
    mIon:'Na⁺', nIon:'Cl⁻',
    porque:'Na tem 1 e⁻ de valência — quer perder. Cl tem 7 — quer ganhar 1. É uma combinação perfeita: cada um atinge o octeto com apenas 1 transferência.',
  },
  {
    metal:'Ca', mLayers:[2,8,8,2], nonmetal:'O',  nLayers:[2,6],
    eCount:2, formula:'CaO',  name:'Óxido de cálcio',
    mIon:'Ca²⁺', nIon:'O²⁻',
    porque:'Ca tem 2 e⁻ de valência — quer perder 2. O tem 6 — quer ganhar 2. Novamente encaixe perfeito: 1 Ca se combina com 1 O.',
  },
  {
    metal:'Mg', mLayers:[2,8,2],   nonmetal:'Cl', nLayers:[2,8,7],
    eCount:2, formula:'MgCl₂', name:'Cloreto de magnésio',
    mIon:'Mg²⁺', nIon:'Cl⁻',
    porque:'Mg quer perder 2 e⁻, mas cada Cl só aceita 1. São necessários 2 átomos de Cl para receber os 2 elétrons do Mg — por isso a fórmula é MgCl₂.',
  },
  {
    metal:'K',  mLayers:[2,8,8,1], nonmetal:'F',  nLayers:[2,7],
    eCount:1, formula:'KF',   name:'Fluoreto de potássio',
    mIon:'K⁺', nIon:'F⁻',
    porque:'K tem 1 e⁻ de valência e F precisa de 1 para completar 8. Combinação direta: 1 K transfere 1 e⁻ para 1 F.',
  },
]

function AtomDiagram({ sym, layers, type, size=130 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const html = (() => {
      const cx=size/2, cy=size/2, r0=size*0.13, maxR=size/2-6
      const step=(maxR-r0)/Math.max(layers.length,1)
      const tc=type==='metal'?'#f0a742':'#3ee8c4'
      let h=`<circle cx="${cx}" cy="${cy}" r="${r0}" fill="${tc}20" stroke="${tc}" stroke-width="1.5"/>
        <text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="${Math.round(r0*0.7)}" font-weight="800" fill="${tc}" font-family="Segoe UI,sans-serif">${sym}</text>`
      layers.forEach((n,i)=>{
        const r=r0+step*(i+1)
        h+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`
        for(let j=0;j<n;j++){
          const a=(j/n)*2*Math.PI-Math.PI/2
          const ex=cx+r*Math.cos(a), ey=cy+r*Math.sin(a)
          const isLast=i===layers.length-1
          h+=`<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${isLast?4:3}" fill="${isLast?tc:'rgba(255,255,255,0.45)'}" opacity="${isLast?1:0.6}"/>`
        }
      })
      return h
    })()
    ref.current.innerHTML = html
  }, [sym, layers, type, size])
  return <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`}/>
}

function SidebarStep({num,label,current}){
  const active=current===num, done=current>num, locked=num>current
  return(
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,marginBottom:4,cursor:locked?'default':'pointer',border:`1px solid ${active?'rgba(59,130,246,0.35)':'transparent'}`,background:active?'rgba(59,130,246,0.1)':'transparent',opacity:locked?0.4:1}}>
      <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0,border:`1.5px solid ${active?'#3b82f6':done?'rgba(59,130,246,0.4)':'rgba(255,255,255,0.1)'}`,background:active?'#3b82f6':done?'rgba(59,130,246,0.15)':'transparent',color:active?'#fff':done?'#3b82f6':'#475569'}}>
        {done
          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          : locked
            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            : num
        }
      </div>
      <span style={{fontSize:13,color:active?'#e2e8f8':done?'#94a3b8':'#475569',fontWeight:active?600:400}}>{label}</span>
    </div>
  )
}

export default function Teoria() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selPair, setSelPair] = useState(0)
  const [animated, setAnimated] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const pair = TRANSFER_PAIRS[selPair]

  function selectPair(i) {
    setSelPair(i)
    setAnimated(false)
    setShowResult(false)
  }

  function animate() {
    setAnimated(true)
    setTimeout(() => setShowResult(true), 500)
  }

  const mLayersAfter = pair.mLayers.slice(0, -1)
  const nLayersAfter = [...pair.nLayers.slice(0,-1), pair.nLayers[pair.nLayers.length-1]+pair.eCount]

  return (
    <>
      <Background/>
      <Navbar/>
      <div style={{display:'flex',paddingTop:56,minHeight:'100vh',position:'relative',zIndex:1}}>

        <aside style={{width:220,flexShrink:0,padding:'2rem 1rem',borderRight:'1px solid var(--border)',position:'sticky',top:56,height:'calc(100vh - 56px)',overflowY:'auto'}}>
          <div style={{fontSize:10,letterSpacing:'1.5px',fontWeight:700,color:'var(--text3)',textTransform:'uppercase',marginBottom:'1rem'}}>Progresso</div>
          <SidebarStep num={1} label="Por que se combinam?" current={step}/>
          <SidebarStep num={2} label="Transferência de Elétrons" current={step}/>
          <SidebarStep num={3} label="Formação da Ligação" current={step}/>
        </aside>

        <main style={{flex:1,padding:'2.5rem 2rem',maxWidth:860,overflowY:'auto'}}>

          {/* ── PASSO 1: Por que certos pares se combinam ── */}
          {step===1&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 1 de 3</div>
              <h1 style={h1}>Por que certos elementos se combinam?</h1>
              <p style={intro}>
                Nem todo metal se combina com qualquer ametal de qualquer jeito. A combinação acontece porque <strong>cada elemento busca atingir 8 elétrons na camada de valência</strong> — a Regra do Octeto. O que determina o par e a proporção é exatamente quantos elétrons cada um precisa perder ou ganhar.
              </p>

              {/* Tabela de tendências */}
              <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:'1rem'}}>Tendência de cada grupo</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1rem'}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--orange)',letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Metais — perdem elétrons</div>
                    {[{g:'IA', e:1,ex:'Na, K, Li'},{g:'IIA',e:2,ex:'Ca, Mg, Ba'},{g:'IIIA',e:3,ex:'Al'}].map(r=>(
                      <div key={r.g} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:'var(--orange-dim)',border:'1px solid var(--orange-border)',borderRadius:10,marginBottom:6}}>
                        <span style={{fontSize:12,fontWeight:700,color:'var(--orange)',width:36,flexShrink:0}}>Grupo {r.g}</span>
                        <span style={{fontSize:13,color:'var(--text2)',flex:1}}>perde <strong style={{color:'var(--text)'}}>{r.e} e⁻</strong> → cátion +{r.e}</span>
                        <span style={{fontSize:11,color:'var(--text3)'}}>{r.ex}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--blue)',letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Ametais — ganham elétrons</div>
                    {[{g:'VIIA',e:1,ex:'F, Cl, Br'},{g:'VIA', e:2,ex:'O, S'},{g:'VA',  e:3,ex:'N, P'}].map(r=>(
                      <div key={r.g} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:'var(--blue-dim)',border:'1px solid var(--blue-border)',borderRadius:10,marginBottom:6}}>
                        <span style={{fontSize:12,fontWeight:700,color:'var(--blue)',width:36,flexShrink:0}}>Grupo {r.g}</span>
                        <span style={{fontSize:13,color:'var(--text2)',flex:1}}>ganha <strong style={{color:'var(--text)'}}>{r.e} e⁻</strong> → ânion −{r.e}</span>
                        <span style={{fontSize:11,color:'var(--text3)'}}>{r.ex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regra da proporção */}
                <div style={{background:'var(--card2)',border:'1px solid var(--teal-border)',borderRadius:12,padding:'1rem'}}>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--teal)',marginBottom:8}}>Como descobrir a proporção do composto?</div>
                  <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.7,marginBottom:10}}>
                    A soma das cargas deve ser <strong style={{color:'var(--text)'}}>zero</strong>. Se as cargas não se cancelam diretamente, usa-se mais de um átomo de cada lado até a soma dar zero.
                  </p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {[
                      {ex:'Na⁺ + Cl⁻', calc:'(+1) + (−1) = 0 ✓', res:'NaCl — proporção 1:1'},
                      {ex:'Mg²⁺ + Cl⁻',calc:'(+2) + (−1) ≠ 0 → precisamos de 2 Cl⁻', res:'MgCl₂ — proporção 1:2'},
                    ].map((e,i)=>(
                      <div key={i} style={{background:'rgba(0,0,0,0.15)',borderRadius:10,padding:'10px 14px'}}>
                        <div style={{fontSize:14,fontWeight:700,color:'var(--teal)',marginBottom:4}}>{e.ex}</div>
                        <div style={{fontSize:12,color:'var(--text2)',marginBottom:4}}>{e.calc}</div>
                        <div style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>{e.res}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button style={btnC} onClick={()=>setStep(2)}>Próximo →</button>
            </div>
          )}

          {/* ── PASSO 2: Transferência animada ── */}
          {step===2&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 2 de 3</div>
              <h1 style={h1}>Transferência de Elétrons</h1>
              <p style={intro}>
                Na ligação iônica, o metal <strong>doa</strong> seus elétrons de valência para o ametal. Esse processo transforma ambos em íons de cargas opostas. Escolha um par e veja a transferência acontecer:
              </p>

              <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
                {/* Seletor de pares */}
                <div style={{display:'flex',gap:8,marginBottom:'1.2rem',flexWrap:'wrap'}}>
                  {TRANSFER_PAIRS.map((p,i)=>(
                    <button key={i} onClick={()=>selectPair(i)} style={{padding:'6px 14px',borderRadius:8,border:`1px solid ${selPair===i?'var(--teal-border)':'var(--border2)'}`,background:selPair===i?'var(--teal-dim)':'var(--card2)',color:selPair===i?'var(--teal)':'var(--text2)',fontSize:13,fontWeight:600,cursor:'pointer',transition:'all 0.15s'}}>
                      {p.metal} + {p.nonmetal}
                    </button>
                  ))}
                </div>

                {/* Explicação do par */}
                <div style={{background:'var(--card2)',border:'1px solid var(--teal-border)',borderRadius:12,padding:'12px 16px',marginBottom:'1.2rem',fontSize:13,color:'var(--text2)',lineHeight:1.7}}>
                  <strong style={{color:'var(--teal)'}}>Por que esse par?</strong> {pair.porque}
                </div>

                {/* Animação */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'2rem',padding:'1rem 0',flexWrap:'wrap',minHeight:200}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                    <AtomDiagram sym={pair.metal} layers={animated?mLayersAfter:pair.mLayers} type="metal" size={130}/>
                    <span style={{fontSize:13,color:'var(--text2)'}}>{pair.metal}</span>
                    {animated&&<span style={{fontSize:16,fontWeight:800,color:'var(--orange)',animation:'popIn 0.3s ease'}}>{pair.mIon}</span>}
                  </div>

                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                    <div style={{fontSize:13,fontWeight:700,color:animated?'var(--teal)':'var(--text3)',transition:'color 0.4s'}}>
                      {pair.eCount}e⁻ →
                    </div>
                  </div>

                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                    <AtomDiagram sym={pair.nonmetal} layers={animated?nLayersAfter:pair.nLayers} type="nonmetal" size={130}/>
                    <span style={{fontSize:13,color:'var(--text2)'}}>{pair.nonmetal}</span>
                    {animated&&<span style={{fontSize:16,fontWeight:800,color:'var(--blue)',animation:'popIn 0.3s ease'}}>{pair.nIon}</span>}
                  </div>
                </div>

                {!animated
                  ? <button onClick={animate} style={{display:'block',margin:'0 auto',padding:'8px 24px',background:'var(--teal-dim)',border:'1px solid var(--teal-border)',color:'var(--teal)',fontSize:14,fontWeight:700,borderRadius:10,cursor:'pointer'}}>
                      ▶ Animar transferência
                    </button>
                  : showResult&&(
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,background:'var(--card2)',border:'1px solid var(--teal-border)',borderRadius:12,padding:'12px 20px',marginTop:'1rem',flexWrap:'wrap',animation:'fadeIn 0.4s ease'}}>
                      <span style={{fontSize:18,fontWeight:800,padding:'6px 14px',borderRadius:8,background:'var(--orange-dim)',color:'var(--orange)',border:'1px solid var(--orange-border)'}}>{pair.mIon}</span>
                      <span style={{color:'var(--text3)',fontSize:16}}>+</span>
                      <span style={{fontSize:18,fontWeight:800,padding:'6px 14px',borderRadius:8,background:'var(--blue-dim)',color:'var(--blue)',border:'1px solid var(--blue-border)'}}>{pair.nIon}</span>
                      <span style={{fontSize:20,margin:'0 4px',color:'var(--text3)'}}>→</span>
                      <strong style={{fontSize:20,color:'var(--teal)'}}>{pair.formula}</strong>
                      <span style={{fontSize:13,color:'var(--text2)'}}>{pair.name}</span>
                    </div>
                  )
                }
              </div>

              <div style={{display:'flex',gap:12}}>
                <button style={btnV} onClick={()=>setStep(1)}>← Voltar</button>
                <button style={btnC} onClick={()=>setStep(3)}>Próximo →</button>
              </div>
            </div>
          )}

          {/* ── PASSO 3: Formação da ligação ── */}
          {step===3&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 3 de 3</div>
              <h1 style={h1}>Formação da Ligação Iônica</h1>
              <p style={intro}>
                Após a transferência de elétrons, os íons formados têm cargas opostas. A <strong>atração eletrostática</strong> entre eles — carga positiva atraindo carga negativa — é o que forma a ligação iônica.
              </p>

              {/* 3 etapas */}
              <div style={{background:'var(--card)',border:'1px solid var(--teal-border)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
                <h4 style={{fontSize:15,fontWeight:700,color:'var(--teal)',marginBottom:'1rem'}}>As 3 etapas da ligação iônica</h4>
                {[
                  {num:'1', title:'Ionização do metal',  desc:'O metal perde elétrons da camada de valência e vira cátion (+). Exemplo: Na → Na⁺ + 1e⁻'},
                  {num:'2', title:'Ionização do ametal', desc:'O ametal recebe esses elétrons e vira ânion (−). Exemplo: Cl + 1e⁻ → Cl⁻'},
                  {num:'3', title:'Atração eletrostática',desc:'Cargas opostas se atraem — cátion e ânion formam o composto iônico. Exemplo: Na⁺ + Cl⁻ → NaCl'},
                ].map(e=>(
                  <div key={e.num} style={{display:'flex',gap:12,alignItems:'flex-start',padding:12,background:'var(--card2)',borderRadius:12,marginBottom:10}}>
                    <div style={{width:28,height:28,borderRadius:'50%',background:'var(--teal-dim)',border:'1px solid var(--teal-border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'var(--teal)',flexShrink:0}}>{e.num}</div>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{e.title}</div>
                      <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>{e.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Propriedades */}
              <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
                <h4 style={{fontSize:15,fontWeight:700,marginBottom:'1rem'}}>Propriedades dos compostos iônicos</h4>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {[
                    {prop:'Estado sólido à temperatura ambiente', ex:'NaCl é um sólido cristalino'},
                    {prop:'Alto ponto de fusão e ebulição',        ex:'NaCl funde a 801°C'},
                    {prop:'Conduzem eletricidade quando dissolvidos em água', ex:'Solução de NaCl conduz corrente'},
                    {prop:'Frágeis — quebram ao receber impacto', ex:'Sal se parte ao ser socado'},
                  ].map((p,i)=>(
                    <div key={i} style={{background:'var(--card2)',borderRadius:12,padding:'12px 14px'}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{p.prop}</div>
                      <div style={{fontSize:12,color:'var(--text3)'}}>Ex: {p.ex}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display:'flex',gap:12}}>
                <button style={btnV} onClick={()=>setStep(2)}>← Voltar</button>
                <button style={btnC} onClick={()=>navigate('/modulo2/exercicios')}>Ir para os Exercícios →</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}

const si    = {fontSize:13,color:'var(--text2)',marginBottom:8}
const h1    = {fontSize:26,fontWeight:800,marginBottom:'1rem'}
const intro = {fontSize:14,color:'var(--text2)',lineHeight:1.7,marginBottom:'1.5rem'}
const btnC  = {display:'flex',alignItems:'center',gap:8,padding:'13px 28px',background:'var(--teal)',color:'#0a1628',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:'pointer'}
const btnV  = {padding:'10px 20px',background:'transparent',border:'1px solid var(--border2)',color:'var(--text2)',fontSize:14,fontWeight:600,borderRadius:10,cursor:'pointer'}
