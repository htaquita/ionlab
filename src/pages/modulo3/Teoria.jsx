import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import { atomSVG } from '../../utils/drawAtom'
import { COMPOUNDS } from '../../data/elements'

function gcd(a, b) { return b ? gcd(b, a % b) : a }
function lcm(a, b) { return (a * b) / gcd(a, b) }

const CATIONS = [
  { sym:'Na', ion:'Na⁺',  charge:1, name:'sódio'     },
  { sym:'Ca', ion:'Ca²⁺', charge:2, name:'cálcio'    },
  { sym:'K',  ion:'K⁺',   charge:1, name:'potássio'  },
  { sym:'Mg', ion:'Mg²⁺', charge:2, name:'magnésio'  },
  { sym:'Al', ion:'Al³⁺', charge:3, name:'alumínio'  },
]
const ANIONS = [
  { sym:'Cl', ion:'Cl⁻',  charge:1, name:'cloreto'  },
  { sym:'O',  ion:'O²⁻',  charge:2, name:'óxido'    },
  { sym:'F',  ion:'F⁻',   charge:1, name:'fluoreto' },
  { sym:'S',  ion:'S²⁻',  charge:2, name:'sulfeto'  },
]

const EXPLORER_ELEMS = [
  { sym:'Na', z:11, layers:[2,8,1],   type:'metal',    name:'Sódio',    val:1, action:'perde 1 e⁻', ion:'Na⁺', ionType:'cat' },
  { sym:'Cl', z:17, layers:[2,8,7],   type:'nonmetal', name:'Cloro',    val:7, action:'ganha 1 e⁻', ion:'Cl⁻', ionType:'ani' },
  { sym:'Ca', z:20, layers:[2,8,8,2], type:'metal',    name:'Cálcio',   val:2, action:'perde 2 e⁻', ion:'Ca²⁺',ionType:'cat' },
  { sym:'O',  z:8,  layers:[2,6],     type:'nonmetal', name:'Oxigênio', val:6, action:'ganha 2 e⁻', ion:'O²⁻', ionType:'ani' },
  { sym:'Mg', z:12, layers:[2,8,2],   type:'metal',    name:'Magnésio', val:2, action:'perde 2 e⁻', ion:'Mg²⁺',ionType:'cat' },
  { sym:'F',  z:9,  layers:[2,7],     type:'nonmetal', name:'Flúor',    val:7, action:'ganha 1 e⁻', ion:'F⁻',  ionType:'ani' },
]

const NOMEN_EXAMPLES = [
  { f:'NaCl',   n:'Cloreto de sódio',     ref:'Cl⁻ = cloreto · Na⁺ = sódio'    },
  { f:'CaO',    n:'Óxido de cálcio',      ref:'O²⁻ = óxido · Ca²⁺ = cálcio'    },
  { f:'MgCl₂',  n:'Cloreto de magnésio',  ref:'Cl⁻ = cloreto · Mg²⁺ = magnésio' },
  { f:'KF',     n:'Fluoreto de potássio', ref:'F⁻ = fluoreto · K⁺ = potássio'  },
  { f:'AlCl₃',  n:'Cloreto de alumínio',  ref:'Cl⁻ = cloreto · Al³⁺ = alumínio' },
  { f:'Na₂O',   n:'Óxido de sódio',       ref:'O²⁻ = óxido · Na⁺ = sódio'      },
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
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, cursor:'pointer', marginBottom:4, border:`1px solid ${active?'var(--teal-border)':'transparent'}`, background: active?'var(--teal-dim)':'transparent', opacity: done ? 0.7 : 1 }}>
      <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, border:`1.5px solid ${active?'var(--teal)':done?'var(--teal-border)':'var(--border2)'}`, background: active?'var(--teal)':done?'rgba(78,205,196,0.2)':'transparent', color: active?'#0a1628':done?'var(--teal)':'var(--text2)' }}>
        {done ? '✓' : num}
      </div>
      <span style={{ fontSize:13, color: active?'var(--text)':'var(--text2)', fontWeight: active?600:400 }}>{label}</span>
    </div>
  )
}

