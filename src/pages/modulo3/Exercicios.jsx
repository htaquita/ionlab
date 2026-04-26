import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import FeedbackBar from '../../components/FeedbackBar'
import ProgressDots from '../../components/ProgressDots'
import { atomSVG } from '../../utils/drawAtom'
import { COMPOUNDS } from '../../data/elements'

function gcd(a,b){return b?gcd(b,a%b):a}
function lcm(a,b){return(a*b)/gcd(a,b)}

const EX1_CATIONS = [
  {sym:'Na',ion:'Na⁺', charge:1},{sym:'Ca',ion:'Ca²⁺',charge:2},
  {sym:'K', ion:'K⁺',  charge:1},{sym:'Al',ion:'Al³⁺',charge:3},
]
const EX1_ANIONS = [
  {sym:'Cl',ion:'Cl⁻', charge:1},{sym:'O', ion:'O²⁻', charge:2},
  {sym:'F', ion:'F⁻',  charge:1},{sym:'S', ion:'S²⁻', charge:2},
]

function AtomDiagram({sym,layers,type,size=160}) {
  const ref = useRef(null)
  useEffect(()=>{if(ref.current) ref.current.innerHTML=atomSVG(sym,layers,type,size,size)},[sym,layers,type,size])
  return <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`}/>
}

function Ex1({onComplete}) {
  const [selCat,setSelCat]=useState(null)
  const [selAni,setSelAni]=useState(null)
  const [result,setResult]=useState(null)
  const [verified,setVerified]=useState(false)
  const [feedback,setFeedback]=useState(null)

  function pick(type,item){
    if(verified)return
    if(type==='cat'){setSelCat(item);setResult(null)}
    else{setSelAni(item);setResult(null)}
  }

  function generate(){
    if(!selCat||!selAni)return
    const key=`${selCat.sym}-${selAni.sym}`
    const comp=COMPOUNDS[key]
    if(!comp)return
    const m=lcm(selCat.charge,selAni.charge)
    setResult({f:comp.f,n:comp.n,ni:m/selCat.charge,nj:m/selAni.charge})
  }

  function verify(){
    const ok = selCat?.sym==='Ca' && selAni?.sym==='O'
    setVerified(true)
    if(ok){
      setFeedback({type:'ok',msg:'Correto! Ca²⁺ (+2) + O²⁻ (−2) → soma = 0. A fórmula é CaO (óxido de cálcio). As cargas se cancelam perfeitamente sem precisar de índices. +10 XP'})
      onComplete(true)
    } else {
      setFeedback({type:'er',msg:`Para formar o CaO precisamos de Ca²⁺ (cátion, +2) e O²⁻ (ânion, −2). Você selecionou ${selCat?.ion||'?'} e ${selAni?.ion||'?'}. A soma das cargas deve ser zero.`})
    }
  }

  return (
    <div>
      <h2 style={exTitle}>Monte a Fórmula</h2>
      <p style={exSub}>Selecione o cátion e o ânion corretos para formar o <strong style={{color:'#8b7cf8'}}>óxido de cálcio (CaO)</strong>.</p>
      <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        <div style={{flex:1,minWidth:140}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#f0a742',marginBottom:8}}>Cátion (+)</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {EX1_CATIONS.map(c=>(
              <button key={c.sym} onClick={()=>pick('cat',c)} style={{padding:'10px 14px',borderRadius:10,border:`1.5px solid ${selCat?.sym===c.sym?'rgba(240,167,66,0.4)':'rgba(255,255,255,0.08)'}`,background:selCat?.sym===c.sym?'rgba(240,167,66,0.1)':'#1d1d28',color:selCat?.sym===c.sym?'#f0a742':'#ededfc',fontSize:14,fontWeight:700,cursor: verified?'default':'pointer',display:'flex',justifyContent:'space-between',transition:'all 0.15s'}}>
                {c.ion}<small style={{opacity:0.5}}>+{c.charge}</small>
              </button>
            ))}
          </div>
        </div>
        <div style={{flex:1,minWidth:140}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:'#3ee8c4',marginBottom:8}}>Ânion (−)</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {EX1_ANIONS.map(a=>(
              <button key={a.sym} onClick={()=>pick('ani',a)} style={{padding:'10px 14px',borderRadius:10,border:`1.5px solid ${selAni?.sym===a.sym?'rgba(62,232,196,0.4)':'rgba(255,255,255,0.08)'}`,background:selAni?.sym===a.sym?'rgba(62,232,196,0.08)':'#1d1d28',color:selAni?.sym===a.sym?'#3ee8c4':'#ededfc',fontSize:14,fontWeight:700,cursor: verified?'default':'pointer',display:'flex',justifyContent:'space-between',transition:'all 0.15s'}}>
                {a.ion}<small style={{opacity:0.5}}>−{a.charge}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
      {!verified&&(
        <button onClick={generate} disabled={!selCat||!selAni}
          style={{display:'block',margin:'0 auto 1rem',padding:'10px 24px',background:'#1d1d28',border:`1px solid ${selCat&&selAni?'rgba(139,124,248,0.4)':'rgba(255,255,255,0.08)'}`,color:selCat&&selAni?'#8b7cf8':'#4a4a68',fontSize:14,fontWeight:700,borderRadius:11,cursor:selCat&&selAni?'pointer':'default',transition:'all 0.2s'}}>
          Ver fórmula →
        </button>
      )}
      {result&&(
        <div style={{background:'#1d1d28',border:'1px solid rgba(139,124,248,0.3)',borderRadius:14,padding:'1rem',textAlign:'center',marginBottom:'1rem',animation:'revealFormula 0.3s ease'}}>
          <div style={{fontSize:28,fontWeight:800,color:'#8b7cf8',marginBottom:4}}>{result.f}</div>
          <div style={{fontSize:13,color:'#8888aa',marginBottom:6}}>{result.n}</div>
          <div style={{fontSize:12,color:'#4a4a68'}}>
            {result.ni===1&&result.nj===1?`${selCat.ion} + ${selAni.ion} → carga total = 0`:`${result.ni}× ${selCat.ion} + ${result.nj}× ${selAni.ion} → carga total = 0`}
          </div>
        </div>
      )}
      <FeedbackBar type={feedback?.type} message={feedback?.msg}/>
      <div style={{display:'flex',justifyContent:'center',marginTop:'1rem'}}>
        {!verified
          ?<button style={{...btnCheck,opacity:result?1:0.4}} disabled={!result} onClick={verify}>Verificar</button>
          :<button style={btnNext} onClick={()=>onComplete(true)}>Próximo Exercício →</button>
        }
      </div>
    </div>
  )
}

function Ex2({onComplete}){
  const opts=['Cloreto de magnésio','Óxido de magnésio','Fluoreto de cloro','Sulfeto de cálcio']
  const correct=0
  const [sel,setSel]=useState(null)
  const [verified,setVerified]=useState(false)
  const [feedback,setFeedback]=useState(null)

  function verify(){
    setVerified(true)
    const ok=sel===correct
    if(ok){
      setFeedback({type:'ok',msg:'Correto! Pela regra IUPAC: ânion primeiro (Cl⁻ = cloreto) + "de" + cátion (Mg²⁺ = magnésio) → Cloreto de magnésio. +10 XP'})
      onComplete(true)
    } else {
      setFeedback({type:'er',msg:'Regra IUPAC: escreva o ânion primeiro com sufixo -eto/-ido, depois "de", depois o cátion. Cl⁻ → cloreto · Mg²⁺ → magnésio → Cloreto de magnésio.'})
    }
  }

  function optStyle(i){
    if(!verified) return sel===i?{background:'rgba(139,124,248,0.12)',borderColor:'rgba(139,124,248,0.28)'}:{}
    if(i===correct) return {background:'rgba(62,232,196,0.1)',borderColor:'rgba(62,232,196,0.3)',color:'#3ee8c4'}
    if(i===sel)     return {background:'rgba(248,113,113,0.08)',borderColor:'rgba(248,113,113,0.3)',color:'#f87171'}
    return{}
  }

  return(
    <div>
      <h2 style={exTitle}>Qual é o nome deste composto?</h2>
      <p style={exSub}>Observe a fórmula e escolha o nome correto seguindo as regras de nomenclatura IUPAC.</p>
      <div style={{fontSize:36,fontWeight:800,color:'#8b7cf8',textAlign:'center',padding:'1rem',background:'#1d1d28',borderRadius:14,marginBottom:'1.5rem',letterSpacing:2}}>MgCl₂</div>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:'1rem'}}>
        {opts.map((o,i)=>(
          <button key={i} disabled={verified} onClick={()=>setSel(i)}
            style={{padding:'13px 18px',background:'#1d1d28',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#ededfc',fontSize:14,textAlign:'left',cursor:verified?'default':'pointer',display:'flex',alignItems:'center',gap:12,transition:'all 0.15s',...optStyle(i)}}>
            <span style={{width:26,height:26,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{String.fromCharCode(65+i)}</span>
            {o}
          </button>
        ))}
      </div>
      <FeedbackBar type={feedback?.type} message={feedback?.msg}/>
      <div style={{display:'flex',justifyContent:'center',marginTop:'1rem'}}>
        {!verified
          ?<button style={{...btnCheck,opacity:sel!==null?1:0.4}} disabled={sel===null} onClick={verify}>Verificar</button>
          :<button style={btnNext} onClick={()=>onComplete(true)}>Próximo Exercício →</button>
        }
      </div>
    </div>
  )
}

function Ex3({onComplete}){
  const choices=['Oxigênio (O, Z=8)','Enxofre (S, Z=16)','Selênio (Se, Z=34)','Cloro (Cl, Z=17)']
  const correct=1
  const [sel,setSel]=useState(null)
  const [verified,setVerified]=useState(false)
  const [feedback,setFeedback]=useState(null)
  const [showSym,setShowSym]=useState(false)

  function verify(){
    setVerified(true)
    const ok=sel===correct
    if(ok){setShowSym(true);setFeedback({type:'ok',msg:'Correto! A camada externa tem 6 elétrons. Contando a distribuição: K=2, L=8, M=6 → total 16 → Z=16 → Enxofre (S). Como ametal com 6 e⁻ de valência, forma o ânion S²⁻. +10 XP'});onComplete(true)}
    else{setFeedback({type:'er',msg:'Dica: some as camadas — K=2, L=8, M=6 → 2+8+6=16 elétrons → Z=16 → Enxofre (S). O oxigênio tem apenas 2 camadas [2,6], o selênio tem 4 camadas.'})}
  }

  return(
    <div>
      <h2 style={exTitle}>Qual elemento está representado?</h2>
      <p style={exSub}>Conte os elétrons em cada camada e some para encontrar o número atômico (Z).</p>
      <div style={{display:'flex',justifyContent:'center',marginBottom:'1.5rem'}}>
        <AtomDiagram sym={showSym?'S':'?'} layers={[2,8,6]} type="nonmetal" size={160}/>
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:'1rem'}}>
        {choices.map((c,i)=>(
          <button key={i} disabled={verified} onClick={()=>setSel(i)}
            style={{background:'#1d1d28',border:`1.5px solid ${sel===i&&!verified?'rgba(139,124,248,0.4)':'rgba(255,255,255,0.08)'}`,borderRadius:14,padding:'1rem 1.2rem',display:'flex',flexDirection:'column',alignItems:'center',gap:8,cursor:verified?'default':'pointer',transition:'all 0.2s',minWidth:120,
              ...(verified&&i===correct?{background:'rgba(62,232,196,0.08)',borderColor:'rgba(62,232,196,0.3)',color:'#3ee8c4'}:
                verified&&i===sel?{background:'rgba(248,113,113,0.08)',borderColor:'rgba(248,113,113,0.3)',color:'#f87171'}:{})}}>
            <span style={{fontSize:13,fontWeight:700}}>{c}</span>
          </button>
        ))}
      </div>
      <FeedbackBar type={feedback?.type} message={feedback?.msg}/>
      <div style={{display:'flex',justifyContent:'center',marginTop:'1rem'}}>
        {!verified
          ?<button style={{...btnCheck,opacity:sel!==null?1:0.4}} disabled={sel===null} onClick={verify}>Verificar</button>
          :<button style={btnNext} onClick={()=>onComplete(true)}>Ver Resultado →</button>
        }
      </div>
    </div>
  )
}

export default function Exercicios(){
  const navigate=useNavigate()
  const {addXP,setProgress}=useUser()
  const [exAtual,setExAtual]=useState(0)
  const [score,setScore]=useState(0)
  const startTime=useRef(Date.now())

  function goNext(acertou){
    if(acertou){setScore(s=>s+1);addXP(10)}
    if(exAtual<2) setExAtual(e=>e+1)
    else{
      setProgress('m3',100)
      const elapsed=Math.floor((Date.now()-startTime.current)/1000)
      navigate('/modulo3/resultado',{state:{score:score+(acertou?1:0),total:3,time:elapsed}})
    }
  }

  return(
    <>
      <Background/>
      <Navbar/>
      <div style={{paddingTop:56,display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:1}}>
        <div style={{padding:'1.5rem 2rem 0',display:'flex',flexDirection:'column',alignItems:'center',width:'100%'}}>
          <ProgressDots total={3} current={exAtual}/>
        </div>
        <div style={card}>
          {exAtual===0&&<Ex1 onComplete={ok=>goNext(ok)}/>}
          {exAtual===1&&<Ex2 onComplete={ok=>goNext(ok)}/>}
          {exAtual===2&&<Ex3 onComplete={ok=>goNext(ok)}/>}
        </div>
      </div>
    </>
  )
}

const card={background:'#17171f',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:'2rem',margin:'1rem auto 2rem',width:'100%',maxWidth:700}
const exTitle={fontSize:20,fontWeight:700,marginBottom:6}
const exSub={fontSize:14,color:'#8888aa',marginBottom:'1.5rem'}
const btnCheck={padding:'13px 36px',background:'#8b7cf8',color:'#fff',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:'pointer'}
const btnNext={padding:'13px 36px',background:'#8b7cf8',color:'#fff',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:'pointer'}
