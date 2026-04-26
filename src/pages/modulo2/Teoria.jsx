import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import { atomSVG } from '../../utils/drawAtom'

const SHELL_ATOMS = [
  { sym:'Na', z:11, layers:[2,8,1],   type:'metal',    name:'Sódio',     desc:'Sódio tem 1 elétron na última camada. É muito fácil perdê-lo, formando Na⁺.' },
  { sym:'Cl', z:17, layers:[2,8,7],   type:'nonmetal', name:'Cloro',     desc:'Cloro tem 7 elétrons na última camada. Falta apenas 1 para completar 8. Por isso ganha 1 elétron, formando Cl⁻.' },
  { sym:'Ca', z:20, layers:[2,8,8,2], type:'metal',    name:'Cálcio',    desc:'Cálcio tem 2 elétrons na última camada. Perde esses 2 facilmente, formando Ca²⁺.' },
  { sym:'O',  z:8,  layers:[2,6],     type:'nonmetal', name:'Oxigênio',  desc:'Oxigênio tem 6 elétrons na última camada. Ganha 2 para completar 8, formando O²⁻.' },
  { sym:'Mg', z:12, layers:[2,8,2],   type:'metal',    name:'Magnésio',  desc:'Magnésio tem 2 elétrons na última camada. Perde ambos facilmente, formando Mg²⁺.' },
  { sym:'F',  z:9,  layers:[2,7],     type:'nonmetal', name:'Flúor',     desc:'Flúor tem 7 elétrons na última camada. Precisa de apenas 1 para completar — o mais eletronegativo da tabela. Forma F⁻.' },
]

const TRANSFER_PAIRS = [
  { metal:'Na', mLayers:[2,8,1],   nonmetal:'Cl', nLayers:[2,8,7],   eCount:1, formula:'NaCl',  name:'Cloreto de sódio',    mIon:'Na⁺',  nIon:'Cl⁻'    },
  { metal:'Ca', mLayers:[2,8,8,2], nonmetal:'O',  nLayers:[2,6],     eCount:2, formula:'CaO',   name:'Óxido de cálcio',     mIon:'Ca²⁺', nIon:'O²⁻'    },
  { metal:'Mg', mLayers:[2,8,2],   nonmetal:'Cl', nLayers:[2,8,7],   eCount:2, formula:'MgCl₂', name:'Cloreto de magnésio', mIon:'Mg²⁺', nIon:'Cl⁻ ×2' },
  { metal:'K',  mLayers:[2,8,8,1], nonmetal:'F',  nLayers:[2,7],     eCount:1, formula:'KF',    name:'Fluoreto de potássio',mIon:'K⁺',   nIon:'F⁻'     },
]

function AtomDiagram({ sym, layers, type, size = 160 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = atomSVG(sym, layers, type, size, size)
  }, [sym, layers, type, size])
  return <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} />
}

function SidebarStep({ num, label, current, onClick }) {
  const active = current === num, done = current > num
  return (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, cursor:'pointer', marginBottom:4, border:`1px solid ${active ? 'var(--teal-border)' : 'transparent'}`, background: active ? 'var(--teal-dim)' : 'transparent', opacity: done ? 0.7 : 1 }}>
      <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, border:`1.5px solid ${active ? 'var(--teal)' : done ? 'var(--teal-border)' : 'var(--border2)'}`, background: active ? 'var(--teal)' : done ? 'rgba(78,205,196,0.2)' : 'transparent', color: active ? '#0a1628' : done ? 'var(--teal)' : 'var(--text2)' }}>
        {done ? '✓' : num}
      </div>
      <span style={{ fontSize:13, color: active ? 'var(--text)' : 'var(--text2)', fontWeight: active ? 600 : 400 }}>{label}</span>
    </div>
  )
}

