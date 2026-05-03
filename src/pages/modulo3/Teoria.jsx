import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import { atomSVG } from '../../utils/drawAtom'
import { COMPOUNDS } from '../../data/elements'

function gcd(a,b){return b?gcd(b,a%b):a}
function lcm(a,b){return(a*b)/gcd(a,b)}

const CATIONS = [
  {sym:'Na',ion:'Na⁺', charge:1,name:'sódio'},
  {sym:'Ca',ion:'Ca²⁺',charge:2,name:'cálcio'},
  {sym:'K', ion:'K⁺',  charge:1,name:'potássio'},
  {sym:'Mg',ion:'Mg²⁺',charge:2,name:'magnésio'},
  {sym:'Al',ion:'Al³⁺',charge:3,name:'alumínio'},
]
const ANIONS = [
  {sym:'Cl',ion:'Cl⁻', charge:1,name:'cloreto'},
  {sym:'O', ion:'O²⁻', charge:2,name:'óxido'},
  {sym:'F', ion:'F⁻',  charge:1,name:'fluoreto'},
  {sym:'S', ion:'S²⁻', charge:2,name:'sulfeto'},
]

const NOMEN_EXAMPLES = [
  {f:'NaCl',  n:'Cloreto de sódio',     ref:'Cl⁻ = cloreto · Na⁺ = sódio'},
  {f:'CaO',   n:'Óxido de cálcio',      ref:'O²⁻ = óxido · Ca²⁺ = cálcio'},
  {f:'MgCl₂', n:'Cloreto de magnésio',  ref:'Cl⁻ = cloreto · Mg²⁺ = magnésio'},
  {f:'KF',    n:'Fluoreto de potássio', ref:'F⁻ = fluoreto · K⁺ = potássio'},
  {f:'AlCl₃', n:'Cloreto de alumínio',  ref:'Cl⁻ = cloreto · Al³⁺ = alumínio'},
  {f:'Na₂O',  n:'Óxido de sódio',       ref:'O²⁻ = óxido · Na⁺ = sódio'},
]

const EXPLORER_ELEMS = [
  {sym:'Na',z:11,layers:[2,8,1],  type:'metal',   name:'Sódio',   val:1,action:'perde 1 e⁻',ion:'Na⁺',ionType:'cat'},
  {sym:'Cl',z:17,layers:[2,8,7],  type:'nonmetal',name:'Cloro',   val:7,action:'ganha 1 e⁻',ion:'Cl⁻',ionType:'ani'},
  {sym:'Ca',z:20,layers:[2,8,8,2],type:'metal',   name:'Cálcio',  val:2,action:'perde 2 e⁻',ion:'Ca²⁺',ionType:'cat'},
  {sym:'O', z:8, layers:[2,6],    type:'nonmetal',name:'Oxigênio',val:6,action:'ganha 2 e⁻',ion:'O²⁻',ionType:'ani'},
  {sym:'Mg',z:12,layers:[2,8,2],  type:'metal',   name:'Magnésio',val:2,action:'perde 2 e⁻',ion:'Mg²⁺',ionType:'cat'},
  {sym:'F', z:9, layers:[2,7],    type:'nonmetal',name:'Flúor',   val:7,action:'ganha 1 e⁻',ion:'F⁻',ionType:'ani'},
]