export default function Teoria() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selCat, setSelCat] = useState(null)
  const [selAni, setSelAni] = useState(null)
  const [formula, setFormula] = useState(null)
  const [selElem, setSelElem] = useState(null)

  function generateFormula() {
    if (!selCat || !selAni) return
    const key = `${selCat.sym}-${selAni.sym}`
    const comp = COMPOUNDS[key]
    if (!comp) return
    const m = lcm(selCat.charge, selAni.charge)
    const ni = m / selCat.charge, nj = m / selAni.charge
    const steps = ni === 1 && nj === 1
      ? `${selCat.ion} (+${selCat.charge}) + ${selAni.ion} (−${selAni.charge}) → soma das cargas = 0 ✓`
      : `${ni}× ${selCat.ion} (${ni}×+${selCat.charge} = +${ni * selCat.charge}) + ${nj}× ${selAni.ion} (${nj}×−${selAni.charge} = −${nj * selAni.charge}) → soma = 0 ✓`
    setFormula({ f: comp.f, n: comp.n, steps })
  }

  function pickCat(c) { setSelCat(c); setFormula(null) }
  function pickAni(a) { setSelAni(a); setFormula(null) }

  return (
    <>
      <Background />
      <Navbar />
      <div style={{ display:'flex', paddingTop:56, minHeight:'100vh', position:'relative', zIndex:1 }}>

        <aside style={{ width:220, flexShrink:0, padding:'2rem 1rem', borderRight:'1px solid var(--border)', position:'sticky', top:56, height:'calc(100vh - 56px)', overflowY:'auto' }}>
          <div style={{ fontSize:10, letterSpacing:'1.5px', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', marginBottom:'1rem' }}>Progresso</div>
          <SidebarStep num={1} label="Formando a fórmula"  current={step} onClick={() => setStep(1)} />
          <SidebarStep num={2} label="Elétrons ao redor"   current={step} onClick={() => setStep(2)} />
          <SidebarStep num={3} label="Nomenclatura"        current={step} onClick={() => setStep(3)} />
        </aside>

        <main style={{ flex:1, padding:'2.5rem 2rem', maxWidth:860, overflowY:'auto' }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={{ animation:'fadeIn 0.3s ease' }}>
              <div style={si}>Passo 1 de 3</div>
              <h1 style={h1}>Como Montar a Fórmula</h1>
              <p style={intro}>Para escrever a fórmula de um composto iônico, combinamos as cargas dos íons de forma que a carga total seja zero. O truque é <strong>cruzar os valores das cargas</strong> — a carga do cátion vira o índice do ânion e vice-versa.</p>

              <div style={sCard}>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:'1rem' }}>Experimente combinar íons</h3>
                <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', marginBottom:'1.2rem' }}>
                  {/* Cátions */}
                  <div style={{ flex:1, minWidth:150 }}>
                    <div style={colLabel('var(--orange)')}>Cátion (+)</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {CATIONS.map(c => (
                        <button key={c.sym} onClick={() => pickCat(c)}
                          style={{ padding:'9px 14px', borderRadius:10, border:`1.5px solid ${selCat?.sym===c.sym?'var(--orange-border)':'var(--border2)'}`, background: selCat?.sym===c.sym?'var(--orange-dim)':'var(--card2)', color: selCat?.sym===c.sym?'var(--orange)':'var(--text)', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', justifyContent:'space-between', transition:'all 0.15s' }}>
                          {c.ion} <span style={{ fontSize:11, opacity:0.6 }}>+{c.charge}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Ânions */}
                  <div style={{ flex:1, minWidth:150 }}>
                    <div style={colLabel('var(--blue)')}>Ânion (−)</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {ANIONS.map(a => (
                        <button key={a.sym} onClick={() => pickAni(a)}
                          style={{ padding:'9px 14px', borderRadius:10, border:`1.5px solid ${selAni?.sym===a.sym?'var(--blue-border)':'var(--border2)'}`, background: selAni?.sym===a.sym?'var(--blue-dim)':'var(--card2)', color: selAni?.sym===a.sym?'var(--blue)':'var(--text)', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', justifyContent:'space-between', transition:'all 0.15s' }}>
                          {a.ion} <span style={{ fontSize:11, opacity:0.6 }}>−{a.charge}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prévia + botão */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.2rem', flexWrap:'wrap' }}>
                  <div style={{ flex:1, minWidth:180, padding:'10px 14px', background:'var(--card2)', border:'1px solid var(--border2)', borderRadius:12, display:'flex', alignItems:'center', gap:8, minHeight:44 }}>
                    {selCat && <span style={{ fontWeight:700, padding:'3px 10px', borderRadius:7, background:'var(--orange-dim)', color:'var(--orange)' }}>{selCat.ion}</span>}
                    {selCat && selAni && <span style={{ color:'var(--text3)' }}>+</span>}
                    {selAni && <span style={{ fontWeight:700, padding:'3px 10px', borderRadius:7, background:'var(--blue-dim)', color:'var(--blue)' }}>{selAni.ion}</span>}
                    {!selCat && !selAni && <span style={{ fontSize:13, color:'var(--text3)' }}>Selecione um cátion e um ânion acima</span>}
                    {(selCat && !selAni) || (!selCat && selAni) ? <span style={{ fontSize:13, color:'var(--text3)' }}>— selecione o outro íon</span> : null}
                  </div>
                  <button onClick={generateFormula} disabled={!selCat || !selAni}
                    style={{ padding:'11px 22px', background:'var(--teal)', color:'#0a1628', fontSize:14, fontWeight:700, border:'none', borderRadius:11, cursor: selCat&&selAni?'pointer':'default', opacity: selCat&&selAni?1:0.35, whiteSpace:'nowrap', transition:'opacity 0.2s' }}>
                    Gerar Fórmula →
                  </button>
                </div>

                {/* Resultado */}
                <div style={{ background:'var(--card2)', border:`1px solid ${formula?'var(--teal-border)':'var(--border2)'}`, borderRadius:14, padding:'1.2rem 1.5rem', textAlign:'center', minHeight:90, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', transition:'border-color 0.3s' }}>
                  {formula ? (
                    <div style={{ animation:'revealFormula 0.3s ease' }}>
                      <div style={{ fontSize:34, fontWeight:800, color:'var(--teal)', letterSpacing:1, marginBottom:6 }}>{formula.f}</div>
                      <div style={{ fontSize:14, color:'var(--text2)', marginBottom:8 }}>{formula.n}</div>
                      <div style={{ fontSize:12, color:'var(--text3)', lineHeight:1.8 }}>{formula.steps}</div>
                    </div>
                  ) : (
                    <span style={{ fontSize:14, color:'var(--text3)' }}>A fórmula aparecerá aqui após clicar em "Gerar Fórmula"</span>
                  )}
                </div>
              </div>

              <button style={btnC} onClick={() => setStep(2)}>Próximo →</button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={{ animation:'fadeIn 0.3s ease' }}>
              <div style={si}>Passo 2 de 3</div>
              <h1 style={h1}>Visualizando os Elétrons</h1>
              <p style={intro}>Ao observar o diagrama de elétrons de um átomo, você consegue identificar o elemento <strong>contando os elétrons na camada externa</strong>. Compare com a tabela periódica para confirmar o número atômico.</p>

              <div style={sCard}>
                <div style={{ display:'flex', gap:8, marginBottom:'1.2rem', flexWrap:'wrap' }}>
                  {EXPLORER_ELEMS.map(e => (
                    <button key={e.sym} onClick={() => setSelElem(e)}
                      style={{ padding:'7px 14px', borderRadius:9, border:`1.5px solid ${selElem?.sym===e.sym?(e.type==='metal'?'var(--orange-border)':'var(--blue-border)'):'var(--border2)'}`, background: selElem?.sym===e.sym?(e.type==='metal'?'var(--orange-dim)':'var(--blue-dim)'):'var(--card2)', color: selElem?.sym===e.sym?(e.type==='metal'?'var(--orange)':'var(--blue)'):'var(--text2)', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
                      {e.sym} ({e.z})
                    </button>
                  ))}
                </div>
                {selElem ? (
                  <div style={{ display:'flex', gap:'2rem', alignItems:'center', flexWrap:'wrap', animation:'fadeIn 0.2s ease' }}>
                    <AtomDiagram sym={selElem.sym} layers={selElem.layers} type={selElem.type} size={160} />
                    <div style={{ flex:1, minWidth:180 }}>
                      <h3 style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>{selElem.name} ({selElem.sym})</h3>
                      <p style={{ fontSize:13, color:'var(--text2)', marginBottom:4 }}>Número atômico: <strong style={{ color:'var(--text)' }}>{selElem.z}</strong></p>
                      <p style={{ fontSize:13, color:'var(--text2)', marginBottom:4 }}>Distribuição: <strong style={{ color:'var(--text)' }}>[{selElem.layers.join(', ')}]</strong></p>
                      <p style={{ fontSize:13, color:'var(--text2)', marginBottom:4 }}>Camada de valência: <strong style={{ color:'var(--text)' }}>{selElem.val} elétron{selElem.val>1?'s':''}</strong></p>
                      <p style={{ fontSize:13, color:'var(--text2)', marginBottom:10 }}>Comportamento: <strong style={{ color:'var(--text)' }}>{selElem.action} → forma {selElem.ion}</strong></p>
                      <span style={{ display:'inline-block', padding:'4px 14px', borderRadius:8, fontSize:15, fontWeight:800, background: selElem.ionType==='cat'?'var(--orange-dim)':'var(--blue-dim)', color: selElem.ionType==='cat'?'var(--orange)':'var(--blue)', border:`1px solid ${selElem.ionType==='cat'?'var(--orange-border)':'var(--blue-border)'}` }}>
                        {selElem.ion}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize:13, color:'var(--text3)', textAlign:'center', padding:'2rem' }}>Selecione um elemento acima para ver seu diagrama de elétrons</p>
                )}
              </div>

              <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:'1.5rem' }}>
                <strong style={{ color:'var(--teal)' }}>Dica:</strong> nos exercícios você verá átomos com seus elétrons desenhados. Conte os elétrons da camada externa para identificar o elemento e saber se ele forma cátion ou ânion.
              </p>

              <div style={{ display:'flex', gap:12 }}>
                <button style={btnV} onClick={() => setStep(1)}>← Voltar</button>
                <button style={btnC} onClick={() => setStep(3)}>Próximo →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div style={{ animation:'fadeIn 0.3s ease' }}>
              <div style={si}>Passo 3 de 3</div>
              <h1 style={h1}>Nomenclatura de Compostos Iônicos</h1>
              <p style={intro}>O nome de um composto iônico segue uma regra simples: <strong>nome do ânion + "de" + nome do cátion</strong>. O ânion recebe o sufixo <em>-eto</em>.</p>

              <div style={sCard}>
                {[
                  { num:1, text: <p>Escreva o <strong>nome do ânion primeiro</strong>, substituindo a terminação do ametal por <strong>-eto</strong> (cloro → cloreto, flúor → fluoreto, oxigênio → óxido).</p> },
                  { num:2, text: <p>Adicione a preposição <strong>"de"</strong> entre o ânion e o cátion.</p> },
                  { num:3, text: <p>Escreva o <strong>nome do cátion</strong> por último.</p> },
                ].map(r => (
                  <div key={r.num} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:12, background:'var(--card2)', borderRadius:12, marginBottom:10 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--teal-dim)', border:'1px solid var(--teal-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'var(--teal)', flexShrink:0 }}>{r.num}</div>
                    <div style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>{r.text}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:'1.5rem' }}>
                {NOMEN_EXAMPLES.map(e => (
                  <div key={e.f} style={{ background:'var(--card2)', border:'1px solid var(--border2)', borderRadius:12, padding:'12px 14px' }}>
                    <div style={{ fontSize:17, fontWeight:800, color:'var(--teal)', marginBottom:4 }}>{e.f}</div>
                    <div style={{ fontSize:13, color:'var(--text2)' }}>{e.n}</div>
                    <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{e.ref}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:12 }}>
                <button style={btnV} onClick={() => setStep(2)}>← Voltar</button>
                <button style={btnC} onClick={() => navigate('/modulo3/exercicios')}>Ir para os Exercícios →</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}

const si = { fontSize:13, color:'var(--text2)', marginBottom:8 }
const h1 = { fontSize:26, fontWeight:800, marginBottom:'1rem' }
const intro = { fontSize:14, color:'var(--text2)', lineHeight:1.7, marginBottom:'1.5rem' }
const sCard = { background:'var(--card)', border:'1px solid var(--border2)', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem' }
const btnC = { display:'flex', alignItems:'center', gap:8, padding:'13px 28px', background:'var(--teal)', color:'#0a1628', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }
const btnV = { padding:'10px 20px', background:'transparent', border:'1px solid var(--border2)', color:'var(--text2)', fontSize:14, fontWeight:600, borderRadius:10, cursor:'pointer' }
const colLabel = (color) => ({ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color, marginBottom:8 })