export default function Teoria() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selAtom, setSelAtom] = useState(SHELL_ATOMS[0])
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
    setTimeout(() => setShowResult(true), 600)
  }

  // layers after transfer
  const mLayersAfter = pair.mLayers.slice(0, -1)
  const nLayersAfter = [...pair.nLayers.slice(0, -1), pair.nLayers[pair.nLayers.length - 1] + pair.eCount]

  return (
    <>
      <Background />
      <Navbar />
      <div style={{ display:'flex', paddingTop:56, minHeight:'100vh', position:'relative', zIndex:1 }}>

        {/* SIDEBAR */}
        <aside style={{ width:220, flexShrink:0, padding:'2rem 1rem', borderRight:'1px solid var(--border)', position:'sticky', top:56, height:'calc(100vh - 56px)', overflowY:'auto' }}>
          <div style={{ fontSize:10, letterSpacing:'1.5px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', marginBottom:'1rem' }}>Progresso</div>
          <SidebarStep num={1} label="Camadas eletrônicas" current={step} onClick={() => setStep(1)} />
          <SidebarStep num={2} label="Transferência de elétrons" current={step} onClick={() => setStep(2)} />
          <SidebarStep num={3} label="Formação da ligação" current={step} onClick={() => setStep(3)} />
        </aside>

        <main style={{ flex:1, padding:'2.5rem 2rem', maxWidth:860, overflowY:'auto' }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ animation:'fadeIn 0.3s ease' }}>
              <div style={stepInd}>Passo 1 de 3</div>
              <h1 style={h1}>Camadas Eletrônicas</h1>
              <p style={intro}>Os elétrons de um átomo se organizam em camadas ao redor do núcleo. A <strong>camada de valência</strong> — a mais externa — determina como o elemento se comporta nas ligações iônicas.</p>

              <div style={sectionCard}>
                <div style={{ display:'flex', gap:8, marginBottom:'1.2rem', flexWrap:'wrap' }}>
                  {SHELL_ATOMS.map(a => (
                    <button key={a.sym} onClick={() => setSelAtom(a)} style={{ padding:'6px 16px', borderRadius:8, border:`1px solid ${selAtom.sym===a.sym ? (a.type==='metal'?'var(--orange-border)':'var(--blue-border)') : 'var(--border2)'}`, background: selAtom.sym===a.sym ? (a.type==='metal'?'var(--orange-dim)':'var(--blue-dim)') : 'var(--card2)', color: selAtom.sym===a.sym ? (a.type==='metal'?'var(--orange)':'var(--blue)') : 'var(--text2)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
                      {a.sym} ({a.z})
                    </button>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'2rem', flexWrap:'wrap' }}>
                  <AtomDiagram sym={selAtom.sym} layers={selAtom.layers} type={selAtom.type} size={180} />
                  <div style={{ flex:1, minWidth:200 }}>
                    <h3 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>{selAtom.name} (Z={selAtom.z})</h3>
                    <p style={{ fontSize:13, color:'var(--text2)', marginBottom:4 }}>Distribuição: <strong style={{ color:'var(--text)' }}>[{selAtom.layers.join(', ')}]</strong></p>
                    <p style={{ fontSize:13, color:'var(--text2)', marginBottom:12, lineHeight:1.6 }}>{selAtom.desc}</p>
                    <span style={{ display:'inline-block', padding:'4px 14px', borderRadius:8, fontSize:14, fontWeight:800, background: selAtom.type==='metal'?'var(--orange-dim)':'var(--blue-dim)', color: selAtom.type==='metal'?'var(--orange)':'var(--blue)', border:`1px solid ${selAtom.type==='metal'?'var(--orange-border)':'var(--blue-border)'}` }}>
                      {selAtom.type === 'metal' ? `${selAtom.layers[selAtom.layers.length-1]} e⁻ na valência → perde → íon +` : `${selAtom.layers[selAtom.layers.length-1]} e⁻ na valência → ganha → íon −`}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:'1.5rem' }}>
                <div style={ruleCard}>
                  <h4 style={{ fontSize:14, fontWeight:700, marginBottom:8 }}><span style={tagM}>Metais</span> Regra de perda</h4>
                  <p style={ruleText}>Metais têm 1, 2 ou 3 elétrons na camada de valência. É mais fácil <strong>perder</strong> esses poucos do que ganhar muitos para completar 8.</p>
                </div>
                <div style={ruleCard}>
                  <h4 style={{ fontSize:14, fontWeight:700, marginBottom:8 }}><span style={tagN}>Ametais</span> Regra de ganho</h4>
                  <p style={ruleText}>Ametais têm 5, 6 ou 7 elétrons na camada de valência. É mais fácil <strong>ganhar</strong> os elétrons que faltam para completar 8 (regra do octeto).</p>
                </div>
              </div>
              <button style={btnC} onClick={() => setStep(2)}>Próximo →</button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ animation:'fadeIn 0.3s ease' }}>
              <div style={stepInd}>Passo 2 de 3</div>
              <h1 style={h1}>Transferência de Elétrons</h1>
              <p style={intro}>Na ligação iônica, o metal <strong>doa</strong> seus elétrons de valência para o ametal. Isso transforma ambos em íons de cargas opostas. Escolha um par e veja a transferência acontecer:</p>

              <div style={sectionCard}>
                <div style={{ display:'flex', gap:8, marginBottom:'1.2rem', flexWrap:'wrap' }}>
                  {TRANSFER_PAIRS.map((p, i) => (
                    <button key={i} onClick={() => selectPair(i)} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${selPair===i?'var(--teal-border)':'var(--border2)'}`, background: selPair===i?'var(--teal-dim)':'var(--card2)', color: selPair===i?'var(--teal)':'var(--text2)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
                      {p.metal} + {p.nonmetal}
                    </button>
                  ))}
                </div>

                {/* Animação */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'2rem', padding:'1rem 0', flexWrap:'wrap', minHeight:200 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                    <AtomDiagram sym={pair.metal} layers={animated ? mLayersAfter : pair.mLayers} type="metal" size={130} />
                    <span style={{ fontSize:13, color:'var(--text2)' }}>{pair.metal}</span>
                    {animated && <span style={{ fontSize:16, fontWeight:800, color:'var(--orange)', animation:'popIn 0.3s ease' }}>{pair.mIon}</span>}
                  </div>

                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                    <div style={{ fontSize:13, fontWeight:700, color: animated ? 'var(--teal)' : 'var(--text3)', transition:'color 0.4s' }}>
                      {pair.eCount}e⁻ →
                    </div>
                  </div>

                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                    <AtomDiagram sym={pair.nonmetal} layers={animated ? nLayersAfter : pair.nLayers} type="nonmetal" size={130} />
                    <span style={{ fontSize:13, color:'var(--text2)' }}>{pair.nonmetal}</span>
                    {animated && <span style={{ fontSize:16, fontWeight:800, color:'var(--blue)', animation:'popIn 0.3s ease' }}>{pair.nIon}</span>}
                  </div>
                </div>

                {!animated
                  ? <button onClick={animate} style={{ display:'block', margin:'0 auto', padding:'8px 24px', background:'var(--teal-dim)', border:'1px solid var(--teal-border)', color:'var(--teal)', fontSize:14, fontWeight:700, borderRadius:10, cursor:'pointer' }}>
                      ▶ Animar transferência
                    </button>
                  : showResult && (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, background:'var(--card2)', border:'1px solid var(--teal-border)', borderRadius:12, padding:'12px 20px', marginTop:'1rem', flexWrap:'wrap', animation:'fadeIn 0.4s ease' }}>
                      <span style={{ fontSize:18, fontWeight:800, padding:'6px 14px', borderRadius:8, background:'var(--orange-dim)', color:'var(--orange)', border:'1px solid var(--orange-border)' }}>{pair.mIon}</span>
                      <span style={{ color:'var(--text3)', fontSize:16 }}>+</span>
                      <span style={{ fontSize:18, fontWeight:800, padding:'6px 14px', borderRadius:8, background:'var(--blue-dim)', color:'var(--blue)', border:'1px solid var(--blue-border)' }}>{pair.nIon}</span>
                      <span style={{ fontSize:20, margin:'0 4px', color:'var(--text3)' }}>→</span>
                      <strong style={{ fontSize:20, color:'var(--teal)' }}>{pair.formula}</strong>
                      <span style={{ fontSize:13, color:'var(--text2)' }}>{pair.name}</span>
                    </div>
                  )
                }
              </div>

              <div style={{ display:'flex', gap:12 }}>
                <button style={btnV} onClick={() => setStep(1)}>← Voltar</button>
                <button style={btnC} onClick={() => setStep(3)}>Próximo →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div style={{ animation:'fadeIn 0.3s ease' }}>
              <div style={stepInd}>Passo 3 de 3</div>
              <h1 style={h1}>Formação da Ligação Iônica</h1>
              <p style={intro}>Após a transferência de elétrons, os íons formados têm cargas opostas. A <strong>atração eletrostática</strong> entre eles forma a ligação iônica.</p>

              <div style={{ ...ruleCard, borderColor:'var(--teal-border)', marginBottom:12 }}>
                <h4 style={{ fontSize:15, fontWeight:700, marginBottom:12, color:'var(--teal)' }}>As 3 etapas da ligação iônica</h4>
                {['1. Ionização do metal: o metal perde elétrons e vira cátion (+)', '2. Ionização do ametal: o ametal ganha elétrons e vira ânion (−)', '3. Atração eletrostática: cátion e ânion se atraem e formam o composto iônico'].map((t, i) => (
                  <p key={i} style={{ fontSize:13, color:'var(--text2)', marginBottom:8, lineHeight:1.6 }}><strong style={{ color:'var(--text)' }}>{t.split(':')[0]}:</strong>{t.split(':')[1]}</p>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:'1.5rem' }}>
                <div style={{ ...ruleCard, borderColor:'var(--orange-border)' }}>
                  <h4 style={{ fontSize:13, fontWeight:700, marginBottom:8 }}><span style={tagM}>Exemplo</span></h4>
                  <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.8 }}>
                    Na → Na⁺ + 1e⁻<br/>Cl + 1e⁻ → Cl⁻<br/>
                    <strong style={{ color:'var(--teal)' }}>Na⁺ + Cl⁻ → NaCl</strong><br/>
                    <small style={{ color:'var(--text3)' }}>Cloreto de sódio (sal de cozinha)</small>
                  </p>
                </div>
                <div style={{ ...ruleCard, borderColor:'var(--blue-border)' }}>
                  <h4 style={{ fontSize:13, fontWeight:700, marginBottom:8 }}><span style={tagN}>Exemplo</span></h4>
                  <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.8 }}>
                    Ca → Ca²⁺ + 2e⁻<br/>O + 2e⁻ → O²⁻<br/>
                    <strong style={{ color:'var(--teal)' }}>Ca²⁺ + O²⁻ → CaO</strong><br/>
                    <small style={{ color:'var(--text3)' }}>Óxido de cálcio (cal viva)</small>
                  </p>
                </div>
              </div>

              <div style={{ display:'flex', gap:12 }}>
                <button style={btnV} onClick={() => setStep(2)}>← Voltar</button>
                <button style={btnC} onClick={() => navigate('/modulo2/exercicios')}>Ir para os Exercícios →</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}

const stepInd = { fontSize:13, color:'var(--text2)', marginBottom:8 }
const h1 = { fontSize:26, fontWeight:800, marginBottom:'1rem' }
const intro = { fontSize:14, color:'var(--text2)', lineHeight:1.7, marginBottom:'1.5rem' }
const sectionCard = { background:'var(--card)', border:'1px solid var(--border2)', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem' }
const ruleCard = { background:'var(--card)', border:'1px solid var(--border2)', borderRadius:14, padding:'1.2rem' }
const ruleText = { fontSize:13, color:'var(--text2)', lineHeight:1.6 }
const tagM = { fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:5, background:'var(--orange-dim)', color:'var(--orange)', marginRight:8 }
const tagN = { fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:5, background:'var(--blue-dim)', color:'var(--blue)', marginRight:8 }
const btnC = { display:'flex', alignItems:'center', gap:8, padding:'13px 28px', background:'var(--teal)', color:'#0a1628', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }
const btnV = { padding:'10px 20px', background:'transparent', border:'1px solid var(--border2)', color:'var(--text2)', fontSize:14, fontWeight:600, borderRadius:10, cursor:'pointer' }