function AtomDiagram({sym,layers,type,size=160}){
  const ref=useRef(null)
  useEffect(()=>{if(ref.current) ref.current.innerHTML=atomSVG(sym,layers,type,size,size)},[sym,layers,type,size])
  return <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`}/>
}

function SidebarStep({num,label,current,onClick}){
  const active=current===num,done=current>num
  return(
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,cursor:'pointer',marginBottom:4,border:`1px solid ${active?'var(--teal-border)':'transparent'}`,background:active?'var(--teal-dim)':'transparent',opacity:done?0.7:1}}>
      <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0,border:`1.5px solid ${active?'var(--teal)':done?'var(--teal-border)':'var(--border2)'}`,background:active?'var(--teal)':done?'rgba(78,205,196,0.2)':'transparent',color:active?'#0a1628':done?'var(--teal)':'var(--text2)'}}>
        {done?'✓':num}
      </div>
      <span style={{fontSize:13,color:active?'var(--text)':'var(--text2)',fontWeight:active?600:400}}>{label}</span>
    </div>
  )
}

export default function Teoria(){
  const navigate=useNavigate()
  const [step,setStep]=useState(1)
  const [selCat,setSelCat]=useState(null)
  const [selAni,setSelAni]=useState(null)
  const [formula,setFormula]=useState(null)
  const [selElem,setSelElem]=useState(null)

  function generateFormula(){
    if(!selCat||!selAni)return
    const key=`${selCat.sym}-${selAni.sym}`
    const comp=COMPOUNDS[key]
    if(!comp)return
    const m=lcm(selCat.charge,selAni.charge)
    const ni=m/selCat.charge, nj=m/selAni.charge
    const repr = ni===1&&nj===1
      ? `${selCat.ion} + ${selAni.ion}`
      : `${ni>1?ni+'×':''} ${selCat.ion} + ${nj>1?nj+'×':''} ${selAni.ion}`
    const soma = ni===1&&nj===1
      ? `(+${selCat.charge}) + (−${selAni.charge}) = 0 ✓`
      : `${ni}×(+${selCat.charge}) + ${nj}×(−${selAni.charge}) = ${ni*selCat.charge - nj*selAni.charge} → soma = 0 ✓`
    setFormula({f:comp.f, n:comp.n, repr, soma, ni, nj})
  }

  function pickCat(c){setSelCat(c);setFormula(null)}
  function pickAni(a){setSelAni(a);setFormula(null)}

  return(
    <>
      <Background/><Navbar/>
      <div style={{display:'flex',paddingTop:56,minHeight:'100vh',position:'relative',zIndex:1}}>
        <aside style={{width:220,flexShrink:0,padding:'2rem 1rem',borderRight:'1px solid var(--border)',position:'sticky',top:56,height:'calc(100vh - 56px)',overflowY:'auto'}}>
          <div style={{fontSize:10,letterSpacing:'1.5px',fontWeight:700,color:'var(--text3)',textTransform:'uppercase',marginBottom:'1rem'}}>Progresso</div>
          <SidebarStep num={1} label="Montando a Fórmula"   current={step} onClick={()=>setStep(1)}/>
          <SidebarStep num={2} label="Visualizando Elétrons" current={step} onClick={()=>setStep(2)}/>
          <SidebarStep num={3} label="Nomenclatura"          current={step} onClick={()=>setStep(3)}/>
        </aside>

        <main style={{flex:1,padding:'2.5rem 2rem',maxWidth:860,overflowY:'auto'}}>

          {/* ── PASSO 1: Fórmula + Representação Iônica separadas ── */}
          {step===1&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 1 de 3</div>
              <h1 style={h1}>Como Montar a Fórmula</h1>
              <p style={intro}>
                Para escrever a fórmula de um composto iônico, as cargas dos íons devem se cancelar — a soma total deve ser <strong>zero</strong>. A técnica mais prática é o <strong>cruzamento de cargas</strong>: o valor da carga do cátion vira o índice do ânion e vice-versa.
              </p>

              <div style={sCard}>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:'1rem'}}>Experimente combinar íons</h3>
                <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap',marginBottom:'1.2rem'}}>
                  <div style={{flex:1,minWidth:150}}>
                    <div style={colLabel('var(--orange)')}>Cátion (+)</div>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {CATIONS.map(c=>(
                        <button key={c.sym} onClick={()=>pickCat(c)} style={{padding:'9px 14px',borderRadius:10,border:`1.5px solid ${selCat?.sym===c.sym?'var(--orange-border)':'var(--border2)'}`,background:selCat?.sym===c.sym?'var(--orange-dim)':'var(--card2)',color:selCat?.sym===c.sym?'var(--orange)':'var(--text)',fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',justifyContent:'space-between',transition:'all 0.15s'}}>
                          {c.ion}<span style={{fontSize:11,opacity:0.6}}>+{c.charge}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{flex:1,minWidth:150}}>
                    <div style={colLabel('var(--blue)')}>Ânion (−)</div>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {ANIONS.map(a=>(
                        <button key={a.sym} onClick={()=>pickAni(a)} style={{padding:'9px 14px',borderRadius:10,border:`1.5px solid ${selAni?.sym===a.sym?'var(--blue-border)':'var(--border2)'}`,background:selAni?.sym===a.sym?'var(--blue-dim)':'var(--card2)',color:selAni?.sym===a.sym?'var(--blue)':'var(--text)',fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',justifyContent:'space-between',transition:'all 0.15s'}}>
                          {a.ion}<span style={{fontSize:11,opacity:0.6}}>−{a.charge}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.2rem',flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:180,padding:'10px 14px',background:'var(--card2)',border:'1px solid var(--border2)',borderRadius:12,display:'flex',alignItems:'center',gap:8,minHeight:44}}>
                    {selCat&&<span style={{fontWeight:700,padding:'3px 10px',borderRadius:7,background:'var(--orange-dim)',color:'var(--orange)'}}>{selCat.ion}</span>}
                    {selCat&&selAni&&<span style={{color:'var(--text3)'}}>+</span>}
                    {selAni&&<span style={{fontWeight:700,padding:'3px 10px',borderRadius:7,background:'var(--blue-dim)',color:'var(--blue)'}}>{selAni.ion}</span>}
                    {!selCat&&!selAni&&<span style={{fontSize:13,color:'var(--text3)'}}>Selecione um cátion e um ânion acima</span>}
                  </div>
                  <button onClick={generateFormula} disabled={!selCat||!selAni} style={{padding:'11px 22px',background:'var(--teal)',color:'#0a1628',fontSize:14,fontWeight:700,border:'none',borderRadius:11,cursor:selCat&&selAni?'pointer':'default',opacity:selCat&&selAni?1:0.35,whiteSpace:'nowrap',transition:'opacity 0.2s'}}>
                    Gerar →
                  </button>
                </div>

                {/* Resultado separado em DOIS blocos distintos — pedido pelo professor */}
                {formula&&(
                  <div style={{display:'flex',flexDirection:'column',gap:12,animation:'revealFormula 0.3s ease'}}>

                    {/* BLOCO 1: Fórmula Química */}
                    <div style={{background:'var(--card2)',border:'1px solid var(--teal-border)',borderRadius:14,padding:'1.2rem 1.5rem'}}>
                      <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--teal)',marginBottom:8}}>Fórmula Química</div>
                      <div style={{fontSize:36,fontWeight:800,color:'var(--teal)',letterSpacing:1,marginBottom:4}}>{formula.f}</div>
                      <div style={{fontSize:13,color:'var(--text2)'}}>{formula.n}</div>
                    </div>

                    {/* BLOCO 2: Representação Iônica */}
                    <div style={{background:'var(--card2)',border:'1px solid var(--purple-border)',borderRadius:14,padding:'1.2rem 1.5rem'}}>
                      <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--purple)',marginBottom:8}}>Representação Iônica</div>
                      <div style={{fontSize:20,fontWeight:700,color:'var(--text)',marginBottom:6,letterSpacing:0.5}}>
                        {formula.repr} → {formula.f}
                      </div>
                      <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>{formula.soma}</div>
                    </div>

                  </div>
                )}
                {!formula&&<div style={{background:'var(--card2)',border:'1px solid var(--border2)',borderRadius:14,padding:'1.2rem 1.5rem',textAlign:'center',fontSize:13,color:'var(--text3)'}}>Selecione os íons e clique em "Gerar" para ver a fórmula e a representação iônica.</div>}
              </div>

              <button style={btnC} onClick={()=>setStep(2)}>Próximo →</button>
            </div>
          )}

          {/* ── PASSO 2: Visualizando elétrons ── */}
          {step===2&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 2 de 3</div>
              <h1 style={h1}>Visualizando os Elétrons</h1>
              <p style={intro}>
                Ao observar o diagrama de elétrons de um átomo, você consegue identificar o elemento <strong>contando os elétrons na camada externa</strong>. Compare com a tabela periódica para confirmar o número atômico e prever se o elemento forma cátion ou ânion.
              </p>

              <div style={sCard}>
                <div style={{display:'flex',gap:8,marginBottom:'1.2rem',flexWrap:'wrap'}}>
                  {EXPLORER_ELEMS.map(e=>(
                    <button key={e.sym} onClick={()=>setSelElem(e)} style={{padding:'7px 14px',borderRadius:9,border:`1.5px solid ${selElem?.sym===e.sym?(e.type==='metal'?'var(--orange-border)':'var(--blue-border)'):'var(--border2)'}`,background:selElem?.sym===e.sym?(e.type==='metal'?'var(--orange-dim)':'var(--blue-dim)'):'var(--card2)',color:selElem?.sym===e.sym?(e.type==='metal'?'var(--orange)':'var(--blue)'):'var(--text2)',fontSize:13,fontWeight:700,cursor:'pointer',transition:'all 0.15s'}}>
                      {e.sym} ({e.z})
                    </button>
                  ))}
                </div>
                {selElem?(
                  <div style={{display:'flex',gap:'2rem',alignItems:'center',flexWrap:'wrap',animation:'fadeIn 0.2s ease'}}>
                    <AtomDiagram sym={selElem.sym} layers={selElem.layers} type={selElem.type} size={160}/>
                    <div style={{flex:1,minWidth:180}}>
                      <h3 style={{fontSize:18,fontWeight:700,marginBottom:6}}>{selElem.name} ({selElem.sym})</h3>
                      <p style={{fontSize:13,color:'var(--text2)',marginBottom:4}}>Número atômico: <strong style={{color:'var(--text)'}}>Z = {selElem.z}</strong></p>
                      <p style={{fontSize:13,color:'var(--text2)',marginBottom:4}}>Distribuição: <strong style={{color:'var(--text)'}}>[{selElem.layers.join(', ')}]</strong></p>
                      <p style={{fontSize:13,color:'var(--text2)',marginBottom:4}}>Valência: <strong style={{color:'var(--text)'}}>{selElem.val} elétron{selElem.val>1?'s':''}</strong></p>
                      <p style={{fontSize:13,color:'var(--text2)',marginBottom:10,lineHeight:1.6}}>{selElem.action} → forma <strong>{selElem.ion}</strong></p>
                      <span style={{display:'inline-block',padding:'4px 14px',borderRadius:8,fontSize:15,fontWeight:800,background:selElem.ionType==='cat'?'var(--orange-dim)':'var(--blue-dim)',color:selElem.ionType==='cat'?'var(--orange)':'var(--blue)',border:`1px solid ${selElem.ionType==='cat'?'var(--orange-border)':'var(--blue-border)'}`}}>
                        {selElem.ion}
                      </span>
                    </div>
                  </div>
                ):(
                  <p style={{fontSize:13,color:'var(--text3)',textAlign:'center',padding:'2rem'}}>Selecione um elemento acima para ver seu diagrama de elétrons</p>
                )}
              </div>

              <div style={{display:'flex',gap:12}}>
                <button style={btnV} onClick={()=>setStep(1)}>← Voltar</button>
                <button style={btnC} onClick={()=>setStep(3)}>Próximo →</button>
              </div>
            </div>
          )}

          {/* ── PASSO 3: Nomenclatura ── */}
          {step===3&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 3 de 3</div>
              <h1 style={h1}>Nomenclatura de Compostos Iônicos</h1>
              <p style={intro}>
                O nome de um composto iônico segue a regra IUPAC: <strong>nome do ânion + "de" + nome do cátion</strong>. O ânion recebe o sufixo <em>-eto</em> ou <em>-eto</em>. Perceba como isso se conecta diretamente com a representação iônica do Passo 1.
              </p>

              {/* Regras */}
              <div style={sCard}>
                {[
                  {num:1,text:<p>Escreva o <strong>nome do ânion primeiro</strong>, com sufixo <strong>-eto</strong> (cloro → cloreto, flúor → fluoreto, oxigênio → óxido, enxofre → sulfeto).</p>},
                  {num:2,text:<p>Adicione a preposição <strong>"de"</strong> entre o ânion e o cátion.</p>},
                  {num:3,text:<p>Escreva o <strong>nome do cátion</strong> por último. Se o metal tiver valências variáveis (como o ferro), use algarismos romanos: ferro (II) ou ferro (III).</p>},
                ].map(r=>(
                  <div key={r.num} style={{display:'flex',gap:12,alignItems:'flex-start',padding:12,background:'var(--card2)',borderRadius:12,marginBottom:10}}>
                    <div style={{width:28,height:28,borderRadius:'50%',background:'var(--teal-dim)',border:'1px solid var(--teal-border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'var(--teal)',flexShrink:0}}>{r.num}</div>
                    <div style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>{r.text}</div>
                  </div>
                ))}
              </div>

              {/* Exemplos com fórmula + representação iônica + nome — mostrando a conexão */}
              <div style={{fontSize:14,fontWeight:700,marginBottom:'0.8rem'}}>Exemplos — veja como fórmula, representação iônica e nome se conectam:</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1.5rem'}}>
                {[
                  {f:'NaCl',  ri:'Na⁺ + Cl⁻ → 0', n:'Cloreto de sódio',     ref:'Cl⁻ = cloreto · Na⁺ = sódio'},
                  {f:'CaO',   ri:'Ca²⁺ + O²⁻ → 0',n:'Óxido de cálcio',      ref:'O²⁻ = óxido · Ca²⁺ = cálcio'},
                  {f:'MgCl₂', ri:'Mg²⁺ + 2Cl⁻ → 0',n:'Cloreto de magnésio', ref:'Cl⁻ = cloreto · Mg²⁺ = magnésio'},
                  {f:'KF',    ri:'K⁺ + F⁻ → 0',    n:'Fluoreto de potássio', ref:'F⁻ = fluoreto · K⁺ = potássio'},
                  {f:'AlCl₃', ri:'Al³⁺ + 3Cl⁻ → 0',n:'Cloreto de alumínio', ref:'Cl⁻ = cloreto · Al³⁺ = alumínio'},
                  {f:'Na₂O',  ri:'2Na⁺ + O²⁻ → 0', n:'Óxido de sódio',      ref:'O²⁻ = óxido · Na⁺ = sódio'},
                ].map((e,i)=>(
                  <div key={i} style={{background:'var(--card2)',border:'1px solid var(--border2)',borderRadius:14,padding:'14px 16px'}}>
                    {/* Fórmula Química */}
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'var(--teal)',marginBottom:2}}>Fórmula</div>
                    <div style={{fontSize:22,fontWeight:800,color:'var(--teal)',marginBottom:6}}>{e.f}</div>
                    {/* Representação Iônica */}
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'var(--purple)',marginBottom:2}}>Representação Iônica</div>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:6}}>{e.ri}</div>
                    {/* Nome */}
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'var(--text3)',marginBottom:2}}>Nome</div>
                    <div style={{fontSize:13,color:'var(--text2)'}}>{e.n}</div>
                    <div style={{fontSize:11,color:'var(--text3)',marginTop:3}}>{e.ref}</div>
                  </div>
                ))}
              </div>

              <div style={{display:'flex',gap:12}}>
                <button style={btnV} onClick={()=>setStep(2)}>← Voltar</button>
                <button style={btnC} onClick={()=>navigate('/modulo3/exercicios')}>Ir para os Exercícios →</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}

const si       = {fontSize:13,color:'var(--text2)',marginBottom:8}
const h1       = {fontSize:26,fontWeight:800,marginBottom:'1rem'}
const intro    = {fontSize:14,color:'var(--text2)',lineHeight:1.7,marginBottom:'1.5rem'}
const sCard    = {background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}
const btnC     = {display:'flex',alignItems:'center',gap:8,padding:'13px 28px',background:'var(--teal)',color:'#0a1628',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:'pointer'}
const btnV     = {padding:'10px 20px',background:'transparent',border:'1px solid var(--border2)',color:'var(--text2)',fontSize:14,fontWeight:600,borderRadius:10,cursor:'pointer'}
const colLabel = (color) => ({fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color,marginBottom:8})
